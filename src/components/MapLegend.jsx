import { useState } from "react";
import { Panel } from "@xyflow/react";
import { ChevronDown } from "lucide-react";
import { EDGE_KINDS } from "../lib/edgeKinds.js";

const legendItems = Object.entries(EDGE_KINDS);

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Panel
      aria-label="Legenda delle relazioni"
      className={`map-legend${isOpen ? " map-legend--open" : ""}`}
      position="bottom-center"
    >
      <p className="map-legend__title map-legend__title--desktop">
        Relazioni
      </p>
      <button
        aria-controls="map-legend-items"
        aria-expanded={isOpen}
        className="map-legend__toggle"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="map-legend__title">Relazioni</span>
        <ChevronDown
          aria-hidden="true"
          className="map-legend__chevron"
          size={13}
        />
      </button>
      <ul className="map-legend__items" id="map-legend-items">
        {legendItems.map(([kind, config]) => (
          <li className="map-legend__item" key={kind} title={config.description}>
            <svg
              aria-hidden="true"
              className="map-legend__sample"
              viewBox="0 0 28 8"
            >
              <line
                stroke={config.color}
                strokeDasharray={config.dasharray}
                strokeLinecap="round"
                strokeWidth={config.width}
                x1="1"
                x2="27"
                y1="4"
                y2="4"
              />
            </svg>
            <span>{config.label}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
