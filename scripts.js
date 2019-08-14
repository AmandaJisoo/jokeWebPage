"use strict";
//TODO:how can I keep track of what btn that user clicked and where should it belong
//TODO: replace curPage with pbject id int parse
let state = {icndbpageNum: 1, icndbList : null, daddyList: null, curPage: 1, numOfJoke: 10, curJokeLink : null, firstNumOfPageNav: 1, icndbNavNum: null};
// const ICNDB_URl = "http://api.icndb.com/jokes/random/"; 
const ICNDB_URl = "http://api.icndb.com/jokes/";
const DADDY_URL = "https://icanhazdadjoke.com/";
// const APPSOPT_URL = "https://official-joke-api.appspot.com/";
// let currentClickedPage = null;
let icndbpageNum = 1; //keeps track of wich page of icndb page is
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
    if (event.target.id === "icndb") {
        console.log("ic inside");
        curJokeLink = "icndb";
        icndbFetch();
    } else if (event.target.id === "daddy") {
        curJokeLink = "daddy";
        daddyFetch();
    }
}

function handlePageNumCilck(event) {
    console.log("user wants to change the page");
    console.log(event);
    console.log("load  innertext");
    console.log(event.currentTarget.innerText);
    let parsed = Number(event.currentTarget.innerText);
    console.log(parsed);
}

function loadNextPage(event) {
    console.log("loadNext");
    $(".chosen-joke").remove();
    $(".pagination").hide();
    //TODO:here COMEBACK HERE FOR ICNDPAGE UPDATE
    icndbpageNum = Number(event.currentTarget.innerText);
    curPage++;
    console.log("cur joke type", curJokeLink);
    if (curJokeLink === "icndb") {
        icndbFetch();
    } else if (curJokeLink === "daddy") {
        console.log("daddy inside");
        daddyFetch();
    } else {
        //third link
    }
}

function changeToNextPageNav(event) {
    //increase the current page count
    //ex: 1,2,3 present and click next-btn
    //then show 4,5,6
    curPage++;
    firstNumOfPageNav += 3;
    icndbpageNum = firstNumOfPageNav;
    $(".page-btn").remove();
     for (let i = 2; i >= 0; i--) {
        let pageBtn = $("<li class='page-item page-btn' id='" + (firstNumOfPageNav + i) + "-page-btn'><a class='page-link' href='#'>" + (firstNumOfPageNav + i) +  "</a></li>");
        $(pageBtn).insertAfter(".arrow-btn");
    }     
    //attach event listener bc prev event listener has been delted
    $(".page-btn").click(loadNextPage);
    //TODO:show default page
    loadNextPage(event);
    console.log(firstNumOfPageNav);
}

//shouldn't fetch again if is same page
function changeToPrevPageNav(event) {
    if (firstNumOfPageNav >= 4) {
        curPage -= 2;
        icndbpageNum = (firstNumOfPageNav -3);
        $(".page-btn").remove();
        for (let i = 1; i <= 3; i++) {
            console.log(firstNumOfPageNav);
            //how to add event listner
            let pageBtn = $("<li class='page-item page-btn' id='" + (firstNumOfPageNav - i) + "-page-btn'><a class='page-link' href='#'>" + (firstNumOfPageNav - i) +  "</a></li>");
            $(pageBtn).insertAfter(".arrow-btn");
        }
        firstNumOfPageNav -= 3;
        //load it as the first set of nav
        curPage = firstNumOfPageNav;
        $(".page-btn").click(loadNextPage);
        loadNextPage(event);
    }
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
    console.log(curPage);
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


