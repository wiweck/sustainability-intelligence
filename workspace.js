(() => {
  "use strict";

  const records = [
    {
      id: "sample-value-chains",
      class: "direct",
      type: "Illustrative direct opportunity",
      theme: "funding",
      title: "Climate-resilient value chains: illustrative call structure",
      source: "Demonstration record · Not an active call",
      summary: "A sample funding format showing how a time-bound opportunity would be reviewed for eligibility, value and a credible route to participation.",
      fit: ["nonprofit"],
      fitLabel: "Nonprofit Fit",
      action: "Assess eligibility",
      timing: "Sample",
      timingLabel: "No live deadline",
      confidence: 92,
      confidenceLabel: "High format confidence",
      whyItMatters: "The record demonstrates how an India-based nonprofit could assess thematic alignment, delivery capacity and possible consortium roles before investing application effort.",
      evidence: "Illustrative only. A published record would require an original issuer notice, confirmed dates, eligibility rules and an accessible source link.",
      nextStep: "Review organisational eligibility, programme alignment and the evidence needed for a participation decision.",
      urgency: 96
    },
    {
      id: "sample-supplier-readiness",
      class: "signal",
      type: "Illustrative emerging signal",
      theme: "policy",
      title: "Supplier-readiness policy signal",
      source: "Demonstration record · Not a current policy notice",
      summary: "A sample regulatory signal showing how changing supplier expectations could create an advisory and capability-building pathway.",
      fit: ["expert", "nonprofit"],
      fitLabel: "Both fit tracks",
      action: "Prepare conversation",
      timing: "Medium",
      timingLabel: "Illustrative horizon",
      confidence: 88,
      confidenceLabel: "Strong sample evidence",
      whyItMatters: "The signal demonstrates how a policy change may affect exporters, support organisations and sector experts before a formal opportunity is published.",
      evidence: "Illustrative only. A published signal would separate verified policy text, interpretation, affected stakeholders and uncertainty.",
      nextStep: "Map the affected stakeholder group and prepare a concise readiness conversation grounded in the original notice.",
      urgency: 82
    },
    {
      id: "sample-circular-fellowship",
      class: "direct",
      type: "Illustrative direct opportunity",
      theme: "knowledge",
      title: "Regional circular economy fellowship format",
      source: "Demonstration record · Not an active fellowship",
      summary: "A sample professional programme showing how individual eligibility, learning value, credibility and effort could be assessed.",
      fit: ["expert"],
      fitLabel: "Individual Expert Fit",
      action: "Review personal fit",
      timing: "Sample",
      timingLabel: "No live deadline",
      confidence: 84,
      confidenceLabel: "High format confidence",
      whyItMatters: "The record demonstrates the decision factors for an individual sustainability expert considering a regional knowledge and network opportunity.",
      evidence: "Illustrative only. A published opportunity would require confirmed programme terms, selection criteria, cost, dates and an original source.",
      nextStep: "Compare the illustrative selection criteria with current expertise, availability and the intended professional outcome.",
      urgency: 74
    },
    {
      id: "sample-disclosure",
      class: "signal",
      type: "Illustrative emerging signal",
      theme: "markets",
      title: "Disclosure expectations move toward implementation",
      source: "Demonstration record · Not a current standards update",
      summary: "A sample standards signal showing how implementation detail may create demand for interpretation, readiness and supplier support.",
      fit: ["expert"],
      fitLabel: "Individual Expert Fit",
      action: "Build readiness note",
      timing: "Near",
      timingLabel: "Illustrative horizon",
      confidence: 79,
      confidenceLabel: "Moderate sample evidence",
      whyItMatters: "Implementation-stage guidance can create an earlier conversation pathway than waiting for organisations to issue a formal consulting request.",
      evidence: "Illustrative only. A published signal would cite the standards body, effective scope, source document and material uncertainties.",
      nextStep: "Draft a one-page interpretation note that distinguishes confirmed requirements from likely implementation needs.",
      urgency: 88
    },
    {
      id: "sample-consortium",
      class: "direct",
      type: "Illustrative direct opportunity",
      theme: "knowledge",
      title: "Consortium invitation for livelihood resilience",
      source: "Demonstration record · Not an active invitation",
      summary: "A sample partnership format showing how a nonprofit delivery role could be considered without treating a commercial tender as automatic fit.",
      fit: ["nonprofit"],
      fitLabel: "Nonprofit Fit",
      action: "Map delivery role",
      timing: "Sample",
      timingLabel: "No live deadline",
      confidence: 76,
      confidenceLabel: "Moderate format confidence",
      whyItMatters: "The record demonstrates the distinction between direct organisational eligibility and a credible consortium pathway based on a substantive programme contribution.",
      evidence: "Illustrative only. A published invitation would require confirmation of the lead organisation, scope, eligibility, procurement terms and deadline.",
      nextStep: "Define the delivery capability, geography and evidence that would support a credible consortium conversation.",
      urgency: 68
    },
    {
      id: "sample-adaptation-finance",
      class: "signal",
      type: "Illustrative emerging signal",
      theme: "funding",
      title: "Blended-finance direction for adaptation",
      source: "Demonstration record · Not a current financing announcement",
      summary: "A sample finance signal showing how an institutional direction could indicate future programme design, partnership or advisory needs.",
      fit: ["expert", "nonprofit"],
      fitLabel: "Both fit tracks",
      action: "Monitor and connect",
      timing: "Longer",
      timingLabel: "Illustrative horizon",
      confidence: 71,
      confidenceLabel: "Developing sample evidence",
      whyItMatters: "Financing direction may reveal stakeholder needs before a formal facility or call exists, creating a reason to prepare evidence and relevant relationships.",
      evidence: "Illustrative only. A published signal would require original institutional statements, geography, instrument detail and explicit uncertainty.",
      nextStep: "Track primary announcements and organise relevant adaptation evidence for a future programme or partnership conversation.",
      urgency: 60
    }
  ];

  const viewCopy = {
    queue: {
      eyebrow: "Prioritised intelligence",
      title: "Action Queue",
      description: "The strongest next actions across both ranking tracks."
    },
    direct: {
      eyebrow: "Defined routes to participate",
      title: "Direct Opportunities",
      description: "Illustrative calls, programmes and partnership formats with a clear route to participation."
    },
    signals: {
      eyebrow: "Developments before formal calls",
      title: "Emerging Signals",
      description: "Illustrative policy, market and finance movements that may create a pathway to act."
    },
    context: {
      eyebrow: "Decision support",
      title: "Context",
      description: "How facts, interpretation, relevance and uncertainty remain separate."
    },
    pipeline: {
      eyebrow: "Personal workspace",
      title: "Pipeline",
      description: "Illustrative records you save or track during this browser session."
    },
    sources: {
      eyebrow: "Evidence discipline",
      title: "Sources",
      description: "The public-source and verification rules that will govern published intelligence."
    },
    settings: {
      eyebrow: "Workspace controls",
      title: "Settings",
      description: "Future account preferences without collecting personal information in this prototype."
    }
  };

  const state = {
    view: "queue",
    fit: "all",
    theme: "all",
    sort: "priority",
    query: "",
    saved: new Set(),
    tracked: new Set(),
    dismissed: new Set(),
    selected: null
  };

  const feed = document.querySelector("#intelligence-feed");
  const template = document.querySelector("#feed-item-template");
  const emptyState = document.querySelector("#empty-state");
  const previewPanel = document.querySelector("#preview-panel");
  const previewContent = document.querySelector("#preview-content");
  const searchInput = document.querySelector("#search-input");
  const themeFilter = document.querySelector("#theme-filter");
  const sortSelect = document.querySelector("#sort-select");
  const toast = document.querySelector("#toast");
  let toastTimer;

  function activeRecords() {
    let result = records.filter((record) => !state.dismissed.has(record.id));

    if (state.view === "direct") result = result.filter((record) => record.class === "direct");
    if (state.view === "signals") result = result.filter((record) => record.class === "signal");
    if (state.view === "pipeline") {
      result = result.filter((record) => state.saved.has(record.id) || state.tracked.has(record.id));
    }

    if (state.fit !== "all") result = result.filter((record) => record.fit.includes(state.fit));
    if (state.theme !== "all") result = result.filter((record) => record.theme === state.theme);

    const query = state.query.trim().toLowerCase();
    if (query) {
      result = result.filter((record) =>
        [record.title, record.summary, record.source, record.action, record.fitLabel]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    result.sort((a, b) => {
      if (state.sort === "confidence") return b.confidence - a.confidence;
      if (state.sort === "urgency") return b.urgency - a.urgency;
      return (b.urgency + b.confidence) - (a.urgency + a.confidence);
    });

    return result;
  }

  function themeLabel(value) {
    const labels = {
      policy: "Policy and regulation",
      funding: "Funding and finance",
      markets: "Markets and standards",
      knowledge: "Knowledge and programmes"
    };
    return labels[value] || value;
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function setViewCopy() {
    const copy = viewCopy[state.view];
    document.querySelector("#view-eyebrow").textContent = copy.eyebrow;
    document.querySelector("#view-title").textContent = copy.title;
    document.querySelector("#view-description").textContent = copy.description;

    document.querySelectorAll(".nav-item").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === state.view);
    });
    document.querySelectorAll("[data-mobile-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mobileView === state.view);
    });
  }

  function updateCounts(visible) {
    const available = records.filter((record) => !state.dismissed.has(record.id));
    document.querySelectorAll('[data-count="queue"]').forEach((node) => {
      node.textContent = String(available.length);
    });
    document.querySelectorAll('[data-count="direct"]').forEach((node) => {
      node.textContent = String(available.filter((record) => record.class === "direct").length);
    });
    document.querySelectorAll('[data-count="signals"]').forEach((node) => {
      node.textContent = String(available.filter((record) => record.class === "signal").length);
    });
    document.querySelectorAll('[data-count="pipeline"]').forEach((node) => {
      node.textContent = String(
        available.filter((record) => state.saved.has(record.id) || state.tracked.has(record.id)).length
      );
    });
    document.querySelector("#visible-count").textContent = String(visible);
    document.querySelector("#saved-count").textContent = String(state.saved.size);
    document.querySelector("#tracked-count").textContent = String(state.tracked.size);
  }

  function informationView() {
    const panels = {
      context: [
        "Factual development",
        "Interpretation and India relevance",
        "Opportunity pathway and uncertainty",
        "Recommended next step"
      ],
      sources: [
        "Original issuer or authoritative public source",
        "Confirmed publication date and current accessibility",
        "Eligibility, geography and deadline verification",
        "Visible distinction between evidence and inference"
      ],
      settings: [
        "Fit-track preferences",
        "Theme and geography interests",
        "Notification frequency",
        "Privacy and session controls"
      ]
    };

    const descriptions = {
      context: "Published intelligence will preserve this sequence so a user can challenge the evidence before accepting the interpretation.",
      sources: "Paid aggregators may reveal a lead, but the underlying public source must be located and verified wherever possible.",
      settings: "These controls are a structural preview. This public prototype does not create an account, store personal information or send notifications."
    };

    feed.replaceChildren();
    const article = document.createElement("article");
    article.className = "empty-state";
    const marker = document.createElement("span");
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = state.view === "sources" ? "□" : state.view === "settings" ? "⚙" : "▤";
    const title = document.createElement("h2");
    title.textContent = state.view === "context"
      ? "A disciplined route from evidence to action"
      : state.view === "sources"
        ? "Verification before publication"
        : "Preferences will belong to a secure account";
    const paragraph = document.createElement("p");
    paragraph.textContent = descriptions[state.view];
    const list = document.createElement("ol");
    list.style.cssText = "max-width:620px;margin:24px auto 0;padding:0;border-top:1px solid #373737;list-style:none;text-align:left";
    panels[state.view].forEach((label, index) => {
      const item = document.createElement("li");
      item.style.cssText = "display:grid;grid-template-columns:40px 1fr;gap:12px;padding:13px 0;border-bottom:1px solid rgba(55,55,55,.18);font-size:12px";
      const number = document.createElement("span");
      number.style.cssText = "color:#e55934;font-family:Georgia,serif;font-size:16px";
      number.textContent = String(index + 1).padStart(2, "0");
      const text = document.createElement("strong");
      text.textContent = label;
      item.append(number, text);
      list.append(item);
    });
    article.append(marker, title, paragraph, list);
    feed.append(article);
    emptyState.hidden = true;
    updateCounts(0);
  }

  function render() {
    setViewCopy();

    if (["context", "sources", "settings"].includes(state.view)) {
      informationView();
      return;
    }

    const result = activeRecords();
    feed.replaceChildren();

    result.forEach((record) => {
      const fragment = template.content.cloneNode(true);
      const article = fragment.querySelector(".feed-item");
      const openButton = fragment.querySelector(".item-open");
      article.dataset.id = record.id;
      article.dataset.class = record.class;
      article.classList.toggle("is-selected", state.selected === record.id);

      fragment.querySelector(".record-type").textContent =
        record.class === "direct" ? "Direct opportunity · Illustrative" : "Emerging signal · Illustrative";
      fragment.querySelector(".record-title").textContent = record.title;
      fragment.querySelector(".record-source").textContent = record.source;
      fragment.querySelector(".record-summary").textContent = record.summary;

      const fitBadge = fragment.querySelector(".fit-badge");
      fitBadge.textContent = record.fitLabel;
      fitBadge.classList.toggle("nonprofit", record.fit.length === 1 && record.fit[0] === "nonprofit");
      fragment.querySelector(".recommended-action").textContent = record.action;
      fragment.querySelector(".item-timing strong").textContent = record.timing;
      fragment.querySelector(".item-timing span").textContent = record.timingLabel;

      openButton.setAttribute("aria-label", "Open illustrative record: " + record.title);
      openButton.addEventListener("click", () => openPreview(record.id));

      fragment.querySelectorAll("[data-action]").forEach((button) => {
        const action = button.dataset.action;
        button.setAttribute("aria-label", action + " " + record.title);
        if (action === "save") button.classList.toggle("is-active", state.saved.has(record.id));
        if (action === "track") button.classList.toggle("is-active", state.tracked.has(record.id));
        button.addEventListener("click", () => handleAction(action, record.id));
      });

      feed.append(fragment);
    });

    emptyState.hidden = result.length !== 0;
    updateCounts(result.length);
  }

  function previewMarkup(record) {
    return [
      '<p class="preview-class">', record.type, ' · ', themeLabel(record.theme), '</p>',
      '<h2 id="preview-title">', record.title, '</h2>',
      '<p class="preview-lead">', record.summary, '</p>',
      '<div class="preview-status">',
      '<div><span>Fit track</span><strong>', record.fitLabel, '</strong></div>',
      '<div><span>Evidence</span><strong>', record.confidenceLabel, '</strong></div>',
      '</div>',
      '<section class="preview-section"><h3>Why it may matter</h3><p>', record.whyItMatters, '</p></section>',
      '<section class="preview-section"><h3>Evidence status</h3><p>', record.evidence, '</p></section>',
      '<section class="preview-section"><h3>Possible next step</h3><p>', record.nextStep, '</p></section>',
      '<div class="preview-actions">',
      '<button type="button" data-preview-action="track">', state.tracked.has(record.id) ? "Tracking" : "Track next step", '</button>',
      '<button class="secondary" type="button" data-preview-action="save">', state.saved.has(record.id) ? "Saved" : "Save", '</button>',
      '</div>',
      '<p class="preview-disclaimer">Interface demonstration only. This record is not live intelligence and should not be used as the basis for a decision.</p>'
    ].join("");
  }

  function openPreview(id) {
    const record = records.find((item) => item.id === id);
    if (!record) return;
    state.selected = id;
    previewContent.innerHTML = previewMarkup(record);
    previewPanel.classList.add("is-open");
    document.querySelectorAll(".feed-item").forEach((item) => {
      item.classList.toggle("is-selected", item.dataset.id === id);
    });
    previewContent.querySelectorAll("[data-preview-action]").forEach((button) => {
      button.addEventListener("click", () => handleAction(button.dataset.previewAction, id));
    });
  }

  function closePreview() {
    state.selected = null;
    previewPanel.classList.remove("is-open");
    previewContent.innerHTML =
      '<div class="preview-placeholder">' +
      '<span aria-hidden="true">◇</span>' +
      '<h2 id="preview-title">Select an intelligence item</h2>' +
      '<p>Review why it matters, evidence status and a possible next step.</p>' +
      '</div>';
    document.querySelectorAll(".feed-item").forEach((item) => item.classList.remove("is-selected"));
  }

  function handleAction(action, id) {
    const record = records.find((item) => item.id === id);
    if (!record) return;

    if (action === "save") {
      if (state.saved.has(id)) {
        state.saved.delete(id);
        showToast("Removed from saved records");
      } else {
        state.saved.add(id);
        showToast("Saved for this browser session");
      }
    }

    if (action === "track") {
      if (state.tracked.has(id)) {
        state.tracked.delete(id);
        showToast("Tracking removed");
      } else {
        state.tracked.add(id);
        showToast("Added to the illustrative pipeline");
      }
    }

    if (action === "dismiss") {
      state.dismissed.add(id);
      showToast("Dismissed for this browser session");
      if (state.selected === id) closePreview();
    }

    render();
    if (state.selected === id && action !== "dismiss") openPreview(id);
  }

  function changeView(view) {
    if (!viewCopy[view]) return;
    state.view = view;
    state.selected = null;
    previewPanel.classList.remove("is-open");
    closeMobileMenu();
    render();
  }

  function closeMobileMenu() {
    const sidebar = document.querySelector("#workspace-sidebar");
    const menuButton = document.querySelector(".mobile-menu-button");
    sidebar.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => changeView(button.dataset.view));
  });

  document.querySelectorAll("[data-mobile-view]").forEach((button) => {
    button.addEventListener("click", () => changeView(button.dataset.mobileView));
  });

  document.querySelectorAll("[data-fit]").forEach((button) => {
    button.addEventListener("click", () => {
      state.fit = button.dataset.fit;
      document.querySelectorAll("[data-fit]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      render();
    });
  });

  searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    render();
  });

  themeFilter.addEventListener("change", () => {
    state.theme = themeFilter.value;
    render();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    render();
  });

  document.querySelector("#clear-filters").addEventListener("click", () => {
    state.fit = "all";
    state.theme = "all";
    state.query = "";
    searchInput.value = "";
    themeFilter.value = "all";
    document.querySelectorAll("[data-fit]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.fit === "all");
    });
    render();
  });

  document.querySelector("#close-preview").addEventListener("click", closePreview);

  const menuButton = document.querySelector(".mobile-menu-button");
  menuButton.addEventListener("click", () => {
    const sidebar = document.querySelector("#workspace-sidebar");
    const open = !sidebar.classList.contains("is-open");
    sidebar.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });

  const searchControl = document.querySelector(".search-control");
  document.querySelector("#mobile-search").addEventListener("click", () => {
    const open = !searchControl.classList.contains("is-open");
    searchControl.classList.toggle("is-open", open);
    if (open) searchInput.focus();
  });

  document.querySelector("#mobile-more").addEventListener("click", () => {
    menuButton.click();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePreview();
      closeMobileMenu();
      searchControl.classList.remove("is-open");
    }
  });

  render();

  if (window.matchMedia("(min-width: 1021px)").matches) {
    const first = activeRecords()[0];
    if (first) openPreview(first.id);
  }
})();