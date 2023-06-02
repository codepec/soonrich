// Initialize game variables

let bottles = 0;
let coins = 0;
let experience = 1;
let level = 1;
let food = 90;
let bottlesCollected = 0;

async function loadExperienceData() {
  const response = await fetch("experience.json"); // Lade die JSON-Datei
  experienceData = await response.json(); // Speichere die Daten in der Variable
}

loadExperienceData();

let eventCards; // Variable zum Speichern der Event-Karten aus der JSON-Datei

// Laden der JSON-Datei
fetch("eventCards.json")
  .then((response) => response.json())
  .then((data) => {
    eventCards = data; // Speichern der Event-Karten in der Variable
    console.log("Event Cards:", eventCards); // Überprüfen der geladenen Event-Karten
  })
  .catch((error) => {
    console.log("Fehler beim Laden der Event-Karten:", error);
  });

fetch("experience.json")
  .then((response) => response.json())
  .then((data) => {
    // Hier kannst du mit den geladenen Erfahrungswerten arbeiten
    console.log("Experience:", data);
  })
  .catch((error) => {
    console.log("Fehler beim Laden der Erfahrungswerte:", error);
  });

let storyCards; // Variable zum Speichern der Story-Karten aus der JSON-Datei

// Laden der JSON-Datei
fetch("storyCards.json")
  .then((response) => response.json())
  .then((data) => {
    storyCards = data; // Speichern der Story-Karten in der Variable
    console.log("Story Cards:", storyCards); // Überprüfen der geladenen Story-Karten
  })
  .catch((error) => {
    console.log("Fehler beim Laden der Story-Karten:", error);
  });

function playEventCard() {
  // Generate a random number between 1 and 20
  const randomNum = Math.floor(Math.random() * 20) + 1;

  // Check if the random number is 1 (1/20 chance)
  if (randomNum <= 1) {
    // Get a random event card from the eventCards array
    const randomCard =
      eventCards[Math.floor(Math.random() * eventCards.length)];

    // Apply the effects of the event card
    if (randomCard.type === "weakness") {
      // Handle weakness event card
      collectExperiencePoints(randomCard.experience);
      food += randomCard.food;
      //bottlesCollected += randomCard.bottlesCollected; Funktioniert noch nicht
    } else if (randomCard.type === "strength") {
      // Handle strength event card
      bottlesCollected += randomCard.bottlesCollected;
      //food += randomCard.food; Funktioniert noch nicht
      // Add more conditionals for other event card types if needed
    }
    // Update the display
    updateDisplay();

    // Show the event card on the monitorBig
    showEventCard(randomCard);
  }
}

function showEventCard(eventCard) {
  const monitorBig = document.querySelector(".monitorBig");

  // Create the event card elements
  const cardTitle = document.createElement("h2");
  cardTitle.textContent = eventCard.title;

  const cardDescription = document.createElement("p");
  cardDescription.textContent = eventCard.description;

  // Clear the monitorBig content
  monitorBig.innerText = "";

  // Append the event card elements to the monitorBig
  monitorBig.appendChild(cardTitle);
  monitorBig.appendChild(cardDescription);
}

// Function to handle checking if the player is starved
function checkStarvation() {
  if (food <= 0) {
    // Display the game over message
    document.querySelector(".monitorBig").textContent =
      "Game Over: You starved";
    food = 0;

    // Hide the buttons
    document.querySelector("#collectButton").style.display = "none";
    document.querySelector("#exchangeButton").style.display = "none";
    document.querySelector("#foodButton").style.display = "none";
    document.querySelector("#partyButton").style.display = "none";
  }

  if (food > 100) {
    document.querySelector(".monitorBig").textContent = "You are full";
    food = 100;
  }
}

function getCurrentLevel() {
  return level;
}

function playStoryCard() {
  const currentLevel = getCurrentLevel(); // Hier musst du den aktuellen Level-Wert erhalten

  // Überprüfe, ob das Level den Anforderungen der Story-Karte entspricht
  const eligibleStoryCards = storyCards.filter((storyCard) => {
    return parseInt(storyCard.requirement) <= currentLevel;
  });

  if (eligibleStoryCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * eligibleStoryCards.length);
    const selectedStoryCard = eligibleStoryCards[randomIndex];

    // Update the display
    updateDisplay();

    // Show the selected story card on the monitorBig
    showStoryCard(selectedStoryCard);
  } else {
    // Keine passende Story-Karte für das aktuelle Level gefunden
    console.log("Keine passende Story-Karte gefunden.");
  }
}

function showStoryCard(storyCard) {
  const monitorBig = document.querySelector(".monitorBig");

  // Create the event card elements
  const cardTitle = document.createElement("h2");
  cardTitle.textContent = storyCard.title;

  const cardDescription = document.createElement("p");
  cardDescription.textContent = storyCard.description;

  // Clear the monitorBig content
  monitorBig.innerText = "";

  // Append the event card elements to the monitorBig
  monitorBig.appendChild(cardTitle);
  monitorBig.appendChild(cardDescription);
}

// Function to update the profile picture based on the level
function updateProfilePicture() {
  const profileImage = document.querySelector(".profile-image");
  profileImage.src = `img/profile${level}.jpg`;
}

// Function to update the game display
function updateDisplay() {
  // Update the progress bars
  document.querySelector(".level").textContent = `Level ${level}`;
  //document.querySelector(".xp").textContent = `XP: ${experience}`;

  // Calculate the remaining experience until the next level
  const remainingXP = calculateRemainingXP();

  // Limit the displayed food value to a range of 0 to 100
  const displayedFood = Math.min(Math.max(food, 0), 100);
  document.querySelector(".food").textContent = `Food: ${displayedFood}%`;

  document.querySelector(".coins").textContent = `Coins: ${coins}`;
  document.querySelector(
    ".bottles"
  ).textContent = `Bottles: ${bottlesCollected}`;

  // Set the experience CSS variable for the progress bar
  document.querySelector(".xp").style.setProperty("--experience", experience);
  document.querySelector(".food").style.setProperty("--food", `${food}%`);

  // Update the profile picture
  updateProfilePicture();

  // Check for starvation
  checkStarvation();

  // Update the remaining experience text
  document.querySelector(
    ".xp"
  ).textContent = `XP: ${experience} / ${remainingXP}`;
}

// Function to calculate the remaining experience until the next level
function calculateRemainingXP() {
  const { experienceLevels } = experienceData; // Read the experience levels from the JSON data

  // Find the next level
  const nextLevel = experienceLevels.find(
    (levelData) => levelData.level > level
  );

  if (nextLevel) {
    // Calculate the remaining experience until the next level
    const remainingXP = nextLevel.experience;
    return remainingXP;
  } else {
    // If there is no next level, the player has reached the maximum level
    return 0;
  }
}

let experienceData; // Variable zum Speichern der Erfahrungspunkte und des Levels aus der JSON-Datei

// Function to update the level based on experience points
function updateLevel() {
  const { experienceLevels } = experienceData; // Hole die Level-Informationen aus der JSON-Datei
  console.log(experienceData);
  for (const levelData of experienceLevels) {
    if (experience >= levelData.experience) {
      level = levelData.level; // Setze das Level basierend auf den Erfahrungspunkten aus der JSON-Datei
    } else {
      break; // Breche die Schleife ab, wenn das aktuelle Level gefunden wurde
    }
  }

  // Update the profile picture
  updateProfilePicture();
}

// Function to handle collecting experience points
function collectExperiencePoints(points) {
  experience += points; // Erhöhe die Erfahrungspunkte

  // Update the level based on experience points
  updateLevel();

  // Update the display
  updateDisplay();
}

// Function to handle collecting bottles
function collectBottles(event) {
  // Capture the pointer for the button element
  event.target.setPointerCapture(event.pointerId);
  // Increase the bottle count
  bottles++;
  bottlesCollected++;

  // Check if the player has leveled up
  if (bottles % 10 === 0) {
    // Increase experience points
    collectExperiencePoints(10);
  }

  // Play an event card
  playEventCard();

  // Update the display
  updateDisplay();
}

// Function to handle exchanging bottles for coins
function exchangeBottles(event) {
  // Capture the pointer for the button element
  event.target.setPointerCapture(event.pointerId);
  // Check if there are enough bottles to exchange
  if (bottlesCollected >= 5) {
    // Calculate the number of coins based on the bottles collected
    const exchangedCoins = Math.floor(bottles / 5);

    // Update the coins and bottles count
    coins += exchangedCoins;
    bottlesCollected -= 5;

    // Update the display
    updateDisplay();
  } else {
    // Display an alert for insufficient bottles
    alert("Insufficient bottles available!");
  }
}

// Function to handle buying food
function buyFood(event) {
  // Capture the pointer for the button element
  event.target.setPointerCapture(event.pointerId);
  // Check if there are enough coins to buy food
  if (coins >= 3) {
    // Deduct coins and increase food
    coins -= 3;
    food += 10;

    // Update the display
    updateDisplay();
  } else {
    // Display an alert for insufficient coins
    alert("Insufficient coins available!");
  }
}

// Function to handle making a party
function makeParty(event) {
  // Capture the pointer for the button element
  event.target.setPointerCapture(event.pointerId);
  // Check if there are enough coins to make a party
  if (coins >= 5) {
    // Deduct coins, increase experience, and decrease food
    coins -= 5;
    collectExperiencePoints(5);
    food -= 20;

    // Update the display
    updateDisplay();
  } else {
    // Display an alert for insufficient coins
    alert("Insufficient coins available!");
  }
}

// Function to handle clicking the story button
function handleStoryButtonClick() {
  playStoryCard();
}

// Add event listener to the story button
document
  .querySelector("#storyButton")
  .addEventListener("click", handleStoryButtonClick);

// Add event listeners to the buttons
document
  .querySelector("#collectButton")
  .addEventListener("pointerdown", collectBottles);
document
  .querySelector("#exchangeButton")
  .addEventListener("pointerdown", exchangeBottles);
document.querySelector("#foodButton").addEventListener("pointerdown", buyFood);
document
  .querySelector("#partyButton")
  .addEventListener("pointerdown", makeParty);

// Initial display update
updateDisplay();
