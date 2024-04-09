chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Relay the message to the popup script
    console.log("message.text: "+message.text);
    chrome.storage.local.set({dataFromContentScript: message.text});
    //chrome.runtime.sendMessage({text: message.text});
});