'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [repo, setRepo] = useState('');
  const [folder, setFolder] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');

    const res = await fetch('/api/concatenate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo, folder }),
    });

    const data = await res.json();
    setOutput(data.output || 'No se pudo procesar el contenido.');
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="bg-gray-950/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-4xl w-full flex flex-col md:flex-row gap-10 items-center">
        {/* Imagen */}
        <div className="hidden md:block">
          <Image src="/github-logo.png" alt="GitHub Logo" width={160} height={160} />
        </div>

        {/* Formulario */}
        <div className="flex-1 w-full">
          <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Concatenador de Proyectos GitHub</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Repositorio (ej: Mai1203/gamification-app)"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 ring-purple-500"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Carpeta (ej: src o vacío)"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 ring-purple-500"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
            >
              {loading ? 'Procesando...' : 'Concatenar'}
            </button>
          </form>

          {output && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Resultado:</h2>
              <textarea
                className="w-full bg-gray-900 text-green-400 p-4 rounded text-sm h-[400px] resize-none"
                value={output}
                readOnly
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
