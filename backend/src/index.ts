// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import donorRoutes from './routes/donationRoutes'



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



app.get('/', (req: Request, res: Response) => {
  res.send('API Doação de Sangue funcionando!');
});

app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/doacao', donorRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
