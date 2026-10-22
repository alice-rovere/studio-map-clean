import { Panel } from "@xyflow/react";
import { Search, X } from "lucide-react";

export default function MapFilters({
  categories,
  hiddenCategories,
  searchTerm,
  onSearchChange,
  onToggleCategory,
  onReset,
}) {
  const hasFilters = searchTerm.trim().length > 0 || hiddenCategories.size > 0;

  return (
    <Panel aria-label="Filtri della mappa" className="map-filters" position="top-right">
      <label className="map-filters__search">
        <Search aria-hidden="true" size={14} />
        <input
          aria-label="Cerca un nodo"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cerca un nodo…"
          type="search"
          value={searchTerm}
        />
      </label>
      <div className="map-filters__categories" role="group" aria-label="Categorie">
        {categories.map((category) => {
          const isHidden = hiddenCategories.has(category);
          return (
            <button
              aria-pressed={!isHidden}
              className={`map-filters__chip studio-node--${category}`}
              key={category}
              onClick={() => onToggleCategory(category)}
              type="button"
            >
              {category}
            </button>
          );
        })}
      </div>
      {hasFilters && (
        <button className="map-filters__reset" onClick={onReset} type="button">
          <X aria-hidden="true" size={13} />
          Azzera filtri
        </button>
      )}
    </Panel>
  );
}
