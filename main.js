import { dictionary } from "./dictionary.js";

const alphabet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

// random for now, but there's definitely a better way to generate if we get time.
const cells = Array.from("ADFBCENOPJMI");

const letter_elements = Array.from(document.getElementsByClassName("letter"));

for (let i = 0; i < 12; i++) {
    letter_elements[i].textContent = cells[i]
}

let last_selected_set = null;

let words_so_far = [];

let current_word = "";

// selectLetterEvent = event => {

// }

letter_elements.forEach(e => {
    e.addEventListener("keyup", event => {
        if (event.code === "Space") {
            console.log(`pressed ${e.textContent}`)
            current_word = `${current_word}${e.textContent}`
            // need to prevent user from selecting from the same set twice in a row
            document.getElementById("current-word").textContent = current_word
            console.log(`current_word = ${current_word}`)
        } else if (event.code === "Enter") {
            if (current_word !== "") {
                word_list = document.getElementById("word-list");
                let new_word = document.createElement("li");
                new_word.appendChild(document.createTextNode(current_word))            
                word_list.appendChild(new_word)
                current_word = "";
                document.getElementById("current-word").textContent = current_word
            }
        }
    });
})

let word_list = document.getElementById("word-list");
