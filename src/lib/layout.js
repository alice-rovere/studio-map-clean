const LAYER_KINDS = new Set([
  "richiede",
  "usa",
  "estende",
  "si_integra",
  "strumento",
  "ospita",
]);

const COLUMN_WIDTH = 280;
const ROW_HEIGHT = 130;
const PADDING_X = 120;

function link(map, key, value) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

export function computeLayeredLayout(nodes, edges) {
  const ids = new Set(nodes.map((node) => node.id));
  const parents = new Map();
  const children = new Map();

  edges.forEach((edge) => {
    if (!ids.has(edge.source) || !ids.has(edge.target)) return;
    const kind = edge.data?.kind ?? "usa";
    if (!LAYER_KINDS.has(kind)) return;
    link(parents, edge.source, edge.target);
    link(children, edge.target, edge.source);
  });

  const layer = new Map();
  const visiting = new Set();

  function resolve(id) {
    if (layer.has(id)) return layer.get(id);
    if (visiting.has(id)) return 0;
    visiting.add(id);
    let value = 0;
    const nodeParents = parents.get(id);
    if (nodeParents) {
      nodeParents.forEach((parent) => {
        value = Math.max(value, resolve(parent) + 1);
      });
    }
    visiting.delete(id);
    layer.set(id, value);
    return value;
  }

  nodes.forEach((node) => resolve(node.id));

  let maxLayer = 0;
  layer.forEach((value) => {
    if (value > maxLayer) maxLayer = value;
  });

  const layers = Array.from({ length: maxLayer + 1 }, () => []);
  nodes.forEach((node) => {
    layers[layer.get(node.id)].push(node.id);
  });

  const order = new Map();
  layers[0].forEach((id, index) => order.set(id, index));

  function barycenter(id, map) {
    const neighbors = map.get(id);
    if (!neighbors || neighbors.size === 0) return null;
    let total = 0;
    let count = 0;
    neighbors.forEach((neighbor) => {
      const position = order.get(neighbor);
      if (position !== undefined) {
        total += position;
        count += 1;
      }
    });
    return count === 0 ? null : total / count;
  }

  function sortLayer(index, map) {
    layers[index]
      .map((id, current) => ({ id, key: barycenter(id, map), current }))
      .sort((a, b) => {
        const aKey = a.key ?? a.current;
        const bKey = b.key ?? b.current;
        return aKey - bKey || a.current - b.current;
      })
      .forEach((entry, position) => {
        layers[index][position] = entry.id;
        order.set(entry.id, position);
      });
  }

  for (let pass = 0; pass < 4; pass += 1) {
    for (let i = 1; i < layers.length; i += 1) sortLayer(i, parents);
    for (let i = layers.length - 2; i >= 0; i -= 1) sortLayer(i, children);
  }

  const positions = new Map();
  nodes.forEach((node) => {
    const column = layers[layer.get(node.id)];
    const indexInColumn = column.indexOf(node.id);
    const offset = indexInColumn - (column.length - 1) / 2;
    positions.set(node.id, {
      x: PADDING_X + layer.get(node.id) * COLUMN_WIDTH,
      y: offset * ROW_HEIGHT,
    });
  });

  return positions;
}
