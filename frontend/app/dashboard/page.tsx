"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ApiItem = {
  id: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userName, setUserName] = useState("");

  const [totalClients, setTotalClients] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("serviceflow_token");

      if (!token) {
        router.replace("/");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
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

        const [
          clientsResponse,
          servicesResponse,
          quotesResponse,
          paymentsResponse,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/clients/", {
            headers,
          }),
          fetch("http://127.0.0.1:8000/work-orders/", {
            headers,
          }),
          fetch("http://127.0.0.1:8000/quotes/", {
            headers,
          }),
          fetch("http://127.0.0.1:8000/payments/", {
            headers,
          }),
        ]);

        if (
          !clientsResponse.ok ||
          !servicesResponse.ok ||
          !quotesResponse.ok ||
          !paymentsResponse.ok
        ) {
          throw new Error(
            "Não foi possível carregar os dados do Dashboard."
          );
        }

        const clients: ApiItem[] =
          await clientsResponse.json();

        const services: ApiItem[] =
          await servicesResponse.json();

        const quotes: ApiItem[] =
          await quotesResponse.json();

        const payments: ApiItem[] =
          await paymentsResponse.json();

        setTotalClients(clients.length);
        setTotalServices(services.length);
        setTotalQuotes(quotes.length);
        setTotalPayments(payments.length);
      } catch (error) {
        console.error(
          "Erro ao carregar dashboard:",
          error
        );
      } finally {
        setCheckingAuth(false);
      }
    }

    loadDashboard();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("serviceflow_token");
    router.replace("/");
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">
          Carregando dashboard...
        </p>
      </main>
    );
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
          <button
            type="button"
            className="flex w-full items-center rounded-lg bg-blue-600 px-4 py-3 text-left text-sm font-medium text-white"
          >
            Dashboard
          </button>

          <Link
            href="/clientes"
            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
>
            Clientes
          </Link>

          <Link
            href="/servicos"
            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
>
            Serviços
          </Link>

          <button
            type="button"
            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Serviços
          </button>

          <button
            type="button"
            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Orçamentos
          </button>

          <button
            type="button"
            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Pagamentos
          </button>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-4 rounded-lg bg-slate-950 p-4">
            <p className="text-xs text-slate-500">
              Utilizador
            </p>

            <p className="mt-1 truncate text-sm font-medium text-slate-200">
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
          <header>
            <p className="text-sm font-medium text-blue-500">
              Visão geral
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Dashboard
            </h2>

            <p className="mt-2 text-slate-400">
              Bem-vindo, {userName}.
            </p>
          </header>

          <section className="mt-10">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">
                    Clientes
                  </p>

                  <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    Total
                  </span>
                </div>

                <p className="mt-5 text-4xl font-bold">
                  {totalClients}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Clientes cadastrados
                </p>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">
                    Serviços
                  </p>

                  <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    Total
                  </span>
                </div>

                <p className="mt-5 text-4xl font-bold">
                  {totalServices}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Ordens de serviço
                </p>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">
                    Orçamentos
                  </p>

                  <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    Total
                  </span>
                </div>

                <p className="mt-5 text-4xl font-bold">
                  {totalQuotes}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Orçamentos registrados
                </p>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">
                    Pagamentos
                  </p>

                  <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    Total
                  </span>
                </div>

                <p className="mt-5 text-4xl font-bold">
                  {totalPayments}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Pagamentos registrados
                </p>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}