document.addEventListener('mouseup', function(event) {
    var selectedText = window.getSelection().toString().trim();
    if (selectedText !== '') {
       // alert("selected text content: "+selectedText);
        chrome.runtime.sendMessage({type: 'textSelected', text: selectedText});
    }
});