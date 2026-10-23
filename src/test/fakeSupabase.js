import { vi } from "vitest";

const defaultTables = () => ({
  nodes: [
    {
      id: "react",
      label: "React",
      category: "frontend",
      subcategory: "libreria",
      position_x: 100,
      position_y: 120,
    },
    {
      id: "node",
      label: "Node.js",
      category: "backend",
      subcategory: "runtime",
      position_x: 320,
      position_y: 120,
    },
    {
      id: "postgres",
      label: "PostgreSQL",
      category: "database",
      subcategory: "database-relazionale",
      position_x: 540,
      position_y: 120,
    },
  ],
  edges: [
    {
      id: "edge-react-node",
      source: "react",
      target: "node",
      type: "smoothstep",
      kind: "usa",
    },
    {
      id: "edge-node-postgres",
      source: "node",
      target: "postgres",
      type: "smoothstep",
      kind: "usa",
    },
  ],
  glossary: [
    {
      id: "glossary-api",
      term: "API",
      definition: "Interfaccia per far comunicare due sistemi.",
    },
  ],
  node_details: [
    {
      node_id: "react",
      description: "Libreria per costruire interfacce.",
      best_practices: "Componi l'interfaccia in componenti piccoli.",
      naming_conventions: ["PascalCase per i componenti"],
      associated_software: ["Vite"],
      study_urls: [{ label: "Documentazione", url: "https://react.dev" }],
      extended_content: [
        { title: "Introduzione", type: "text", text: "React è una libreria." },
      ],
    },
  ],
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mapRow(table, row, sequence) {
  const next = { ...row };
  if (!next.id) {
    next.id =
      table === "glossary"
        ? `glossary-${sequence}`
        : `${table}-${sequence}`;
  }
  return next;
}

class FakeQuery {
  constructor(fake, table) {
    this.fake = fake;
    this.table = table;
    this.operation = "select";
    this.payload = null;
    this.filters = [];
    this.orderColumn = null;
    this.returnSelected = false;
    this.singleRow = false;
  }

  select() {
    this.returnSelected = true;
    return this;
  }

  insert(payload) {
    this.operation = "insert";
    this.payload = payload;
    return this;
  }

  upsert(payload) {
    this.operation = "upsert";
    this.payload = payload;
    return this;
  }

  update(payload) {
    this.operation = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  eq(column, value) {
    this.filters.push({ type: "eq", column, value });
    return this;
  }

  in(column, values) {
    this.filters.push({ type: "in", column, values });
    return this;
  }

  order(column) {
    this.orderColumn = column;
    return this;
  }

  single() {
    this.singleRow = true;
    return this;
  }

  matches(row) {
    return this.filters.every((filter) => {
      if (filter.type === "eq") return row[filter.column] === filter.value;
      return filter.values.includes(row[filter.column]);
    });
  }

  failure() {
    const failure = this.fake.failures[`${this.table}:${this.operation}`];
    if (!failure) return null;
    if (typeof failure === "function") {
      const result = failure(this.fake);
      if (!result) return null;
      return { message: result.message ?? String(result) };
    }
    return { message: failure.message ?? String(failure) };
  }

  async execute() {
    this.fake.calls.push({
      table: this.table,
      operation: this.operation,
      payload: this.payload,
      filters: this.filters,
    });

    const error = this.failure();
    if (error) return { data: null, error };

    const rows = this.fake.tables[this.table] ?? [];
    let result = null;
    let affected = [];

    if (this.operation === "select") {
      affected = rows.filter((row) => this.matches(row));
      if (this.orderColumn) {
        affected = [...affected].sort((left, right) =>
          String(left[this.orderColumn] ?? "").localeCompare(
            String(right[this.orderColumn] ?? ""),
          ),
        );
      }
      result = clone(affected);
    }

    if (this.operation === "insert") {
      const inserted = Array.isArray(this.payload)
        ? this.payload.map((row) =>
            mapRow(this.table, row, ++this.fake.sequence),
          )
        : [mapRow(this.table, this.payload, ++this.fake.sequence)];
      rows.push(...inserted);
      this.fake.tables[this.table] = rows;
      result = clone(inserted);
    }

    if (this.operation === "upsert") {
      const existingIndex = rows.findIndex((row) =>
        this.payload.node_id
          ? row.node_id === this.payload.node_id
          : row.id === this.payload.id,
      );
      if (existingIndex >= 0) {
        rows[existingIndex] = { ...rows[existingIndex], ...this.payload };
        result = [rows[existingIndex]];
      } else {
        const inserted = mapRow(
          this.table,
          this.payload,
          ++this.fake.sequence,
        );
        rows.push(inserted);
        result = [inserted];
      }
      this.fake.tables[this.table] = rows;
      result = clone(result);
    }

    if (this.operation === "update") {
      rows.forEach((row, index) => {
        if (!this.matches(row)) return;
        rows[index] = { ...row, ...this.payload };
        affected.push(rows[index]);
      });
      this.fake.tables[this.table] = rows;
      result = clone(affected);
    }

    if (this.operation === "delete") {
      const retained = rows.filter((row) => !this.matches(row));
      this.fake.tables[this.table] = retained;
      affected = rows.filter((row) => this.matches(row));
      result = clone(affected);
    }

    if (this.singleRow) {
      return { data: result?.[0] ?? null, error: null };
    }

    if (this.operation === "select" || this.returnSelected) {
      return { data: result, error: null };
    }

    return { data: null, error: null };
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

export function createFakeSupabase({
  session = null,
  tables,
  failures = {},
} = {}) {
  const fake = {
    tables: clone(tables ?? defaultTables()),
    failures: { ...failures },
    calls: [],
    sequence: 100,
    authListener: null,
  };

  fake.session = session;
  fake.auth = {
    signInError: null,
    signOutError: null,
    getSessionError: null,
    signInWithPassword: vi.fn(async ({ email }) => {
      if (fake.auth.signInError) {
        return { data: null, error: fake.auth.signInError };
      }
      const nextSession = { user: { email } };
      fake.session = nextSession;
      fake.emitAuth("SIGNED_IN", nextSession);
      return { data: { session: nextSession }, error: null };
    }),
    signOut: vi.fn(async () => {
      if (fake.auth.signOutError) {
        return { error: fake.auth.signOutError };
      }
      fake.session = null;
      fake.emitAuth("SIGNED_OUT", null);
      return { error: null };
    }),
    getSession: vi.fn(async () => ({
      data: { session: fake.session },
      error: fake.auth.getSessionError,
    })),
    onAuthStateChange: vi.fn((listener) => {
      fake.authListener = listener;
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    }),
  };

  fake.emitAuth = (event, nextSession = fake.session) => {
    fake.session = nextSession;
    fake.authListener?.(event, nextSession);
  };

  fake.from = vi.fn((table) => new FakeQuery(fake, table));

  return fake;
}
