'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('authToken'));
  }, []);

  function handleLogout() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Chat en temps réel</h1>
            <p className="mt-2 text-sm text-slate-600">
              Cette page illustre le flux authentifié. Le chat arrivera ensuite.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Déconnexion
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          {token ? (
            <>
              <p className="text-slate-700">Tu es connecté.</p>
              <p className="mt-4 text-sm text-slate-600">
                Le token JWT est stocké dans le navigateur. Tu peux maintenant intégrer
                le chat temps réel en utilisant ce token pour authentifier les requêtes.
              </p>
            </>
          ) : (
            <>
              <p className="text-slate-700">Tu n'es pas connecté.</p>
              <p className="mt-4 text-sm text-slate-600">
                <Link href="/login" className="font-semibold text-slate-900 hover:underline">
                  Connecte-toi
                </Link>{' '}
                ou{' '}
                <Link href="/register" className="font-semibold text-slate-900 hover:underline">
                  crée un compte
                </Link>{' '}
                pour accéder au chat.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
