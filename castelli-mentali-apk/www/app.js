(function () {
  "use strict";

  const STORAGE_KEY = "castelliMentali_v2";
  const LEGACY_KEY = "castelliMentali_v1";

  /** @typedef {{ id: string, label: string, memo: string }} Locus */
  /** @typedef {{ id: string, name: string, loci: Locus[] }} Palace */

  /** @type {{ palaces: Palace[], currentId: string | null }} */
  let state = { palaces: [], currentId: null };

  /** @type {{ hideMemo: boolean, revealed: boolean }} */
  let reviewUi = { hideMemo: true, revealed: false };

  const PRESETS = {
    time: {
      name: "Demo: tempo, focus e benessere",
      loci: [
        { label: "1. Soglia (apri l’app)", memo: "3 respiri lenti: «Questa sessione ha uno scopo, non è scroll»." },
        { label: "2. Punto di lavoro", memo: "Scelgo 1 azione concreta per la prossima ora (anche piccola)." },
        { label: "3. Finestra / luce", memo: "Dopo il ripasso: 2 minuti senza notifiche — micro-pausa consapevole." },
        { label: "4. Angolo relax", memo: "Una cosa utile già fatta oggi (anche minima): la noto e chiudo il cerchio." },
        { label: "5. Cucina / acqua", memo: "Un bicchiere d’acqua = gesto di cura fisica tra una schermata e l’altra." },
        { label: "6. Porta d’uscita", memo: "Chiudo l’app con un «fatto»: ho allenato la memoria, non ho solo consumato contenuti." },
      ],
    },
    study: {
      name: "Demo: studio e abitudini collaudate",
      loci: [
        { label: "1. Libreria", memo: "Ripetizione attiva: chiudo gli appunti e richiamo a voce 3 concetti chiave." },
        { label: "2. Tavolo", memo: "Spaced repetition: ripasso oggi → tra 2 giorni → tra 1 settimana (calendario)." },
        { label: "3. Letto (sera)", memo: "Sonno prima dell’esame: la memoria consolida durante il riposo, non solo la notte prima." },
        { label: "4. Quaderno", memo: "Pratica di recupero: domande difficili a me stesso invece di rileggere passivamente." },
        { label: "5. Orologio", memo: "Sessioni brevi (es. 25+5): meno fatica, più attenzione sostenuta nel tempo." },
        { label: "6. Posto d’esame", memo: "Se possibile, allenarsi nello stesso tipo di contesto in cui sarò valutato." },
      ],
    },
    champions: {
      name: "Demo: come i campioni di memoria",
      loci: [
        { label: "1. Partenza del percorso", memo: "Ordine sempre uguale: gli atleti della memoria non improvvisano il tracciato." },
        { label: "2. Prima tappa", memo: "Immagine esagerata: dimensioni enormi, colori forti, movimento — resta impressa." },
        { label: "3. Seconda tappa", memo: "Multisensoriale: aggiungo suono, tatto o odore all’immagine (anche inventati)." },
        { label: "4. Punto centrale", memo: "Primo ripasso subito dopo aver creato le immagini: fissa il percorso." },
        { label: "5. Penultima tappa", memo: "Allenamento breve ma spesso: meglio 5 minuti ripetuti che un’ora ogni tanto." },
        { label: "6. Arrivo", memo: "Un palazzo per argomento: non mischio lista spesa ed esame nello stesso percorso." },
      ],
    },
  };

  function uid() {
    return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
  }

  function parseStored(raw) {
    const p = JSON.parse(raw);
    if (!p || !Array.isArray(p.palaces)) return null;
    return {
      palaces: p.palaces.map(normalizePalace),
      currentId: p.currentId && p.palaces.some((x) => x.id === p.currentId) ? p.currentId : (p.palaces[0]?.id ?? null),
    };
  }

  function load() {
    try {
      for (const key of [STORAGE_KEY, LEGACY_KEY]) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = parseStored(raw);
          if (parsed) {
            state = parsed;
            if (key === LEGACY_KEY) save();
            return;
          }
        }
      }
    } catch (_) {}
    state = { palaces: [], currentId: null };
  }

  /** @param {any} x */
  function normalizePalace(x) {
    return {
      id: typeof x.id === "string" ? x.id : uid(),
      name: typeof x.name === "string" ? x.name : "Senza nome",
      loci: Array.isArray(x.loci) ? x.loci.map(normalizeLocus) : [],
    };
  }

  /** @param {any} x */
  function normalizeLocus(x) {
    return {
      id: typeof x.id === "string" ? x.id : uid(),
      label: typeof x.label === "string" ? x.label : "",
      memo: typeof x.memo === "string" ? x.memo : "",
    };
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ palaces: state.palaces, currentId: state.currentId }));
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch (_) {}
  }

  function currentPalace() {
    return state.palaces.find((p) => p.id === state.currentId) ?? null;
  }

  function clonePreset(key) {
    const src = PRESETS[key];
    if (!src) return null;
    return {
      id: uid(),
      name: src.name,
      loci: src.loci.map((l) => ({ id: uid(), label: l.label, memo: l.memo })),
    };
  }

  const el = {
    tabHome: document.getElementById("tabHome"),
    tabEdit: document.getElementById("tabEdit"),
    tabReview: document.getElementById("tabReview"),
    tabScience: document.getElementById("tabScience"),
    panelHome: document.getElementById("panelHome"),
    panelEdit: document.getElementById("panelEdit"),
    panelReview: document.getElementById("panelReview"),
    panelScience: document.getElementById("panelScience"),
    palaceSelect: document.getElementById("palaceSelect"),
    btnNewPalace: document.getElementById("btnNewPalace"),
    btnDeletePalace: document.getElementById("btnDeletePalace"),
    palaceName: document.getElementById("palaceName"),
    lociList: document.getElementById("lociList"),
    btnAddLocus: document.getElementById("btnAddLocus"),
    btnTemplate10: document.getElementById("btnTemplate10"),
    reviewProgress: document.getElementById("reviewProgress"),
    reviewLabel: document.getElementById("reviewLabel"),
    reviewMemo: document.getElementById("reviewMemo"),
    btnReveal: document.getElementById("btnReveal"),
    chkHideMemo: document.getElementById("chkHideMemo"),
    btnPrev: document.getElementById("btnPrev"),
    btnNext: document.getElementById("btnNext"),
    btnRestart: document.getElementById("btnRestart"),
    exportBtn: document.getElementById("exportBtn"),
    importFile: document.getElementById("importFile"),
    sciToggleWhy: document.getElementById("sciToggleWhy"),
    sciPanelWhy: document.getElementById("sciPanelWhy"),
  };

  let reviewIndex = 0;

  function renderPalaceSelect() {
    el.palaceSelect.innerHTML = "";
    state.palaces.forEach((p) => {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.name;
      el.palaceSelect.appendChild(o);
    });
    if (state.currentId) el.palaceSelect.value = state.currentId;
    el.btnDeletePalace.disabled = state.palaces.length === 0;
    el.palaceName.disabled = !currentPalace();
  }

  function renderLoci() {
    el.lociList.innerHTML = "";
    const p = currentPalace();
    if (!p) {
      el.lociList.innerHTML = '<p class="empty-hint">Crea un palazzo dalla scheda Percorso (demo) o con «Nuovo palazzo».</p>';
      return;
    }
    if (p.loci.length === 0) {
      el.lociList.innerHTML =
        '<p class="empty-hint">Aggiungi i <strong>loci</strong> in ordine: luogo fisso del percorso, poi l’associazione vivida da ricordare.</p>';
      return;
    }
    p.loci.forEach((loc, i) => {
      const row = document.createElement("div");
      row.className = "locus-row";
      row.dataset.id = loc.id;
      row.innerHTML = `
        <div class="locus-num">${i + 1}</div>
        <div class="locus-fields">
          <label class="sr-only" for="lab-${loc.id}">Luogo / punto</label>
          <input type="text" id="lab-${loc.id}" class="input locus-label" placeholder="Es. Ingresso — armadio" value="${escapeAttr(loc.label)}" />
          <label class="sr-only" for="mem-${loc.id}">Da ricordare</label>
          <input type="text" id="mem-${loc.id}" class="input locus-memo" placeholder="Immagine o promemoria vivido" value="${escapeAttr(loc.memo)}" />
        </div>
        <div class="locus-actions">
          <button type="button" class="btn-icon" data-act="up" title="Su" aria-label="Sposta su">↑</button>
          <button type="button" class="btn-icon" data-act="down" title="Giù" aria-label="Sposta giù">↓</button>
          <button type="button" class="btn-icon danger" data-act="del" title="Elimina" aria-label="Elimina">×</button>
        </div>
      `;
      el.lociList.appendChild(row);
    });

    el.lociList.querySelectorAll(".locus-label").forEach((inp) => {
      inp.addEventListener("change", onLocusFieldChange);
      inp.addEventListener("blur", onLocusFieldChange);
    });
    el.lociList.querySelectorAll(".locus-memo").forEach((inp) => {
      inp.addEventListener("change", onLocusFieldChange);
      inp.addEventListener("blur", onLocusFieldChange);
    });
    el.lociList.querySelectorAll("[data-act]").forEach((btn) => {
      btn.addEventListener("click", onLocusAction);
    });
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function onLocusFieldChange(ev) {
    const row = ev.target.closest(".locus-row");
    if (!row) return;
    const id = row.dataset.id;
    const p = currentPalace();
    if (!p) return;
    const loc = p.loci.find((l) => l.id === id);
    if (!loc) return;
    if (ev.target.classList.contains("locus-label")) loc.label = ev.target.value.trim();
    if (ev.target.classList.contains("locus-memo")) loc.memo = ev.target.value.trim();
    save();
  }

  function onLocusAction(ev) {
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.dataset.act;
    const row = btn.closest(".locus-row");
    if (!row) return;
    const id = row.dataset.id;
    const p = currentPalace();
    if (!p) return;
    const idx = p.loci.findIndex((l) => l.id === id);
    if (idx < 0) return;
    if (act === "del") {
      p.loci.splice(idx, 1);
      save();
      renderLoci();
      clampReviewIndex();
      return;
    }
    if (act === "up" && idx > 0) {
      [p.loci[idx - 1], p.loci[idx]] = [p.loci[idx], p.loci[idx - 1]];
      save();
      renderLoci();
    }
    if (act === "down" && idx < p.loci.length - 1) {
      [p.loci[idx + 1], p.loci[idx]] = [p.loci[idx], p.loci[idx + 1]];
      save();
      renderLoci();
    }
  }

  function clampReviewIndex() {
    const p = currentPalace();
    const n = p ? p.loci.length : 0;
    if (n === 0) reviewIndex = 0;
    else if (reviewIndex >= n) reviewIndex = n - 1;
  }

  function applyReviewMemoVisibility() {
    const p = currentPalace();
    const loc = p?.loci[reviewIndex];
    const hasMemo = !!(loc && String(loc.memo).trim());
    const hide = el.chkHideMemo.checked && hasMemo;

    reviewUi.hideMemo = hide;
    reviewUi.revealed = !hide;

    if (!loc) {
      el.reviewMemo.textContent = "";
      el.reviewMemo.classList.remove("hidden-memo");
      el.btnReveal.hidden = true;
      return;
    }

    if (hide) {
      el.reviewMemo.textContent = "Prova a ricordare l’associazione, poi tocca «Mostra risposta».";
      el.reviewMemo.classList.add("hidden-memo");
      el.btnReveal.hidden = false;
    } else {
      el.reviewMemo.textContent = loc.memo.trim() || "— nessuna nota —";
      el.reviewMemo.classList.remove("hidden-memo");
      el.btnReveal.hidden = true;
    }
  }

  function renderReview() {
    const p = currentPalace();
    if (!p || p.loci.length === 0) {
      el.reviewProgress.textContent = "";
      el.reviewLabel.textContent = "Nessun percorso attivo";
      el.reviewMemo.textContent = "Scegli un palazzo o aggiungi un percorso demo dalla scheda Percorso.";
      el.reviewMemo.classList.remove("hidden-memo");
      el.btnReveal.hidden = true;
      el.btnPrev.disabled = true;
      el.btnNext.disabled = true;
      return;
    }
    clampReviewIndex();
    const loc = p.loci[reviewIndex];
    el.reviewProgress.textContent = `Passo ${reviewIndex + 1} / ${p.loci.length}`;
    el.reviewLabel.textContent = loc.label || "(punto senza nome)";
    applyReviewMemoVisibility();
    el.btnPrev.disabled = reviewIndex === 0;
    el.btnNext.disabled = reviewIndex >= p.loci.length - 1;
  }

  function syncPalaceNameInput() {
    const p = currentPalace();
    el.palaceName.value = p ? p.name : "";
  }

  function fullRender() {
    renderPalaceSelect();
    syncPalaceNameInput();
    renderLoci();
    renderReview();
  }

  function setNavTab(which) {
    const tabs = [
      { id: "home", tab: el.tabHome, panel: el.panelHome },
      { id: "edit", tab: el.tabEdit, panel: el.panelEdit },
      { id: "review", tab: el.tabReview, panel: el.panelReview },
      { id: "science", tab: el.tabScience, panel: el.panelScience },
    ];
    tabs.forEach((t) => {
      const on = t.id === which;
      t.tab.classList.toggle("active", on);
      t.tab.setAttribute("aria-selected", on ? "true" : "false");
      t.panel.hidden = !on;
    });
    if (which === "review") renderReview();
  }

  el.tabHome.addEventListener("click", () => setNavTab("home"));
  el.tabEdit.addEventListener("click", () => setNavTab("edit"));
  el.tabReview.addEventListener("click", () => setNavTab("review"));
  el.tabScience.addEventListener("click", () => setNavTab("science"));

  el.palaceSelect.addEventListener("change", () => {
    state.currentId = el.palaceSelect.value || null;
    reviewIndex = 0;
    save();
    syncPalaceNameInput();
    renderLoci();
    renderReview();
  });

  el.btnNewPalace.addEventListener("click", () => {
    const name = prompt("Nome del nuovo palazzo:", "Il mio palazzo");
    if (name === null) return;
    const p = { id: uid(), name: name.trim() || "Nuovo palazzo", loci: [] };
    state.palaces.push(p);
    state.currentId = p.id;
    reviewIndex = 0;
    save();
    fullRender();
    setNavTab("edit");
  });

  el.btnDeletePalace.addEventListener("click", () => {
    const p = currentPalace();
    if (!p) return;
    if (!confirm(`Eliminare «${p.name}» e tutti i suoi punti?`)) return;
    state.palaces = state.palaces.filter((x) => x.id !== p.id);
    state.currentId = state.palaces[0]?.id ?? null;
    reviewIndex = 0;
    save();
    fullRender();
  });

  el.palaceName.addEventListener("change", () => {
    const p = currentPalace();
    if (!p) return;
    p.name = el.palaceName.value.trim() || "Senza nome";
    save();
    renderPalaceSelect();
  });

  el.btnAddLocus.addEventListener("click", () => {
    const p = currentPalace();
    if (!p) {
      alert("Crea prima un palazzo (Percorso → demo, o «Nuovo palazzo»).");
      return;
    }
    p.loci.push({ id: uid(), label: "", memo: "" });
    save();
    renderLoci();
  });

  el.btnTemplate10.addEventListener("click", () => {
    const p = currentPalace();
    if (!p) {
      alert("Crea prima un palazzo.");
      return;
    }
    if (p.loci.length > 0 && !confirm("Aggiungere 10 punti numerati in coda?")) return;
    for (let i = 1; i <= 10; i++) {
      p.loci.push({ id: uid(), label: `Punto ${p.loci.length + 1}`, memo: "" });
    }
    save();
    renderLoci();
  });

  el.btnPrev.addEventListener("click", () => {
    if (reviewIndex > 0) {
      reviewIndex--;
      renderReview();
    }
  });

  el.btnNext.addEventListener("click", () => {
    const p = currentPalace();
    if (p && reviewIndex < p.loci.length - 1) {
      reviewIndex++;
      renderReview();
    }
  });

  el.btnRestart.addEventListener("click", () => {
    reviewIndex = 0;
    renderReview();
  });

  el.btnReveal.addEventListener("click", () => {
    const p = currentPalace();
    const loc = p?.loci[reviewIndex];
    if (!loc) return;
    el.reviewMemo.textContent = loc.memo.trim() || "— nessuna nota —";
    el.reviewMemo.classList.remove("hidden-memo");
    el.btnReveal.hidden = true;
    reviewUi.revealed = true;
  });

  el.chkHideMemo.addEventListener("change", () => {
    renderReview();
  });

  document.querySelectorAll(".preset-btn[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-preset");
      const palace = clonePreset(key);
      if (!palace) return;
      state.palaces.push(palace);
      state.currentId = palace.id;
      reviewIndex = 0;
      save();
      fullRender();
      setNavTab("review");
    });
  });

  el.exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ palaces: state.palaces, currentId: state.currentId }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "castelli-mentali-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  el.importFile.addEventListener("change", () => {
    const f = el.importFile.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(String(r.result));
        if (!data.palaces || !Array.isArray(data.palaces)) throw new Error("Formato non valido");
        state = {
          palaces: data.palaces.map(normalizePalace),
          currentId: data.currentId ?? data.palaces[0]?.id ?? null,
        };
        if (!state.palaces.some((p) => p.id === state.currentId)) state.currentId = state.palaces[0]?.id ?? null;
        reviewIndex = 0;
        save();
        fullRender();
      } catch (e) {
        alert("Import fallito: " + (e.message || "file non valido"));
      }
      el.importFile.value = "";
    };
    r.readAsText(f);
  });

  el.sciToggleWhy.addEventListener("click", () => {
    const open = el.sciPanelWhy.hidden;
    el.sciPanelWhy.hidden = !open;
    el.sciToggleWhy.setAttribute("aria-expanded", open ? "true" : "false");
  });

  load();
  if (state.palaces.length === 0) {
    const pTime = clonePreset("time");
    if (pTime) {
      state.palaces.push(pTime);
      state.currentId = pTime.id;
      save();
    }
  }

  fullRender();
  setNavTab("home");
})();
