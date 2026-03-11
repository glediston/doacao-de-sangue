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
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Rota de Check (Health Check)

app.get("/", (req, res) => {
  res.json({
    status: "API funcionando",
  });
});

// Padronização das Rotas (Sugestão de boas práticas)
// No src/index.ts, altere para:
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/donors', donorRoutes);
app.use('/requests', requestRoutes);
app.use('/donations', donationRoutes);
app.use('/status', statusRoutes);

const PORT = process.env.PORT || 3000;

// Só sobe o servidor se não estivermos em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

export default app;