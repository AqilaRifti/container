let credentials;
const maxPrepTime = 0//40000;
const formId = window.location.search.split("=")[1]

function storeUsername(username) {
    if (typeof(Storage) !== "undefined") {
        // Store the username
        localStorage.setItem("username", username);
        console.log("Username stored successfully.");
    } else {
        console.error("Sorry, your browser does not support Web Storage.");
    }
}

function getUsername() {
    return localStorage.getItem("username");
}


function sendCheatReport(method) {
    const xhr = new XMLHttpRequest();
    const baseUrl = "https://anticheat.up.railway.app/report"
    xhr.open("GET", `${baseUrl}/${formId}/${credentials}/${new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false })}/${method}`);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(credentials, xhr.response);
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };
}
async function getFormLink(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      alert('There was a problem with the fetch operation:', error);
    }
  }

async function onLoad() {
    const baseUrl = "https://anticheat.up.railway.app/get/url"
    const response = await getFormLink(`${baseUrl}/${formId}`)

    const formIframeLoader = document.createElement('iframe');
    formIframeLoader.src = await response.url
    formIframeLoader.id = "iframe"
    const popup = document.getElementById('popup');

    var previous_clipboard = navigator.clipboard.readText()
            .then(text => text)
            .catch(err => {
                console.error('Failed to read text:', err);
        })
    popup.addEventListener('click', function() {
        console.log("activ")
        setInterval(() => navigator.clipboard.readText()
            .then(text => {
                if (previous_clipboard !== text) {
                    console.log("clipboard changed")
                    sendCheatReport("clipboard")
                    previous_clipboard = text
                }
            })
            .catch(err => {
                console.error('Failed to read text:', err);
        }), 5000)
        ;
    })

    document.getElementById("form").appendChild(formIframeLoader)

    setTimeout(registerVisibilityEventListener, maxPrepTime);
    setTimeout(registerVisibilityEventListenerRemover, maxPrepTime+10000)
}
function onStart() {
    if (document.getElementById("credentials").value === "") {
        return
    }
    document.getElementById("popup").style.display = "none";
    credentials = document.getElementById("credentials").value
}


function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        sendCheatReport("change")
    }
}

function onClipboardChange() {
    document.addEventListener('click', function() { () => {
        console.log("clicked")
        navigator.clipboard.readText()
            .then(text => {
                console.log('Text read from clipboard:', text);
            })
            .catch(err => {
                console.error('Failed to read text:', err);
            });
        }},
    )
}
let docState = {
    _hidden: document.hidden,
    
    get hidden() {
      return this._hidden;
    },
    
    set hidden(value) {
      if (this._hidden !== value) {
        onVisibilityChange()
        this._hidden = value;
      }
    }
  };
  
  // Function to check and update document.hidden manually
  function checkDocumentHidden() {
    docState.hidden = document.hidden;
  }
  
  // Polling mechanism to check document.hidden periodically
  function registerVisibilityEventListener() {
    setInterval(checkDocumentHidden, 1000); // Check every 1 second
    //document.addEventListener('visibilitychange', onVisibilityChange)
}

function registerStartButtonEventListener() {
    document.getElementById("close").addEventListener("click", onStart);
}

function registerLoadEventListener() {
    window.addEventListener('load', onLoad)
}


function removeVisibilityChangeEventListener() {
    document.removeEventListener('visibilitychange', onVisibilityChange)
}
function registerVisibilityEventListenerRemover() {
    document.querySelector("iframe").addEventListener("load", removeVisibilityChangeEventListener)
}

function registerOnClipboardChangeEventListener() {
    onClipboardChange()
}

registerLoadEventListener()
registerStartButtonEventListener()
registerOnClipboardChangeEventListener()