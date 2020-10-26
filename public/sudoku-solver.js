const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
});

let cells = document.querySelectorAll('.sudoku-input')
let validateRegex = /^[0-9.]*$/

let errorBox = document.querySelector('#error-msg')


let textBoxChanged = () => {
  errorBox.innerText = ''
  if(validateRegex.test(document.querySelector('#text-input').value) === false){
		return
	}
	if(textBox.value.length != 81){
    errorBox.innerText = 'Error: Expected puzzle to be 81 characters long.'
    return
  }
  let textBoxValues = document.querySelector('#text-input').value.split('')
  

	textBoxValues.forEach((value, index) => {
		cells[index].value = value
	})

		
	
}

document.querySelector('#text-input').oninput = textBoxChanged

let gridChanged = () => {
  errorBox.innerText = ''
	let cells = document.querySelectorAll('.sudoku-input')
	let textBoxString = ''
	cells.forEach((cell) => {
		textBoxString += cell.value.toString()
	})
	if(validateRegex.test(textBoxString) === false){
		return
	}
	document.querySelector('#text-input').value = textBoxString
}

let generateBoard = (values) => {
	let board = [[], [], [], [], [], [], [], [], []]

	let boardRow = -1
	let i
	for (i = 0; i < values.length; i++) {
		if(i % 9 === 0){
			boardRow = boardRow + 1
		}
		board[boardRow].push(values[i])
	}

	return board
}


let solvePressed = () => {

  let textBoxValues = document.querySelector('#text-input').value.split('')

	let originalBoard = generateBoard(textBoxValues)

	let solution = solveFromCell(originalBoard, 0, 0)

	if(solution === false){
		return
	}

	let i
	let j
	let solutionString = ''
	for(i = 0; i < solution.length; i++){
		for(j=0; j < solution[i].length; j++){
			solutionString += solution[i][j].toString()
		}
	}
	document.querySelector('#text-input').value = solutionString
	textBoxChanged()
	
}



let canPlace = (board, row, col, value) => {

	/* Check Column */
	let i
	for(i = 0; i < 9; i++){
		if(board[i][col] == value){
			return false
		}
	}

	/*Check Row */
	let j
	for(j=0; j < 9; j++){
		if(board[row][j] == value){
			return false
		}
	}

	/*Check Box Placement */
	let boxTopRow = parseInt(row / 3) * 3       // Returns index of top row of box (0, 3, or 6)
	let boxLeftColumn = parseInt(col / 3) * 3   // Returns index of left column of box (0, 3 or 6)

	let k // Looks through rows
	let l // Looks through columns
	for (k = boxTopRow; k < boxTopRow + 3; k++) {
		for(l = boxLeftColumn; l < boxLeftColumn + 3; l++){
			if(board[k][l] == value){
				return false
			}
		}
	}

	return true
}


document.querySelector('#solve-button').onclick = solvePressed




let solveFromCell = (board, row, col) =>{

	console.log('Attempting to solve row ' + (row + 1) + ', column ' + (col+1))

	/* If on column 9 (outside row), move to next row and reset column to zero */
	if(col === 9){
		col = 0
		row ++
	}

	/* If on row 9 (outside board), the solution is complete, so return the board */
	if(row === 9){
		return board
	}

	/* If already filled out (not empty) then skip to next column */
	if(board[row][col] != '.'){
		return solveFromCell(board, row, col + 1)
	}

	//* Try placing in values */

	// Start with 1 and check if okay to place in cell. If so,
	// run the algorithm from the next cell (col + 1), and see if
	// false is not returned. A returned board indicates true, since
	// a solution has been found. If false was returned, then empty out
	// the cell, and try with next value
	let i
	for(i = 1; i < 10; i ++){
		let valueToPlace = i.toString()
		console.log('Trying with ' + valueToPlace)
		if(canPlace(board, row, col, valueToPlace)){
			board[row][col] = valueToPlace
			if(solveFromCell(board, row, col + 1) != false){
				return board
			}else{
				board[row][col] = '.'
			}
		}
	}
	
	/* If not found a solution yet, return false */
	return false
}


document.querySelector('#clear-button').onclick = () => {
	textBox.value = ''
	cells.forEach((cell) => {
		cell.value = ''
	})
}


let cellDOMArray = document.querySelectorAll('.sudoku-input')
cellDOMArray.forEach((cellDOM) => {
	cellDOM.oninput = gridChanged
})

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {

  }
} catch (e) {}
