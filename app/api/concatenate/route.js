import { NextResponse } from 'next/server';
import axios from 'axios';
import { Buffer } from 'buffer';

export async function POST(req) {
  const { repo, folder } = await req.json();
  const githubToken = process.env.GITHUB_TOKEN;
  const apiBaseUrl = `https://api.github.com/repos/${repo}/contents`;

  async function fetchFolderContents(folderPath) {
    try {
      const response = await axios.get(`${apiBaseUrl}/${folderPath}`, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo carpeta:', error.message);
      return [];
    }
  }

  async function fetchFileContent(fileUrl) {
    try {
      const response = await axios.get(fileUrl, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      });

      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    } catch (error) {
      console.error('Error obteniendo archivo:', error.message);
      return '';
    }
  }

  async function processFolder(folderPath, structure = '', output = '') {
    const items = await fetchFolderContents(folderPath);
    for (const item of items) {
      if (item.type === 'file') {
        const content = await fetchFileContent(item.url);
        output += `---\nArchivo: ${folderPath}/${item.name}\n---\n${content}\n\n`;
      } else if (item.type === 'dir') {
        structure += `${' '.repeat(folderPath.split('/').length)}├── ${item.name}/\n`;
        const result = await processFolder(`${folderPath}/${item.name}`, structure, output);
        structure = result.structure;
        output = result.output;
      }
    }
    return { structure, output };
  }

  try {
    const { structure, output } = await processFolder(folder || '');
    const fullOutput = `Estructura del proyecto:\n${structure}\n\n${output}`;
    return NextResponse.json({ output: fullOutput });
  } catch (error) {
    console.error('Error general:', error.message);
    return NextResponse.json({ error: 'Error procesando datos' }, { status: 500 });
  }
}
