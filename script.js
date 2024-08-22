let credentials;
const maxPrepTime = 0//40000;
const formId = window.location.search.split("=")[1]

function sendCheatReport() {
    const xhr = new XMLHttpRequest();
    const baseUrl = "https://anticheat.up.railway.app/report"
    xhr.open("GET", `${baseUrl}/${formId}/${credentials}/${new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false })}`);
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
        sendCheatReport()
    }
}

function registerVisibilityEventListener() {
    document.addEventListener('visibilitychange', onVisibilityChange)
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

registerLoadEventListener()
registerStartButtonEventListener()
