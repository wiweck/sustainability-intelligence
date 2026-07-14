(() => {
  "use strict";

  const detailsForm = document.querySelector("#details-form");
  const verifyForm = document.querySelector("#verify-form");
  const configurationMessage = document.querySelector("#configuration-message");
  const existingSession = document.querySelector("#existing-session");
  const status = document.querySelector("#access-status");
  const nameInput = document.querySelector("#display-name");
  const emailInput = document.querySelector("#email-address");
  const codeInput = document.querySelector("#verification-code");
  const verificationEmail = document.querySelector("#verification-email");
  const resendButton = document.querySelector("#resend-code");
  const changeButton = document.querySelector("#change-email");
  const existingSignOut = document.querySelector("#existing-sign-out");
  const reviewMode = window.SIAuth.isReviewMode();
  let pending = null;
  let countdownTimer = null;

  function setStatus(message, success) {
    status.textContent = message || "";
    status.classList.toggle("is-success", Boolean(success));
  }

  function setBusy(form, busy) {
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = busy;
    form.setAttribute("aria-busy", String(busy));
  }

  function setStep(step) {
    document.querySelectorAll("[data-step-indicator]").forEach((item) => {
      const order = { details: 1, verify: 2, complete: 3 };
      item.classList.toggle("is-active", order[item.dataset.stepIndicator] <= order[step]);
    });
  }

  function startCountdown() {
    window.clearInterval(countdownTimer);
    let remaining = 60;
    resendButton.disabled = true;
    resendButton.textContent = "Resend in " + remaining + " seconds";
    countdownTimer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(countdownTimer);
        resendButton.disabled = false;
        resendButton.textContent = "Resend code";
        return;
      }
      resendButton.textContent = "Resend in " + remaining + " seconds";
    }, 1000);
  }

  function showVerification() {
    detailsForm.hidden = true;
    verifyForm.hidden = false;
    verificationEmail.textContent = pending.email;
    setStep("verify");
    startCountdown();
    codeInput.focus();
  }

  function showDetails() {
    window.clearInterval(countdownTimer);
    verifyForm.hidden = true;
    detailsForm.hidden = false;
    setStep("details");
    setStatus("");
    emailInput.focus();
  }

  async function sendCode() {
    if (reviewMode) {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      setStatus("Review mode: enter 123456 to inspect the verification step.", true);
      showVerification();
      return;
    }
    await window.SIAuth.requestOtp({
      email: pending.email,
      displayName: pending.displayName
    });
    setStatus("Verification code sent. Check your inbox and spam folder.", true);
    showVerification();
  }

  detailsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!detailsForm.reportValidity()) return;
    pending = {
      displayName: nameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase()
    };
    setBusy(detailsForm, true);
    setStatus("Requesting your verification code...");
    try {
      await sendCode();
    } catch (error) {
      const message = error.status === 429
        ? "Too many verification attempts. Please wait before trying again."
        : error.message;
      setStatus(message);
    } finally {
      setBusy(detailsForm, false);
    }
  });

  verifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!verifyForm.reportValidity() || !pending) return;
    const token = codeInput.value.replace(/\D/g, "");
    setBusy(verifyForm, true);
    setStatus("Verifying your secure code...");
    try {
      if (reviewMode) {
        if (token !== "123456") throw new Error("For review mode, use the demonstration code 123456.");
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        setStep("complete");
        setStatus("Review verification complete. No account or personal information was created.", true);
        return;
      }
      await window.SIAuth.verifyOtp({ email: pending.email, token });
      await window.SIAuth.upsertProfile({
        displayName: pending.displayName,
        fitTrack: "both"
      });
      setStep("complete");
      setStatus("Email verified. Opening your private workspace.", true);
      window.setTimeout(() => {
        window.location.href = "workspace.html";
      }, 500);
    } catch (error) {
      const message = error.status === 401 || error.status === 403
        ? "That code is invalid or has expired. Request a new code and try again."
        : error.message;
      setStatus(message);
      codeInput.select();
    } finally {
      setBusy(verifyForm, false);
    }
  });

  resendButton.addEventListener("click", async () => {
    if (!pending) return;
    resendButton.disabled = true;
    setStatus("Sending a new verification code...");
    try {
      await sendCode();
    } catch (error) {
      setStatus(error.message);
      resendButton.disabled = false;
      resendButton.textContent = "Resend code";
    }
  });

  changeButton.addEventListener("click", showDetails);

  existingSignOut.addEventListener("click", async () => {
    existingSignOut.disabled = true;
    await window.SIAuth.signOut();
    existingSession.hidden = true;
    detailsForm.hidden = false;
    setStep("details");
    existingSignOut.disabled = false;
  });

  async function initialise() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("notice") === "session") {
      setStatus("Your session ended. Verify your email to return to the workspace.");
    }

    if (!window.SIAuth.isConfigured() && !reviewMode) {
      configurationMessage.hidden = false;
      detailsForm.hidden = true;
      return;
    }

    if (reviewMode) {
      document.querySelector(".card-index").textContent = "Access checkpoint · Review mode";
      return;
    }

    const session = await window.SIAuth.getSession();
    if (session) {
      detailsForm.hidden = true;
      existingSession.hidden = false;
      setStep("complete");
    }
  }

  initialise().catch((error) => setStatus(error.message));
})();
