const fridge = document.getElementById('refrigerator-area');
const wordPool = document.getElementById('word-pool');

// --- 1. WORD DATA ---
const initialWords = [
    "the", "a", "is", "was", "will", "i", "you", "we", "he", "she", "it",
    "dream", "ocean", "cat", "dog", "moon", "star", "silent",
    "happy", "sing", "fly", "imagine", "beautiful", "sky", "always",
    "sometimes", "never", "tomorrow", "yesterday", "love", "hate", "machine"
];

let draggedElement = null;

// --- 2. INITIALIZATION ---
function createTiles() {
    initialWords.sort(() => Math.random() - 0.5).forEach(word => {
        const tile = document.createElement('div');
        tile.classList.add('word-tile');
        tile.textContent = word;
        tile.setAttribute('draggable', true);
        wordPool.appendChild(tile);
    });
}

// --- 3. DRAG START EVENT (on the word tile) ---
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('word-tile')) {
        draggedElement = e.target;
        e.dataTransfer.setData('text/plain', e.target.textContent);
    }
});

// --- 4. DRAG OVER EVENT (on the fridge area) ---
fridge.addEventListener('dragover', (e) => {
    e.preventDefault(); 
});

// --- 5. DROP EVENT (on the fridge area) ---
fridge.addEventListener('drop', (e) => {
    e.preventDefault();
    
    if (draggedElement && draggedElement.classList.contains('word-tile')) {
        const prompt = fridge.querySelector('.poem-prompt');
        if (prompt) { prompt.remove(); }
        
        fridge.appendChild(draggedElement);
        
        // Remove old positioning styles (NEW)
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        
        // Random Rotation is still applied using transform! (Keep this line from our previous feature)
        const randomAngle = Math.floor(Math.random() * 11) - 5; 
        draggedElement.style.transform = `rotate(${randomAngle}deg)`;
        
        draggedElement = null; 
    }
});

// --- 6. DRAG OVER EVENT (on the word pool) ---
wordPool.addEventListener('dragover', (e) => {
    e.preventDefault(); 
});

// --- 7. DROP EVENT (on the word pool) ---
wordPool.addEventListener('drop', (e) => {
    e.preventDefault();
    
    if (draggedElement && draggedElement.classList.contains('word-tile')) {
        // Append the word back to the word pool
        wordPool.appendChild(draggedElement);
        
        // Clear all inline styling (position and rotation) (NEW)
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.transform = '';

        draggedElement = null;
    }
});

// Run the initialization function
createTiles();
