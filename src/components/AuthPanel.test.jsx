import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AuthPanel from "./AuthPanel.jsx";

describe("AuthPanel", () => {
  it("submits the credentials to the handler", async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn().mockResolvedValue(null);
    render(<AuthPanel onClose={vi.fn()} onSignIn={onSignIn} />);

    await user.type(
      screen.getByLabelText("Email dell'account invitato"),
      "editor@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "segreta");
    await user.click(screen.getByRole("button", { name: "Accedi" }));

    expect(onSignIn).toHaveBeenCalledWith({
      email: "editor@example.com",
      password: "segreta",
    });
  });

  it("shows the error returned by the handler", async () => {
    const user = userEvent.setup();
    const onSignIn = vi
      .fn()
      .mockResolvedValue("Credenziali non valide.");
    render(<AuthPanel onClose={vi.fn()} onSignIn={onSignIn} />);

    await user.type(
      screen.getByLabelText("Email dell'account invitato"),
      "editor@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "errata");
    await user.click(screen.getByRole("button", { name: "Accedi" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Credenziali non valide.",
    );
  });

  it("shows unexpected exceptions", async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn().mockRejectedValue(new Error("Rete assente"));
    render(<AuthPanel onClose={vi.fn()} onSignIn={onSignIn} />);

    await user.type(
      screen.getByLabelText("Email dell'account invitato"),
      "editor@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "segreta");
    await user.click(screen.getByRole("button", { name: "Accedi" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Rete assente");
  });

  it("disables the form while signing in", async () => {
    const user = userEvent.setup();
    let resolveSignIn;
    const onSignIn = vi.fn(
      () => new Promise((resolve) => {
        resolveSignIn = resolve;
      }),
    );
    render(<AuthPanel onClose={vi.fn()} onSignIn={onSignIn} />);

    await user.type(
      screen.getByLabelText("Email dell'account invitato"),
      "editor@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "segreta");
    await user.click(screen.getByRole("button", { name: "Accedi" }));

    expect(screen.getByRole("button", { name: "Accesso…" })).toBeDisabled();
    expect(screen.getByLabelText("Email dell'account invitato")).toBeDisabled();

    resolveSignIn(null);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Accedi" })).toBeEnabled(),
    );
  });

  it("closes from the header button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AuthPanel onClose={onClose} onSignIn={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Chiudi accesso" }));
    expect(onClose).toHaveBeenCalled();
  });
});
