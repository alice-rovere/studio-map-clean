import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeSupabase } from "./test/fakeSupabase.js";
import { reactFlowPropsRef } from "./test/mocks/xyflow.jsx";

const { supabaseRef } = vi.hoisted(() => ({
  supabaseRef: { current: null },
}));

vi.mock("./lib/supabase.js", () => ({
  get supabase() {
    return supabaseRef.current;
  },
}));

vi.mock("@xyflow/react", () => import("./test/mocks/xyflow.jsx"));

import App from "./App.jsx";

function setSupabase(fake) {
  supabaseRef.current = fake;
}

async function waitForMap() {
  await screen.findByRole("heading", { level: 1, name: "studio-map" });
}

async function waitForEditor() {
  await waitForMap();
  await screen.findByRole("button", { name: "Aggiungi nodo" });
}

function selectNode(id) {
  act(() => {
    reactFlowPropsRef.current.onNodeClick(null, { id });
  });
}

describe("App", () => {
  beforeEach(() => {
    supabaseRef.current = null;
    vi.clearAllMocks();
  });

  it("shows a configuration message without Supabase", () => {
    render(<App />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Configurazione Supabase mancante.",
    );
    expect(
      screen.queryByRole("button", { name: "Riprova" }),
    ).not.toBeInTheDocument();
  });

  it("shows a loading state and then the map", async () => {
    const fake = createFakeSupabase();
    setSupabase(fake);
    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Caricamento mappa da Supabase",
    );

    await waitForMap();
    expect(screen.getByRole("button", { name: "Accedi" })).toBeInTheDocument();
  });

  it("shows a load error and retries without leaving the page", async () => {
    const user = userEvent.setup();
    const fake = createFakeSupabase({
      failures: { "nodes:select": "Errore di rete" },
    });
    setSupabase(fake);
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Impossibile caricare i dati da Supabase: Errore di rete",
    );

    delete fake.failures["nodes:select"];
    await user.click(screen.getByRole("button", { name: "Riprova" }));

    await waitForMap();
  });

  it("keeps visitors read-only", async () => {
    const fake = createFakeSupabase();
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForMap();
    const login = await screen.findByRole("button", { name: "Accedi" });
    expect(login).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: "Aggiungi nodo" }),
    ).not.toBeInTheDocument();

    await user.click(login);
    expect(
      screen.getByRole("dialog", { name: "Accesso editor" }),
    ).toBeInTheDocument();
  });

  it("shows the login error and then signs in", async () => {
    const fake = createFakeSupabase();
    fake.auth.signInError = { message: "Credenziali non valide" };
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await screen.findByRole("button", { name: "Accedi" });
    await user.click(screen.getByRole("button", { name: "Accedi" }));

    const dialog = screen.getByRole("dialog", { name: "Accesso editor" });
    await user.type(
      within(dialog).getByLabelText("Email dell'account invitato"),
      "editor@example.com",
    );
    await user.type(within(dialog).getByLabelText("Password"), "segreta");
    await user.click(within(dialog).getByRole("button", { name: "Accedi" }));

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "Impossibile accedere: Credenziali non valide",
    );

    fake.auth.signInError = null;
    await user.click(within(dialog).getByRole("button", { name: "Accedi" }));

    await screen.findByRole("button", { name: "Aggiungi nodo" });
    expect(
      screen.queryByRole("dialog", { name: "Accesso editor" }),
    ).not.toBeInTheDocument();
  });

  it("restores an authenticated session", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    setSupabase(fake);
    render(<App />);

    await waitForEditor();
    expect(screen.getByRole("button", { name: /Esci/ })).toBeInTheDocument();
  });

  it("shows and dismisses an invalid session error", async () => {
    const fake = createFakeSupabase();
    fake.auth.getSessionError = { message: "Sessione scaduta" };
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForMap();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Impossibile verificare la sessione: Sessione scaduta",
    );

    await user.click(
      screen.getByRole("button", { name: "Chiudi messaggio di errore" }),
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("creates a node with the editor session", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    await user.click(screen.getByRole("button", { name: "Aggiungi nodo" }));

    const dialog = screen.getByRole("dialog", { name: "Nuovo nodo" });
    await user.type(within(dialog).getByLabelText("Nome del nodo"), "Vite");
    await user.selectOptions(
      within(dialog).getByLabelText("Sottocategoria"),
      "build-tool",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Aggiungi nodo" }),
    );

    await waitFor(() =>
      expect(fake.tables.nodes.some((node) => node.label === "Vite")).toBe(true),
    );
    expect(
      screen.queryByRole("dialog", { name: "Nuovo nodo" }),
    ).not.toBeInTheDocument();
  });

  it("shows a node creation error without closing the form", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
      failures: { "nodes:insert": "Nodo duplicato" },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    await user.click(screen.getByRole("button", { name: "Aggiungi nodo" }));

    const dialog = screen.getByRole("dialog", { name: "Nuovo nodo" });
    await user.type(within(dialog).getByLabelText("Nome del nodo"), "Vite");
    await user.selectOptions(
      within(dialog).getByLabelText("Sottocategoria"),
      "build-tool",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Aggiungi nodo" }),
    );

    expect(
      await within(dialog).findByText(
        "Impossibile salvare il nodo: Nodo duplicato",
      ),
    ).toBeInTheDocument();
  });

  it("rejects duplicate glossary terms and creates new ones", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    await user.click(screen.getByRole("button", { name: "Aggiungi termine" }));

    let dialog = screen.getByRole("dialog", { name: "Nuovo termine" });
    await user.type(within(dialog).getByLabelText("Nome del termine"), "api");
    await user.type(within(dialog).getByLabelText("Definizione"), "Definizione.");
    await user.click(
      within(dialog).getByRole("button", { name: "Aggiungi termine" }),
    );

    expect(
      await within(dialog).findByText(
        "Questo termine è già presente nel glossario.",
      ),
    ).toBeInTheDocument();
    expect(fake.tables.glossary).toHaveLength(1);

    await user.clear(within(dialog).getByLabelText("Nome del termine"));
    await user.type(within(dialog).getByLabelText("Nome del termine"), "CDN");
    await user.click(
      within(dialog).getByRole("button", { name: "Aggiungi termine" }),
    );

    await waitFor(() =>
      expect(fake.tables.glossary.some((entry) => entry.term === "CDN")).toBe(
        true,
      ),
    );
    dialog = screen.queryByRole("dialog", { name: "Nuovo termine" });
    expect(dialog).not.toBeInTheDocument();
  });

  it("shows a glossary insertion error", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
      failures: { "glossary:insert": "Termine non valido" },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    await user.click(screen.getByRole("button", { name: "Aggiungi termine" }));

    const dialog = screen.getByRole("dialog", { name: "Nuovo termine" });
    await user.type(within(dialog).getByLabelText("Nome del termine"), "CDN");
    await user.type(within(dialog).getByLabelText("Definizione"), "Rete.");
    await user.click(
      within(dialog).getByRole("button", { name: "Aggiungi termine" }),
    );

    expect(
      await within(dialog).findByText(
        "Impossibile salvare il termine: Termine non valido",
      ),
    ).toBeInTheDocument();
  });

  it("saves extended node content", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    selectNode("react");
    await user.click(screen.getByRole("button", { name: /Apri approfondimento/ }));
    await user.click(
      screen.getByRole("button", { name: /Inserisci o modifica contenuti/ }),
    );

    fireEvent.change(screen.getByLabelText("Contenuto esteso (JSON)"), {
      target: {
        value: JSON.stringify([
          { title: "Aggiornato", type: "text", text: "Nuovo contenuto." },
        ]),
      },
    });
    await user.click(screen.getByRole("button", { name: /Salva contenuti/ }));

    await waitFor(() => {
      const details = fake.tables.node_details.find(
        (entry) => entry.node_id === "react",
      );
      expect(details.extended_content).toEqual([
        { title: "Aggiornato", type: "text", text: "Nuovo contenuto." },
      ]);
    });
  });

  it("shows a save content error in the editor", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
      failures: { "node_details:upsert": "Contenuto non valido" },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    selectNode("react");
    await user.click(screen.getByRole("button", { name: /Apri approfondimento/ }));
    await user.click(
      screen.getByRole("button", { name: /Inserisci o modifica contenuti/ }),
    );

    fireEvent.change(screen.getByLabelText("Contenuto esteso (JSON)"), {
      target: {
        value: JSON.stringify([
          { title: "Aggiornato", type: "text", text: "Nuovo contenuto." },
        ]),
      },
    });
    await user.click(screen.getByRole("button", { name: /Salva contenuti/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Impossibile salvare i contenuti: Contenuto non valido",
    );
  });

  it("creates and edits a relation", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    act(() => {
      reactFlowPropsRef.current.onConnect({ source: "react", target: "postgres" });
    });

    const createDialog = screen.getByRole("dialog", { name: "Nuova relazione" });
    await user.click(
      within(createDialog).getByRole("radio", { name: /richiede/ }),
    );
    await user.click(
      within(createDialog).getByRole("button", { name: "Crea relazione" }),
    );

    await waitFor(() =>
      expect(
        fake.tables.edges.some(
          (edge) =>
            edge.source === "react" &&
            edge.target === "postgres" &&
            edge.kind === "richiede",
        ),
      ).toBe(true),
    );

    act(() => {
      reactFlowPropsRef.current.onEdgeClick(null, { id: "edge-react-node" });
    });
    const editDialog = screen.getByRole("dialog", {
      name: "Modifica relazione",
    });
    await user.click(
      within(editDialog).getByRole("radio", { name: /alternativa/ }),
    );
    await user.click(
      within(editDialog).getByRole("button", { name: "Salva relazione" }),
    );

    await waitFor(() => {
      const edge = fake.tables.edges.find(
        (item) => item.id === "edge-react-node",
      );
      expect(edge.kind).toBe("alternativa");
    });
  });

  it("saves the new node position", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    setSupabase(fake);
    render(<App />);

    await waitForEditor();
    act(() => {
      reactFlowPropsRef.current.onNodeDragStop(null, {
        id: "react",
        position: { x: 40, y: 50 },
      });
    });

    await waitFor(() => {
      const node = fake.tables.nodes.find((item) => item.id === "react");
      expect(node).toMatchObject({ position_x: 40, position_y: 50 });
    });
  });

  it("restores a node when deletion fails", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
      failures: { "nodes:delete": "Operazione negata" },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    act(() => {
      reactFlowPropsRef.current.onNodesChange([
        { id: "react", type: "remove" },
      ]);
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "I nodi sono stati ripristinati",
    );
    await waitFor(() =>
      expect(
        reactFlowPropsRef.current.nodes.some((node) => node.id === "react"),
      ).toBe(true),
    );

    await user.click(
      screen.getByRole("button", { name: "Chiudi messaggio di errore" }),
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("removes connected edges when a node is deleted", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    setSupabase(fake);
    render(<App />);

    await waitForEditor();
    act(() => {
      reactFlowPropsRef.current.onNodesChange([
        { id: "react", type: "remove" },
      ]);
    });

    await waitFor(() => {
      expect(
        reactFlowPropsRef.current.nodes.some((node) => node.id === "react"),
      ).toBe(false);
      expect(
        reactFlowPropsRef.current.edges.some(
          (edge) => edge.source === "react" || edge.target === "react",
        ),
      ).toBe(false);
    });
  });

  it("restores an edge when deletion fails", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
      failures: { "edges:delete": "Operazione negata" },
    });
    setSupabase(fake);
    render(<App />);

    await waitForEditor();
    act(() => {
      reactFlowPropsRef.current.onEdgesChange([
        { id: "edge-react-node", type: "remove" },
      ]);
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "I collegamenti sono stati ripristinati",
    );
    await waitFor(() =>
      expect(
        reactFlowPropsRef.current.edges.some(
          (edge) => edge.id === "edge-react-node",
        ),
      ).toBe(true),
    );
  });

  it("signs out and resets the editor state", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    await user.click(screen.getByRole("button", { name: /Esci/ }));

    await screen.findByRole("button", { name: "Accedi" });
    expect(
      screen.queryByRole("button", { name: "Aggiungi nodo" }),
    ).not.toBeInTheDocument();
  });

  it("shows a sign-out error", async () => {
    const fake = createFakeSupabase({
      session: { user: { email: "editor@example.com" } },
    });
    fake.auth.signOutError = { message: "Rete assente" };
    setSupabase(fake);
    const user = userEvent.setup();
    render(<App />);

    await waitForEditor();
    await user.click(screen.getByRole("button", { name: /Esci/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Impossibile uscire: Rete assente",
    );
  });
});
