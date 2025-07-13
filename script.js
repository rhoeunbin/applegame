document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const GRID_HEIGHT = 10;
    const GRID_WIDTH = 16;
    let cells = [];
    let selectedCells = [];
    let currentSum = 0;
    let score = 0;
    let isDragging = false;
    let timer;
    let timeLeft = 60;

    function startGame() {
        stopGame();
        score = 0;
        updateScoreDisplay();
        createBoard();
        timeLeft = 60;
        updateTimerDisplay();
        timer = setInterval(updateTimer, 1000);
    }

    function stopGame() {
        clearInterval(timer);
    }

    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            stopGame();
            alert(`시간 초과! 최종 점수: ${score}점`);
            endGame();
        }
    }

    function updateTimerDisplay() {
        timerDisplay.innerHTML = `⏰ ${timeLeft}초`;
    }

    function updateScoreDisplay() {
        scoreDisplay.innerHTML = `🏆 ${score}`;
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        cells = [];
        for (let i = 0; i < GRID_HEIGHT * GRID_WIDTH; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const number = Math.floor(Math.random() * 9) + 1;
            cell.textContent = number;
            cell.dataset.value = number;
            cell.dataset.index = i;
            addEventListeners(cell);
            gameBoard.appendChild(cell);
            cells.push(cell);
        }
    }

    function addEventListeners(cell) {
        cell.addEventListener('mousedown', handleMouseDown);
        cell.addEventListener('mouseover', handleMouseOver);
        gameBoard.addEventListener('mouseup', handleMouseUp);
        gameBoard.addEventListener('mouseleave', handleMouseUp);
    }

    function handleMouseDown(e) {
        isDragging = true;
        const cell = e.target;
        if (cell.classList.contains('cell') && cell.style.visibility !== 'hidden') {
            toggleCellSelection(cell);
        }
    }

    function handleMouseOver(e) {
        if (isDragging) {
            const cell = e.target;
            if (cell.classList.contains('cell') && cell.style.visibility !== 'hidden') {
                toggleCellSelection(cell);
            }
        }
    }

    function handleMouseUp() {
        isDragging = false;
        resetSelection();
    }

    function toggleCellSelection(cell) {
        if (selectedCells.includes(cell)) {
            return;
        }

        const lastSelected = selectedCells[selectedCells.length - 1];
        if (lastSelected && !isValidConnection(lastSelected, cell)) {
            return;
        }

        selectedCells.push(cell);
        cell.classList.add('selected');
        currentSum += parseInt(cell.dataset.value);

        if (currentSum === 10) {
            score += 10;
            updateScoreDisplay();
            removeSelectedCells();
            isDragging = false;
        } else if (currentSum > 10) {
            resetSelection();
            isDragging = false;
        }
    }

    function isValidConnection(cell1, cell2) {
        const idx1 = parseInt(cell1.dataset.index);
        const idx2 = parseInt(cell2.dataset.index);
        const x1 = idx1 % GRID_WIDTH, y1 = Math.floor(idx1 / GRID_WIDTH);
        const x2 = idx2 % GRID_WIDTH, y2 = Math.floor(idx2 / GRID_WIDTH);

        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);

        // Condition A: Direct adjacency
        if (dx <= 1 && dy <= 1) {
            return true;
        }

        // Condition B: Clear linear path
        if (y1 === y2) { // Horizontal
            const start = Math.min(x1, x2) + 1;
            const end = Math.max(x1, x2);
            for (let i = start; i < end; i++) {
                if (cells[y1 * GRID_WIDTH + i].style.visibility !== 'hidden') return false;
            }
            return true;
        }
        if (x1 === x2) { // Vertical
            const start = Math.min(y1, y2) + 1;
            const end = Math.max(y1, y2);
            for (let i = start; i < end; i++) {
                if (cells[i * GRID_WIDTH + x1].style.visibility !== 'hidden') return false;
            }
            return true;
        }

        return false;
    }

    function removeSelectedCells() {
        selectedCells.forEach(cell => {
            cell.style.visibility = 'hidden';
        });
        checkGameWin();
        resetSelection(false);
    }

    function resetSelection(removeClass = true) {
        if (removeClass) {
            selectedCells.forEach(cell => cell.classList.remove('selected'));
        }
        selectedCells = [];
        currentSum = 0;
    }

    function checkGameWin() {
        const visibleCells = cells.filter(c => c.style.visibility !== 'hidden');
        if (visibleCells.length === 0) {
            stopGame();
            alert('축하합니다! 모든 사과를 없앴습니다!');
        }
    }

    function endGame() {
        isDragging = false;
    }

    newGameBtn.addEventListener('click', startGame);
    startGame();
});
