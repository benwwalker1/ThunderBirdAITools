const OPENAI_API_KEY = "myAPIkey";

async function fetchGPT3Response(prompt) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 1
      }),
    });
  
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
  
  messenger.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchGPT3Response") {
      fetchGPT3Response(request.prompt)
        .then((result) => sendResponse({ result }))
        .catch((error) => sendResponse({ error: error.message }));
      return true;
    }
  });