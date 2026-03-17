import 'dotenv/config';
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Método:", req.method);
  console.log("URL:", req.url);
  next();
});

// --- Configuração do OpenAI ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Rota de Comunicação ---
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensagem não enviada." });
    }

    // Chamando o modelo de chat
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ou "gpt-4" se tiver acesso
      messages: [
        {
          role: "system",
          content: "Você é um chatbot especialista em todos os esportes. Apenas responda sobre esportes no geral. Seja amigável e informativo, porém sucinto."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const text = completion.choices[0].message.content;
    res.json({ reply: text });

  } catch (error) {
    console.error("Erro COMPLETO:", error);
    res.status(500).json({
      error: "Erro ao processar a pergunta.",
      details: error.message
    });
  }
});

// --- Inicialização na Porta 3001 ---
const PORT = 3001;

app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log(`✅ O SERVIDOR ESTÁ VIVO NA PORTA ${PORT}!`);
  console.log(`🚀 O motor do bot está ligado e pronto.`);
  console.log("-----------------------------------------");
}).on('error', (err) => {
  console.log("❌ ERRO AO LIGAR O SERVIDOR:", err.message);
});