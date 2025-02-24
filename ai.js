class AI {
  constructor(grid) {
    this.grid = grid;
  }

  // Static evaluation function
  evaluate() {
    let emptyCells = this.grid.availableCells().length;
    const smoothWeight = 0.1,
          monoWeight = 1.0,
          emptyWeight = 2.7,
          maxWeight = 1.0;

    return this.grid.smoothness() * smoothWeight +
           this.grid.monotonicity() * monoWeight +
           Math.log(emptyCells + 1) * emptyWeight +
           this.grid.maxValue() * maxWeight;
  }

  // Alpha-beta depth-first search
  search(depth, alpha, beta, positions = 0, cutoffs = 0) {
    let bestMove = -1;
    let bestScore = this.grid.playerTurn ? alpha : beta;
    let result;

    if (this.grid.playerTurn) {
      for (let direction of [0, 1, 2, 3]) {
        let newGrid = this.grid.clone();
        if (newGrid.move(direction).moved) {
          positions++;
          if (newGrid.isWin()) return { move: direction, score: 10000, positions, cutoffs };
          let newAI = new AI(newGrid);
          result = depth === 0 ? { score: newAI.evaluate() } : newAI.search(depth - 1, bestScore, beta, positions, cutoffs);
          positions = result.positions;
          cutoffs = result.cutoffs;
          
          if (result.score > bestScore) {
            bestScore = result.score;
            bestMove = direction;
          }
          if (bestScore > beta) return { move: bestMove, score: beta, positions, cutoffs };
        }
      }
    } else { // AI simulates opponent (random tile placement)
      let candidates = [];
      for (let cell of this.grid.availableCells()) {
        let newGrid = this.grid.clone();
        newGrid.insertTile(new Tile(cell, 2));
        candidates.push({ position: cell, score: -newGrid.smoothness() + newGrid.islands() });
      }
      candidates.sort((a, b) => b.score - a.score);
      for (let candidate of candidates) {
        let newGrid = this.grid.clone();
        newGrid.insertTile(new Tile(candidate.position, 2));
        newGrid.playerTurn = true;
        positions++;
        let newAI = new AI(newGrid);
        result = newAI.search(depth, alpha, bestScore, positions, cutoffs);
        positions = result.positions;
        cutoffs = result.cutoffs;
        if (result.score < bestScore) bestScore = result.score;
        if (bestScore < alpha) return { move: null, score: alpha, positions, cutoffs };
      }
    }
    return { move: bestMove, score: bestScore, positions, cutoffs };
  }

  getBestMove() {
    return this.iterativeDeepening();
  }

  iterativeDeepening() {
    let startTime = Date.now(), depth = 0, bestMove;
    do {
      let result = this.search(depth, -10000, 10000);
      if (result.move === -1) break;
      bestMove = result;
      depth++;
    } while (Date.now() - startTime < 1000);
    return bestMove;
  }
}
