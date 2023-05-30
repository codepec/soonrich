// Initialize game variables
let bottles = 0;
let coins = 0;
let experience = 1;
let level = 1;
let food = 90;
let bottlesCollected = 0;

const eventCards = [
  {
    type: "weakness",
    title: "Drinking Party",
    description:
      "A wild night of partying awaits you! Experience +100 and Food -50%. Let loose, dance, and drink until the sun comes up. But be warned, the next morning might not be so pleasant.",
    experience: 100,
    food: -50,
  },
  {
    type: "strength",
    title: "Lucky Find",
    description: "You are a lucky person and find +100 bottles!",
    bottlesCollected: 100,
    bottles: 100,
  },
  {
    type: "strength",
    title: "Meet Colleagues",
    description: "You meet your colleagues and collect +50 bottles!",
    bottlesCollected: 50,
    bottles: 50,
  },
  {
    type: "weakness",
    title: "Rat Bite",
    description: "You were bitten by a rat! Food -20% and a risk of infection.",
    experience: 10,
    food: -20,
  },
  {
    type: "weakness",
    title: "Glass Shard Injury",
    description:
      "You accidentally cut yourself on a glass shard. Food -20% and a painful wound.",
    experience: 10,
    food: -20,
  },
  {
    type: "weakness",
    title: "Tick Bite",
    description:
      "You got bitten by a tick! Food -20% and a possibility of contracting a disease.",
    experience: 10,
    food: -20,
  },
  {
    type: "weakness",
    title: "Dog Bite",
    description:
      "A dog bit you while collecting bottles. Food -20% and a deep wound.",
    experience: 10,
    food: -20,
  },
  {
    type: "weakness",
    title: "Slipped on a Banana Peel",
    description: "You slipped on a banana peel! Food -20% and a bruised ego.",
    experience: 10,
    food: -20,
  },
  {
    type: "weakness",
    title: "Mugged",
    description:
      "You were mugged while collecting bottles. Food -20% and all your collected bottles were taken.",
    experience: 10,
    food: -20,
  },
  {
    type: "strength",
    title: "Helping Hand",
    description: "A kind stranger helps you and gives you +50 bottles!",
    bottlesCollected: 50,
    bottles: 50,
  },
  {
    type: "strength",
    title: "Hidden Treasure",
    description: "You stumble upon a hidden treasure and collect +100 bottles!",
    bottlesCollected: 100,
    bottles: 100,
  },
  {
    type: "strength",
    title: "Generous Donation",
    description: "Someone donates +200 bottles to your collection!",
    bottlesCollected: 200,
    bottles: 200,
  },
  {
    type: "strength",
    title: "Community Support",
    description:
      "The local community rallies behind you and donates +500 bottles!",
    bottlesCollected: 500,
  },

  // Add more event cards here
];

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

const storyCards = [
  {
    type: "story",
    title: "Einleitung",
    description:
      "In einer kleinen Stadt lebte ein bescheidener Flaschensammler namens Emil. Tag für Tag durchstreifte er die Straßen, auf der Suche nach leeren Flaschen, die er gegen ein paar Münzen eintauschen konnte. Emil war bekannt für seine Ausdauer und Hartnäckigkeit. Obwohl sein Leben einfach war, träumte er insgeheim von aufregenden Abenteuern und neuen Begegnungen.",
    requirement: "1",
  },
  {
    type: "story",
    title: "Erste Begegnung im Hinterhof",
    description:
      "Eines Tages, als Emil in einem abgelegenen Hinterhof nach Flaschen suchte, hörte er ein Geräusch hinter einer alten Holzkiste. Neugierig ging er näher heran und entdeckte eine Gruppe von Kindern, die sich dort versteckt hatten. Sie hatten einen geheimen Club gegründet und waren fasziniert von Emils Sammlung leerer Flaschen. Emil teilte seine Geschichten über das Sammeln von Flaschen und begeisterte die Kinder. Sie schlossen ihn in ihre Gemeinschaft ein und wurden zu treuen Begleitern auf seinen Abenteuern.",
    requirement: "5",
  },
  {
    type: "story",
    title: "Aufführung auf dem Marktplatz",
    description:
      "Die Kinder hatten eine brillante Idee: Sie wollten eine Aufführung auf dem belebten Marktplatz organisieren, um Geld für wohltätige Zwecke zu sammeln. Emil war zunächst zögerlich, aber die Begeisterung der Kinder steckte ihn an. Sie probten eifrig und entwickelten eine erstaunliche Darbietung, die die Herzen der Menschen berührte. Emil wurde zu ihrem größten Unterstützer und half dabei, die Aufführung zu organisieren. Die Menschen auf dem Marktplatz waren von der Leidenschaft und dem Talent der Kinder beeindruckt und spendeten großzügig für den guten Zweck.",
    requirement: "8",
  },
  {
    type: "story",
    title:
      "Halt und Zuversicht für ein neues Leben durch seine drei neuen Freunde",
    description:
      "Während Emil mit den Kindern auf seinen Abenteuern unterwegs war, wurde er von ihrer Energie und ihrem Optimismus inspiriert. Er erzählte ihnen von seinen persönlichen Herausforderungen und seinem Wunsch nach einem besseren Leben. Die Kinder versprachen, ihm zu helfen, und sie begannen, gemeinsam nach Lösungen zu suchen. Durch ihre Kontakte und Bemühungen gelang es ihnen, Emil eine Anstellung in einem nahegelegenen Recyclingunternehmen zu verschaffen. Emil fand nicht nur eine neue berufliche Perspektive, sondern auch Halt und Zuversicht für ein neues Leben durch seine drei neuen Freunde. Emil lernte, dass wahre Schätze nicht immer aus materiellen Dingen bestehen. Durch sein Engagement und seine Begeisterung für das Sammeln von Flaschen hatte er wertvolle Begegnungen und eine Gemeinschaft von mitfühlenden Menschen gefunden. Zusammen erlebten sie spannende Abenteuer, die Emils Leben bereicherten und ihm zeigten, dass man manchmal mehr erreichen kann, wenn man gemeinsam an einem Strang zieht. Diese Geschichte erzählt von Emils Reise als Flaschensammler und den wunderbaren Menschen, die sein Leben bereicherten. Sie zeigt, wie kleine Taten der Freundlichkeit und Mitmenschlichkeit große Veränderungen bewirken können und dass manchmal die einfachsten Dinge die größten Schätze bergen.",
    requirement: "12",
  },
  // Add more event cards here
];

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
  // Calculate the experience required for the next level
  const nextLevelXP = (level + 1) * 100;

  // Calculate the remaining experience until the next level
  const remainingXP = nextLevelXP;

  return remainingXP;
}

// Function to update the level based on experience points
function updateLevel() {
  if (experience >= 100 && experience < 200) {
    level = 2;
  } else if (experience >= 200 && experience < 300) {
    level = 3;
  } else if (experience >= 300 && experience < 500) {
    level = 4;
  } else if (experience >= 500 && experience < 1000) {
    level = 5;
  } else if (experience >= 1000 && experience < 2000) {
    level = 6;
  } else if (experience >= 2000 && experience < 3000) {
    level = 7;
  } else if (experience >= 3000 && experience < 4000) {
    level = 8;
  } else if (experience >= 4000 && experience < 5000) {
    level = 9;
  } else if (experience >= 5000 && experience < 6000) {
    level = 10;
  } else if (experience >= 6000 && experience < 7000) {
    level = 11;
  } else if (experience >= 10000) {
    level = 12;
  }
  // Update the profile picture
  updateProfilePicture();
}

// Function to handle collecting experience points
function collectExperiencePoints(points) {
  // Increase the experience points
  experience += points;

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
