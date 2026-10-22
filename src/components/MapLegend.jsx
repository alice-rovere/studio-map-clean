import { Panel } from "@xyflow/react";
import { EDGE_KINDS } from "../lib/edgeKinds.js";

const legendItems = Object.entries(EDGE_KINDS);

export default function MapLegend() {
  return (
    <Panel
      aria-label="Legenda delle relazioni"
      className="map-legend"
      position="bottom-center"
    >
      <p className="map-legend__title">Relazioni</p>
      <ul className="map-legend__items">
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
