"use strict";

//TODO: figure out when alredy at home
let state = {curPage: 1, numOfJoke: 10, curJokeLink : null, firstNumOfPageNav: 1}; 
const ICNDB_URl = "http://api.icndb.com/jokes/";
const DADDY_URL = "https://icanhazdadjoke.com/";

let curPage = 1; 
let numOfJoke = 10;
let curJokeLink = null;
let firstNumOfPageNav = 1;
let isAtHome = true;
$(".pagination").hide();
$("#loading").hide();
$("#icndb").click(renderHomePage);
$("#daddy").click(renderHomePage);
$("#assport").click(renderHomePage);
$("#next-btn").click(changeToNextPageNav);
$("#prev-btn").click(changeToPrevPageNav);
$(".page-btn").click(loadNextPage);
$("#project-description").click(displayProjectInfo);
$(".paper").hide();
$(".user-option-container").click(hideHomeItems);   

function hideHomeItems() {
    console.log("isCalled");
    $(".title").hide();
    $(".intro").hide();
    $("#loading").show();
    isAtHome = false;
}
function displayProjectInfo() {
    hideHomeItems();
    $(".user-option-container").hide();
    $(".home-display-joke").empty();
    $(".home-display-joke").hide();
    $(".pagination").hide();
    $("footer").hide();
    setTimeout(() => {
        $("#loading").hide();
        $(".paper").show();
        $("footer").show();
    }, 500);
}

//triggered when the home on the navigation is clicked
//changes the view of the screen as default first page
function resetToHome() {
    if (!isAtHome) {
        $(".home-display-joke").empty();
        $(".home-display-joke").show();
        $(".user-option-container").show();
        $(".pagination").hide();
        $("#loading").hide();
        $(".title").show();
        $(".intro").toggle();
        $(".paper").hide();
        isAtHome = true;
    }
}


function renderHomePage(event) {
    $(".pagination").hide()
    $(".chosen-joke").remove();
    $("footer").hide();
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
    $("footer").hide();
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
    $(".pagination").hide();
    $(".page-btn").remove();
    $(".chosen-joke").remove();
    $("footer").hide();
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
    $("footer").hide();
    $("#loading").show();
    $(".pagination").hide();
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
        $("footer").show();
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
        $("footer").show();
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
    return response;
}


