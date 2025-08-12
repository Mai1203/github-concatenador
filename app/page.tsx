"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FILE_TYPES, DEFAULT_SELECTED_TYPES } from "@/data/fileTypes";
import FileTypeSelector from "@/components/FileTypeSelector";

export default function Home() {
  const [repo, setRepo] = useState("");
  const [folder, setFolder] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(DEFAULT_SELECTED_TYPES);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const toggleFileType = (ext: string) => {
    setSelectedFileTypes(prev => 
      prev.includes(ext) 
        ? prev.filter(e => e !== ext) 
        : [...prev, ext]
    );
  };

  const selectAll = () => {
    setSelectedFileTypes(FILE_TYPES.map(type => type.ext));
  };

  const deselectAll = () => {
    setSelectedFileTypes([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    setCopied(false);

    try {
      const res = await fetch("/api/concatenate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          repo, 
          folder,
          selectedFileTypes
        }),
      });

      const data = await res.json();
      setOutput(data.output || "No se pudo procesar el contenido.");
    } catch (err) {
      setOutput("Error al procesar la solicitud." + err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#2a0845] to-[#0f0c29] flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full">
        <header className="text-center mb-10">
          <div className="inline-block bg-gradient-to-br from-purple-600 to-indigo-700 p-3 rounded-full mb-4">
            <Image
              src="/img/github-logo.png"
              alt="GitHub Logo"
              width={80}
              height={80}
              className="filter brightness-125"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Concatenador de Proyectos GitHub
          </h1>
          <p className="mt-2 text-gray-300 max-w-md mx-auto">
            Obtén todo el código de tu proyecto en un solo archivo
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl flex-1">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="repo" className="block text-sm font-medium text-gray-300 mb-1">
                  Repositorio
                </label>
                <input
                  id="repo"
                  type="text"
                  placeholder="usuario/repositorio (ej: Mai1203/gamification-app)"
                  className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg outline-none 
                    focus:ring-2 ring-purple-500 border border-gray-600"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="folder" className="block text-sm font-medium text-gray-300 mb-1">
                  Carpeta (opcional)
                </label>
                <input
                  id="folder"
                  type="text"
                  placeholder="Carpeta (ej: src o vacío)"
                  className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg outline-none 
                    focus:ring-2 ring-purple-500 border border-gray-600"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-lg transition
                  ${loading 
                    ? 'bg-indigo-700 cursor-not-allowed opacity-75' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}
                  transform hover:scale-[1.02]`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Concatenar
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl w-full lg:w-[400px]">
            <FileTypeSelector
              fileTypes={FILE_TYPES}
              selectedFileTypes={selectedFileTypes}
              onToggle={toggleFileType}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
            />
          </div>
        </div>

        {output && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-white">
                Resultado
              </h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    Copiar
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <textarea
                ref={textareaRef}
                className="w-full bg-gray-900 text-green-400 p-4 rounded-lg text-sm h-[300px] md:h-[400px] resize-none 
                  font-mono border border-gray-700"
                value={output}
                readOnly
              />
            </div>
          </div>
        )}
        
        <footer className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} - Concatenador de Proyectos GitHub
        </footer>
      </div>
    </div>
  );
}