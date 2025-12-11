const fridge = document.getElementById('refrigerator-area');
const wordPool = document.getElementById('word-pool');
const ROW_HEIGHT = 30; // Height for snapping tiles to a straight line
let draggedElement = null;

// Function to convert CSV text into an array of words
function parseWords(csvText) {
    // 1. Use a robust regex to split lines, handling different line endings (\r\n, \r, or \n)
    const lines = csvText.split(/[\r\n]+/).filter(line => line.trim() !== '');
    
    // The first line is the header row; subsequent lines are data
    const dataLines = lines.slice(1);
    
    let allWords = [];

    dataLines.forEach(line => {
        // Split the line into columns (cells)
        // Note: This simple split works well for CSVs without commas inside the data
        const cells = line.split(','); 
        
        // Iterate through every cell (column) in the row
        cells.forEach(cell => {
            let word = cell.trim();

            // 2. CRITICAL FIX: Remove potential surrounding quotation marks 
            // that are often added by spreadsheet programs during export.
            if (word.startsWith('"') && word.endsWith('"')) {
                word = word.substring(1, word.length - 1);
            }
            
            // Only add the word if it is not an empty string
            if (word.length > 0) {
                allWords.push(word);
            }
        });
    });
    
    // Optional: Log the final word count to the browser console to confirm
    console.log(`Successfully loaded ${allWords.length} words from CSV.`);
    
    return allWords;
}
// (Keep all other functions below this one unchanged)

// Function to fetch the CSV file and start the page setup
async function loadWordsAndCreateTiles() {
    try {
        // CRITICAL: Fetching the file by its exact name
        const response = await fetch('Borderline Poetry - Individual words.csv'); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - File not found.`);
        }
        
        const csvText = await response.text();
        
        // Parse the CSV text into our clean word array
        const finalWords = parseWords(csvText);
        
        // Create the tiles using the words from the CSV
        createTiles(finalWords);

    } catch (error) {
        console.error("Could not load the word list:", error);
        wordPool.innerHTML = 'Error loading word list. Check console for details.';
    }
}

// Function to create the HTML tiles and populate the word pool
function createTiles(wordsArray) {
    // Sort words randomly before creating them
    wordsArray.sort(() => Math.random() - 0.5).forEach(word => {
        const tile = document.createElement('div');
        tile.classList.add('word-tile');
        tile.textContent = word;
        
        tile.setAttribute('draggable', true);
        
        wordPool.appendChild(tile);
    });
}

// --- DRAGSTART EVENT (on the word tile) ---
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('word-tile')) {
        draggedElement = e.target;
        e.dataTransfer.setData('text/plain', e.target.textContent);
    }
});

// --- DRAG OVER EVENT (on the fridge area) ---
fridge.addEventListener('dragover', (e) => {
    e.preventDefault(); 
});

// --- DROP EVENT (on the fridge area - Snap-to-Row Logic) ---
fridge.addEventListener('drop', (e) => {
    e.preventDefault();
    
    if (draggedElement && draggedElement.classList.contains('word-tile')) {
        const prompt = fridge.querySelector('.poem-prompt');
        if (prompt) { prompt.remove(); }
        
        fridge.appendChild(draggedElement);
        
        // 1. Set the position
        draggedElement.style.position = 'absolute';
        
        const rect = fridge.getBoundingClientRect();
        
        // Calculate raw drop coordinates relative to the fridge
        const rawLeft = e.clientX - rect.left - (draggedElement.offsetWidth / 2);
        const rawTop = e.clientY - rect.top - (draggedElement.offsetHeight / 2);

        // 2. Snap to Row Logic
        const snappedTop = Math.round(rawTop / ROW_HEIGHT) * ROW_HEIGHT;
        const finalTop = Math.max(0, snappedTop); 
        
        // 3. Apply Positioning (horizontal freedom, vertical snap)
        draggedElement.style.left = rawLeft + 'px';
        draggedElement.style.top = finalTop + 'px'; 
        draggedElement.style.transform = 'none'; // Ensure no rotation
        
        draggedElement = null; 
    }
});

// --- DRAG OVER EVENT (on the word pool - for returning words) ---
wordPool.addEventListener('dragover', (e) => {
    e.preventDefault(); 
});

// --- DROP EVENT (on the word pool - to return a word) ---
wordPool.addEventListener('drop', (e) => {
    e.preventDefault();
    
    if (draggedElement && draggedElement.classList.contains('word-tile')) {
        // Append the word back to the word pool
        wordPool.appendChild(draggedElement);
        
        // Clear all inline styling (position and rotation)
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.transform = '';

        draggedElement = null;
    }
});


// ----------------------------------------------------
// START APPLICATION
// ----------------------------------------------------
loadWordsAndCreateTiles();
