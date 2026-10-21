import { useCallback, useMemo } from "react";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { initialEdges, initialNodes } from "./data/schemaNodi.js";
import TechNode from "./components/TechNode.jsx";

function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = useMemo(() => ({ techNode: TechNode }), []);
  const onConnect = useCallback(
    (params) => setEdges((currentEdges) => addEdge(params, currentEdges)),
    [setEdges],
  );

  return (
    <main className="studio-map h-screen w-screen">
      <div className="studio-map__heading">
        <span className="studio-map__eyebrow">WORKSPACE MANAGEMENT</span>
        <h1>Studio Tech Ecosystem</h1>
        <p>Mappatura dinamica delle competenze e dei software</p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant="dots" gap={16} size={1} color="#273349" />
        <Controls />
        <MiniMap pannable zoomable maskColor="rgba(11, 17, 32, 0.6)" />
      </ReactFlow>
    </main>
  );
}

export default App;
