"use strict";
//TODO: DO I want the page to show the same content? when going back to prev page?

let state = {icndbList : null, daddyList: null, curPage: 1, numOfJoke: 30, curJokeLink : null, firstNumOfPageNav: 1};
// const ICNDB_URl = "http://api.icndb.com/jokes/random/"; 
const ICNDB_URl = "http://api.icndb.com/jokes/";
const DADDY_URL = "https://icanhazdadjoke.com/";
// const APPSOPT_URL = "https://official-joke-api.appspot.com/";
let icndbList = [];
let daddyList = [];
let numOfJoke = 30;
let curJokeLink = null;
let curPage = 1;
let firstNumOfPageNav = 1;
$(".pagination").hide();
$("#icndb").click(renderHomePage);
$("#daddy").click(renderHomePage);
$("#assport").click(renderHomePage);
$(".page-item").click(loadNextPage);
$("#next-btn").click(changeToNextPageNav);
$("#prev-btn").click(changeToPrevPageNav);


//only render when not click current page link
function renderHomePage(event) {
    console.log(event);
    $(".pagination").show()
    $(".chosen-joke").remove();
    if (event.target.id === "icndb") {
        console.log("ic inside");
        curJokeLink = "icndb";
        // icndbFetch();
        primoseAll();
    } else if (event.target.id === "daddy") {
        curJokeLink = "daddy";
        daddyFetch();
    } 
}

function loadNextPage(event) {
    console.log("inside of load next page");
    $(".chosen-joke").remove();
    curPage++;
    if (curJokeLink === "icndb") {
        icndbFetch();
    } else if (curJokeLink === "daddy") {
        console.log("daddy inside");
        daddyFetch();
    } else {
        //third link
    }
}

function changeToNextPageNav() {
    //increase the current page count
    //ex: 1,2,3 present and click next-btn
    //then show 4,5,6
    curPage++;
    firstNumOfPageNav += 3;
    $(".page-btn").remove();
     for (let i = 2; i >= 0; i--) {
        let pageBtn = $("<li class='page-item page-btn' id='" + firstNumOfPageNav + "-page-btn'><a class='page-link' href='#'>" + (firstNumOfPageNav + i) +  "</a></li>");
        $(pageBtn).insertAfter(".arrow-btn");
    }     
    console.log(firstNumOfPageNav);
}

//shouldn't fetch again if is same page
function changeToPrevPageNav() {
    if (firstNumOfPageNav >= 4) {
        curPage -= 2;
        $(".page-btn").remove();
        for (let i = 1; i <= 3; i++) {
            let pageBtn = $("<li class='page-item page-btn' id='" + firstNumOfPageNav + "-page-btn'><a class='page-link' href='#'>" + (firstNumOfPageNav - i) +  "</a></li>");
            $(pageBtn).insertAfter(".arrow-btn");
        }
        firstNumOfPageNav -= 3;
        //load it as the first set of nav
        curPage = firstNumOfPageNav;
        console.log(curPage);
    }
}

// function icndbFetch() {
//     let mutipleJokeRequest = ICNDB_URl + numOfJoke;
//     fetch(mutipleJokeRequest)
//     .then(checkStatus)
//     .then(resp => resp.json())
//     .then((response) => {
//         icndbAppendToPage(response.value);
//     })
// }

function primoseAll() {
    let promiseList = [];
    for (let i = 1; i <= numOfJoke; i++) {
        promiseList.push(fetch(ICNDB_URl + i)); 
    }
    Promise.all(promiseList).then((values)=> {
        console.log("vaues");
        console.log(values);
        return values.map((response) => response.json());
    } ).then((response =>{
        Promise.all(response).then(icndbAppendToPage(response));
    })).catch(console.error);
}

// (function primoseAll() {
//     // let promise1 = fetch(ICNDB_URl + "1");
//     // let promise2 = fetch(ICNDB_URl + "2");
//     let promiseList = [];
//     for (let i = 1; i <= numOfJoke; i++) {
//         promiseList.push(fetch(ICNDB_URl + i)); 
//     }
//     //arrray 
//     Promise.all(promiseList).then((values)=> {
//         console.log(values);
//         return values.map((response) => response.json());
//     } ).then((responses =>{
//         Promise.all(responses).then(console.log);
//     }))
// })();

//stroing the joke into an array for future reference
function icndbAppendToPage(response) {
    //  let homeJokePost = response.value.joke;
    console.log("response");
    console.log(response);
    for (let key of response) {
        //TODO: FIGURE OUT HOW TO ACCESS RIGHT DATA
        // let jokeToPost =  key.PromiseValue;
        // console.log(jokeToPost);
        let jokeItem = $("<div class=chosen-joke></div>");
        $(jokeItem).append("<p>" + jokeToPost + "</p>");
        $(".home-display-joke").append(jokeItem);
    }
}

function daddyFetch() {
    let daddyJokeList = DADDY_URL + "search?page=" + curPage + "&limit=" + numOfJoke;
    fetch(daddyJokeList,  {
        method: 'GET',
        headers: {
            'Accept' : 'application/json'
        }
    })
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        daddyAppendToPage(response);
    })
    .catch(console.error);
}
 
//attaching the daddyjoke to the page dynamically
function daddyAppendToPage(response) {
    console.log(response.results);
    for (let key of response.results) {
        let jokeToPost = key.joke;
        let jokeItem = $("<div class=chosen-joke></div>");
        $(jokeItem).append("<p>" + jokeToPost + "</p>");
        $(".home-display-joke").append(jokeItem);
    }
}



// function appendDaddyToHTML(list) {
//     for (let jokeToPost of icndbList) {
//         let jokeItem = $("<div class=chosen-joke></div>");
//         $(jokeItem).append("<p>" + jokeToPost + "</p>");
//         $(".home-display-joke").append(jokeItem);
//     }   
// }

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


