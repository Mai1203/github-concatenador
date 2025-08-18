"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import { FILE_TYPES, DEFAULT_SELECTED_TYPES } from "@/data/fileTypes";
import FileTypeSelector from "@/components/FileTypeSelector";

interface SavedConfig {
  id: string;
  name: string;
  selectedTypes: string[];
  userPattern?: string;
  projectPattern?: string;
  folderPattern?: string;
  timestamp: number;
}

export default function Home() {
  const [user, setUser] = useState("");
  const [project, setProject] = useState(""); 
  const [folder, setFolder] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(DEFAULT_SELECTED_TYPES);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [configName, setConfigName] = useState("");
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('savedConfigs');
    if (saved) {
      setSavedConfigs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedConfigs', JSON.stringify(savedConfigs));
  }, [savedConfigs]);

  useEffect(() => {
    if (output) {
      Prism.highlightAll();
    }
  });

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

  const saveCurrentConfig = () => {
    if (!configName.trim()) return;
    
    const newConfig: SavedConfig = {
      id: Date.now().toString(),
      name: configName,
      selectedTypes: [...selectedFileTypes],
      userPattern: user,
      projectPattern: project,
      folderPattern: folder,
      timestamp: Date.now()
    };
    
    setSavedConfigs(prev => [...prev, newConfig]);
    setConfigName("");
    setShowConfigModal(false);
  };

  const loadConfig = (config: SavedConfig) => {
    setSelectedFileTypes(config.selectedTypes);
    if (config.userPattern) setUser(config.userPattern);
    if (config.projectPattern) setProject(config.projectPattern);
    if (config.folderPattern) setFolder(config.folderPattern); else setFolder("");
  };

  const deleteConfig = (id: string) => {
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user || !project) {
      setOutput("Por favor ingresa usuario y nombre del proyecto");
      return;
    }
    
    setLoading(true);
    setOutput("");
    setCopied(false);

    try {
      const repo = `${user}/${project}`; // Combinamos usuario y proyecto
      
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
              {/* Campos divididos para usuario y proyecto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user" className="block text-sm font-medium text-gray-300 mb-1">
                    Usuario/Organización
                  </label>
                  <input
                    id="user"
                    type="text"
                    placeholder="github"
                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg outline-none 
                      focus:ring-2 ring-purple-500 border border-gray-600"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre del Proyecto
                  </label>
                  <input
                    id="project"
                    type="text"
                    placeholder="react"
                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg outline-none 
                      focus:ring-2 ring-purple-500 border border-gray-600"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="folder" className="block text-sm font-medium text-gray-300 mb-1">
                  Carpeta (opcional)
                </label>
                <input
                  id="folder"
                  type="text"
                  placeholder="src (dejar vacío para raíz)"
                  className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg outline-none 
                    focus:ring-2 ring-purple-500 border border-gray-600"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-lg transition cursor-pointer
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
                      Concatenar Proyecto
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="relative bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 px-4 py-3 rounded-lg flex items-center justify-center transition-all transform hover:scale-105 group border border-gray-600 cursor-pointer"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    className="w-5 h-5 text-indigo-300 group-hover:text-white transition-colors"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.8} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.8} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  
                  {/* Efecto de brillo al pasar el mouse */}
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"></span>
                  
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    Configuraciones guardadas
                  </span>
                </button>

              </div>
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
              <div className="flex gap-2">
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
            </div>
            <div className="relative">
              <pre className="language-javascript">
                <code>{output}</code>
              </pre>
            </div>
          </div>
        )}

        {showConfigModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Configuraciones Guardadas
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Administra tus selecciones de archivos para proyectos recurrentes
                  </p>
                </div>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-full transition-all"
                  aria-label="Cerrar modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Formulario para guardar nueva configuración */}
                <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600">
                  <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Guardar configuración actual
                  </h4>
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Nombre descriptivo..."
                      className="flex-1 bg-gray-600/50 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      value={configName}
                      onChange={(e) => setConfigName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveCurrentConfig()}
                    />
                    <button 
                      onClick={saveCurrentConfig}
                      className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-lg transition flex items-center gap-1 ${
                        !configName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!configName.trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Se guardarán: {selectedFileTypes.length} tipos de archivo seleccionados
                  </div>
                </div>
                
                {/* Lista de configuraciones guardadas */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-medium text-white flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      Tus configuraciones
                    </h4>
                    <span className="text-sm text-gray-400">
                      {savedConfigs.length} guardadas
                    </span>
                  </div>
                  
                  {savedConfigs.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                      {savedConfigs.map((config) => (
                        <div 
                          key={config.id}
                          className="group relative bg-gray-700/30 hover:bg-gray-700/50 p-4 rounded-xl border border-gray-600 transition-all cursor-pointer"
                          onClick={(e) => {
                            // Solo cargar si no se hizo clic en el botón de eliminar
                            if (!(e.target as HTMLElement).closest('.delete-btn')) {
                              loadConfig(config);
                              setShowConfigModal(false);
                            }
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                {config.name}
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-3">
                                {config.selectedTypes.slice(0, 5).map(ext => (
                                  <span 
                                    key={ext} 
                                    className="text-xs bg-purple-600/30 px-2 py-1 rounded"
                                  >
                                    {ext}
                                  </span>
                                ))}
                                {config.selectedTypes.length > 5 && (
                                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                                    +{config.selectedTypes.length - 5} más
                                  </span>
                                )}
                              </div>
                              
                              <div className="mt-3 flex gap-4">
                                {config.userPattern && (
                                  <div className="text-xs text-gray-400 flex items-center">
                                    <div className="relative flex items-center justify-center mr-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-gray-800"></div>
                                    </div>
                                    <span className="text-blue-300 font-medium">{config.userPattern}</span>
                                  </div>
                                )}
                                {config.projectPattern && (
                                  <div className="text-xs text-gray-400 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    {config.projectPattern}
                                  </div>
                                )}
                                {config.folderPattern && (
                                  <div className="text-xs text-gray-400 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    {config.folderPattern}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConfig(config.id);
                                }}
                                className="delete-btn bg-red-600/30 hover:bg-red-600 p-2 rounded-lg transition-opacity opacity-0 group-hover:opacity-100"
                                title="Eliminar configuración"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                            {new Date(config.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-700 rounded-xl bg-gray-800/20">
                      <div className="mb-4 flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </div>
                      <h5 className="font-medium text-gray-300 mb-1">
                        No hay configuraciones guardadas
                      </h5>
                      <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        Guarda tus selecciones de archivos para acceder rápidamente en futuras sesiones
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                <p className="text-sm text-gray-400">
                  Las configuraciones se guardan localmente en tu navegador
                </p>
              </div>
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