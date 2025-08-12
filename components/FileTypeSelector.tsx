import { useState } from "react";
import { FileType } from "@/data/fileTypes";
import { Icon } from "@iconify/react";

interface FileTypeSelectorProps {
  fileTypes: FileType[];
  selectedFileTypes: string[];
  onToggle: (ext: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export default function FileTypeSelector({
  fileTypes,
  selectedFileTypes,
  onToggle,
  onSelectAll,
  onDeselectAll
}: FileTypeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filtrar por término de búsqueda
  const filteredTypes = fileTypes.filter(type => {
    const matchesSearch = 
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.ext.includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "all" || 
      (type.category && type.category === activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = [
    { id: "all", name: "Todas" },
    ...Array.from(
      new Set(fileTypes.map(type => type.category).filter(Boolean))
    ).map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1)
    }))
  ];

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">
        Tipos de Archivo a Incluir
      </h3>

      {/* Barra de búsqueda */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Buscar tipos de archivo..."
          className="w-full bg-gray-700 text-white px-3 py-2 pl-10 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              activeCategory === category.id
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Botones de selección */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={onSelectAll}
          className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded transition"
        >
          Seleccionar Todos
        </button>
        <button 
          onClick={onDeselectAll}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
        >
          Deseleccionar Todos
        </button>
      </div>
      
      {/* Lista de tipos de archivo */}
      <div className="flex-1 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-2">
        {filteredTypes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredTypes.map((type) => (
              <div 
                key={type.ext}
                className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                  selectedFileTypes.includes(type.ext)
                    ? "bg-purple-600/50 border border-purple-400"
                    : "bg-gray-700/50 border border-gray-600 hover:bg-gray-600/50"
                }`}
                onClick={() => onToggle(type.ext)}
              >
                <div className="relative w-10 h-10 mb-2">
                  <Icon icon={type.icon} className="w-full h-full" />
                </div>
                <span className="text-xs text-gray-200 text-center">
                  {type.name}
                </span>
                <span className="text-xs text-gray-400">{type.ext}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <svg 
              className="mx-auto h-12 w-12 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="mt-2">No se encontraron tipos de archivo</p>
            <p className="text-xs mt-1">Prueba con otro término de búsqueda</p>
          </div>
        )}
      </div>
      
      {/* Barra de progreso */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            {selectedFileTypes.length} de {fileTypes.length} seleccionados
          </p>
          <div className="text-sm text-purple-400">
            {Math.round((selectedFileTypes.length / fileTypes.length) * 100)}%
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ 
              width: `${(selectedFileTypes.length / fileTypes.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}