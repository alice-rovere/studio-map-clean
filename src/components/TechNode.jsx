import { Handle, Position } from "@xyflow/react";

export default function TechNode({ data }) {
  const category = data.category?.toLowerCase() || "tools";
  const categoryClass = `studio-node--${category}`;

  return (
    <div className={`studio-node ${categoryClass}`}>
      <Handle
        className="studio-node__handle--target"
        id="target-left"
        position={Position.Left}
        type="target"
      />
      <Handle
        className="studio-node__handle--source"
        id="source-left"
        position={Position.Left}
        type="source"
      />
      <Handle
        className="studio-node__handle--target"
        id="target-right"
        position={Position.Right}
        type="target"
      />
      <Handle
        className="studio-node__handle--source"
        id="source-right"
        position={Position.Right}
        type="source"
      />
      <div className="studio-node__category">{data.category}</div>
      <div className="studio-node__label">{data.label}</div>
    </div>
  );
}
