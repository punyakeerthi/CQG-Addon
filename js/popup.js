document.getElementById("gpt-key-submit").addEventListener("click", saveKey);

function saveKey(){
    document.getElementById('gpt-key-success').style.display = "none";
    document.getElementById('gpt-key-failure').style.display = "none";
    let key = document.getElementById('gpt-key-value').value;
     if(isValidAPIKey(key)){
         chrome.storage.local.set({"gptApiKey": key}).then(()=>{
            console.log("Key saved");
            alert("Key saved Successfully");
            document.getElementById('gpt-popup').classList.add('d-none');
            document.getElementById('gpt-popup-mainpage').classList.remove('d-none');
            document.getElementById('gpt-key-success').style.display = "block";
        });
        

    }else{
        document.getElementById('gpt-key-failure').style.display = "block";
    }

}

function isValidAPIKey(apiKey) {
    // API keys issued by OpenAI are typically 64 characters long
    if (apiKey.length !== 51) {
        return false;
    }
    // API keys consist of uppercase letters, lowercase letters, and hyphens
    const regex = /^[A-Za-z0-9\-]+$/;
    if (!regex.test(apiKey)) {
        return false;
    }
    return true;
}




chrome.storage.local.get("gptApiKey", function (data) {
     console.log(data);
    if(data.gptApiKey !== undefined){
         document.getElementById('gpt-popup-mainpage').classList.remove('d-none');
         document.getElementById('gpt-key-value').value = isValidAPIKey(data.gptApiKey);
    }else{
        document.getElementById('gpt-key-value').value = "";
        document.getElementById('gpt-popup').classList.remove('d-none');
    }
});

chrome.storage.local.get('dataFromContentScript', function(data) {
    const charCount = (data.dataFromContentScript !== undefined && data.dataFromContentScript !== null && data.dataFromContentScript !== '')? data.dataFromContentScript.length : 0;
     if(charCount == 0){ 
         $('#gq-submit').hide();
        document.getElementById("bubble").innerText = "Please select the text on web page and click on icon";
    }
    else if(charCount > 200)
    {
        document.getElementById("bubble").innerText = data.dataFromContentScript.substring(0, 200);
    }
    else
    {
        document.getElementById("bubble").innerText = data.dataFromContentScript;
    }
    
    
   chrome.storage.local.remove('dataFromContentScript', function() {
  console.log('Item removed from local storage');
});

    
    
});


$(document).ready(function() {
     $('#lt').hide();
    // Assuming you have a button with id "send-button"
    let openaiApiKey;
    chrome.storage.local.get("gptApiKey", function(result) {
    openaiApiKey = result.gptApiKey;
    });

    $('#gq-submit').click(function() {
       $('#lt').show();
       $("#lt").toggleClass('loader-text');
     
        sendMessage(openaiApiKey);
    });
    $('#egq-submit').hide();
    $('#ai-gen-con-hd').hide();
    $('#ai-generated-content').hide();
    
  

     $("#egq-submit").click(function() {
        // Disable the button with id "exportq"
        $("#egq-submit").prop("disabled", true);

        var content = $("#ai-generated-content").text();
        var fileName = "question_generater_data.txt";
        exportToTextFile(content, fileName);
    });
});

function exportToTextFile(content, fileName) {
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName);
}

 


function sendMessage(openaiApiKey) {

    var userMessage = $('#bubble').text(); 
     
     
    var topic = userMessage; // Assume user's input is the topic

    // Call OpenAI API (replace 'YOUR_OPENAI_API_KEY' with your actual API key)
   
   // var openaiApiKey = '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';
    var openaiApiUrl = 'https://api.openai.com/v1/chat/completions';

    // Construct the prompt
    var prompt = ` You are a UPSC aspirant Please check this  "${topic}" and if this is related to any subject of UPSC exam then generate key points and questions for UPSC  If questions were asked in previous exams please give paper and year else give it as expected Please generate in the below format This content is related to the subject of <Subject>, which is a part of the <Paper> for UPSC exams. Here are some key points and potential questions:

Key Points:
1. <Key Point>
2. <Key Point>
3. <Key Point>
4. <Key Point>
5. <Key Point>

Potential Questions:
1. <Question> (<Paper,Year>)
2. <Question> (<Paper,Year>)
3. <Question> (<Paper,Year>)
4. <Question> (<Paper,Year>)
5. <Question> (<Paper,Year>) `;

//exportToTextFile(prompt, "prompt_file");

    $.ajax({
        url: openaiApiUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + openaiApiKey
        },
        data: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        }),
        success: function (response) {
            var aiMessage = response.choices[0].message.content;
            // Display AI message
            $('#lt').text("Key Points and Questions Generated Successfully !");
            $("#lt").toggleClass('loader-text');
           // alert("Key Points and Questions Generated Successfully !");
            $('#ai-generated-content-p').text(aiMessage);
            $('#gq-submit').hide();
            $('#egq-submit').show();
            $('#ai-gen-con-hd').show();
            $('#ai-generated-content').show();
             

             //document.getElementById("bubble").innerText = aiMessage;
        },
        error: function (error) {
            $('#lt').text("Failed ! to Generate Key Points and Questions");
            $("#lt").toggleClass('loader-text');
            console.error('Error calling OpenAI API:', error);
        },
        complete: function () { 
        }
    });
}
