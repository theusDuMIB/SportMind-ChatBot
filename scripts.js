function sendMessage() {
    console.log("1 - entrou na função");

    let input = document.getElementById("input");
    console.log("2 - pegou input");

    let text = input.value.trim();
    console.log("3 - pegou texto");

    if (text === "") return;

    let messages = document.getElementById("messages");
    console.log("4 - pegou messages: ", messages);

    // Cria a mensagem do usuário
    let userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");

    userMsg.innerHTML = `
    <img src="/imgs/perfil.png" class="avatar">
    <div class="bubble">${text}</div>`;

    messages.appendChild(userMsg);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    // Delay para parecer natural
    setTimeout(async () => {
        console.log("CHEGOU NO TIMEOUT");

        // 
        let botMsg = document.createElement("div");
        botMsg.classList.add("message", "bot");

        botMsg.innerHTML = `
            <img src="/imgs/bot.png" class="avatar">
            <div class="bubble">Digitando</div>`;
        // 

        // Animação "Digitando..."
        let bubble = botMsg.querySelector(".bubble");
        bubble.textContent = "Digitando";
        let dots = 0;

        const typingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            bubble.textContent = "Digitando" + ".".repeat(dots);
        }, 500);

        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;

        try {
            console.log("ANTES DO FETCH");

            const responseText = await getBotResponse(text);
            console.log("DEPOIS DO FETCH");

            // Para animação
            clearInterval(typingInterval);

            // Efeito digitando letra por letra
            await typeMessage(botMsg, responseText);

        } catch (error) {
            clearInterval(typingInterval);
            botMsg.textContent = "Erro ao conectar com o servidor. Verifique se o Node está rodando na porta 3001.";
            console.error("Erro na requisição:", error);
        }

        messages.scrollTop = messages.scrollHeight;

    }, 500);
}

async function getBotResponse(text) {
    const response = await fetch("http://127.0.0.1:3001/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
    });

    if (!response.ok) {
        throw new Error("O servidor respondeu com um erro.");
    }

    const data = await response.json();
    return data.reply;
}

// Função efeito digitando
function typeMessage(element, text) {
    return new Promise((resolve) => {
        let index = 0;
        const bubble = element.querySelector(".bubble");
        bubble.textContent = "";

        function type() {
            if (index < text.length) {
                bubble.textContent += text.charAt(index);
                index++;

                setTimeout(type, 20); // velocidade da digitação
            } else {
                resolve();
            }
        }

        type();
    });
}

// Enviar com ENTER
window.onload = () => {
    const inputField = document.getElementById("input");

    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
};


// mudar o tema
const toggle = document.getElementById("themeToggle");

// carregar tema salvo
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// clique no botão
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// clicar nos itens e mandar mensagem pro bot
// clique nos itens do menu (Futebol, F1, etc)
const chatItems = document.querySelectorAll(".chat-item");

chatItems.forEach(item => {
    item.addEventListener("click", () => {
        let texto = item.textContent;

        // remove emoji (opcional)
        texto = texto.replace(/^[^\w]+/, "").trim();

        // coloca no input
        document.getElementById("input").value = texto;

        // envia mensagem
        sendMessage();
    });
});