const ICNDB_URl = "http://api.icndb.com/jokes/random"; 
const DONALD_TRUMP = "https://icanhazdadjoke.com/";
const 
//only fetching one joke 

function fetchOne() {
    fetch(ICNDB_URl)
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        icndbAppendToPage(response, "one");
    })
    .catch(console.error);
}

let fetchData = {
    method: 'GET',
    Headers: {
        'Content-Type': 'application/json',
        "Accept" : 'application/json',
        cache: 'no-cache',
        mode: 'cors'
        }
}

function fetchTwo() {
    fetch(DONALD_TRUMP,  {
        method: 'GET',
        headers: {
            "Accept" : 'application/json',
        }
    })
    .then(checkStatus)
    .then(resp => {
        console.log(resp);
        return resp.json();
    })
    .then((response) => {
        console.log(response);
        trumpAppendToPage(response, "two");
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
    console.log("inside");
    let homeJokePost = response.value.joke;
    // $("#id").append(homeJokePost);
    document.getElementById(name).append(homeJokePost);
}

function init() {
    fetchOne();
    fetchTwo();
    // fetchThree();
    // fetchFour();
}

function trumpAppendToPage(response, name) {
    let homeJokePost = response.joke;
    document.getElementById(name).append(homeJokePost);
}
init();
