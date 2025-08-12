import { FileType } from "@/data/fileTypes";
import Image from "next/image";

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
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">
        Tipos de Archivo a Incluir
      </h3>
      
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
      
      <div className="flex-1 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fileTypes.map((type) => (
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
                <Image
                  src={type.icon}
                  alt={type.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-gray-200 text-center">
                {type.name}
              </span>
              <span className="text-xs text-gray-400">{type.ext}</span>
            </div>
          ))}
        </div>
      </div>
      
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
            className="bg-purple-600 h-2 rounded-full" 
            style={{ 
              width: `${(selectedFileTypes.length / fileTypes.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}