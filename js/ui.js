/**
 * ui.js — Costruzione UI (toolbar icone + dropdown) e interazioni.
 * Pattern: la toolbar è generata a partire dall'array `tools`.
 * Ogni tool crea automaticamente:
 *  - un pulsante circolare con icona Bootstrap Icons;
 *  - un dropdown Bootstrap contenente una "card" con header (titolo + chiudi) e body.
 */

// Definizione degli strumenti
export const tools = [
  { id: "layers",  icon: "bi-layers",        label: "Layers" },
  { id: "stats",   icon: "bi-grid-3x3-gap",  label: "Statistiche" },
  { id: "filters", icon: "bi-funnel",        label: "Filtri" },
  { id: "info",    icon: "bi-info-circle",   label: "Info" }
];

// Entry point UI: costruzione toolbar e binding eventi
document.addEventListener("DOMContentLoaded", () => {
  buildToolbar();
  wireHamburgerToggle();
  wireDropdownExclusivity();
});

/* Costruzione della Toolbar */
function buildToolbar() {
  const container = document.getElementById("toolsToolbar");
  container.classList.add("tools-toolbar", "d-flex", "align-items-center", "gap-2");

  const fragment = document.createDocumentFragment();

  tools.forEach(tool => {
    const wrapper = document.createElement("div");
    wrapper.className = "dropdown";

    // Pulsante icona circolare
    wrapper.innerHTML = `
      <button class="btn tool-btn dropdown-toggle" type="button"
              id="btn-${tool.id}" data-bs-toggle="dropdown" data-bs-auto-close="outside"
              aria-expanded="false" title="${tool.label}" aria-label="${tool.label}">
        <i class="bi ${tool.icon}"></i>
      </button>
      <div class="dropdown-menu" aria-labelledby="btn-${tool.id}">
        <div class="dropdown-card">
          <div class="card-header d-flex justify-content-between align-items-center px-3 py-2">
            <span class="fw-semibold">${tool.label}</span>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-close="${tool.id}">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="card-body p-3">
            <!-- Placeholder body: contenuti futuri -->
            <div class="text-muted small">Contenuto disponibile a breve…</div>
          </div>
        </div>
      </div>
    `;

    fragment.appendChild(wrapper);
  });

  container.appendChild(fragment);

  // Pulsanti "chiudi" interni alle card: chiudono il relativo dropdown
  container.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const parentDropdown = e.currentTarget.closest(".dropdown");
      if (!parentDropdown) return;
      const toggle = parentDropdown.querySelector("[data-bs-toggle='dropdown']");
      const instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
      instance.hide();
    });
  });
}

/**
 * Gestisce il toggle dell’hamburger:
 * - Mostra/nasconde SOLO la toolbar (senza influire su altri elementi).
 */
function wireHamburgerToggle() {
  const btn = document.getElementById("btnHamburger");
  const toolbar = document.getElementById("toolsToolbar");

  btn.addEventListener("click", () => {
    // Mostra/nasconde la toolbar
    toolbar.classList.toggle("d-none");
    // Attiva/disattiva animazione hamburger
    btn.classList.toggle("is-active");
  });
}


/** Quando apro un dropdown, chiudo gli altri per pulizia visuale. **/
function wireDropdownExclusivity() {
  const toolbar = document.getElementById("toolsToolbar");

  toolbar.addEventListener("show.bs.dropdown", (evt) => {
    const current = evt.target; // .dropdown
    toolbar.querySelectorAll(".dropdown.show").forEach(opened => {
      if (opened !== current) {
        const toggle = opened.querySelector("[data-bs-toggle='dropdown']");
        bootstrap.Dropdown.getInstance(toggle)?.hide();
      }
    });
  });
}
