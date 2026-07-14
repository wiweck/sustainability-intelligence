(() => {
  "use strict";

  const config = window.SUSTAINABILITY_CONFIG || {};
  const storageKey = "sustainability-intelligence.session.v1";

  function cleanBaseUrl(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function isConfigured() {
    return Boolean(
      cleanBaseUrl(config.supabaseUrl) &&
      String(config.supabasePublishableKey || "").trim()
    );
  }

  function isReviewMode() {
    return new URLSearchParams(window.location.search).get("review") === "1";
  }

  function headers(accessToken, extra) {
    return Object.assign({
      apikey: config.supabasePublishableKey,
      "Content-Type": "application/json"
    }, accessToken ? { Authorization: "Bearer " + accessToken } : {}, extra || {});
  }

  async function parseResponse(response) {
    const body = await response.text();
    let data = null;
    if (body) {
      try {
        data = JSON.parse(body);
      } catch (error) {
        data = { message: body };
      }
    }
    if (!response.ok) {
      const message = data && (data.msg || data.message || data.error_description || data.error);
      const apiError = new Error(message || "The secure service could not complete this request.");
      apiError.status = response.status;
      apiError.code = data && (data.code || data.error_code);
      throw apiError;
    }
    return data;
  }

  async function authRequest(path, options) {
    if (!isConfigured()) throw new Error("Secure access has not been configured yet.");
    const response = await fetch(cleanBaseUrl(config.supabaseUrl) + "/auth/v1" + path, {
      method: options.method || "POST",
      headers: headers(options.accessToken),
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    return parseResponse(response);
  }

  function normalizeSession(payload) {
    if (!payload || !payload.access_token || !payload.refresh_token) return null;
    const expiresAt = payload.expires_at || Math.floor(Date.now() / 1000) + Number(payload.expires_in || 3600);
    return {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      expires_at: expiresAt,
      token_type: payload.token_type || "bearer",
      user: payload.user || null
    };
  }

  function saveSession(session) {
    if (!session) {
      window.localStorage.removeItem(storageKey);
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(session));
  }

  function readSession() {
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey));
      return value && value.access_token && value.refresh_token ? value : null;
    } catch (error) {
      window.localStorage.removeItem(storageKey);
      return null;
    }
  }

  async function requestOtp({ email, displayName }) {
    return authRequest("/otp", {
      body: {
        email: String(email || "").trim().toLowerCase(),
        create_user: true,
        data: {
          display_name: String(displayName || "").trim()
        }
      }
    });
  }

  async function verifyOtp({ email, token }) {
    const payload = await authRequest("/verify", {
      body: {
        email: String(email || "").trim().toLowerCase(),
        token: String(token || "").replace(/\D/g, ""),
        type: "email"
      }
    });
    const session = normalizeSession(payload);
    if (!session) throw new Error("The verification response did not create a secure session.");
    saveSession(session);
    return session;
  }

  async function refreshSession(session) {
    const payload = await authRequest("/token?grant_type=refresh_token", {
      body: { refresh_token: session.refresh_token }
    });
    const refreshed = normalizeSession(payload);
    if (!refreshed) throw new Error("Your secure session could not be renewed.");
    saveSession(refreshed);
    return refreshed;
  }

  async function getSession() {
    const session = readSession();
    if (!session) return null;
    if (Number(session.expires_at || 0) > Math.floor(Date.now() / 1000) + 90) return session;
    try {
      return await refreshSession(session);
    } catch (error) {
      saveSession(null);
      return null;
    }
  }

  async function signOut() {
    const session = readSession();
    try {
      if (session && isConfigured()) {
        await authRequest("/logout", {
          method: "POST",
          accessToken: session.access_token
        });
      }
    } finally {
      saveSession(null);
    }
  }

  async function restRequest(path, options) {
    if (!isConfigured()) throw new Error("The private workspace database has not been configured.");
    const session = await getSession();
    if (!session) {
      const error = new Error("Your secure session has expired. Please verify your email again.");
      error.status = 401;
      throw error;
    }
    const response = await fetch(cleanBaseUrl(config.supabaseUrl) + "/rest/v1/" + path, {
      method: options.method || "GET",
      headers: headers(session.access_token, Object.assign({
        Accept: "application/json"
      }, options.prefer ? { Prefer: options.prefer } : {})),
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    return parseResponse(response);
  }

  async function getProfile() {
    const session = await getSession();
    if (!session || !session.user) return null;
    const rows = await restRequest(
      "profiles?select=display_name,fit_track&user_id=eq." + encodeURIComponent(session.user.id) + "&limit=1",
      {}
    );
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  }

  async function upsertProfile({ displayName, fitTrack }) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("A verified session is required.");
    const rows = await restRequest("profiles?on_conflict=user_id", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: {
        user_id: session.user.id,
        display_name: String(displayName || "").trim(),
        fit_track: fitTrack || "both",
        updated_at: new Date().toISOString()
      }
    });
    return Array.isArray(rows) ? rows[0] : null;
  }

  async function getWorkspaceStates() {
    const rows = await restRequest(
      "workspace_states?select=item_id,saved,tracked,dismissed,note,next_action,updated_at&order=updated_at.desc",
      {}
    );
    return Array.isArray(rows) ? rows : [];
  }

  async function saveWorkspaceState(record) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("A verified session is required.");
    return restRequest("workspace_states?on_conflict=user_id,item_id", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: Object.assign({}, record, {
        user_id: session.user.id,
        updated_at: new Date().toISOString()
      })
    });
  }

  async function createAccountRequest(requestType) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("A verified session is required.");
    return restRequest("account_requests", {
      method: "POST",
      prefer: "return=minimal",
      body: {
        user_id: session.user.id,
        request_type: requestType
      }
    });
  }

  window.SIAuth = Object.freeze({
    isConfigured,
    isReviewMode,
    requestOtp,
    verifyOtp,
    getSession,
    getProfile,
    upsertProfile,
    getWorkspaceStates,
    saveWorkspaceState,
    createAccountRequest,
    signOut
  });
})();
