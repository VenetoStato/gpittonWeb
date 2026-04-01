(function () {
  "use strict";

  const STORAGE_KEY = "castelliMentali_v1";

  /** @typedef {{ id: string, label: string, memo: string }} Locus */
  /** @typedef {{ id: string, name: string, loci: Locus[] }} Palace */

  /** @type {{ palaces: Palace[], currentId: string | null }} */
  let state = { palaces: [], currentId: null };

  function uid() {
    return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && Array.isArray(p.palaces)) {
          state = {
            palaces: p.palaces.map(normalizePalace),
            currentId: p.currentId && p.palaces.some((x) => x.id === p.currentId) ? p.currentId : (p.palaces[0]?.id ?? null),
          };
          return;
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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ palaces: state.palaces, currentId: state.currentId })
    );
  }

  function currentPalace() {
    return state.palaces.find((p) => p.id === state.currentId) ?? null;
  }

  // —— DOM ——
  const el = {
    palaceSelect: document.getElementById("palaceSelect"),
    btnNewPalace: document.getElementById("btnNewPalace"),
    btnDeletePalace: document.getElementById("btnDeletePalace"),
    palaceName: document.getElementById("palaceName"),
    lociList: document.getElementById("lociList"),
    btnAddLocus: document.getElementById("btnAddLocus"),
    btnTemplate10: document.getElementById("btnTemplate10"),
    tabEdit: document.getElementById("tabEdit"),
    tabReview: document.getElementById("tabReview"),
    panelEdit: document.getElementById("panelEdit"),
    panelReview: document.getElementById("panelReview"),
    reviewProgress: document.getElementById("reviewProgress"),
    reviewLabel: document.getElementById("reviewLabel"),
    reviewMemo: document.getElementById("reviewMemo"),
    btnPrev: document.getElementById("btnPrev"),
    btnNext: document.getElementById("btnNext"),
    btnRestart: document.getElementById("btnRestart"),
    exportBtn: document.getElementById("exportBtn"),
    importFile: document.getElementById("importFile"),
    helpToggle: document.getElementById("helpToggle"),
    helpPanel: document.getElementById("helpPanel"),
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
      el.lociList.innerHTML = '<p class="empty-hint">Crea un palazzo per aggiungere i punti del percorso.</p>';
      return;
    }
    if (p.loci.length === 0) {
      el.lociList.innerHTML =
        '<p class="empty-hint">Aggiungi i <strong>loci</strong>: ogni riga è un punto fisso in ordine (es. ingresso, corridoio, cucina…). Poi scrivi cosa vuoi ricordare lì.</p>';
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
          <input type="text" id="lab-${loc.id}" class="input locus-label" placeholder="Es. Ingresso — armadio scarpe" value="${escapeAttr(loc.label)}" />
          <label class="sr-only" for="mem-${loc.id}">Da ricordare</label>
          <input type="text" id="mem-${loc.id}" class="input locus-memo" placeholder="Immagine o parola da associare (es. melone gigante)" value="${escapeAttr(loc.memo)}" />
        </div>
        <div class="locus-actions">
          <button type="button" class="btn-icon" data-act="up" title="Sposta su" aria-label="Sposta su">↑</button>
          <button type="button" class="btn-icon" data-act="down" title="Sposta giù" aria-label="Sposta giù">↓</button>
          <button type="button" class="btn-icon danger" data-act="del" title="Elimina punto" aria-label="Elimina">×</button>
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

  function renderReview() {
    const p = currentPalace();
    if (!p || p.loci.length === 0) {
      el.reviewProgress.textContent = "";
      el.reviewLabel.textContent = "Nessun punto nel palazzo";
      el.reviewMemo.textContent = "Aggiungi almeno un locus nella scheda Costruisci.";
      el.btnPrev.disabled = true;
      el.btnNext.disabled = true;
      return;
    }
    clampReviewIndex();
    const loc = p.loci[reviewIndex];
    el.reviewProgress.textContent = `Passo ${reviewIndex + 1} di ${p.loci.length}`;
    el.reviewLabel.textContent = loc.label || "(punto senza nome)";
    el.reviewMemo.textContent = loc.memo || "— nessuna associazione —";
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

  el.palaceSelect.addEventListener("change", () => {
    state.currentId = el.palaceSelect.value || null;
    reviewIndex = 0;
    save();
    syncPalaceNameInput();
    renderLoci();
    renderReview();
  });

  el.btnNewPalace.addEventListener("click", () => {
    const name = prompt("Nome del nuovo palazzo (es. Casa mia, Ufficio):", "Il mio palazzo");
    if (name === null) return;
    const p = { id: uid(), name: name.trim() || "Nuovo palazzo", loci: [] };
    state.palaces.push(p);
    state.currentId = p.id;
    reviewIndex = 0;
    save();
    fullRender();
  });

  el.btnDeletePalace.addEventListener("click", () => {
    const p = currentPalace();
    if (!p) return;
    if (!confirm(`Eliminare il palazzo «${p.name}» e tutti i suoi punti?`)) return;
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
      alert("Prima crea un palazzo dal pulsante «Nuovo palazzo».");
      return;
    }
    p.loci.push({ id: uid(), label: "", memo: "" });
    save();
    renderLoci();
  });

  el.btnTemplate10.addEventListener("click", () => {
    const p = currentPalace();
    if (!p) {
      alert("Prima crea un palazzo.");
      return;
    }
    if (p.loci.length > 0 && !confirm("Aggiungere 10 punti numerati in coda? (non cancella quelli esistenti)")) return;
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

  function setTab(which) {
    const edit = which === "edit";
    el.tabEdit.classList.toggle("active", edit);
    el.tabReview.classList.toggle("active", !edit);
    el.panelEdit.hidden = !edit;
    el.panelReview.hidden = edit;
    if (!edit) renderReview();
  }

  el.tabEdit.addEventListener("click", () => setTab("edit"));
  el.tabReview.addEventListener("click", () => setTab("review"));

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

  el.helpToggle.addEventListener("click", () => {
    const open = el.helpPanel.hidden;
    el.helpPanel.hidden = !open;
    el.helpToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  load();
  if (state.palaces.length === 0) {
    const demo = {
      id: uid(),
      name: "Esempio: mini percorso",
      loci: [
        { id: uid(), label: "1. Ingresso", memo: "Immagine: campanello che suona da solo" },
        { id: uid(), label: "2. Corridoio", memo: "Lista spesa: pane" },
        { id: uid(), label: "3. Cucina — frigo", memo: "Lista spesa: latte" },
      ],
    };
    state.palaces.push(demo);
    state.currentId = demo.id;
    save();
  }
  fullRender();
  setTab("edit");
})();
