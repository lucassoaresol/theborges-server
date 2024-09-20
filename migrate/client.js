import fs from 'node:fs/promises'; // Usar API de promessas do fs
import prismaClient from './prismaClient.js';
import { generateUniquePublicId } from './utils.js';



const meses = {
  "Jan": 1,
  "Fev": 2,
  "Mar": 3,
  "Abr": 4,
  "Mai": 5,
  "Jun": 6,
  "Jul": 7,
  "Ago": 8,
  "Set": 9,
  "Out": 10,
  "Nov": 11,
  "Dez": 12
};


// Função para criar um agendamento no banco
async function createClient(columns) {
  try {
    const publicId = await generateUniquePublicId('client')
    const name = columns[0].trim().split(/\s+/).join(' ');
    const birthDay = columns[3] ? Number(columns[3]) : undefined
    const birthMonth = meses[columns[4]] ? meses[columns[4]] : undefined
    const wantsPromotions = columns[5] == "off" ? false : true


    await prismaClient.client.create({
      data: {
        email: columns[2],
        name, phone: columns[1],
        publicId, birthDay, birthMonth, wantsPromotions
      },
    });


  } catch (error) {
    console.error('Erro ao criar cliente:', error);
  }
}

// Função para "pausar" o processamento por alguns segundos
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para processar o arquivo em lotes de 500 linhas
async function processFile(filePath) {
  try {
    // Ler o arquivo
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Quebrar as linhas
    const lines = fileContent.split('\n').filter(line => line.trim() !== ''); // Remover linhas vazias

    // Dividir as linhas em blocos de 500
    const chunks = [];
    for (let i = 0; i < lines.length; i += 500) {
      chunks.push(lines.slice(i, i + 500));
    }

    // Processar cada bloco com intervalo de 2 segundos
    for (const [index, chunk] of chunks.entries()) {
      console.log(`Processando bloco ${index + 1} de ${chunks.length}`);

      await Promise.all(
        chunk.map((line) => {
          const columns = line.split(';'); // Separar as colunas
          return createClient(columns); // Chamar a função para criar booking
        })
      );

      // Esperar 2 segundos antes de processar o próximo bloco
      if (index < chunks.length - 1) {
        console.log('Aguardando 2 segundos antes do próximo bloco...');
        await sleep(2000);
      }
    }

    console.log('Processamento concluído com sucesso.');

  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
  }
}

// Chamar a função com o caminho do arquivo
processFile('/root/repo/dev/theborges/server/migrate/client.txt');
