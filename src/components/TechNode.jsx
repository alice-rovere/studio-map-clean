import { Handle, Position } from "@xyflow/react";

export default function TechNode({ data }) {
  const category = data.category?.toLowerCase() || "tools";
  const categoryClass = `studio-node--${category}`;

  return (
    <div className={`studio-node ${categoryClass}`}>
      <Handle type="target" position={Position.Left} />
      <div className="studio-node__category">{data.category}</div>
      <div className="studio-node__label">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
