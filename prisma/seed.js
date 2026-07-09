import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const dbPath = path.resolve(__dirname, '../db.json');
  const data = await fs.readFile(dbPath, 'utf-8');
  const { categorias } = JSON.parse(data);

  await prisma.ingrediente.deleteMany();
  await prisma.categoria.deleteMany();

  for (const cat of categorias) {
    await prisma.categoria.create({
      data: {
        nome: cat.nome,
        icone: cat.icone,
        ingredientes: {
          create: cat.ingredientes.map((ing) => ({
            nome: ing.nome,
          })),
        },
      },
    });
  }

  console.log('✅ Dados inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular o banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });