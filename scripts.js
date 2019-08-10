"use strict";
//TODo: create a dictionary and only fetch when it is first 
//time clicked

let state = {icndbList : null};
const ICNDB_URl = "http://api.icndb.com/jokes/random/"; 
const DADDY_URL = "https://icanhazdadjoke.com/";
const APPSOPT_URL = "https://official-joke-api.appspot.com/";
let icndbList = [];
$("#icndb").click(renderHomePage);
$("#daddy").click(renderHomePage);
$("#assport").click(renderHomePage);

function renderHomePage(event) {
    console.log(event);
    //empty out joke here
    //only fetch when the dictionary does not contain the key
    $(".home-display-joke").remove("chosen-joke");
    if (event.target.id === "icndb") {
        icndbFetch();
    } else if (event.target.id === "daddy") {
        console.log("inside");
        daddyFetch();
    }
}


function icndbFetch() {
    let mutipleJokeRequest = ICNDB_URl + "100";
    fetch(mutipleJokeRequest)
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        icndbAppendToPage(response.value);
    })
}

//stroing the joke into an array for future reference
function icndbAppendToPage(response) {
    //  let homeJokePost = response.value.joke;
    for (let key of response) {
        let joke = key.joke;
        icndbList.push(joke);
    }
    console.log(icndbList);
    for (let jokeToPost of icndbList) {
        console.log(jokeToPost);
        let jokeItem = $("<div class=chosen-joke></div>");
        $(jokeItem).append("<p>" + jokeToPost + "</p>");
        $(".home-display-joke").append(jokeItem);
    }
}

function daddyFetch() {
    let daddyJokeList = DADDY_URL + "search?page=10&limit=30"
    fetch(daddyJokeList,  {
        method: 'GET',
        headers: {
            'Accept' : 'application/json'
        }
    })
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        console.log(response);
        daddyAppendToPage(response);
    })
    .catch(console.error);
}
 

function daddyAppendToPage(response) {
    console.log(response);
    for (let jokeToPost of icndbList) {
        // let joke = jo
    }
}

// function removeCurrentJokes() {
//     $(".home-display-joke").detach();
// }

// <div class="joke-list">Something</div> 
// function icndbFetch() {
//     fetch(ICNDB_URl)
//     .then(checkStatus)
//     .then(resp => resp.json())
//     .then((response) => {
//         icndbAppendToPage(response, "one");
//     })
//     .catch(console.error);
// }

// function appSpotJoke() {
//     let appRandomSpotUrl = APPSOPT_URL + "random_joke";
//     fetch(appRandomSpotUrl)
//     .then(checkStatus)
//     .then(resp => resp.json())
//     .then((response) => {
//         console.log(response);
//         appSpotRandomToPage(response, "three");
//     })
//     .catch(console.error);
// }

function checkStatus(response) {
    console.log(response);
    if (!response.ok) {
        throw Error("Error in request: " + response.statusText);
    }
    //reponse object
    return response;
}



// function daddyAppendToPage(response, name) {
//     let homeJokePost = response.joke;
//     $("#" + name).append(homeJokePost);
// }

// function appSpotRandomToPage(response, name) {
//     let homeJokePost = response.setup;
//     homeJokePost += response.punchline;
//     $("#" + name).append(homeJokePost);
// }

// function init() {
//     icndbFetch();
//     daddyFetch();
//     appSpotJoke();

// }




// let options = `<div class ="home-display-joke"> 
// <div class="home-joke" id="one"></div><div class="home-joke" id="two"></div><div class="home-joke" id="three"></div></div>`;
// This is just an example from your amazing mentor Hao Chen
//$(".example").append(options);
