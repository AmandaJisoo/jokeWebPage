"use strict";
//TODO: FIRST THING 8/14. Figure out how to remove the appending on prev
let state = {curPage: 1, numOfJoke: 10, curJokeLink : null, firstNumOfPageNav: 1}; 
const ICNDB_URl = "http://api.icndb.com/jokes/";
const DADDY_URL = "https://icanhazdadjoke.com/";

let curPage = 1; //keeps track of wich page of icndb page is
let numOfJoke = 10;
let curJokeLink = null;
let firstNumOfPageNav = 1;// increase by three to provide three set of navigation
$(".pagination").hide();
$("#icndb").click(renderHomePage);
$("#daddy").click(renderHomePage);
$("#assport").click(renderHomePage);
$(".page-item").click(loadNextPage);
$("#next-btn").click(changeToNextPageNav);
$("#prev-btn").click(changeToPrevPageNav);
$(".page-btn").click(loadNextPage);


//only render when not click current page link
function renderHomePage(event) {
    $(".pagination").hide()
    $(".chosen-joke").remove();
    if (event.target.id === "icndb") {
        curJokeLink = "icndb";
        icndbFetch();
    } else if (event.target.id === "daddy") {
        curJokeLink = "daddy";
        daddyFetch();
    } 
}

function loadNextPage(event) {
    $(".pagination").hide();
    $(".chosen-joke").remove();
    curPage = parseInt(event.currentTarget.innerText);
    checkJokeTypeForFetch();
}

function checkJokeTypeForFetch() {
    console.log("check type", parseInt(curPage));
    if (curJokeLink === "icndb") {
        icndbFetch();
    } else if (curJokeLink === "daddy") {
        daddyFetch();
    }
}
function changeToNextPageNav(event) {
    //increase the current page count
    //ex: 1,2,3 present and click next-btn
    //then show 4,5,6
    console.log("page num", firstNumOfPageNav);
    $(".page-btn").remove();
    $(".chosen-joke").remove();
    firstNumOfPageNav += 3;
     for (let i = 2; i >= 0; i--) {
        let pageBtn = $("<li class='page-item page-btn' id='" + (firstNumOfPageNav + i) + "-page-btn'><a class='page-link' href='#'>" + (firstNumOfPageNav + i) +  "</a></li>");
        $(pageBtn).insertAfter(".arrow-btn");
        $(".page-btn").click(loadNextPage);
    }     
    curPage = firstNumOfPageNav;
    console.log("cur page num", curPage);
    checkJokeTypeForFetch();
}

//shouldn't fetch again if is same page
function changeToPrevPageNav(event) {
    console.log("page num", firstNumOfPageNav);
    if (firstNumOfPageNav >= 4) {
        $(".page-btn").remove();
        for (let i = 1; i <= 3; i++) {
            //how to add event listner
            let pageBtn = $("<li class='page-item page-btn' id='" + (firstNumOfPageNav - i) + "-page-btn'><a class='page-link' href='#'>" + (firstNumOfPageNav - i) +  "</a></li>");
            $(pageBtn).insertAfter(".arrow-btn");
            $(".page-btn").click(loadNextPage);
        }
        firstNumOfPageNav -= 3;
        curPage = firstNumOfPageNav;
        checkJokeTypeForFetch();
    }
    console.log("check this nav page", firstNumOfPageNav);
    console.log("check this cur page", curPage);
}

function icndbFetch() {
    let promiseList = [];
    curPage = parseInt(curPage);
    for (let i = ((curPage - 1) * numOfJoke + 1); i <= numOfJoke * curPage; i++) {
        console.log(i);
        promiseList.push(fetch(ICNDB_URl + i)); 
    }
    Promise.all(promiseList).then((values)=> {
        return values.map((response) => response.json())
    }).then((response =>{
        Promise.all(response).then(icndbAppendToPage);
    }))
    .then(()=> {
        $(".pagination").show();
    })
    .catch(console.error);
}

//stroing the joke into an array for future reference
function icndbAppendToPage(response) {
    for (let key of response) {
        //only fetch the joke has a correspoding data
        if (key.type != "NoSuchQuoteException") {
           let jokeToPost =  key.value["joke"];
           let jokeItem = $("<div class=chosen-joke></div>");
           $(jokeItem).append("<p>" + jokeToPost + "</p>");
           $(".home-display-joke").append(jokeItem);
        }
    }
}

function daddyFetch() {
    let daddyJokeList = DADDY_URL + "search?page=" + curPage + "&limit=" + numOfJoke;
    console.log(daddyJokeList);
    fetch(daddyJokeList, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        }
    })
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        daddyAppendToPage(response);
    }).then(()=> {
        $(".pagination").show();
    })
    .catch(console.error);
}
 
//attaching the daddyjoke to the page dynamically
function daddyAppendToPage(response) {
    for (let key of response.results) {
        let jokeToPost = key.joke;
        let jokeItem = $("<div class=chosen-joke></div>");
        $(jokeItem).append("<p>" + jokeToPost + "</p>");
        $(".home-display-joke").append(jokeItem);
    }
}

function checkStatus(response) {
    if (!response.ok) {
        throw Error("Error in request: " + response.statusText);
    }
    //reponse object
    return response;
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



