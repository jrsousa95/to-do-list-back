import cors from "cors";
import express from "express";
import logger from "node-color-log";
import registerRoutes from "./config/register-routes";

const HOST = "http://localhost";

const app = express();

// Configuração do CORS para permitir o front-end
const corsOptions = {
  origin: "http://localhost:5173", // Permite apenas o front-end rodando nessa porta
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  credentials: true, // Se precisar enviar cookies ou autenticação via headers
};

app.use(cors(corsOptions)); // Aplica o CORS com as opções configuradas

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando com CORS habilitado!" });
});

registerRoutes(app);

const PORT = 5000;

app.listen(PORT, () => {
  try {
    logger.success(`✅ Servidor rodando em ${HOST}/ na porta: ${PORT}`);
  } catch (error) {
    logger.error("❌ Falha ao iniciar servidor.", error);
  }
});
