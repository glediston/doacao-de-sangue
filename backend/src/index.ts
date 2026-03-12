// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import donorRoutes from './routes/donorRoutes';
import donationRoutes from './routes/donationRoutes';
import statusRoutes from './routes/statusRoutes';
import requestRoutes from './routes/requestRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    status: "API funcionando",
  });
});

// Padronização das Rotas (Sugestão de boas práticas)
// No src/index.ts, altere para:
app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/status', statusRoutes);

const PORT = process.env.PORT || 3000;

// Só sobe o servidor se não estivermos em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

export default app;