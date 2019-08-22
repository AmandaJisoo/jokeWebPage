"use strict";

let state = {curPage: 1, numOfJoke: 10, curJokeLink : null, firstNumOfPageNav: 1}; 
const ICNDB_URl = "http://api.icndb.com/jokes/";
const DADDY_URL = "https://icanhazdadjoke.com/";

let curPage = 1; 
let numOfJoke = 10;
let curJokeLink = null;
let firstNumOfPageNav = 1;
$(".pagination").hide();
$("#loading").hide();
$("#icndb").click(renderHomePage);
$("#daddy").click(renderHomePage);
$("#assport").click(renderHomePage);
$("#next-btn").click(changeToNextPageNav);
$("#prev-btn").click(changeToPrevPageNav);
$(".page-btn").click(loadNextPage);
$(".user-choice").click(()=> {
    $(".intro").hide();
    $(".user-choice").hide();
    $(".title").hide();
    $(".explanation").hide();
    $("#loading").show();
})    



//Handles render 
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
    $("#loading").show();
    $(".chosen-joke").remove();
    curPage = parseInt(event.currentTarget.innerText);
    console.log(typeof(curPage));
    console.log(curPage);
    checkJokeTypeForFetch();
}

function checkJokeTypeForFetch() {
    if (curJokeLink === "icndb") {
        icndbFetch();
    } else if (curJokeLink === "daddy") {
        daddyFetch();
    }
}

function changeToNextPageNav(event) {
    $("#loading").show();
    $(".pagination")
    $(".page-btn").remove();
    $(".chosen-joke").remove();
    firstNumOfPageNav += 3;
     for (let i = 2; i >= 0; i--) {
        let pageBtn = $("<li class='page-item page-btn' id='" + (firstNumOfPageNav + i) + "-page-btn'><a class='page-link' href='#'>" + (firstNumOfPageNav + i) +  "</a></li>");
        $(pageBtn).insertAfter(".arrow-btn");
        $(".page-btn").click(loadNextPage);
    }     
    curPage = firstNumOfPageNav;
    checkJokeTypeForFetch();
}


//shouldn't fetch again if is same page
function changeToPrevPageNav(event) {
    $("#loading").show();
    if (firstNumOfPageNav >= 4) {
        $(".chosen-joke").remove();
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
}

function icndbFetch() {
    let promiseList = [];
    curPage = parseInt(curPage);
    for (let i = ((curPage - 1) * numOfJoke + 1); i <= numOfJoke * curPage; i++) {
        promiseList.push(fetch(ICNDB_URl + i)); 
    }
    Promise.all(promiseList).then((values)=> {
        return values.map((response) => response.json())
    }).then((response =>{
        Promise.all(response).then(icndbAppendToPage);
    }))
    .then(()=> {
        $("#loading").hide();
        $(".pagination").show();
    })
    .catch(console.error);
}

//stroing the joke into an array for future reference
function icndbAppendToPage(response) {
    for (let key of response) {
        if (key.type != "NoSuchQuoteException") {
           let jokeToPost =  key.value["joke"];
           let jokeItem = $("<div class=chosen-joke></div>");
           $(jokeItem).append("<p>" + jokeToPost + "</p>");
           $(".home-display-joke").append(jokeItem);
        }
    }
    $("#loading").hide();
}

function daddyFetch() {
    let daddyJokeList = DADDY_URL + "search?page=" + curPage + "&limit=" + numOfJoke;
    console.log("curPage for daddy", curPage);
    console.log("isBeing called", daddyJokeList);
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
        $("#loading").hide();
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
    $("#loading").hide();
}

function checkStatus(response) {
    if (!response.ok) {
        throw Error("Error in request: " + response.statusText);
    }
    return response;
}


