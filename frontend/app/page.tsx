import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900">Chat en temps réel</h1>
            <p className="mt-4 text-slate-600">
              Commence par créer un compte ou te connecter. Ensuite, tu pourras utiliser ton chat en temps réel avec authentification.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/login"
              className="rounded-2xl bg-slate-900 px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Créer un compte
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Étape suivante</h2>
            <p className="mt-2 text-slate-600">
              Une fois connecté, tu pourras utiliser la page de chat. Le token est stocké dans le navigateur et sera utile pour l’accès aux APIs protégées.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
