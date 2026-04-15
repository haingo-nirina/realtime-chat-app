'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Vérification du login...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setMessage('Aucun token reçu depuis Google.');
      return;
    }

    localStorage.setItem('authToken', token);
    setMessage('Connexion réussie, redirection vers le chat...');
    router.replace('/chat');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Autorisation Google</h1>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </main>
  );
}
