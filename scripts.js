const ICNDB_URl = "http://api.icndb.com/jokes/random"; 
const DADDY_URL = "https://icanhazdadjoke.com/";
const APPSOPT_URL = "https://official-joke-api.appspot.com/";
//only fetching one joke 

function icndbFetch() {
    fetch(ICNDB_URl)
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        icndbAppendToPage(response, "one");
    })
    .catch(console.error);
}

function daddyFetch() {
    fetch(DADDY_URL,  {
        method: 'GET',
        headers: {
            'Accept' : 'application/json'
        }
    })
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        console.log(response);
        daddyAppendToPage(response, "two");
    })
    .catch(console.error);
}
 
function appSpotJoke() {
    let appRandomSpotUrl = APPSOPT_URL + "random_joke";
    fetch(appRandomSpotUrl)
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        console.log(response);
        appSpotRandomToPage(response, "three");
    })
    .catch(console.error);
}

function checkStatus(response) {
    console.log(response);
    if (!response.ok) {
        throw Error("Error in request: " + response.statusText);
    }
    //reponse object
    return response;
}

function icndbAppendToPage(response, name) {
    let homeJokePost = response.value.joke;
    document.getElementById(name).append(homeJokePost);
}

function daddyAppendToPage(response, name) {
    let homeJokePost = response.joke;
    document.getElementById(name).append(homeJokePost);
}

function appSpotRandomToPage(response, name) {
    let homeJokePost = response.setup;
    homeJokePost += response.punchline;
    document.getElementById(name).append(homeJokePost);
}

function init() {
    icndbFetch();
    daddyFetch();
    appSpotJoke();
}
init();
