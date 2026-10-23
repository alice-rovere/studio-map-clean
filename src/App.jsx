import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import {
  BookOpen,
  Boxes,
  ChevronDown,
  LogIn,
  LogOut,
  Network,
  Plus,
  ShieldCheck,
} from "lucide-react";
import TechNode from "./components/TechNode.jsx";
import RelationEdge from "./components/RelationEdge.jsx";
import MapLegend from "./components/MapLegend.jsx";
import MapFilters from "./components/MapFilters.jsx";
import GlossaryForm from "./components/GlossaryForm.jsx";
import AuthPanel from "./components/AuthPanel.jsx";
import NodeForm from "./components/NodeForm.jsx";
import NodeDetailsPanel from "./components/NodeDetailsPanel.jsx";
import RelationForm from "./components/RelationForm.jsx";
import NodeKnowledgePage from "./components/NodeKnowledgePage.jsx";
import GeneralGuidelinesPage from "./components/GeneralGuidelinesPage.jsx";
import SecurityLearningPage from "./components/SecurityLearningPage.jsx";
import { supabase } from "./lib/supabase.js";
import { DEFAULT_EDGE_KIND, createFlowEdge } from "./lib/edgeKinds.js";
import {
  NODE_SUBCATEGORY_OPTIONS,
  getSubcategoryLabel,
} from "./lib/nodeSubcategories.js";
import {
  buildDisplayEdges,
  buildDisplayNodes,
  buildFocus,
  filterVisibleEdges,
  filterVisibleNodes,
  getIsolatedCategory,
} from "./lib/mapGraph.js";

const ArchitecturePanel = lazy(
  () => import("./components/ArchitecturePanel.jsx"),
);

const nodeCategories = ["frontend", "backend", "database", "devops", "tools"];

const MOBILE_QUERY = "(max-width: 760px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobile(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

const studioCategories = [
  {
    id: "frontend",
    label: "Frontend",
    description:
      "Interfacce, esperienze utente e tecnologie che rendono visibili e interattivi i prodotti digitali.",
  },
  {
    id: "backend",
    label: "Backend",
    description:
      "Servizi, API e logica applicativa che elaborano i dati e collegano le parti del prodotto.",
  },
  {
    id: "tools",
    label: "Tools",
    description:
      "Strumenti e applicazioni utili al lavoro quotidiano dello studio e del team.",
  },
  {
    id: "devops",
    label: "DevOps",
    description:
      "Infrastruttura, automazione e processi per distribuire e mantenere i prodotti.",
  },
  {
    id: "database",
    label: "Database",
    description:
      "Sistemi e tecnologie per organizzare, archiviare e interrogare i dati.",
  },
];

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }
  return "Errore imprevisto.";
}

function MapActions({
  isGlossaryFormOpen,
  isNodeFormOpen,
  isAuthenticated,
  isAuthLoading,
  isAuthPanelOpen,
  userEmail,
  onToggleAuthPanel,
  onSignIn,
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
  onOpenArchitecture,
  nodes,
  onSelectNode,
}) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [openCategory, setOpenCategory] = useState(null);

  function handleAddNode({ label, category, subcategory }) {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    return onAddNode({ label, category, subcategory, position });
  }

  function handleSelectNode(node) {
    onSelectNode(node.id);
    setOpenCategory(null);
    fitView({
      nodes: [{ id: node.id }],
      padding: 0.4,
      duration: 500,
      maxZoom: 1,
    });
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
              aria-label="Linee guida"
              className="studio-map__header-link"
              onClick={onOpenGuidelines}
              title="Linee guida"
              type="button"
            >
              <BookOpen aria-hidden="true" size={15} />
              <span className="studio-map__header-link-label">
                Linee guida
              </span>
            </button>
            <button
              aria-label="Sicurezza informatica"
              className="studio-map__header-link"
              onClick={onOpenSecurity}
              title="Sicurezza informatica"
              type="button"
            >
              <ShieldCheck aria-hidden="true" size={15} />
              <span className="studio-map__header-link-label">
                Sicurezza informatica
              </span>
            </button>
            <button
              aria-label="Architettura 3D"
              className="studio-map__header-link"
              onClick={onOpenArchitecture}
              title="Architettura 3D"
              type="button"
            >
              <Boxes aria-hidden="true" size={15} />
              <span className="studio-map__header-link-label">
                Architettura 3D
              </span>
            </button>
          </nav>
        </div>
        <nav
          aria-label="Categorie dello studio"
          className="studio-map__categories"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              event.target
                .closest(".studio-map__category")
                ?.querySelector(".studio-map__category-button")
                ?.focus();
              setOpenCategory(null);
            }
          }}
        >
          {studioCategories.map((category) => {
            const categoryNodes = nodes.filter(
              (node) => node.data.category?.toLowerCase() === category.id,
            );
            const isOpen = openCategory === category.id;
            const menuId = `studio-map-category-${category.id}`;

            return (
              <div className="studio-map__category" key={category.id}>
                <button
                  aria-describedby={`${menuId}-description`}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? menuId : undefined}
                  className="studio-map__category-button"
                  onClick={() =>
                    setOpenCategory(isOpen ? null : category.id)
                  }
                  type="button"
                >
                  {category.label}
                  <ChevronDown aria-hidden="true" size={13} />
                </button>
                <span
                  className="studio-map__category-description"
                  id={`${menuId}-description`}
                  role="tooltip"
                >
                  {category.description}
                </span>
                {isOpen && (
                  <div
                    className="studio-map__category-menu"
                    id={menuId}
                    role="region"
                    aria-label={`Nodi ${category.label}`}
                  >
                    {categoryNodes.length > 0 ? (
                      categoryNodes.map((node) => (
                        <button
                          className="studio-map__category-item"
                          key={node.id}
                          onClick={() => handleSelectNode(node)}
                          type="button"
                        >
                          <span>{node.data.label}</span>
                          <span className="studio-map__category-item-subcategory">
                            {getSubcategoryLabel(node.data.subcategory)}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="studio-map__category-empty">
                        Nessun nodo inserito
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
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
              onSignIn={onSignIn}
              onClose={onCloseAuthPanel}
            />
          )}
          {isNodeFormOpen && isAuthenticated && (
            <NodeForm
              categories={nodeCategories}
              subcategories={NODE_SUBCATEGORY_OPTIONS}
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
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [hasOpenedArchitecture, setHasOpenedArchitecture] = useState(false);
  const [isGlossaryFormOpen, setIsGlossaryFormOpen] = useState(false);
  const [isNodeFormOpen, setIsNodeFormOpen] = useState(false);
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState(null);
  const [editingEdgeId, setEditingEdgeId] = useState(null);
  const [relationFormError, setRelationFormError] = useState("");
  const [isSavingRelation, setIsSavingRelation] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [hiddenCategories, setHiddenCategories] = useState(() => new Set());
  const isMobile = useIsMobile();
  const flowInstanceRef = useRef(null);
  const nodeTypes = useMemo(() => ({ techNode: TechNode }), []);
  const edgeTypes = useMemo(() => ({ relation: RelationEdge }), []);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const activeArchitectureCategory = getIsolatedCategory(
    nodeCategories,
    hiddenCategories,
    searchTerm,
    selectedSubcategory,
  );
  const isAuthenticated = Boolean(session?.user);
  const nodeLabels = useMemo(
    () => new Map(nodes.map((node) => [node.id, node.data.label])),
    [nodes],
  );
  const editingEdge = edges.find((edge) => edge.id === editingEdgeId);
  const relationFormData = useMemo(() => {
    if (pendingConnection) {
      return {
        key: `create-${pendingConnection.source}-${pendingConnection.target}`,
        mode: "create",
        source: pendingConnection.source,
        target: pendingConnection.target,
        sourceLabel:
          nodeLabels.get(pendingConnection.source) ?? pendingConnection.source,
        targetLabel:
          nodeLabels.get(pendingConnection.target) ?? pendingConnection.target,
        initialKind: DEFAULT_EDGE_KIND,
      };
    }
    if (editingEdge) {
      return {
        key: `edit-${editingEdge.id}`,
        id: editingEdge.id,
        mode: "edit",
        source: editingEdge.source,
        target: editingEdge.target,
        sourceLabel: nodeLabels.get(editingEdge.source) ?? editingEdge.source,
        targetLabel: nodeLabels.get(editingEdge.target) ?? editingEdge.target,
        initialKind: editingEdge.data?.kind ?? DEFAULT_EDGE_KIND,
      };
    }
    return null;
  }, [pendingConnection, editingEdge, nodeLabels]);

  const visibleNodes = useMemo(
    () =>
      filterVisibleNodes(nodes, {
        isMobile,
        hiddenCategories,
        selectedSubcategory,
        searchTerm,
      }),
    [nodes, isMobile, hiddenCategories, selectedSubcategory, searchTerm],
  );

  const visibleEdges = useMemo(
    () => filterVisibleEdges(edges, visibleNodes),
    [edges, visibleNodes],
  );

  const focus = useMemo(
    () => buildFocus(selectedNodeId, visibleNodes, visibleEdges),
    [selectedNodeId, visibleNodes, visibleEdges],
  );

  const displayNodes = useMemo(
    () => buildDisplayNodes(visibleNodes, focus),
    [visibleNodes, focus],
  );

  const displayEdges = useMemo(
    () => buildDisplayEdges(visibleNodes, visibleEdges, focus),
    [visibleNodes, visibleEdges, focus],
  );

  const loadStudioMap = useCallback(async () => {
    if (!supabase) return;

    try {
      const [nodesResult, edgesResult, glossaryResult, detailsResult] =
        await Promise.all([
          supabase
            .from("nodes")
            .select("id,label,category,subcategory,position_x,position_y"),
          supabase.from("edges").select("id,source,target,type,kind"),
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

      const flowNodes = nodesResult.data.map((node) => ({
        id: node.id,
        type: "techNode",
        position: { x: node.position_x, y: node.position_y },
        data: {
          label: node.label,
          category: node.category,
          subcategory: node.subcategory,
        },
      }));
      const nodeLabels = new Map(
        nodesResult.data.map((node) => [node.id, node.label]),
      );

      setNodes(flowNodes);
      setEdges(edgesResult.data.map((edge) => createFlowEdge(edge, nodeLabels)));
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
        setPendingConnection(null);
        setEditingEdgeId(null);
        setRelationFormError("");
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
      if (removedIds.length === 0 || !supabase) return;

      const removedNodes = nodes
        .map((node, index) => ({ node, index }))
        .filter(({ node }) => removedIds.includes(node.id));

      supabase
        .from("nodes")
        .delete()
        .in("id", removedIds)
        .then(({ error }) => {
          if (error) {
            console.error("Impossibile eliminare i nodi da Supabase.", error);
            setNodes((currentNodes) => {
              const restored = [...currentNodes];
              removedNodes.forEach(({ node, index }) => {
                if (!restored.some((current) => current.id === node.id)) {
                  restored.splice(Math.min(index, restored.length), 0, node);
                }
              });
              return restored;
            });
            setMutationError(
              `Impossibile eliminare i nodi: ${error.message}. I nodi sono stati ripristinati.`,
            );
            return;
          }

          setEdges((currentEdges) =>
            currentEdges.filter(
              (edge) =>
                !removedIds.includes(edge.source) &&
                !removedIds.includes(edge.target),
            ),
          );
          setMutationError("");
        });
    },
    [isAuthenticated, nodes],
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
      if (removedIds.length === 0 || !supabase) return;

      const removedEdges = edges
        .map((edge, index) => ({ edge, index }))
        .filter(({ edge }) => removedIds.includes(edge.id));

      supabase
        .from("edges")
        .delete()
        .in("id", removedIds)
        .then(({ error }) => {
          if (error) {
            console.error("Impossibile eliminare i collegamenti da Supabase.", error);
            setEdges((currentEdges) => {
              const restored = [...currentEdges];
              removedEdges.forEach(({ edge, index }) => {
                if (!restored.some((current) => current.id === edge.id)) {
                  restored.splice(Math.min(index, restored.length), 0, edge);
                }
              });
              return restored;
            });
            setMutationError(
              `Impossibile eliminare i collegamenti: ${error.message}. I collegamenti sono stati ripristinati.`,
            );
            return;
          }

          setMutationError("");
        });
    },
    [isAuthenticated, edges],
  );

  const onConnect = useCallback(
    (connection) => {
      if (!supabase || !isAuthenticated) return;
      setPendingConnection({
        source: connection.source,
        target: connection.target,
      });
      setEditingEdgeId(null);
      setRelationFormError("");
    },
    [isAuthenticated],
  );

  const onEdgeClick = useCallback(
    (_, edge) => {
      if (!isAuthenticated) return;
      setPendingConnection(null);
      setEditingEdgeId(edge.id);
      setRelationFormError("");
      setIsNodeKnowledgeOpen(false);
    },
    [isAuthenticated],
  );

  function handleCloseRelationForm() {
    if (isSavingRelation) return;
    setPendingConnection(null);
    setEditingEdgeId(null);
    setRelationFormError("");
  }

  async function handleConfirmRelation({ kind, isReversed }) {
    if (!relationFormData) return;
    if (!supabase) {
      setRelationFormError("Configurazione Supabase mancante.");
      return;
    }
    if (!isAuthenticated) {
      setRelationFormError("Accedi per modificare i collegamenti.");
      return;
    }

    const source = isReversed ? relationFormData.target : relationFormData.source;
    const target = isReversed ? relationFormData.source : relationFormData.target;
    if (source === target) {
      setRelationFormError("Una relazione non può collegare un nodo a se stesso.");
      return;
    }

    setIsSavingRelation(true);
    try {
      if (relationFormData.mode === "edit") {
        const { error } = await supabase
          .from("edges")
          .update({ source, target, kind })
          .eq("id", relationFormData.id);
        if (error) throw error;

        setEdges((currentEdges) =>
          currentEdges.map((edge) =>
            edge.id === relationFormData.id
              ? createFlowEdge(
                  { id: edge.id, source, target, kind },
                  nodeLabels,
                )
              : edge,
          ),
        );
        setEditingEdgeId(null);
      } else {
        const edge = {
          id: crypto.randomUUID(),
          source,
          target,
          type: "smoothstep",
          kind,
        };
        const { error } = await supabase.from("edges").insert(edge);
        if (error) throw error;

        setEdges((currentEdges) =>
          addEdge(createFlowEdge(edge, nodeLabels), currentEdges),
        );
        setPendingConnection(null);
      }
      setRelationFormError("");
      setMutationError("");
    } catch (error) {
      console.error("Impossibile salvare la relazione in Supabase.", error);
      setRelationFormError(
        `Impossibile salvare la relazione: ${getErrorMessage(error)}`,
      );
    } finally {
      setIsSavingRelation(false);
    }
  }

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

  async function handleAddNode({ label, category, subcategory, position }) {
    if (!supabase) return "Configurazione Supabase mancante.";
    if (!isAuthenticated) return "Accedi per aggiungere nodi.";

    const node = {
      id: crypto.randomUUID(),
      label: label.trim(),
      category,
      subcategory,
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
        data: {
          label: node.label,
          category: node.category,
          subcategory: node.subcategory,
        },
      },
    ]);
    setIsNodeFormOpen(false);
    setMutationError("");
    return null;
  }

  async function handleSaveNodeContent(content) {
    if (!selectedNode) return "Configurazione Supabase mancante.";
    if (!supabase) return "Configurazione Supabase mancante.";
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

  function handleSearchChange(value) {
    setSearchTerm(value);
    setSelectedNodeId(null);
  }

  function handleToggleCategory(category) {
    setHiddenCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
    setSelectedNodeId(null);
  }

  function handleResetFilters() {
    setHiddenCategories(new Set());
    setSelectedSubcategory("");
    setSearchTerm("");
    setSelectedNodeId(null);
  }

  function fitVisibleFlow() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flowInstanceRef.current?.fitView({
          duration: 500,
          maxZoom: 1.2,
          padding: 0.25,
        });
      });
    });
  }

  function fitNodeInFlow(nodeId) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flowInstanceRef.current?.fitView({
          nodes: [{ id: nodeId }],
          duration: 500,
          maxZoom: 1,
          padding: 0.4,
        });
      });
    });
  }

  function handleArchitectureCategory(category) {
    if (activeArchitectureCategory === category) {
      setHiddenCategories(new Set());
    } else {
      setHiddenCategories(
        new Set(
          nodeCategories.filter(
            (visibleCategory) => visibleCategory !== category,
          ),
        ),
      );
    }
    setSelectedSubcategory("");
    setSearchTerm("");
    setSelectedNodeId(null);
    setIsNodeKnowledgeOpen(false);
    fitVisibleFlow();
  }

  function handleArchitectureNode(nodeId, category) {
    setHiddenCategories(
      new Set(
        nodeCategories.filter(
          (visibleCategory) => visibleCategory !== category,
        ),
      ),
    );
    setSelectedSubcategory("");
    setSearchTerm("");
    setSelectedNodeId(nodeId);
    setIsNodeKnowledgeOpen(false);
    fitNodeInFlow(nodeId);
  }

  function handleResetArchitectureFilter() {
    handleResetFilters();
    fitVisibleFlow();
  }

  async function handleSignIn({ email, password }) {
    if (!supabase) return "Configurazione Supabase mancante.";

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Impossibile accedere.", error);
      return `Impossibile accedere: ${error.message}`;
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
      !isArchitectureOpen &&
      !isGlossaryFormOpen &&
      !isNodeFormOpen &&
      !relationFormData
    ) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        if (relationFormData) {
          if (!isSavingRelation) {
            setPendingConnection(null);
            setEditingEdgeId(null);
            setRelationFormError("");
          }
        } else if (isNodeKnowledgeOpen) {
          setIsNodeKnowledgeOpen(false);
        } else if (isGuidelinesOpen) {
          setIsGuidelinesOpen(false);
        } else if (isSecurityLearningOpen) {
          setIsSecurityLearningOpen(false);
        } else if (selectedNodeId) {
          setSelectedNodeId(null);
          setIsGlossaryFormOpen(false);
          setIsNodeFormOpen(false);
        } else if (isArchitectureOpen) {
          setIsArchitectureOpen(false);
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
    isArchitectureOpen,
    isGlossaryFormOpen,
    isNodeFormOpen,
    relationFormData,
    isSavingRelation,
  ]);

  if (isLoading || loadError) {
    return (
      <main className="studio-map studio-map__message">
        {isLoading ? (
          <p role="status">Caricamento mappa da Supabase…</p>
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
        <div className="studio-map__error" role="alert">
          <span>{mutationError || authError}</span>
          <button
            aria-label="Chiudi messaggio di errore"
            className="studio-map__error-close"
            onClick={() => {
              setMutationError("");
              setAuthError("");
            }}
            type="button"
          >
            Chiudi
          </button>
        </div>
      )}
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onNodeDragStop={handleNodeDragStop}
        onInit={(instance) => {
          flowInstanceRef.current = instance;
        }}
        onPaneClick={() => setSelectedNodeId(null)}
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
        <MapFilters
          categories={nodeCategories}
          subcategories={NODE_SUBCATEGORY_OPTIONS}
          hiddenCategories={hiddenCategories}
          onReset={handleResetFilters}
          onSearchChange={handleSearchChange}
          onSubcategoryChange={(value) => {
            setSelectedSubcategory(value);
            setSelectedNodeId(null);
          }}
          onToggleCategory={handleToggleCategory}
          searchTerm={searchTerm}
          selectedSubcategory={selectedSubcategory}
        />
        <MapActions
          nodes={nodes}
          isGlossaryFormOpen={isGlossaryFormOpen}
          isNodeFormOpen={isNodeFormOpen}
          isAuthenticated={isAuthenticated}
          isAuthLoading={isAuthLoading}
          isAuthPanelOpen={isAuthPanelOpen}
          userEmail={session?.user?.email}
          onToggleAuthPanel={() => setIsAuthPanelOpen((isOpen) => !isOpen)}
          onSignIn={handleSignIn}
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
            setIsArchitectureOpen(false);
            setIsGlossaryFormOpen(false);
            setIsNodeFormOpen(false);
            setSelectedNodeId(null);
          }}
          onOpenSecurity={() => {
            setIsSecurityLearningOpen(true);
            setIsArchitectureOpen(false);
            setIsGlossaryFormOpen(false);
            setIsNodeFormOpen(false);
            setSelectedNodeId(null);
          }}
          onOpenArchitecture={() => {
            setIsArchitectureOpen(true);
            setHasOpenedArchitecture(true);
            setIsGuidelinesOpen(false);
            setIsSecurityLearningOpen(false);
            setIsGlossaryFormOpen(false);
            setIsNodeFormOpen(false);
            setIsNodeKnowledgeOpen(false);
            setSelectedNodeId(null);
          }}
          onSelectNode={(nodeId) => {
            setSelectedNodeId(nodeId);
            setIsNodeKnowledgeOpen(false);
          }}
        />
        <MiniMap pannable zoomable maskColor="rgba(11, 17, 32, 0.6)" />
        <MapLegend />
      </ReactFlow>
      {selectedNode && !isNodeKnowledgeOpen && (
        <NodeDetailsPanel
          key={selectedNode.id}
          node={selectedNode}
          details={nodeDetails[selectedNode.id]}
          glossary={glossary}
          relations={focus}
          onSelectRelated={(nodeId) => {
            setSelectedNodeId(nodeId);
            setIsNodeKnowledgeOpen(false);
          }}
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
      {relationFormData && (
        <RelationForm
          error={relationFormError}
          initialKind={relationFormData.initialKind}
          isSubmitting={isSavingRelation}
          key={relationFormData.key}
          mode={relationFormData.mode}
          onClose={handleCloseRelationForm}
          onConfirm={handleConfirmRelation}
          sourceLabel={relationFormData.sourceLabel}
          targetLabel={relationFormData.targetLabel}
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
      {(isArchitectureOpen || hasOpenedArchitecture) && (
        <Suspense
          fallback={
            <aside
              className="architecture-panel architecture-panel--loading"
              role="status"
            >
              Caricamento architettura 3D…
            </aside>
          }
        >
          <ArchitecturePanel
            activeCategory={activeArchitectureCategory}
            filtersMap={!isMobile}
            nodeDetails={nodeDetails}
            nodes={nodes}
            isOpen={isArchitectureOpen}
            onClose={() => setIsArchitectureOpen(false)}
            onResetFilter={handleResetArchitectureFilter}
            onSelectCategory={handleArchitectureCategory}
            onSelectNode={handleArchitectureNode}
          />
        </Suspense>
      )}
    </main>
  );
}

export default App;
