import { NextResponse } from 'next/server';
import axios from 'axios';

const ignoredFiles = ['README.md', 'package-lock.json', '.gitignore', '.env'];

export async function POST(req) {
  const { repo, folder, selectedFileTypes } = await req.json();
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
    try {
      const response = await axios.get(`${apiBaseUrl}/${folderPath}`, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Concatenator-App'
        },
        timeout: 15000
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
          Accept: 'application/vnd.github.v3.raw',
          'User-Agent': 'GitHub-Concatenator-App'
        },
        timeout: 10000
      });

      return response.data || '';
    } catch (error) {
      console.error('Error obteniendo archivo:', {
        url: fileUrl,
        status: error.response?.status,
        message: error.message
      });
      return `[Error al obtener archivo: ${error.message}]`;
    }
  }

  // Nueva versión: Construye la estructura y el contenido por separado
  async function buildProjectStructure(basePath = '') {
    let structure = '';
    let output = '';
    
    try {
      const items = await fetchFolderContents(basePath);
      const indent = basePath.split('/').length;
      
      for (const item of items) {
        const fullPath = basePath ? `${basePath}/${item.name}` : item.name;
        const isIgnoredFile = ignoredFiles.includes(item.name);
        
        // Verificar si es un archivo y si tiene una extensión permitida
        const isFile = item.type === 'file';
        const fileExtension = item.name.includes('.') 
          ? item.name.substring(item.name.lastIndexOf('.')).toLowerCase() 
          : '';
        
        const isAllowedExtension = selectedFileTypes?.length > 0 
          ? selectedFileTypes.includes(fileExtension)
          : true;

        if (isIgnoredFile || (isFile && !isAllowedExtension)) {
          console.log(`⛔ Archivo ignorado: ${item.name}`);
          continue;
        }

        if (isFile) {
          // Agregar a la estructura
          structure += `${'│   '.repeat(indent)}├── ${item.name}\n`;
          
          // Obtener contenido
          const content = await fetchFileContent(item.download_url || item.url);
          output += `\n---\nArchivo: ${fullPath}\n---\n${content}\n\n`;
        } else if (item.type === 'dir') {
          // Agregar directorio a la estructura
          structure += `${'│   '.repeat(indent)}├── ${item.name}/\n`;
          
          // Procesar recursivamente el subdirectorio
          const subResult = await buildProjectStructure(fullPath);
          structure += subResult.structure;
          output += subResult.output;
        }
      }
    } catch (error) {
      output += `\n[Error procesando carpeta ${basePath}: ${error.message}]\n`;
    }
    
    return { structure, output };
  }

  try {
    const { structure, output } = await buildProjectStructure(folder || '');
    const fullOutput = `# Estructura del proyecto:\n${structure}\n\n# Contenido:\n${output}`;
    return NextResponse.json({ output: fullOutput });
  } catch (error) {
    console.error('Error general:', error.message);
    return NextResponse.json({ 
      error: `Error procesando datos: ${error.message}` 
    }, { status: 500 });
  }
}