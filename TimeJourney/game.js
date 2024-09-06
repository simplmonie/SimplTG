// Era background images
const eraBackgrounds = {
    'Ancient Egypt': 'https://example.com/ancient-egypt-bg.jpg',
    'Medieval Europe': 'https://example.com/medieval-europe-bg.jpg',
    'Renaissance': 'https://example.com/renaissance-bg.jpg',
    'Industrial Revolution': 'https://example.com/industrial-revolution-bg.jpg',
    'Modern Era': 'https://example.com/modern-era-bg.jpg'
};

// Initializing game state variables
let timeFragments = 10;  // Initial boost
let kairosTokens = 0;
let chronosTokens = 0;
let aionTokens = 0;
let knowledge = 0;
let gadgetry = 0;
let currentEra = 'Modern Era';

// Historical events for each era
const historicalEvents = {
    'Ancient Egypt': [
        { name: 'Building of the Great Pyramid', year: '2560 BCE', description: 'The Great Pyramid of Giza is constructed as a tomb for Pharaoh Khufu.' },
        { name: 'Reign of Cleopatra', year: '51-30 BCE', description: 'Cleopatra, the last active ruler of the Ptolemaic Kingdom of Egypt, reigns.' }
    ],
    'Medieval Europe': [
        { name: 'Signing of the Magna Carta', year: '1215', description: 'King John of England signs the Magna Carta, limiting the power of the monarchy.' },
        { name: 'The Crusades', year: '1095-1291', description: 'A series of religious wars between Christians and Muslims centered around the Holy Land.' }
    ],
    'Renaissance': [
        { name: 'Leonardo da Vinci paints the Mona Lisa', year: 'c. 1503-1506', description: 'Leonardo da Vinci begins painting the Mona Lisa, one of the most famous paintings in the world.' },
        { name: 'Gutenberg invents the printing press', year: 'c. 1440', description: 'Johannes Gutenberg invents the movable-type printing press, revolutionizing the spread of information.' }
    ],
    'Industrial Revolution': [
        { name: 'James Watt improves the steam engine', year: '1769', description: 'James Watt patents an improved version of the steam engine, crucial to the Industrial Revolution.' },
        { name: 'First Transcontinental Railroad completed', year: '1869', description: 'The First Transcontinental Railroad is completed in the United States, linking the east and west coasts.' }
    ],
    'Modern Era': [
        { name: 'World War II', year: '1939-1945', description: 'The deadliest and most destructive war in history, involving most of the world\'s nations.' },
        { name: 'Moon Landing', year: '1969', description: 'Neil Armstrong becomes the first human to step on the Moon during the Apollo 11 mission.' }
    ]
};

// Puzzle questions for each era
const puzzles = {
    'Ancient Egypt': { question: 'What was the primary purpose of the pyramids?', answer: 'tombs' },
    'Medieval Europe': { question: 'What document limited the power of the king in 1215?', answer: 'magna carta' },
    'Renaissance': { question: 'Who painted the Mona Lisa?', answer: 'leonardo da vinci' },
    'Industrial Revolution': { question: 'What invention is James Watt known for?', answer: 'steam engine' },
    'Modern Era': { question: 'In what year did humans first land on the moon?', answer: '1969' }
};

// Initialize the game
function initializeGame() {
    updateGameState();
}

// Update game state
function updateGameState() {
    document.getElementById('time-fragments').textContent = timeFragments;
    document.getElementById('knowledge').textContent = knowledge;
    document.getElementById('gadgetry').textContent = gadgetry;
    document.getElementById('current-era').textContent = "Current Era: " + currentEra;
    
    updateResourceWithAnimation('time-fragments');
    updateResourceWithAnimation('knowledge');
    updateResourceWithAnimation('gadgetry');
}

// Update resource display with animation
function updateResourceWithAnimation(resourceId) {
    const element = document.getElementById(resourceId);
    element.classList.add('glow');
    setTimeout(() => {
        element.classList.remove('glow');
    }, 2000);
}

// Update the timeline display
function updateTimeline() {
    const timelineEvents = document.getElementById('timeline-events');
    timelineEvents.innerHTML = '';  // Clear existing events

    Object.entries(historicalEvents).forEach(([era, events]) => {
        const eraElement = document.createElement('div');
        eraElement.innerHTML = `<strong>${era}</strong>`;
        eraElement.className = 'timeline-event';
        eraElement.onclick = () => timeTravel(era);
        timelineEvents.appendChild(eraElement);
        
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.textContent = `- ${event.name} (${event.year})`;
            eventElement.className = 'timeline-event';
            eventElement.onclick = () => showEventDetails(era, event);
            timelineEvents.appendChild(eventElement);
        });
    });
}

// Show event details in an alert
function showEventDetails(era, event) {
    alert(`${event.name}\nYear: ${event.year}\n\n${event.description}`);
}

// Time travel to a selected era
function timeTravel(era) {
    if (kairosTokens >= 1) {
        kairosTokens -= 1;
        currentEra = era;
        document.getElementById('current-era').textContent = "Current Era: " + currentEra;
        document.getElementById('event-description').textContent = "You've traveled to " + currentEra + ". What will you do in this new time period?";
        document.body.style.backgroundImage = `url(${eraBackgrounds[era]})`;
        alert("You've time traveled to " + currentEra + "!");
        updateGameState();
    } else {
        alert("Not enough Kairos Tokens to time travel.");
    }
}

// Solve a puzzle
function solveGPuzzle() {
    if (knowledge >= 5) {
        const puzzle = puzzles[currentEra];
        const playerAnswer = prompt(puzzle.question).toLowerCase();
        if (playerAnswer === puzzle.answer) {
            knowledge -= 5;
            timeFragments += 10;
            chronosTokens += 1;
            alert("Correct! You gained 10 Time Fragments and 1 Chronos Token.");
        } else {
            alert("Incorrect. Try again after gathering more knowledge.");
        }
        updateGameState();
    } else {
        alert("Not enough Knowledge to solve the puzzle.");
    }
}

// Mine tokens based on resources
function mineTokens() {
    if (timeFragments >= 10) {
        timeFragments -= 10;
        let miningPower = gadgetry + knowledge;
        let tokensMined = Math.floor(Math.random() * (miningPower / 10)) + 1;
        let tokenType = Math.random();
        let message = "";

        if (tokenType < 0.4) {
            chronosTokens += tokensMined;
            message = `You mined ${tokensMined} Chronos Token(s)!`;
        } else if (tokenType < 0.7) {
            kairosTokens += tokensMined;
            message = `You mined ${tokensMined} Kairos Token(s)!`;
        } else {
            aionTokens += tokensMined;
            message = `You mined ${tokensMined} Aion Token(s)!`;
        }

        alert(message);
        updateGameState();
    } else {
        alert("Not enough Time Fragments to mine tokens.");
    }
}

// Toggle inventory visibility
function toggleInventory() {
    const inventorySection = document.getElementById('inventory');
    const display = inventorySection.style.display;
    switchSection(display === 'none' || display === '' ? 'inventory' : 'main-area');
}

// Add an item to the inventory
function addToInventory(item) {
    inventory.push(item);
    updateInventoryDisplay();
}

// Update inventory display
function updateInventoryDisplay() {
    const inventoryElement = document.getElementById('inventory');
    inventoryElement.innerHTML = '<h3>Inventory</h3>';
    inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = item;
        inventoryElement.appendChild(itemElement);
    });
}

// Gather clues and possibly find items
function gatherClue() {
    gadgetry += 1;
    knowledge += 2;
    aionTokens += 1;
    
    const items = ['Ancient Scroll', 'Mysterious Artifact', 'Futuristic Gadget', 'Historical Document', 'Antique Coin'];
    if (Math.random() < 0.3) {  // 30% chance to find an item
        const item = items[Math.floor(Math.random() * items.length)];
        addToInventory(item);
        alert(`You gathered a clue and found a ${item}!`);
    } else {
        alert("You gathered a clue!");
    }
    
    updateGameState();
}

// Switch between sections of the game
function switchSection(sectionId) {
    const sections = ['timeline', 'main-area', 'inventory'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (section === sectionId) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

// Grant daily reward on login
function grantDailyReward() {
    const fragmentsFound = Math.floor(Math.random() * 5) + 1;  // Random number between 1 and 5
    timeFragments += fragmentsFound;
    knowledge += Math.floor(Math.random() * 3) + 1;  // Random number between 1 and 3
    alert(`You explored the era and found ${fragmentsFound} Time Fragments and gained knowledge!`);
    updateGameState();
}

// Initialize the game when the page loads
window.onload = function() {
    grantDailyReward();
    updateTimeline();
    initializeGame();
};
