class Grid {
    constructor(size) {
        this.size = size;
        this.cells = this.emptyGrid();
        this.addRandomTile();
        this.addRandomTile();
    }

    emptyGrid() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(null));
    }

    availableCells() {
        let cells = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (!this.cells[row][col]) {
                    cells.push({ x: row, y: col });
                }
            }
        }
        return cells;
    }

    addRandomTile() {
        let cells = this.availableCells();
        if (cells.length > 0) {
            let { x, y } = cells[Math.floor(Math.random() * cells.length)];
            this.cells[x][y] = new Tile(2);
        }
    }

    move(direction) {
        // Implement movement logic (left, right, up, down)
        return { moved: true };
    }

    clone() {
        let newGrid = new Grid(this.size);
        newGrid.cells = this.cells.map(row => row.map(cell => cell ? new Tile(cell.value) : null));
        return newGrid;
    }

    isWin() {
        return this.cells.flat().some(tile => tile && tile.value === 2048);
    }

    maxValue() {
        return Math.max(...this.cells.flat().map(tile => (tile ? tile.value : 0)));
    }
}
