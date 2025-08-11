import { NextResponse } from 'next/server';
import axios from 'axios';

const ignoredFiles = ['README.md', 'package-lock.json', '.gitignore', '.env'];
const ignoredExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.json', '.lock', '.log'];

export async function POST(req) {
  const { repo, folder } = await req.json();
  const githubToken = process.env.GITHUB_TOKEN;
  const apiBaseUrl = `https://api.github.com/repos/${repo}/contents`;

  // Validación básica del token
  if (!githubToken || githubToken.length < 40) {
    return NextResponse.json({ 
      error: 'Token de GitHub no configurado o inválido' 
    }, { status: 500 });
  }

  // Función mejorada para obtener contenido de carpetas
  async function fetchFolderContents(folderPath) {
    console.log('GitHub Token:', githubToken ? '✔️ Presente' : '❌ No definido');
    
    try {
      const response = await axios.get(`${apiBaseUrl}/${folderPath}`, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Concatenator-App' // Necesario para la API de GitHub
        },
        timeout: 15000 // Timeout de 15 segundos
      });
      return response.data;
    } catch (error) {
      console.error('Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Token de GitHub inválido o sin permisos suficientes');
      }
      
      throw new Error(`Error al obtener carpeta: ${error.message}`);
    }
  }

  // Función mejorada para obtener contenido de archivos
  async function fetchFileContent(fileUrl) {
    try {
      const response = await axios.get(fileUrl, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3.raw', // Obtener contenido en formato raw
          'User-Agent': 'GitHub-Concatenator-App'
        },
        timeout: 10000
      });

      // Para archivos pequeños, simplemente retornamos el contenido
      if (response.data.length < 100000) { // 100KB
        return response.data;
      }
      
      return `[Archivo demasiado grande para mostrar: ${(response.data.length / 1024).toFixed(2)} KB]`;
    } catch (error) {
      console.error('Error obteniendo archivo:', {
        url: fileUrl,
        status: error.response?.status,
        message: error.message
      });
      return `[Error al obtener archivo: ${error.message}]`;
    }
  }

  // Función recursiva mejorada para procesar carpetas
  async function processFolder(folderPath, structure = '', output = '', depth = 0) {
    if (depth > 10) { // Límite de profundidad
      return { structure, output };
    }
    
    try {
      const items = await fetchFolderContents(folderPath);
      
      for (const item of items) {
        const isIgnoredFile = ignoredFiles.includes(item.name);
        const isIgnoredExtension = ignoredExtensions.some(ext => 
          item.name.toLowerCase().endsWith(ext)
        );

        if (isIgnoredFile || isIgnoredExtension) {
          console.log(`⛔ Archivo ignorado: ${item.name}`);
          continue;
        }

        if (item.type === 'file') {
          const content = await fetchFileContent(item.download_url || item.url);
          output += `\n---\nArchivo: ${folderPath}/${item.name}\n---\n${content}\n\n`;
        } else if (item.type === 'dir') {
          structure += `${'  '.repeat(depth)}├── ${item.name}/\n`;
          const result = await processFolder(
            `${folderPath}/${item.name}`, 
            structure, 
            output, 
            depth + 1
          );
          structure = result.structure;
          output = result.output;
        }
      }
    } catch (error) {
      output += `\n[Error procesando carpeta ${folderPath}: ${error.message}]\n`;
    }
    
    return { structure, output };
  }

  try {
    const { structure, output } = await processFolder(folder || '');
    const fullOutput = `# Estructura del proyecto:\n${structure}\n\n# Contenido:\n${output}`;
    return NextResponse.json({ output: fullOutput });
  } catch (error) {
    console.error('Error general:', error.message);
    return NextResponse.json({ 
      error: `Error procesando datos: ${error.message}` 
    }, { status: 500 });
  }
}