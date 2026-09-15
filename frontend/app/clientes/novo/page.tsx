"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoClientePage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [nif, setNif] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem("serviceflow_token");

      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("serviceflow_token");
          router.replace("/");
          return;
        }

        setCheckingAuth(false);
      } catch {
        localStorage.removeItem("serviceflow_token");
        router.replace("/");
      }
    }

    validateSession();
  }, [router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = localStorage.getItem("serviceflow_token");

    if (!token) {
      router.replace("/");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/clients/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome,
            email: email || null,
            telefone: telefone || null,
            cidade: cidade || null,
            nif: nif || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Não foi possível cadastrar o cliente."
        );
      }

      router.push("/clientes");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Ocorreu um erro ao cadastrar o cliente."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">
          Verificando sessão...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/clientes"
          className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
        >
          ← Voltar para clientes
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium text-blue-500">
            Clientes
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Novo cliente
          </h1>

          <p className="mt-2 text-slate-400">
            Cadastre um novo cliente no ServiceFlow.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8"
        >
          <div>
            <label
              htmlFor="nome"
              className="text-sm font-medium text-slate-300"
            >
              Nome *
            </label>

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              placeholder="Nome do cliente"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-300"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              placeholder="cliente@email.com"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="telefone"
                className="text-sm font-medium text-slate-300"
              >
                Telefone
              </label>

              <input
                id="telefone"
                type="text"
                value={telefone}
                onChange={(event) =>
                  setTelefone(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                placeholder="912345678"
              />
            </div>

            <div>
              <label
                htmlFor="cidade"
                className="text-sm font-medium text-slate-300"
              >
                Cidade
              </label>

              <input
                id="cidade"
                type="text"
                value={cidade}
                onChange={(event) =>
                  setCidade(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                placeholder="Portimão"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="nif"
              className="text-sm font-medium text-slate-300"
            >
              NIF
            </label>

            <input
              id="nif"
              type="text"
              value={nif}
              onChange={(event) =>
                setNif(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              placeholder="123456789"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 border-t border-slate-800 pt-6">
            <Link
              href="/clientes"
              className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Salvando..."
                : "Cadastrar cliente"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}