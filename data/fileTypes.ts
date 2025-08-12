
export interface FileType {
  ext: string;
  name: string;
  icon: string; // clave de icono para @iconify/react
  category: string;
}

export const FILE_TYPES: FileType[] = [
  // Frontend
  { ext: ".jsx", name: "JSX", icon: "vscode-icons:file-type-reactjs", category: "frontend" },
  { ext: ".tsx", name: "TSX", icon: "vscode-icons:file-type-reactts", category: "frontend" },
  { ext: ".vue", name: "Vue", icon: "vscode-icons:file-type-vue", category: "frontend" },
  { ext: ".svelte", name: "Svelte", icon: "vscode-icons:file-type-svelte", category: "frontend" },

  // Lenguajes de programación
  { ext: ".js", name: "JavaScript", icon: "vscode-icons:file-type-js", category: "programming" },
  { ext: ".ts", name: "TypeScript", icon: "vscode-icons:file-type-typescript", category: "programming" },
  { ext: ".py", name: "Python", icon: "vscode-icons:file-type-python", category: "programming" },
  { ext: ".java", name: "Java", icon: "vscode-icons:file-type-java", category: "programming" },
  { ext: ".php", name: "PHP", icon: "vscode-icons:file-type-php", category: "programming" },
  { ext: ".rb", name: "Ruby", icon: "vscode-icons:file-type-ruby", category: "programming" },
  { ext: ".go", name: "Go", icon: "vscode-icons:file-type-go", category: "programming" },
  { ext: ".rs", name: "Rust", icon: "vscode-icons:file-type-rust", category: "programming" },
  { ext: ".cs", name: "C#", icon: "vscode-icons:file-type-csharp", category: "programming" },
  { ext: ".swift", name: "Swift", icon: "vscode-icons:file-type-swift", category: "programming" },
  { ext: ".kt", name: "Kotlin", icon: "vscode-icons:file-type-kotlin", category: "programming" },
  { ext: ".dart", name: "Dart", icon: "vscode-icons:file-type-dartlang", category: "programming" },

  // Estilos
  { ext: ".css", name: "CSS", icon: "vscode-icons:file-type-css", category: "styles" },
  { ext: ".scss", name: "SCSS", icon: "vscode-icons:file-type-scss", category: "styles" },
  { ext: ".less", name: "LESS", icon: "vscode-icons:file-type-less", category: "styles" },

  // Marcado
  { ext: ".html", name: "HTML", icon: "vscode-icons:file-type-html", category: "markup" },
  { ext: ".md", name: "Markdown", icon: "vscode-icons:file-type-markdown", category: "markup" },

  // Configuración
  { ext: ".json", name: "JSON", icon: "vscode-icons:file-type-json", category: "config" },
  { ext: ".yml", name: "YAML", icon: "vscode-icons:file-type-yaml", category: "config" },
  { ext: ".toml", name: "TOML", icon: "vscode-icons:file-type-toml", category: "config" },

  // Scripts
  { ext: ".sh", name: "Shell", icon: "vscode-icons:file-type-shell", category: "scripts" },
  { ext: ".bat", name: "Batch", icon: "vscode-icons:file-type-bat", category: "scripts" },
  { ext: ".ps1", name: "PowerShell", icon: "vscode-icons:file-type-powershell", category: "scripts" },

  // Imagenes
  { ext: ".ico", name: "Icono", icon: "mdi:file", category: "images" },
  { ext: ".png", name: "Imagen", icon: "mdi:file-image", category: "images" },
  { ext: ".jpg", name: "Imagen", icon: "mdi:file-image-outline", category: "images" },
  { ext: ".jpeg", name: "Imagen", icon: "mdi:file-image", category: "images" },
  { ext: ".gif", name: "Imagen", icon: "mdi:image-move", category: "images" },
  { ext: ".svg", name: "Imagen", icon: "vscode-icons:file-type-svg", category: "images" },
  { ext: ".webp", name: "Imagen", icon: "vscode-icons:file-type-webp", category: "images" },

  //Videos y audio
  { ext: ".mp4", name: "Video", icon: "mdi:file-video", category: "other" },
  { ext: ".webm", name: "Video", icon: "mdi:file-video", category: "other" },
  { ext: ".ogv", name: "Video", icon: "mdi:file-video", category: "other" },
  { ext: ".mp3", name: "Audio", icon: "mdi:file-music", category: "other" },
  { ext: ".m4a", name: "Audio", icon: "mdi:file-music", category: "other" },
];

export const CATEGORIES = [
  { id: "programming", name: "Lenguajes de Programación" },
  { id: "frontend", name: "Frameworks Frontend" },
  { id: "styles", name: "Hojas de Estilo" },
  { id: "markup", name: "Lenguajes de Marcado" },
  { id: "config", name: "Archivos de Configuración" },
  { id: "scripts", name: "Scripts" },
];

export const DEFAULT_SELECTED_TYPES = [
  ".js", ".ts", ".jsx", ".tsx", ".css", ".scss", ".html", ".py", ".json"
];
