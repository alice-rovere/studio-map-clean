import { useEffect, useMemo, useState } from "react";
import { MousePointer2, RotateCcw, X } from "lucide-react";
import {
  ARCHITECTURE_CATEGORIES,
  buildArchitectureDevOpsItems,
  buildArchitectureToolItems,
  getArchitectureCategory,
} from "../lib/architectureLayers.js";
import ArchitectureScene from "./ArchitectureScene.jsx";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
}

export default function ArchitecturePanel({
  activeCategory,
  nodeDetails = {},
  nodes = [],
  isOpen = true,
  onClose,
  onResetFilter,
  onSelectCategory,
  onSelectNode,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const reducedMotion = useReducedMotion();
  const activeItem = getArchitectureCategory(activeCategory);
  const infoItem = hoveredItem ?? activeItem;
  const infoAccent = infoItem?.accent ?? "#7ab8ff";
  const toolItems = useMemo(
    () => buildArchitectureToolItems(nodes, nodeDetails),
    [nodeDetails, nodes],
  );
  const devopsItems = useMemo(
    () => buildArchitectureDevOpsItems(nodes, nodeDetails),
    [nodeDetails, nodes],
  );

  return (
    <aside
      aria-labelledby="architecture-panel-title"
      className="architecture-panel"
      hidden={!isOpen}
    >
      <header className="architecture-panel__header">
        <div>
          <span className="architecture-panel__eyebrow">VISTA SISTEMA</span>
          <h2 id="architecture-panel-title">Architettura</h2>
        </div>
        <button
          aria-label="Chiudi architettura 3D"
          autoFocus
          className="architecture-panel__close"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </header>

      <div className="architecture-panel__scene">
        <ArchitectureScene
          activeCategory={activeCategory}
          devopsItems={devopsItems}
          hoveredId={hoveredItem?.id}
          isOpen={isOpen}
          onHoverItem={setHoveredItem}
          onLeaveItem={() => setHoveredItem(null)}
          onSelectCategory={onSelectCategory}
          onSelectNode={onSelectNode}
          reducedMotion={reducedMotion}
          toolItems={toolItems}
        />
        <span className="architecture-panel__hint">
          <MousePointer2 aria-hidden="true" size={11} />
          Trascina per ruotare · Scroll per zoom
        </span>
      </div>

      <div
        aria-label="Filtra la mappa per livello"
        className="architecture-panel__legend"
        role="group"
      >
        {ARCHITECTURE_CATEGORIES.map((category) => (
          <button
            aria-pressed={activeCategory === category.id}
            className={`architecture-level architecture-level--${category.id}`}
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            onFocus={() => setHoveredItem(category)}
            onBlur={() => setHoveredItem(null)}
            onMouseEnter={() => setHoveredItem(category)}
            onMouseLeave={() => setHoveredItem(null)}
            type="button"
          >
            {category.label}
          </button>
        ))}
      </div>

      <div
        aria-live="polite"
        className="architecture-panel__info"
        style={{ "--info-accent": infoAccent }}
      >
        {infoItem ? (
          <>
            <span className="architecture-panel__info-eyebrow">
              {infoItem.tagline}
            </span>
            <h3>{infoItem.label}</h3>
            <p>{infoItem.description}</p>
          </>
        ) : (
          <>
            <span className="architecture-panel__info-eyebrow">
              TRE LIVELLI, UN GUSCIO
            </span>
            <h3>Esplora la struttura</h3>
            <p>
              Seleziona un livello per filtrare la mappa, oppure un tool o un
              nodo DevOps per aprire direttamente la sua scheda. Clicca di
              nuovo sul livello per rimuovere il filtro.
            </p>
          </>
        )}
      </div>

      <footer className="architecture-panel__footer">
        <span className="architecture-panel__status">
          {activeItem ? `Mappa filtrata: ${activeItem.label}` : "Nessun filtro attivo"}
        </span>
        <button
          className="architecture-panel__reset"
          disabled={!activeCategory}
          onClick={onResetFilter}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={12} />
          Azzera
        </button>
      </footer>
    </aside>
  );
}
