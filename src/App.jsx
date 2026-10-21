import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  Background,
  ControlButton,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import { initialEdges, initialNodes } from "./data/schemaNodi.js";
import TechNode from "./components/TechNode.jsx";
import GlossaryForm from "./components/GlossaryForm.jsx";
import NodeDetailsPanel from "./components/NodeDetailsPanel.jsx";
import { glossario } from "./data/glossario.js";

const GLOSSARY_STORAGE_KEY = "studio-map-glossary";

function readStoredGlossary() {
  try {
    const storedGlossary = window.localStorage.getItem(GLOSSARY_STORAGE_KEY);
    if (!storedGlossary) return { entries: [], error: null };

    const entries = JSON.parse(storedGlossary);
    if (
      !Array.isArray(entries) ||
      entries.some(
        (entry) =>
          typeof entry.term !== "string" ||
          typeof entry.definition !== "string",
      )
    ) {
      return { entries: [], error: "I termini salvati non sono validi." };
    }

    return { entries, error: null };
  } catch (error) {
    console.error("Impossibile caricare il glossario salvato.", error);
    return {
      entries: [],
      error: "Impossibile caricare i termini salvati nel browser.",
    };
  }
}

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isGlossaryFormOpen, setIsGlossaryFormOpen] = useState(false);
  const [storedGlossary] = useState(readStoredGlossary);
  const [customGlossary, setCustomGlossary] = useState(storedGlossary.entries);
  const [glossaryError, setGlossaryError] = useState(storedGlossary.error);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const glossary = [...glossario, ...customGlossary];
  const nodeTypes = useMemo(() => ({ techNode: TechNode }), []);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const onConnect = useCallback(
    (params) => setEdges((currentEdges) => addEdge(params, currentEdges)),
    [setEdges],
  );

  function handleAddGlossaryTerm({ term, definition }) {
    const normalizedTerm = term.trim();
    const normalizedDefinition = definition.trim();
    if (
      glossary.some(
        (entry) => entry.term.toLocaleLowerCase() === normalizedTerm.toLocaleLowerCase(),
      )
    ) {
      return "Questo termine è già presente nel glossario.";
    }

    const nextGlossary = [
      ...customGlossary,
      { term: normalizedTerm, definition: normalizedDefinition },
    ];
    try {
      window.localStorage.setItem(
        GLOSSARY_STORAGE_KEY,
        JSON.stringify(nextGlossary),
      );
    } catch (error) {
      console.error("Impossibile salvare il nuovo termine.", error);
      return "Non è stato possibile salvare il termine nel browser.";
    }

    setCustomGlossary(nextGlossary);
    setGlossaryError(null);
    return null;
  }

  useEffect(() => {
    if (!selectedNodeId && !isGlossaryFormOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedNodeId(null);
        setIsGlossaryFormOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, isGlossaryFormOpen]);

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
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant="dots" gap={16} size={1} color="#273349" />
        <Controls>
          <ControlButton
            aria-label="Aggiungi un termine al glossario"
            className="studio-map__glossary-button"
            onClick={() => setIsGlossaryFormOpen((isOpen) => !isOpen)}
            title="Aggiungi un termine al glossario"
          >
            <Plus aria-hidden="true" size={16} />
          </ControlButton>
        </Controls>
        <MiniMap pannable zoomable maskColor="rgba(11, 17, 32, 0.6)" />
      </ReactFlow>
      {isGlossaryFormOpen && (
        <GlossaryForm
          error={glossaryError}
          onAddTerm={handleAddGlossaryTerm}
          onClose={() => setIsGlossaryFormOpen(false)}
        />
      )}
      {selectedNode && (
        <NodeDetailsPanel
          key={selectedNode.id}
          node={selectedNode}
          glossary={glossary}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </main>
  );
}

export default App;
