"use strict";

let state = {curPage: 1, numOfJoke: 10, curJokeLink : null, firstNumOfPageNav: 1}; 
const ICNDB_URl = "https://api.icndb.com/jokes/";
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
$("#home").click(resetToHome);

 /**
   * hide div elements on the default page.
   * display loading image alarming users that
   * their joke is loading.
*/
function hideHomeItems() {
    $(".title").hide();
    $(".intro").hide();
    $("#loading").show();
}

/**
 * call is made when user is currently on About Project page
 * and clicks home button.home-display-joke.
 * hides all elements to transform view to default home page
 */
function displayProjectInfo() {
    hideHomeItems();
    $(".user-option-container").hide();
    $(".home-display-joke").empty();
    $(".pagination").hide();
    $("footer").hide();
    setTimeout(() => {
        $("#loading").hide();
        $(".paper").show();
        $("footer").show();
    }, 1000);
}

/**
 * Call is made when user clicks Home btn 
 * on the top navigation
 * reload the page
 * users will the default page
 */
function resetToHome() {
    location.reload();
}

/**
 *  function is called when user click one 
 *  of the joke option
 *  hides items items displayed on the home page
 *  identifies the joke the user clicked
 * @param {event} returns the event triggered by
 * the option user chose on the form
 */
function renderHomePage(event) {
    hideHomeItems();
    $(".pagination").hide()
    $(".chosen-joke").remove();
    $(".home-display-joke").empty();
    $("footer").hide();
    $("home-display-joke").hide();
    if (event.target.id === "icndb") {
        curJokeLink = "icndb";
        icndbFetch();
    } else if (event.target.id === "daddy") {
        curJokeLink = "daddy";
        daddyFetch();
    } 
}

/**
 * this function identifies the type of joke
 * that user selected and make appropriate fetch call
 */
function checkJokeTypeForFetch() {
    if (curJokeLink === "icndb") {
        icndbFetch();
    } else if (curJokeLink === "daddy") {
        daddyFetch();
    }
}

/**
 * function is called when user clicks the page 
 * on the pagination
 * identifies the page that user clicks
 * @param {event} triggered by the page number that user clicks
 */
function loadNextPage(event) {
    $(".pagination").hide();
    $("#loading").show();
    $(".chosen-joke").remove();
    curPage = parseInt(event.currentTarget.innerText);
    $("footer").hide();
    checkJokeTypeForFetch();
}

/**
 * this function is called when user clicks the forward 
 * btn of the pagination
 * hides the currently displayed items 
 * and display loading icons to alarm users
 * @param {event} triggered when user click the forward btn
 */
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


/**
 * this function is called when user clicks the backward
 * btn of the pagination
 * hides the currently displayed items 
 * and generate the correct pagination  for upcoming display
 * Display loading icons to alarm user that their request has been received
 * @param {event} triggered when user click the backward btn
 * this function doesn't respond on the first pagination display(pg 1, 2,3)
 */
function changeToPrevPageNav(event) {
    if (firstNumOfPageNav >= 4) {
        $("footer").hide();
        $("#loading").show();
        $(".pagination").hide();
        $(".chosen-joke").remove();
        $(".page-btn").remove();
        for (let i = 1; i <= 3; i++) {
            let pageBtn = $("<li class='page-item page-btn' id='" + (firstNumOfPageNav - i) + "-page-btn'><a class='page-link' href='#'>" + (firstNumOfPageNav - i) +  "</a></li>");
            $(pageBtn).insertAfter(".arrow-btn");
            $(".page-btn").click(loadNextPage);
        }
        firstNumOfPageNav -= 3;
        curPage = firstNumOfPageNav;
        checkJokeTypeForFetch();
    }
}

/**
 * this function fetches joke from icndb api
 * icndb api contains jokes about Chuck Norris
 * the api allows fetching by the page number
 * the fetch is made based on the page that user clicks
 * if error occurs during the process of fetching, 
 * the error will be recorded on the console
 * */
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
        $("footer").show();
        $(".pagination").show();
    })
    .catch(console.error);
}

/**
 * this method append the fetched data from icndb api 
 * to the webpage
 * @param {response} response object that has status of 200
 * which means no error was thrown 
 */
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

/**
 * this function fetches joke from daddy joke api
 * daddy joke api contains lame daddy jokes
 * the api allows fetching by the page number
 * the fetch is made based on the page that user clicks
 * if error occurs during the process of fetching, 
 * the error will be recorded on the console
 * */
function daddyFetch() {
    let daddyJokeList = DADDY_URL + "search?page=" + curPage + "&limit=" + numOfJoke;
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
 
/**
 * this function appends the fetched daddy jokes into the webpage
 * @param {response}  response object that has status of 200
 * which means no error was thrown 
 */
function daddyAppendToPage(response) {
    for (let key of response.results) {
        let jokeToPost = key.joke;
        let jokeItem = $("<div class=chosen-joke></div>");
        $(jokeItem).append("<p>" + jokeToPost + "</p>");
        $(".home-display-joke").append(jokeItem);
    }
}

  /**
   * This function is called when an error occurs in the fetch call chain (e.g. the request
   * returns a non-200 error code). Displays a user-friendly
   * error message on the page on the console
   * @param {Error} err - the err details of the request.
   */
function checkStatus(response) {
    if (!response.ok) {
        throw Error("There was an error requesting data from the" + curJokeLink  + ": " 
        + response.statusText);
    }
    return response;
}


