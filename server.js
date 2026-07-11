import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API do CookInUp funcionando!');
});

app.get('/categorias', async (req, res) => {

    const { busca } = req.query;
    
    try {
        const categorias = await prisma.categoria.findMany({
            where: busca ? {
                nome: {
                    contains: busca
                }
            } : {},
            include: {
                ingredientes: true
            }
        });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar dados do banco." });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});