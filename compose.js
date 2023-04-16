document.getElementById("compose-email").addEventListener("click", async () => {
    let [tab] = await messenger.tabs.query({ active: true, currentWindow: true });
  
    if (tab) {
      let composeDetails = await messenger.compose.getComposeDetails(tab.id);
  
      let subject = composeDetails.subject;
      let body = composeDetails.body;
      let old_body = body;
      
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
  
      // Send the prompt + the email body to the GPT-3.5-turbo API
      //define the promt
        let prompt = "Respond to this email thread as if you were the recepient of the topmost email. Do not include INFO: in your response. First you will receive information that ben wants to convey, labeled \"INFO:\", then you will receive the email chain which begins with \"On MM/DD/YYYY, at HH:MM AM/PM, NAME wrote\. INFO:";
      //split the body into two parts, the first is the info, the second is the chain using On as the delimiter
        //cocatenate the prompt and the email body;
        let full_prompt = prompt+body;
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