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
    userMsg.textContent = text;
    messages.appendChild(userMsg);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    // Pequeno delay para a resposta do bot parecer mais natural
    setTimeout(async () => {
        console.log("CHEGOU NO TIMEOUT");

        let botMsg = document.createElement("div");
        botMsg.classList.add("message", "bot");

        // Indicador de carregamento
        botMsg.textContent = "...";
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;

        try {
            console.log("ANTES DO FETCH");
            
            // Chama a função que pega a resposta do servidor
            const responseText = await getBotResponse(text);
            console.log("DEPOIS DO FETCH");

            botMsg.textContent = responseText;

        } catch (error) {
            botMsg.textContent = "Erro ao conectar com o servidor. Verifique se o Node está rodando na porta 3001.";
            console.error("Erro na requisição:", error);
        }

        // Rola novamente para baixo após a resposta chegar
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

// Permite enviar a mensagem pressionando ENTER
window.onload = () => {
    const inputField = document.getElementById("input");

    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
};