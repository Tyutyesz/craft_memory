
const $main = document.querySelector("main");
const $score = document.querySelector("h3 span");
const $cards = [];
const cardCount = 20;

let cats;
let clearedCount = 0;
let activeCard = null;
let waitingEndMove = false;
let playerPoints = 0;

async function getCats(count) {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${count}`);
    return await response.json();
}


const createGame = () => {
    let pureCats = cardCount / 2;
    getCats(pureCats).then((data) => {
        cats = [...data, ...data];
        shuffleCats(cats);
    })
}
const shuffleCats = (catArray) => {
    for (let i = 0; i < cardCount; i ++){
        const randomIndex = Math.floor(Math.random() * catArray.length);
        const cat = catArray[randomIndex];
        buildCards(cat);
        catArray.splice(randomIndex, 1);
    }
}
const buildCards = (cat) => {
    const element = document.createElement("div");
    const image = document.createElement("img");
    element.classList.add("card");
    image.src = cat.url;
    element.setAttribute("data-id", cat.id);
    element.setAttribute("data-cleared", "false");
    element.addEventListener("click", () => {
        const cleared = element.getAttribute("data-cleared");
        if(waitingEndMove || cleared === "true" || element === activeCard) {
            return;
        }
        element.classList.add("flipped");

        if(!activeCard) {
            activeCard = element

            return;
        }

        const catToMatch = activeCard.getAttribute("data-id");

        if(catToMatch === cat.id){
            element.setAttribute("data-cleared", "true");
            activeCard.setAttribute("data-cleared", "true");

            activeCard = null;
            waitingEndMove = false;
            clearedCount += 2;
            playerPoints += 2;
            $score.innerHTML = playerPoints;
            if(clearedCount === cardCount) {
                askPlayer();
            }

            return;
        }
        waitingEndMove = true;

        setTimeout(() => {
            activeCard.classList.remove("flipped");
            element.classList.remove("flipped");

            waitingEndMove = false;
            activeCard = null;
        },1000)

    })
    element.appendChild(image);
    $cards.push(element);
    $main.appendChild(element);
}
const askPlayer = () => {
    if(confirm("You win! Play another one?")){
        endGame();
    }
}
const endGame = () => {
    $cards.forEach(card => {
        card.remove();
    })
    cats = null;
    clearedCount = 0;
    activeCard = null;
    waitingEndMove = false;
    playerPoints = 0;
    $score.innerHTML = "0";
    createGame();
}

window.addEventListener("DOMContentLoaded", () => {
    createGame();
})

