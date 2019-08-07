const ICNDB_URl = "http://api.icndb.com/jokes/random"; 
const DONALD_TRUMP = "";

//only fetching one joke 
fetch(ICNDB_URl)
    .then(checkStatus)
    .then(resp => resp.json())
    .then((response) => {
        appendToPage(response, "one");
    })
    .catch(console.error);


function init() {
    fetchOne();
    fetchTwo();
    fetchThree();
    fetchFour();
}
function fetchOne() {

}
function checkStatus(resposnse) {
    if (!resposnse.ok) {
        throw Error("Error in request: " + response.statusText);
    }
    //reponse object
    return resposnse;
}

function appendToPage(response, name) {
    console.log("inside");
    let homeJokePost = response.value.joke;
    console.log(homeJokePost);
    console.log(document.getElementById("one"));
    document.getElementById(name).append(homeJokePost);
}