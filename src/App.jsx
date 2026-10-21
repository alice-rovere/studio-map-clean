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
import { BookOpen, LogIn, LogOut, Network, Plus, ShieldCheck } from "lucide-react";
import TechNode from "./components/TechNode.jsx";
import GlossaryForm from "./components/GlossaryForm.jsx";
import AuthPanel from "./components/AuthPanel.jsx";
import NodeForm from "./components/NodeForm.jsx";
import NodeDetailsPanel from "./components/NodeDetailsPanel.jsx";
import NodeKnowledgePage from "./components/NodeKnowledgePage.jsx";
import GeneralGuidelinesPage from "./components/GeneralGuidelinesPage.jsx";
import SecurityLearningPage from "./components/SecurityLearningPage.jsx";
import { supabase } from "./lib/supabase.js";

const nodeCategories = ["frontend", "backend", "database", "devops", "tools"];

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Errore imprevisto.";
}

function MapActions({
  isGlossaryFormOpen,
  isNodeFormOpen,
  isAuthenticated,
  isAuthLoading,
  isAuthPanelOpen,
  userEmail,
  onToggleAuthPanel,
  onRequestMagicLink,
  onCloseAuthPanel,
  onSignOut,
  onToggleGlossary,
  onToggleNode,
  onAddNode,
  onAddGlossaryTerm,
  onCloseGlossaryForm,
  onCloseNodeForm,
  onOpenGuidelines,
  onOpenSecurity,
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
    <Panel className="studio-map__header-panel" position="top-left">
      <header className="studio-map__header">
        <div className="studio-map__header-brand">
          <div className="studio-map__brand">
            <span className="studio-map__brand-icon">
              <Network aria-hidden="true" size={19} />
            </span>
            <h1 className="studio-map__brand-name">studio-map</h1>
          </div>
          <nav aria-label="Risorse" className="studio-map__header-links">
            <button
              className="studio-map__header-link"
              onClick={onOpenGuidelines}
              type="button"
            >
              <BookOpen aria-hidden="true" size={15} />
              Linee guida
            </button>
            <button
              className="studio-map__header-link"
              onClick={onOpenSecurity}
              type="button"
            >
              <ShieldCheck aria-hidden="true" size={15} />
              Sicurezza informatica
            </button>
          </nav>
        </div>
        <div className="studio-map__actions">
          {isAuthenticated ? (
            <>
              <button
                aria-pressed={isGlossaryFormOpen}
                className="studio-map__action-button studio-map__node-button"
                onClick={() => onToggleGlossary()}
                type="button"
              >
                <Plus aria-hidden="true" size={15} />
                Aggiungi termine
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
              <button
                aria-label={`Esci${userEmail ? ` da ${userEmail}` : ""}`}
                className="studio-map__action-button studio-map__auth-button"
                onClick={onSignOut}
                title={userEmail || "Esci"}
                type="button"
              >
                <LogOut aria-hidden="true" size={15} />
                Esci
              </button>
            </>
          ) : (
            <button
              className="studio-map__action-button studio-map__auth-button"
              disabled={isAuthLoading}
              onClick={onToggleAuthPanel}
              type="button"
            >
              <LogIn aria-hidden="true" size={15} />
              {isAuthLoading ? "Verifica accesso…" : "Accedi"}
            </button>
          )}
          {isAuthPanelOpen && !isAuthenticated && (
            <AuthPanel
              onRequestMagicLink={onRequestMagicLink}
              onClose={onCloseAuthPanel}
            />
          )}
          {isNodeFormOpen && isAuthenticated && (
            <NodeForm
              categories={nodeCategories}
              onAddNode={handleAddNode}
              onClose={onCloseNodeForm}
            />
          )}
          {isGlossaryFormOpen && isAuthenticated && (
            <GlossaryForm
              onAddTerm={onAddGlossaryTerm}
              onClose={onCloseGlossaryForm}
            />
          )}
        </div>
      </header>
    </Panel>
  );
}

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isNodeKnowledgeOpen, setIsNodeKnowledgeOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isSecurityLearningOpen, setIsSecurityLearningOpen] = useState(false);
  const [isGlossaryFormOpen, setIsGlossaryFormOpen] = useState(false);
  const [isNodeFormOpen, setIsNodeFormOpen] = useState(false);
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const [glossary, setGlossary] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeDetails, setNodeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState("");
  const [loadError, setLoadError] = useState(
    supabase
      ? ""
      : "Configurazione Supabase mancante. Imposta VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
  );
  const [mutationError, setMutationError] = useState("");
  const nodeTypes = useMemo(() => ({ techNode: TechNode }), []);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const isAuthenticated = Boolean(session?.user);

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
              "node_id,description,best_practices,naming_conventions,associated_software,study_urls,extended_content",
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

  useEffect(() => {
    if (!supabase) return undefined;

    let isActive = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) return;
      setSession(nextSession);
      setIsAuthLoading(false);
      setAuthError("");
      if (!nextSession) {
        setIsAuthPanelOpen(false);
        setIsGlossaryFormOpen(false);
        setIsNodeFormOpen(false);
        setSelectedNodeId(null);
        setIsNodeKnowledgeOpen(false);
      }
    });

    async function restoreSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (isActive) {
          setSession(data.session);
          setAuthError("");
        }
      } catch (error) {
        console.error("Impossibile verificare la sessione Supabase.", error);
        if (isActive) {
          setAuthError(
            `Impossibile verificare la sessione: ${getErrorMessage(error)}`,
          );
        }
      } finally {
        if (isActive) setIsAuthLoading(false);
      }
    }

    void restoreSession();
    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  function retryLoadStudioMap() {
    setIsLoading(true);
    setMutationError("");
    loadStudioMap();
  }

  const onNodesChange = useCallback(
    (changes) => {
      const acceptedChanges = isAuthenticated
        ? changes
        : changes.filter(
            (change) => change.type !== "remove" && change.type !== "position",
          );
      setNodes((currentNodes) => applyNodeChanges(acceptedChanges, currentNodes));
      if (!isAuthenticated) return;

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
    [isAuthenticated],
  );

  const onEdgesChange = useCallback(
    (changes) => {
      const acceptedChanges = isAuthenticated
        ? changes
        : changes.filter((change) => change.type !== "remove");
      setEdges((currentEdges) => applyEdgeChanges(acceptedChanges, currentEdges));
      if (!isAuthenticated) return;

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
    [isAuthenticated],
  );

  const onConnect = useCallback(
    async (connection) => {
      if (!supabase || !isAuthenticated) return;
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
    [isAuthenticated],
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
    if (!isAuthenticated) return "Accedi per modificare il glossario.";

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
    if (!isAuthenticated) return "Accedi per aggiungere nodi.";

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

  async function handleSaveNodeContent(content) {
    if (!selectedNode || !supabase) return "Configurazione Supabase mancante.";
    if (!isAuthenticated) return "Accedi per modificare i contenuti.";

    try {
      const { error } = await supabase
        .from("node_details")
        .upsert(
          { node_id: selectedNode.id, extended_content: content },
          { onConflict: "node_id" },
        );
      if (error) {
        console.error("Impossibile salvare i contenuti estesi del nodo.", error);
        return `Impossibile salvare i contenuti: ${error.message}`;
      }
    } catch (error) {
      console.error("Impossibile salvare i contenuti estesi del nodo.", error);
      return `Impossibile salvare i contenuti: ${getErrorMessage(error)}`;
    }

    setNodeDetails((currentDetails) => ({
      ...currentDetails,
      [selectedNode.id]: {
        ...currentDetails[selectedNode.id],
        node_id: selectedNode.id,
        extended_content: content,
      },
    }));
    setMutationError("");
    return null;
  }

  async function handleNodeDragStop(_, node) {
    if (!supabase || !isAuthenticated) return;

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

  async function handleRequestMagicLink(email) {
    if (!supabase) return "Configurazione Supabase mancante.";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error("Impossibile inviare il link di accesso.", error);
      return `Impossibile inviare il link di accesso: ${error.message}`;
    }
    return null;
  }

  async function handleSignOut() {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMutationError("");
    } catch (error) {
      console.error("Impossibile terminare la sessione Supabase.", error);
      setMutationError(`Impossibile uscire: ${getErrorMessage(error)}`);
    }
  }

  useEffect(() => {
    if (
      !selectedNodeId &&
      !isNodeKnowledgeOpen &&
      !isGuidelinesOpen &&
      !isSecurityLearningOpen &&
      !isGlossaryFormOpen &&
      !isNodeFormOpen
    ) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        if (isNodeKnowledgeOpen) {
          setIsNodeKnowledgeOpen(false);
        } else if (isGuidelinesOpen) {
          setIsGuidelinesOpen(false);
        } else if (isSecurityLearningOpen) {
          setIsSecurityLearningOpen(false);
        } else {
          setSelectedNodeId(null);
          setIsGlossaryFormOpen(false);
          setIsNodeFormOpen(false);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedNodeId,
    isNodeKnowledgeOpen,
    isGuidelinesOpen,
    isSecurityLearningOpen,
    isGlossaryFormOpen,
    isNodeFormOpen,
  ]);

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
      {(mutationError || authError) && (
        <p className="studio-map__error" role="alert">
          {mutationError || authError}
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
        nodesDraggable={isAuthenticated}
        nodesConnectable={isAuthenticated}
        deleteKeyCode={isAuthenticated ? ["Backspace", "Delete"] : null}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
          setIsNodeKnowledgeOpen(false);
        }}
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
          isAuthenticated={isAuthenticated}
          isAuthLoading={isAuthLoading}
          isAuthPanelOpen={isAuthPanelOpen}
          userEmail={session?.user?.email}
          onToggleAuthPanel={() => setIsAuthPanelOpen((isOpen) => !isOpen)}
          onRequestMagicLink={handleRequestMagicLink}
          onCloseAuthPanel={() => setIsAuthPanelOpen(false)}
          onSignOut={handleSignOut}
          onToggleGlossary={() => {
            setIsGlossaryFormOpen((isOpen) => !isOpen);
            setIsNodeFormOpen(false);
          }}
          onToggleNode={() => {
            setIsNodeFormOpen((isOpen) => !isOpen);
            setIsGlossaryFormOpen(false);
          }}
          onAddNode={handleAddNode}
          onAddGlossaryTerm={handleAddGlossaryTerm}
          onCloseGlossaryForm={() => setIsGlossaryFormOpen(false)}
          onCloseNodeForm={() => setIsNodeFormOpen(false)}
          onOpenGuidelines={() => {
            setIsGuidelinesOpen(true);
            setIsGlossaryFormOpen(false);
            setIsNodeFormOpen(false);
            setSelectedNodeId(null);
          }}
          onOpenSecurity={() => {
            setIsSecurityLearningOpen(true);
            setIsGlossaryFormOpen(false);
            setIsNodeFormOpen(false);
            setSelectedNodeId(null);
          }}
        />
        <MiniMap pannable zoomable maskColor="rgba(11, 17, 32, 0.6)" />
      </ReactFlow>
      {selectedNode && !isNodeKnowledgeOpen && (
        <NodeDetailsPanel
          key={selectedNode.id}
          node={selectedNode}
          details={nodeDetails[selectedNode.id]}
          glossary={glossary}
          onClose={() => setSelectedNodeId(null)}
          onOpenKnowledge={() => setIsNodeKnowledgeOpen(true)}
        />
      )}
      {selectedNode && isNodeKnowledgeOpen && (
        <NodeKnowledgePage
          node={selectedNode}
          content={nodeDetails[selectedNode.id]?.extended_content}
          canEdit={isAuthenticated}
          onSaveContent={handleSaveNodeContent}
          onBack={() => setIsNodeKnowledgeOpen(false)}
          onClose={() => {
            setIsNodeKnowledgeOpen(false);
            setSelectedNodeId(null);
          }}
        />
      )}
      {isGuidelinesOpen && (
        <GeneralGuidelinesPage onClose={() => setIsGuidelinesOpen(false)} />
      )}
      {isSecurityLearningOpen && (
        <SecurityLearningPage
          onBack={() => setIsSecurityLearningOpen(false)}
          onClose={() => setIsSecurityLearningOpen(false)}
        />
      )}
    </main>
  );
}

export default App;
