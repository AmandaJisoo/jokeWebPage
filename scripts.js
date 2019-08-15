"use strict";
//TODO: remove curPage
//TODO: RELOAD THE ITEM WHEN THE BUG NEXT _BTN WAS CLICKED
let state = {icndbpageNum: 1, icndbList : null, daddyList: null, curPage: 1, numOfJoke: 10, curJokeLink : null, firstNumOfPageNav: 1, icndbNavNum: null};
// const ICNDB_URl = "http://api.icndb.com/jokes/random/"; 
const ICNDB_URl = "http://api.icndb.com/jokes/";
const DADDY_URL = "https://icanhazdadjoke.com/";
// const APPSOPT_URL = "https://official-joke-api.appspot.com/";
// let currentClickedPage = null;
let icndbpageNum = 1; //keeps track of wich page of icndb page is
let daddyPageNum = 1;
let icndbList = [];
let daddyList = [];
let numOfJoke = 10;
let curJokeLink = null;
let curPage = 1;
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
    console.log("render home", event);
    if (event.target.id === "icndb") {
        console.log("ic inside");
        curJokeLink = "icndb";
        icndbFetch();
    } else if (event.target.id === "daddy") {
        curJokeLink = "daddy";
        daddyFetch();
    } 
}

function loadNextPage(event) {
    console.log("loadNext");
    $(".pagination").hide();
    $(".chosen-joke").remove();
    console.log("chosen joke removed");
    curPage++;
    console.log("cur joke type", curJokeLink);
    icndbpageNum = parseInt(event.currentTarget.innerText);
    daddyPageNum = parseInt(event.currentTarget.innerText);
    fetchJokes();
}

//decide only what to fetch
//when the btn is clicked immediately uppate the stage of teh page to fetch next
//
function fetchJokes() {
    if (curJokeLink === "icndb") {
        icndbFetch();
    } else if (curJokeLink === "daddy") {
        daddyFetch();
    } 
}

function changeToNextPageNav(event) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> parent of 03e1f95... new issue found when manuvering nav btn
    //increase the current page count
    //ex: 1,2,3 present and click next-btn
    //then show 4,5,6
    // console.log("change to event", event);
<<<<<<< HEAD
>>>>>>> parent of 03e1f95... new issue found when manuvering nav btn
=======
>>>>>>> parent of 03e1f95... new issue found when manuvering nav btn
    console.log("next nav btn here")
    curPage++;
    // firstNumOfPageNav += 3;
    icndbpageNum = parseInt($(".last-btn>.page-link").text()) + 1;
    daddyPageNum = parseInt($(".last-btn").text()) + 1;
    console.log ("parsed", icndbpageNum);
    console.log("num", parseInt($(".last-btn>.page-link").text()));
    $(".page-btn").remove();
    $(".chosen-joke").remove();
    let pageBtn = null;
     for (let i = 2; i >= 0; i--) {
        if (i != 2) {
            pageBtn = $("<li class='page-item page-btn' id='" + (icndbpageNum + i) + "-page-btn'><a class='page-link' href='#'>" + (icndbpageNum + i) +  "</a></li>");
        } else {
            pageBtn = $("<li class='page-item page-btn last-btn' id='" + (icndbpageNum + i) + "-page-btn'><a class='page-link' href='#'>" + (icndbpageNum + i) +  "</a></li>");
        }   
        $(pageBtn).insertAfter(".arrow-btn");
        $(".page-btn").click(loadNextPage);
    }     
    fetchJokes();
}

//shouldn't fetch again if is same page
function changeToPrevPageNav(event) {
    let curUsedPage = parseInt($(".last-btn>.page-link").text());
    console.log("curUsedPahr", curUsedPage);
    if (curUsedPage >= 6) {

        icndbpageNum = parseInt($(".last-btn>.page-link").text()) -3;
        daddyPageNum = parseInt($(".last-btn>.page-link").text()) -3;

        console.log("this is the last page ",icndbpageNum);
        console.log("look at this",daddyPageNum);

        $(".page-btn").remove();
        let pageNum = icndbpageNum;
        console.log(pageNum);
        for (let i = 0; i < 3; i++) {
            console.log(i);
            let pageBtn = null;
            if (i === 0) {
                console.log("loop page num", pageNum + i);
                pageBtn = $("<li class='page-item page-btn last-btn' id='" + (pageNum - i) + "-page-btn'><a class='page-link' href='#'>" + (pageNum - i) +  "</a></li>");
            } else {
                pageBtn = $("<li class='page-item page-btn' id='" + (pageNum - i) + "-page-btn'><a class='page-link' href='#'>" + (pageNum - i) +  "</a></li>");
            }
            $(pageBtn).insertAfter(".arrow-btn");
            $(".page-btn").click(loadNextPage);
        }
    } else {
        //show the first page
        icndbpageNum = 3;
    }
    fetchJokes();
}

function icndbFetch() {
    let promiseList = [];
    for (let i = ((icndbpageNum - 1) * numOfJoke + 1); i <= numOfJoke * icndbpageNum; i++) {
        console.log(i);
        promiseList.push(fetch(ICNDB_URl + i)); 
    }
    Promise.all(promiseList).then((values)=> {
        return values.map((response) => response.json())
    }).then((response =>{
        Promise.all(response).then(icndbAppendToPage);
    })).then(()=> {
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
    console.log("daddypag");
    console.log(daddyPageNum);
    // let daddyJokeList = DADDY_URL + "search?page=" + curPage + "&limit=" + numOfJoke;
    let daddyJokeList = DADDY_URL + "search?page=" + daddyPageNum + "&limit=" + numOfJoke;
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
    }).then(()=> {
        $(".pagination").show();
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

function checkStatus(response) {
    console.log(response);
    if (!response.ok) {
        throw Error("Error in request: " + response.statusText);
    }
    //reponse object
    return response;
}


