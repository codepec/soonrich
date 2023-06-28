// Initialize game variables
let bottles = 0;
let coins = 0;
let experience = 0;
let level = 1;
let food = 90;
let bottlesCollected = 0;
let factor = 1;
let itemTitleDefault = "Empty";
let experienceData = {
  experienceLevels: [{ level: 1, experience: 100 }],
};
let eventCards;
let itemCards;
let storyCards;
let factorHat = 1;
let factorCoat = 1;
let factorRing = 1;
let factorAmulet = 1;
let titleHat = "no item";
let descriptionHat = "";
let titleCoat = "no item";
let descriptionCoat = "";
let titleRing = "no item";
let descriptionRing = "";
let titleAmulet = "no item";
let descriptionAmulet = "";

async function loadExperienceData() {
  const response = await fetch("experience.json");
  experienceData = await response.json();
  console.log("Experience:", experienceData);
}

async function loadEventCards() {
  const response = await fetch("eventCards.json");
  eventCards = await response.json();
  //console.log("Event Cards:", eventCards);
}

async function loadItemCards() {
  const response = await fetch("itemCards.json");
  itemCards = await response.json();
  //console.log("Item Cards:", itemCards);
}

async function loadStoryCards() {
  const response = await fetch("storyCards.json");
  storyCards = await response.json();
  //console.log("Story Cards:", storyCards);
}

loadExperienceData();
loadEventCards();
loadItemCards();
loadStoryCards();

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

function restart() {
  location.reload();
  return false;
}

// Function to handle checking if the player is starved
function checkStarvation() {
  if (food <= 0) {
    // Display the game over message
    document.querySelector(".monitorBig").textContent =
      "Game Over: You starved";
    food = 0;

    if (food === 0) {
      document.querySelector("#storyButton").textContent = "Restart";
      document.querySelector("#storyButton").addEventListener("click", restart);
    }

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
  const currentLevel = getCurrentLevel(); // Here you need to get the current level value

  // Check if the level meets the requirements of the story card
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
    // No suitable story card found for the current level
    console.log("No suitable story card found.");
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

  const levelColor = getLevelColor(level);
  profileImage.style.border = `${level}px solid ${levelColor}`;
  //profileImage.classList.add("glowing");

  const starsContainer = document.querySelector(".stars");
  // Remove stars
  while (starsContainer.firstChild) {
    starsContainer.removeChild(starsContainer.firstChild);
  }

  const starCount = Math.floor(level / 5); // Number of stars based on the level
  for (let i = 0; i < starCount; i++) {
    const starIcon = document.createElement("span");
    starIcon.classList.add("material-icons");
    starIcon.style.touchAction = "manipulation";
    starIcon.textContent = "star";
    starsContainer.appendChild(starIcon);
  }
}

function getLevelColor(level) {
  if (level >= 5 && level <= 10) {
    return "#8B0000";
  } else if (level > 10 && level <= 20) {
    return "#00008B";
  } else {
    return "black";
  }
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

// Function to update the level based on experience points
function updateLevel() {
  const { experienceLevels } = experienceData; // Get the level information from the JSON file
  //console.log(experienceData);
  for (const levelData of experienceLevels) {
    if (experience >= levelData.experience) {
      level = levelData.level; // Set the level based on the experience points from the JSON file
    } else {
      break; // Break the loop if the current level is found
    }
  }

  // Update the profile picture
  updateProfilePicture();
}

// Function to handle collecting experience points
function collectExperiencePoints(points) {
  experience += points; // Increase Xp

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
    collectExperiencePoints(25);
  }

  // Play an event card
  playEventCard();

  playItemCard();

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
    collectExperiencePoints(35);
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

function multiply() {
  factor = 2;
}

// Function to update the profile picture based on the item

function updateItems(newImageSrc) {
  const itemImages = document.querySelectorAll(".item-image");

  const selectedItem = itemCards.find(
    (item) => item.itemPicture === newImageSrc
  );

  if (selectedItem) {
    const selectedItemId = selectedItem.itemId;
    const selectedItemImage = document.getElementById(selectedItemId);

    if (selectedItemImage) {
      selectedItemImage.src = newImageSrc;
    }
  }

  for (let i = 0; i < itemImages.length; i++) {
    const itemId = itemImages[i].id;
    if (itemId === newImageSrc) {
      itemImages[i].src = newImageSrc;
    }
  }

  console.log(newImageSrc, selectedItem.type);

  if (selectedItem.type === "hat") {
    document.querySelector("#hat").src = selectedItem.itemPicture;
  } else if (selectedItem.type === "coat") {
    document.querySelector("#coat").src = selectedItem.itemPicture;
  } else if (selectedItem.type === "ring") {
    document.querySelector("#ring").src = selectedItem.itemPicture;
  } else if (selectedItem.type === "amulet") {
    document.querySelector("#amulet").src = selectedItem.itemPicture;
  } else {
    console.log("Error. Kann kein Item finden.");
  }
}

function playItemCard() {
  // Generate a random number between 1 and 25
  const randomNum = Math.floor(Math.random() * 25) + 1;

  // Check if the random number is 1 (1/25 chance)
  if (randomNum === 1) {
    // Get a random item card from the itemCards array
    const randomCard = itemCards[Math.floor(Math.random() * itemCards.length)];

    // Apply the effects of the item card
    updateItems(randomCard.itemPicture);
    itemTitle = randomCard.title;
    console.log(itemTitle);

    // Filter the item types
    const filteredItem = itemCards.filter(
      (item) => item.type === randomCard.type
    );
    if (filteredItem.length > 0) {
      // Update the display
      updateDisplay();

      // Assign the item picture to the corresponding ID
      if (filteredItem[0].type === "hat") {
        factorHat = filteredItem[0].itemEffect;
        titleHat = filteredItem[0].title;
        descriptionHat = filteredItem[0].description;
      } else if (filteredItem[0].type === "coat") {
        factorCoat = filteredItem[0].itemEffect;
        titleCoat = filteredItem[0].title;
        descriptionCoat = filteredItem[0].description;
      } else if (filteredItem[0].type === "ring") {
        factorRing = filteredItem[0].itemEffect;
        titleRing = filteredItem[0].title;
        descriptionRing = filteredItem[0].description;
      } else if (filteredItem[0].type === "amulet") {
        factorAmulet = filteredItem[0].itemEffect;
        titleAmulet = filteredItem[0].title;
        descriptionAmulet = filteredItem[0].description;
      }
    } else {
      console.log("Error. No item found.");
    }
  }
}

document
  .querySelector("#hat")
  .addEventListener("click", handleHatItemButtonClick);

function handleHatItemButtonClick() {
  alert(`Effect: ${titleHat} ${descriptionHat}`);

  // Handle the item effect
  bottlesCollected *= factorHat;

  // Reset factor
  factorHat = 1;

  // Reset img
  document.querySelector("#hat").src = "items/default.jpg";

  // Reset alert title and description
  titleHat = "no item";
  descriptionHat = "";

  // Update the display
  updateDisplay();
}

document
  .querySelector("#coat")
  .addEventListener("click", handleCoatItemButtonClick);

function handleCoatItemButtonClick() {
  alert(`Effect: ${titleCoat} ${descriptionCoat}`);

  // Handle the item effect
  bottlesCollected *= factorCoat;

  // Reset factor
  factorCoat = 1;

  // Reset img
  document.querySelector("#coat").src = "items/default.jpg";

  // Reset alert title and description
  titleCoat = "no item";
  descriptionCoat = "";

  // Update the display
  updateDisplay();
}

document
  .querySelector("#ring")
  .addEventListener("click", handleRingItemButtonClick);

function handleRingItemButtonClick() {
  alert(`Effect: ${titleRing} ${descriptionRing}`);

  // Handle the item effect
  coins *= factorRing;

  // Reset factor
  factorRing = 1;

  // Reset img
  document.querySelector("#ring").src = "items/default.jpg";

  // Reset alert title and description
  titleRing = "no item";
  descriptionRing = "";

  // Update the display
  updateDisplay();
}

document
  .querySelector("#amulet")
  .addEventListener("click", handleAmuletItemButtonClick);

function handleAmuletItemButtonClick() {
  alert(`Effect: ${titleAmulet} ${descriptionAmulet}`);

  // Handle the item effect
  coins *= factorAmulet;

  // Reset factor
  factorAmulet = 1;

  // Reset img
  document.querySelector("#amulet").src = "items/default.jpg";

  // Reset alert title and description
  titleAmulet = "no item";
  descriptionAmulet = "";

  // Update the display
  updateDisplay();
}

// Add event listener to the story button
if (food > 0) {
  document
    .querySelector("#storyButton")
    .addEventListener("click", handleStoryButtonClick);
}
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
