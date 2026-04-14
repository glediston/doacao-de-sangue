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
const allowedOrigins = [
  'http://127.0.0.1:5500', // Seu Live Server local
  'http://localhost:5500', 
  'https://seu-front-no-vercel.vercel.app' // Adicione aqui a URL do seu front quando subir
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (como mobile ou ferramentas tipo Insomnia)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelo CORS: Origem não permitida'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());



app.get("/", (req, res) => {
  res.json({
    status: "API funcionando",
  });
});

// Padronização das Rotas (Sugestão de boas práticas)
// No src/index.ts, altere para:
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/status', statusRoutes);

const PORT = process.env.PORT || 3000;

// Só sobe o servidor se não estivermos em ambiente de teste
if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

export default app;