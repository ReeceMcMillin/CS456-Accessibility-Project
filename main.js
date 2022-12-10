import { dictionary } from "./dictionary.js";

const cells = Array.from("NLDAGBVCRIYU");
let letterElements = Array.from(document.getElementsByClassName("letter"));
let lastSelectedSide = null;
let currentWord = "";
let wordList = [];
let usedLetters = [];

for (let i = 0; i < 12; i++) {
    let letter = cells[i];
    let element = letterElements[i]
    element.textContent = letter;
    // This is a fix for specific screen readers that struggle with individual letters.
    element.setAttribute("aria-label", `${letter},`);
}

function srSpeak(text, priority) {
    // Source: https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
    var el = document.createElement("div");
    var id = "speak-" + Date.now();
    el.setAttribute("id", id);
    el.setAttribute("aria-live", priority || "polite");
    el.classList.add("visually-hidden");
    document.body.appendChild(el);

    window.setTimeout(function () {
      document.getElementById(id).innerHTML = text;
    }, 100);

    window.setTimeout(function () {
        document.body.removeChild(document.getElementById(id));
    }, 1000);
}

let chooseLetter = element => {
    element.focus();
    let letter = element.textContent;
    // let element = letterElements[cells.indexOf(letter)];
    parent = element.closest("div.letter-container");
    if (parent.id == lastSelectedSide) {
        return
    }
    lastSelectedSide = parent.id;
    // element.classList.add("letter-used");
    currentWord = `${currentWord}${letter}`
    usedLetters.push(letter);
    document.getElementById("current-word").textContent = currentWord
    console.log(`current_word = ${currentWord}`)
    checkUsedLetters();
}

let getSideOfLetter = letter => {
    let index = cells.indexOf(letter);
    let element = letterElements.at(index);
    parent = element.closest("div.letter-container");
    return parent.id;
}

let checkUsedLetters = () => {
    letterElements.forEach(element => {
        let letter = element.textContent;

        if (usedLetters.includes(letter)) {
            element.classList.add("letter-used");
        } else {
            element.classList.remove("letter-used");
        }
    })
    console.log(`used: ${usedLetters}`)
}

letterElements.forEach(letterElement => {
    letterElement.addEventListener("click", _ => {
        chooseLetter(letterElement);
    })
    letterElement.addEventListener("keydown", event => {
        if (event.code === "Space") {
            chooseLetter(letterElement);
        } else if (event.code === "Enter") {
            if (currentWord !== "") {
                if (dictionary.includes(currentWord.toLowerCase())) {
                    let wordListElement = document.getElementById("word-list");
                    let new_word = document.createElement("li");
                    new_word.appendChild(document.createTextNode(currentWord))            
                    wordListElement.appendChild(new_word)
                    wordList.push(currentWord);
                    srSpeak(`Added the word ${currentWord}`, 1)
                    currentWord = Array.from(currentWord).at(-1);
                    document.getElementById("current-word").textContent = currentWord
                } else {
                    srSpeak(`The word you've selected - ${currentWord} - isn't in the dictionary.`)
                    Array.from(currentWord).slice(1).forEach(letter => {
                        console.log(`removing ${letter}`)
                        usedLetters.splice(usedLetters.indexOf(letter), 1);
                    })
                    let lastGoodWord = wordList.length > 0 ? wordList.at(-1) : ""
                    currentWord = Array.from(lastGoodWord).at(-1);
                    lastSelectedSide = getSideOfLetter(currentWord);
                    document.getElementById("current-word").textContent = currentWord
                    checkUsedLetters();
                }
                
            } else {
                srSpeak("You haven't selected any letters!")
            }
        }
    });
});

document.addEventListener("keydown", event => {
    let letter = event.key.toUpperCase();
    if (cells.includes(letter)) {
        let element = letterElements[cells.indexOf(letter)];
        chooseLetter(element);
    }
});
