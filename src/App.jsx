import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Network, Plus } from "lucide-react";
import TechNode from "./components/TechNode.jsx";
import GlossaryForm from "./components/GlossaryForm.jsx";
import NodeForm from "./components/NodeForm.jsx";
import NodeDetailsPanel from "./components/NodeDetailsPanel.jsx";
import { supabase } from "./lib/supabase.js";

const nodeCategories = ["frontend", "backend", "database", "devops", "tools"];

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Errore imprevisto.";
}

function MapActions({
  isGlossaryFormOpen,
  isNodeFormOpen,
  onToggleGlossary,
  onToggleNode,
  onAddNode,
  onCloseNodeForm,
}) {
  const { screenToFlowPosition } = useReactFlow();

  function handleAddNode({ label, category }) {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    return onAddNode({ label, category, position });
  }

  return (
    <Panel className="studio-map__actions" position="top-right">
      <button
        aria-label="Aggiungi un termine al glossario"
        aria-pressed={isGlossaryFormOpen}
        className="studio-map__action-button studio-map__glossary-button"
        onClick={() => onToggleGlossary()}
        title="Aggiungi un termine al glossario"
        type="button"
      >
        <Plus aria-hidden="true" size={16} />
      </button>
      <button
        aria-pressed={isNodeFormOpen}
        className="studio-map__action-button studio-map__node-button"
        onClick={() => onToggleNode()}
        type="button"
      >
        <Network aria-hidden="true" size={15} />
        Aggiungi nodo
      </button>
      {isNodeFormOpen && (
        <NodeForm
          categories={nodeCategories}
          onAddNode={handleAddNode}
          onClose={onCloseNodeForm}
        />
      )}
    </Panel>
  );
}

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isGlossaryFormOpen, setIsGlossaryFormOpen] = useState(false);
  const [isNodeFormOpen, setIsNodeFormOpen] = useState(false);
  const [glossary, setGlossary] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeDetails, setNodeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [loadError, setLoadError] = useState(
    supabase
      ? ""
      : "Configurazione Supabase mancante. Imposta VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
  );
  const [mutationError, setMutationError] = useState("");
  const nodeTypes = useMemo(() => ({ techNode: TechNode }), []);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const loadStudioMap = useCallback(async () => {
    if (!supabase) return;

    try {
      const [nodesResult, edgesResult, glossaryResult, detailsResult] =
        await Promise.all([
          supabase.from("nodes").select("id,label,category,position_x,position_y"),
          supabase.from("edges").select("id,source,target,type"),
          supabase.from("glossary").select("id,term,definition").order("term"),
          supabase
            .from("node_details")
            .select(
              "node_id,description,best_practices,naming_conventions,associated_software,study_urls",
            ),
        ]);

      const queryError = [
        nodesResult.error,
        edgesResult.error,
        glossaryResult.error,
        detailsResult.error,
      ].find(Boolean);
      if (queryError) throw queryError;

      setNodes(
        nodesResult.data.map((node) => ({
          id: node.id,
          type: "techNode",
          position: { x: node.position_x, y: node.position_y },
          data: { label: node.label, category: node.category },
        })),
      );
      setEdges(edgesResult.data);
      setGlossary(glossaryResult.data);
      setNodeDetails(
        Object.fromEntries(
          detailsResult.data.map((details) => [details.node_id, details]),
        ),
      );
      setLoadError("");
    } catch (error) {
      console.error("Impossibile caricare i dati da Supabase.", error);
      setLoadError(`Impossibile caricare i dati da Supabase: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (supabase) void Promise.resolve().then(loadStudioMap);
  }, [loadStudioMap]);

  function retryLoadStudioMap() {
    setIsLoading(true);
    setMutationError("");
    loadStudioMap();
  }

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
      const removedIds = changes
        .filter((change) => change.type === "remove")
        .map((change) => change.id);
      if (removedIds.length > 0 && supabase) {
        supabase
          .from("nodes")
          .delete()
          .in("id", removedIds)
          .then(({ error }) => {
            if (error) {
              console.error("Impossibile eliminare i nodi da Supabase.", error);
              setMutationError(`Impossibile eliminare i nodi: ${error.message}`);
            }
          });
      }
    },
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
      const removedIds = changes
        .filter((change) => change.type === "remove")
        .map((change) => change.id);
      if (removedIds.length > 0 && supabase) {
        supabase
          .from("edges")
          .delete()
          .in("id", removedIds)
          .then(({ error }) => {
            if (error) {
              console.error("Impossibile eliminare i collegamenti da Supabase.", error);
              setMutationError(`Impossibile eliminare i collegamenti: ${error.message}`);
            }
          });
      }
    },
    [],
  );

  const onConnect = useCallback(
    async (connection) => {
      if (!supabase) return;
      const edge = {
        id: crypto.randomUUID(),
        source: connection.source,
        target: connection.target,
        type: "smoothstep",
      };

      const { error } = await supabase.from("edges").insert(edge);
      if (error) {
        console.error("Impossibile salvare il collegamento in Supabase.", error);
        setMutationError(`Impossibile salvare il collegamento: ${error.message}`);
        return;
      }

      setEdges((currentEdges) => addEdge(edge, currentEdges));
      setMutationError("");
    },
    [],
  );

  async function handleAddGlossaryTerm({ term, definition }) {
    const normalizedTerm = term.trim();
    const normalizedDefinition = definition.trim();
    if (
      glossary.some(
        (entry) => entry.term.toLocaleLowerCase() === normalizedTerm.toLocaleLowerCase(),
      )
    ) {
      return "Questo termine è già presente nel glossario.";
    }

    if (!supabase) return "Configurazione Supabase mancante.";

    const { data, error } = await supabase
      .from("glossary")
      .insert({ term: normalizedTerm, definition: normalizedDefinition })
      .select("id,term,definition")
      .single();
    if (error) {
      console.error("Impossibile salvare il termine in Supabase.", error);
      return `Impossibile salvare il termine: ${error.message}`;
    }

    setGlossary((currentGlossary) => [...currentGlossary, data]);
    setMutationError("");
    return null;
  }

  async function handleAddNode({ label, category, position }) {
    if (!supabase) return "Configurazione Supabase mancante.";

    const node = {
      id: crypto.randomUUID(),
      label: label.trim(),
      category,
      position_x: position.x,
      position_y: position.y,
    };
    const { error } = await supabase.from("nodes").insert(node);
    if (error) {
      console.error("Impossibile salvare il nodo in Supabase.", error);
      return `Impossibile salvare il nodo: ${error.message}`;
    }

    setNodes((currentNodes) => [
      ...currentNodes,
      {
        id: node.id,
        type: "techNode",
        position,
        data: { label: node.label, category: node.category },
      },
    ]);
    setIsNodeFormOpen(false);
    setMutationError("");
    return null;
  }

  async function handleNodeDragStop(_, node) {
    if (!supabase) return;

    const { error } = await supabase
      .from("nodes")
      .update({ position_x: node.position.x, position_y: node.position.y })
      .eq("id", node.id);
    if (error) {
      console.error("Impossibile salvare la posizione del nodo.", error);
      setMutationError(`Impossibile salvare la posizione: ${error.message}`);
      return;
    }
    setMutationError("");
  }

  useEffect(() => {
    if (!selectedNodeId && !isGlossaryFormOpen && !isNodeFormOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedNodeId(null);
        setIsGlossaryFormOpen(false);
        setIsNodeFormOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, isGlossaryFormOpen, isNodeFormOpen]);

  if (isLoading || loadError) {
    return (
      <main className="studio-map studio-map__message">
        {isLoading ? (
          <p>Caricamento mappa da Supabase…</p>
        ) : (
          <div role="alert">
            <p>{loadError}</p>
            {supabase && (
              <button type="button" onClick={retryLoadStudioMap}>
                Riprova
              </button>
            )}
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="studio-map h-screen w-screen">
      <div className="studio-map__heading">
        <span className="studio-map__eyebrow">WORKSPACE MANAGEMENT</span>
        <h1>Studio Tech Ecosystem</h1>
        <p>Mappatura dinamica delle competenze e dei software</p>
      </div>
      {mutationError && (
        <p className="studio-map__error" role="alert">
          {mutationError}
        </p>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant="dots" gap={16} size={1} color="#273349" />
        <Controls />
        <MapActions
          isGlossaryFormOpen={isGlossaryFormOpen}
          isNodeFormOpen={isNodeFormOpen}
          onToggleGlossary={() => {
            setIsGlossaryFormOpen((isOpen) => !isOpen);
            setIsNodeFormOpen(false);
          }}
          onToggleNode={() => {
            setIsNodeFormOpen((isOpen) => !isOpen);
            setIsGlossaryFormOpen(false);
          }}
          onAddNode={handleAddNode}
          onCloseNodeForm={() => setIsNodeFormOpen(false)}
        />
        <MiniMap pannable zoomable maskColor="rgba(11, 17, 32, 0.6)" />
      </ReactFlow>
      {isGlossaryFormOpen && (
        <GlossaryForm
          onAddTerm={handleAddGlossaryTerm}
          onClose={() => setIsGlossaryFormOpen(false)}
        />
      )}
      {selectedNode && (
        <NodeDetailsPanel
          key={selectedNode.id}
          node={selectedNode}
          details={nodeDetails[selectedNode.id]}
          glossary={glossary}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </main>
  );
}

export default App;
