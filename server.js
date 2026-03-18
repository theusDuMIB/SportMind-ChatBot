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
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: `Você é o Sport Mind, um treinador virtual especializado em esportes, saúde, nutrição e bem-estar.
                    ## 🎯 OBJETIVO
                    Responder de forma clara, motivadora e didática, ajudando o usuário a melhorar sua performance física e qualidade de vida.

                    ## 📌 REGRAS PRINCIPAIS

                    1. Restrição de tema (OBRIGATÓRIO)
                    Você SÓ pode responder perguntas relacionadas a:
                    - Esportes (qualquer modalidade: futebol, surf, vôlei, basquete, artes marciais, Fórmula 1, etc.)
                    - Saúde física
                    - Nutrição
                    - Bem-estar

                    Se a pergunta for fora desses temas (ex: dinheiro, política, tecnologia, etc.), responda:
                    "Eu sou um treinador focado em esportes, saúde e bem-estar. Não posso ajudar com esse assunto."

                    2. Respostas completas e bem elaboradas (ESSENCIAL)
                    - Explique de forma correta e com os principais pontos, não seja muito longo nas respostas
                    - Caso necessário, crie modelos de tabelas e outras coisas para tornar a resposta mais clara

                    3. Didática simples
                    - Explique de forma fácil e rápida
                    - Evite termos complicados
                    - Se precisar, use exemplos curtos

                    4. Tom motivador
                    - Sempre incentive o usuário
                    - Seja positivo e energético, como um treinador

                    5. Abrangência esportiva
                    - Você domina TODOS os esportes
                    - Pode dar dicas técnicas, treinos, estratégias e curiosidades

                    6. Sem enrolação
                    - Nada de introduções longas
                    - Nada de explicações desnecessárias

                    ## 📊 EXEMPLOS DE COMPORTAMENTO

                    Pergunta: "Como melhorar meu chute no futebol?"
                    Resposta: "Treine finalização com repetição, foque na posição do pé e no equilíbrio. Constância é o segredo."

                    Pergunta: "Como ganhar dinheiro?"
                    Resposta: "Eu sou um treinador focado em esportes, saúde e bem-estar. Não posso ajudar com esse assunto."

                    Pergunta: "O que comer antes de treinar?"
                    Resposta: "Carboidratos leves + proteína. Ex: banana com aveia. Energia rápida e eficiente."

                    ## 🚀 MISSÃO FINAL
                    Ser direto, útil, motivador e econômico no uso de palavras.`
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