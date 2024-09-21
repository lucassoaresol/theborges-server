import fs from 'node:fs/promises'; // Usar API de promessas do fs
import dayLib from './dayjs.js';
import prismaClient from './prismaClient.js';
import { generateUniquePublicId } from './utils.js';




const statusDict = {
  "Agendado": "CONFIRMED",
  "Aprovado": "CONFIRMED",
  "Atendido": "COMPLETED",
  "Cancelado": "CANCELLED"
};

// Função para converter o número serial do Excel em uma data
function excelSerialToDate(serial) {
  const excelEpoch = dayLib('1899-12-30');
  return excelEpoch.add(serial, 'day').toDate();
}

// Validação de colunas para evitar erros de dados inválidos
function validateColumns(columns) {
  if (!columns[0] || isNaN(Number(columns[0]))) {
    throw new Error('Data inválida na coluna 0');
  }
  if (!columns[1] || isNaN(Number(columns[1]))) {
    throw new Error('Hora inicial inválida na coluna 1');
  }
  if (!columns[2] || isNaN(Number(columns[2]))) {
    throw new Error('Hora final inválida na coluna 2');
  }
}

// Função para criar um agendamento no banco
async function createBooking(columns) {
  try {
    const publicId = await generateUniquePublicId('booking')
    validateColumns(columns);
    const date = excelSerialToDate(Number(columns[0]));
    const status = statusDict[columns[5]] || "UNKNOWN";

    const client = await prismaClient.client.findUnique({ where: { email: columns[3] } });
    if (!client) {
      throw new Error(`Cliente não encontrado com o email: ${columns[3]}`);
    }

    // Criar a reserva (booking)
    const book = await prismaClient.booking.create({
      data: {
        date,
        startTime: Number(columns[1]),
        endTime: Number(columns[2]),
        status, publicId,
        clientId: client.id,
        professionalId: Number(columns[4]),
      },
    });

    // Criar o serviço de reserva
    await createBookingService(book.id, columns);

  } catch (error) {
    console.error('Erro ao criar reserva:', error.message);
  }
}

// Função para criar os serviços relacionados à reserva
async function createBookingService(bookingId, columns) {
  try {
    const services = columns[6].split(',').map(service => service.trim()).filter(Boolean);

    for (let i = 0; i < services.length; i++) {
      const order = i + 1
      const name = services[i];
      const service = await prismaClient.service.findUnique({ where: { name } });

      if (!service) {
        console.error(`Serviço não encontrado: ${name}`);
        continue;
      }

      let price = i === 0 && parseFloat(columns[7]) ? parseFloat(columns[7]) : service.price;


      if (i > 0) {

        price = service.additionalPrice;

      }


      await prismaClient.bookingService.create({
        data: {
          price,
          bookingId,
          serviceId: service.id, order
        },
      });
    }
  } catch (error) {
    console.error('Erro ao criar serviço de reserva:', error.message);
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
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    // Dividir as linhas em blocos de 500
    const chunks = [];
    for (let i = 0; i < lines.length; i += 500) {
      chunks.push(lines.slice(i, i + 500));
    }

    // Processar cada bloco com intervalo de 2 segundos
    for (const [index, chunk] of chunks.entries()) {
      console.log(`Processando bloco ${index + 1} de ${chunks.length}`);

      // Processar cada linha
      for (const line of chunk) {
        const columns = line.split(';');
        await createBooking(columns); // Chamar a função para criar booking
      }

      // Esperar 2 segundos antes de processar o próximo bloco
      if (index < chunks.length - 1) {
        console.log('Aguardando 2 segundos antes do próximo bloco...');
        await sleep(2000);
      }
    }

    console.log('Processamento concluído com sucesso.');

  } catch (error) {
    console.error('Erro ao processar o arquivo:', error.message);
  }
}

// Chamar a função com o caminho do arquivo
processFile('booking.txt');


