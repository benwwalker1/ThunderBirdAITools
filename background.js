async function injectComposeScript(windowId) {
    let windowDetails = await messenger.windows.get(windowId);
  
    if (windowDetails.type === 'messageCompose') {
      let activeTab = windowDetails.tabs[0];
      await messenger.tabs.executeScript(activeTab.id, { file: "compose.js" });
    }
  }
  
messenger.windows.onFocusChanged.addListener(injectComposeScript);