import { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from "@xyflow/react";

export default function RelationEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data,
  selected,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const isVisible = (isHovered || selected) && data?.sentence;

  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BaseEdge
          interactionWidth={22}
          markerEnd={markerEnd}
          path={edgePath}
          style={style}
        />
      </g>
      {isVisible && (
        <EdgeLabelRenderer>
          <div
            className="relation-edge"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <span
              className="relation-edge__kind"
              style={{ color: data.color }}
            >
              {data.kindLabel}
            </span>
            <span className="relation-edge__sentence">{data.sentence}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
