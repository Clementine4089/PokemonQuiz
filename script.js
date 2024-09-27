const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const totalPokemonCount = 1025; // Total number of Pokémon

let correctAnswer;
let score = 0;
let questionCount = 0;
let askedPokemonIds = [];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const resultElement = document.getElementById("result");
const progressElement = document.getElementById("progress");
const increectElement = document.getElementById("incorrect");
const background = document.getElementById("background");

async function getRandomPokemon() {
  let randomId;
  do {
    randomId = Math.floor(Math.random() * totalPokemonCount) + 1; // Randomly select a Pokemon ID
  } while (askedPokemonIds.includes(randomId)); // Ensure the Pokemon has not been asked before
  askedPokemonIds.push(randomId);
  const response = await fetch(apiUrl + randomId);
  const data = await response.json();
  return data;
}

async function getRandomPokemonName() {
    const randomPokemon = await getRandomPokemon();
    return randomPokemon.name;
    }

function displayPokemon(pokemon) {
  questionElement.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;
}

async function displayOptions(pokemon) {
    const options = [];
    correctAnswer = Math.floor(Math.random() * 4); // Randomly assign the correct answer position
    options[correctAnswer] = pokemon.name;
  
    // Fetch real Pokemon names for additional options
    for (let i = 0; i < 4; i++) {
      if (i !== correctAnswer) {
        options[i] = await getRandomPokemonName();
      }
    }
  
    optionsElement.innerHTML = "";
    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.classList.add("option");
      button.addEventListener("click", () => checkAnswer(index));
      optionsElement.appendChild(button);
    });
  }

function checkAnswer(selectedIndex) {
  if (selectedIndex === correctAnswer) {
    score++;
    resultElement.textContent = "Correct!";
    background.style.backgroundColor = "lightgreen";
  } else {
    resultElement.textContent = "Incorrect!";
    increectElement.textContent = `The correct answer was: ${correctAnswer}`;
    background.style.backgroundColor = "lightcoral";

  }
  questionCount++;
  updateProgress();
  updateScore();
  nextButton.disabled = false;
}

function updateProgress() {
  progressElement.textContent = `Progress: ${questionCount} / ${totalPokemonCount}`;
  nextQuestion();
}

async function nextQuestion() {
  if (questionCount >= totalPokemonCount) {
    // Quiz ended
    questionElement.innerHTML = "Quiz ended!";
    optionsElement.innerHTML = "";
    nextButton.disabled = true;
    return;
  }
  nextButton.disabled = true;
  resultElement.textContent = "";
  const pokemon = await getRandomPokemon();
  displayPokemon(pokemon);
  await displayOptions(pokemon);
  updateScore();
}

  // At the beginning of the script
  const scoreElement = document.getElementById("score");
  function updateScore() {
    scoreElement.textContent = `Score: ${score} / ${totalPokemonCount}`;
  }



nextButton.addEventListener("click", nextQuestion);

nextQuestion(); // Start the quiz
updateProgress(); // Initialize progress counter
