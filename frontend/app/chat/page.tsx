'use client';

import Link from 'next/link';
import { useEffect, useState, FormEvent } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; username: string; avatar: string | null };
}

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    if (stored) {
      setToken(stored);
      fetch(`${API_URL}/chat/messages`, {
        headers: {
          Authorization: `Bearer ${stored}`,
        },
      })
        .then((res) => res.ok ? res.json() : Promise.reject(res))
        .then((data: Message[]) => setMessages(data))
        .catch((error) => {
          console.error('Failed to load messages', error);
        });
    }
  }, []);

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const savedToken = token || localStorage.getItem('authToken');
    if (!savedToken) return;

    try {
      const response = await fetch(`${API_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Unable to send message');
      }

      const newMessage = await response.json();
      setMessages((current) => [...current, newMessage]);
      setInput('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Chat en temps réel</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-4">
        {token ? (
          <>
            <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4">
              {messages.length === 0 && (
                <p className="text-center text-sm text-slate-400 py-8">
                  Aucun message. Commence la conversation !
                </p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className="mb-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {msg.sender.username}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                  <p className="mt-1 text-sm text-slate-700">{msg.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="mt-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écris un message..."
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Envoyer
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
