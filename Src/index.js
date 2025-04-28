// index.js
import express from 'express';
import cors from 'cors';
import pontosRoutes from './routes/pontos.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração do __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use('/api/pontos', pontosRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
