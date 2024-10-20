import React, { useState, Fragment } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={highlight ? "square highlight" : "square"} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, locationList, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    if (i < 3) {
      locationList.push(' (row: ' + 1 + ', col: ' + (i + 1) + ')');
    } else if (i >= 3 && i < 6) {
      locationList.push(' (row: ' + 2 + ', col: ' + (i - 2) + ')');
    } else {
      locationList.push(' (row: ' + 3 + ', col: ' + (i - 5) + ')');
    }

    onPlay(nextSquares, locationList, i);
  }

  const winner = calculateWinner(squares).winner;
  const winningLine = calculateWinner(squares).line;
  let status;

  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!squares.includes(null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  let groupedSquares = [];
  let row = [];
  let squareNumber = 1;
  for (let i = 0; i < squares.length; i++) {
    row.push(
      <Square
        key={i}
        highlight={winningLine && winningLine.includes(i)}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
      />
    );
    squareNumber++;

    if (squareNumber === 4) {
      groupedSquares.push(<div key={i} className="board-row">{row}</div>);
      squareNumber = 1;
      row = [];
    }
  }

  return (
    <Fragment>
      <div className="status">{status}</div>
      {groupedSquares}
    </Fragment>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAsc, setSortAsc] = useState(true);
  const [locationList, setLocationList] = useState([]);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, locationList, idx) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setLocationList(locationList);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSort() {
    setSortAsc(!sortAsc);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = (move === currentMove ? 'You are on ' : 'Go to ') + 'move #' + move + locationList[move - 1];
    } else {
      description = (move === currentMove ? 'You are on game start' : 'Go to game start');
    }

    return (
      <li key={move}>
        {
          move === currentMove ? (
            <span className='list-text'>{description}</span>
          ) : (
            <button className='list-button' onClick={() => { jumpTo(move) }}>{description}</button>
          )
        }
      </li>
    );
  });

  return (
    <div className="game">
      <h1>
        <span className='title'>Tic</span>
        <span className='title dash'>-</span>
        <span className='title'>tac</span>
        <span className='title dash'>-</span>
        <span className='title'>toe</span>
      </h1>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} locationList={locationList} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className='sort-button' disabled={currentMove === 0 && !locationList.length} onClick={handleSort}>{sortAsc ? 'Sort descending' : 'Sort ascending'}</button>
        <ul>{sortAsc ? moves : moves.reverse()}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i]
      }
    }
  }
  return {
    winner: null
  };
}
