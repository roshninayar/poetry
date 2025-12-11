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

const ROW_HEIGHT = 30; // Define the height of each straight row (in pixels)

// --- 5. DROP EVENT (on the fridge area) ---
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
        // Calculate the nearest multiple of ROW_HEIGHT
        const snappedTop = Math.round(rawTop / ROW_HEIGHT) * ROW_HEIGHT;
        
        // Ensure the word stays within the bounds
        const finalTop = Math.max(0, snappedTop); 
        
        // 3. Apply Positioning
        draggedElement.style.left = rawLeft + 'px';
        draggedElement.style.top = finalTop + 'px'; 

        // ----------------------------------------------------
        // REMOVED CODE: 
        // const randomAngle = Math.floor(Math.random() * 11) - 5; 
        // draggedElement.style.transform = `rotate(${randomAngle}deg)`;
        // ----------------------------------------------------
        
        // IMPORTANT: Ensure the word is straight when returning from the pool.
        // If the word was previously rotated, we need to explicitly set transform to none.
        draggedElement.style.transform = 'none'; 

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
