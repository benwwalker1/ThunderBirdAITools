document.getElementById("proofread-email").addEventListener("click", async () => {
  let [tab] = await messenger.tabs.query({ active: true, currentWindow: true });

  if (tab) {
    let composeDetails = await messenger.compose.getComposeDetails(tab.id);

    let subject = composeDetails.subject;
    let body = composeDetails.body;
    let old_body = body;

    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // Send the prompt + the email body to the GPT-3.5-turbo API
    //define the prompt
    let prompt = "Provide editorial feedback on the following email. Do not give feedback for any other email in the chain besides the firstmost.";
    //concatenate the prompt and the email body;
    let full_prompt = prompt + body;
    messenger.runtime.sendMessage({
      action: "fetchGPT3Response",
      prompt: full_prompt,
    }).then((response) => {
      if (response.result) {
        console.log("GPT-3.5-turbo Response:", response.result);
        //replace all newline characters with <br> in response.result
        response.result = response.result.replace(/\n/g, '<br>');
        //remove <html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body><p><br></p><div class="moz-cite-prefix"> from body
        let short_body = body.replace('<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body><p><br></p><div class="moz-cite-prefix">', '');
          let new_body = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body><p></p><div class="moz-cite-prefix">'+response.result + '<br>' + short_body;
          console.log("New_body:", new_body);
          messenger.compose.setComposeDetails(tab.id, {
            body: new_body
        });
      } else if (response.error) {
        console.error("Error fetching GPT-3.5-turbo response:", response.error);
      }
    }).catch((error) => {
      console.error("Error:", error.message);
    });
  }
});