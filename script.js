document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("game-board");
    const ctx = canvas.getContext("2d");
    const aiButton = document.getElementById("ai-move");

    canvas.width = 400;
    canvas.height = 400;

    let grid = new Grid(4); // 4x4 game grid
    let ai = new AI(grid);

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let cellSize = canvas.width / 4;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                let value = grid.cells[row][col] ? grid.cells[row][col].value : 0;
                ctx.fillStyle = value ? "orange" : "lightgray";
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
                if (value) {
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.fillText(value, col * cellSize + cellSize / 2 - 10, row * cellSize + cellSize / 2 + 5);
                }
            }
        }
    }

    drawBoard();

    aiButton.addEventListener("click", function () {
        let bestMove = ai.getBest().move;
        if (bestMove !== -1) {
            grid.move(bestMove);
            drawBoard();
        }
    });
});
