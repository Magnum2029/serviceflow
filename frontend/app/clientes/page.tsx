"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: number;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  cidade?: string | null;
  nif?: string | null;
};

export default function ClientesPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClients() {
      const token = localStorage.getItem("serviceflow_token");

      if (!token) {
        router.replace("/");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        // Valida o utilizador
        const userResponse = await fetch(
          "http://127.0.0.1:8000/auth/me",
          { headers }
        );

        if (!userResponse.ok) {
          localStorage.removeItem("serviceflow_token");
          router.replace("/");
          return;
        }

        const user = await userResponse.json();
        setUserName(user.nome || "");

        // Busca os clientes
        const clientsResponse = await fetch(
          "http://127.0.0.1:8000/clients/",
          { headers }
        );

        if (!clientsResponse.ok) {
          throw new Error(
            "Não foi possível carregar os clientes."
          );
        }

        const data: Client[] =
          await clientsResponse.json();

        setClients(data);
      } catch (error) {
        console.error(error);

        setError(
          "Não foi possível carregar os clientes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("serviceflow_token");
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 lg:flex lg:flex-col">
        <div className="border-b border-slate-800 px-6 py-6">
          <h1 className="text-2xl font-bold">
            Service
            <span className="text-blue-500">
              Flow
            </span>
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Gestão de serviços
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <Link
            href="/dashboard"
            className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/clientes"
            className="flex w-full items-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white"
          >
            Clientes
          </Link>

          <span className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-400">
            Serviços
          </span>

          <span className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-400">
            Orçamentos
          </span>

          <span className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-400">
            Pagamentos
          </span>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-4 rounded-lg bg-slate-950 p-4">
            <p className="text-xs text-slate-500">
              Utilizador
            </p>

            <p className="mt-1 truncate text-sm font-medium">
              {userName}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-500">
                Gestão
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Clientes
              </h2>

              <p className="mt-2 text-slate-400">
                Gerencie os clientes cadastrados no
                ServiceFlow.
              </p>
            </div>

            <Link
               href="/clientes/novo"
               className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
           >
               + Novo cliente
            </Link>
          </header>

          <section className="mt-10">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              {loading ? (
                <div className="p-8 text-slate-400">
                  Carregando clientes...
                </div>
              ) : error ? (
                <div className="p-8 text-red-400">
                  {error}
                </div>
              ) : clients.length === 0 ? (
                <div className="p-8 text-slate-400">
                  Nenhum cliente cadastrado.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-slate-800 bg-slate-950/50">
                      <tr className="text-sm text-slate-400">
                        <th className="px-6 py-4 font-medium">
                          Cliente
                        </th>

                        <th className="px-6 py-4 font-medium">
                          E-mail
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Telefone
                        </th>

                        <th className="px-6 py-4 font-medium">
                          Cidade
                        </th>

                        <th className="px-6 py-4 font-medium">
                          NIF
                        </th>

                        <th className="px-6 py-4 text-right font-medium">
                          Ações
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {clients.map((client) => (
                        <tr
                          key={client.id}
                          className="border-b border-slate-800 last:border-b-0"
                        >
                          <td className="px-6 py-5 font-medium text-white">
                            {client.nome}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-400">
                            {client.email || "—"}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-400">
                            {client.telefone || "—"}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-400">
                            {client.cidade || "—"}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-400">
                            {client.nif || "—"}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}