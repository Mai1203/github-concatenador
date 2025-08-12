// src/data/fileTypes.ts

export interface FileType {
  ext: string;
  name: string;
  icon: string;
  category: string;
}

export const FILE_TYPES: FileType[] = [
  // Lenguajes de programación
  { ext: ".js", name: "JavaScript", icon: "/img/logoTipoArchivo/js.png", category: "programming" },
  { ext: ".ts", name: "TypeScript", icon: "/img/ts.png", category: "programming" },
  { ext: ".py", name: "Python", icon: "/img/python.png", category: "programming" },
  { ext: ".java", name: "Java", icon: "/img/java.png", category: "programming" },
  { ext: ".php", name: "PHP", icon: "/img/php.png", category: "programming" },
  { ext: ".rb", name: "Ruby", icon: "/img/ruby.png", category: "programming" },
  { ext: ".go", name: "Go", icon: "/img/go.png", category: "programming" },
  { ext: ".rs", name: "Rust", icon: "/img/rust.png", category: "programming" },
  { ext: ".cs", name: "C#", icon: "/img/csharp.png", category: "programming" },
  { ext: ".swift", name: "Swift", icon: "/img/swift.png", category: "programming" },
  { ext: ".kt", name: "Kotlin", icon: "/img/kotlin.png", category: "programming" },
  { ext: ".dart", name: "Dart", icon: "/img/dart.png", category: "programming" },
  
  // Frontend
  { ext: ".jsx", name: "JSX", icon: "/img/react.png", category: "frontend" },
  { ext: ".tsx", name: "TSX", icon: "/img/react.png", category: "frontend" },
  { ext: ".vue", name: "Vue", icon: "/img/vue.png", category: "frontend" },
  { ext: ".svelte", name: "Svelte", icon: "/img/svelte.png", category: "frontend" },
  
  // Estilos
  { ext: ".css", name: "CSS", icon: "/img/css.png", category: "styles" },
  { ext: ".scss", name: "SCSS", icon: "/img/sass.png", category: "styles" },
  { ext: ".less", name: "LESS", icon: "/img/less.png", category: "styles" },
  
  // Marcado
  { ext: ".html", name: "HTML", icon: "/img/html.png", category: "markup" },
  { ext: ".md", name: "Markdown", icon: "/img/markdown.png", category: "markup" },
  
  // Configuración
  { ext: ".json", name: "JSON", icon: "/img/json.png", category: "config" },
  { ext: ".yml", name: "YAML", icon: "/img/yaml.png", category: "config" },
  { ext: ".toml", name: "TOML", icon: "/img/toml.png", category: "config" },
  
  // Scripts
  { ext: ".sh", name: "Shell", icon: "/img/shell.png", category: "scripts" },
  { ext: ".bat", name: "Batch", icon: "/img/batch.png", category: "scripts" },
  { ext: ".ps1", name: "PowerShell", icon: "/img/powershell.png", category: "scripts" },
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