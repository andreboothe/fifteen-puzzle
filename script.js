
let puzzle = document.querySelectorAll('.cell');
let winNodeList = [];
let backPiece = [];
let matrix = [];

const shuffleBtn = document.querySelector('#shuffle');


const loadPuzzle = () => {
    let row = 0, right = 0, top = 0;

    for (let i = 0;i < puzzle.length-1; i++){
        puzzle[i].classList.add("cell");
        puzzle[i].style.float = "left";
        puzzle[i].style.backgroundSize = "400px 400px";
        
        backPiece[i] = [];
        backPiece[i][0] = right;
        backPiece[i][1] = top;

        puzzle[i].style.backgroundPosition = "-"+backPiece[i][0]+"px -"+backPiece[i][1]+"px";
        row ++;
        if (row === 4)
        {
            top += 100; right = 0; row = 0; 
        } 
        else {
            right +=100
        }
    }
    
    matrix = to4x4Matrix(puzzle);
    copyNodes();
    
}




//converts a node list to its 4 x 4 matrix equivalent
const to4x4Matrix = (nodeList) => {
    let result = [];
    let row = [];
    let nodeIndex = 0;
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            row.push(nodeList[nodeIndex]);
            nodeIndex++;
        }
        result.push(row);
        row = [];
    }
    return result;
}

//swaps two puzzle pieces given an index value
const swapPieces = (index1, index2) => {
    let cloneA = matrix[index1[0]][index1[1]].cloneNode(true);
    let cloneB = matrix[index2[0]][index2[1]].cloneNode(true);

    matrix[index1[0]][index1[1]].parentNode.replaceChild(cloneB, matrix[index1[0]][index1[1]]);
    matrix[index2[0]][index2[1]].parentNode.replaceChild(cloneA, matrix[index2[0]][index2[1]]);


}

//
const copyNodes= () => {
    puzzle.forEach(node => winNodeList.push(node.cloneNode(true)));
}

//
const swapNode = (node1, node2) => {
    let cloneA = node1.cloneNode(true);
    let cloneB = node2.cloneNode(true);

    node1.parentNode.replaceChild(cloneB, node1);
    node2.parentNode.replaceChild(cloneA, node2);
}

//
const cellfourByFourIndex = (fourByFour, node) => {
    let rowIndex = 0;
    let colIndex = 0;
    let result = [];
    fourByFour.forEach( row => {
        // debugger;
        row.forEach( ele => {
            
            if(node.isSameNode(ele)) result.push(rowIndex,colIndex);
            colIndex++;
        });
        rowIndex++;
        colIndex = 0;

    });
    return result;
}

//
const emptyCellIndex = (fourByFour) => {
    let rowIndex = 0;
    let colIndex = 0;
    let result = [];
    fourByFour.forEach( row => {
        row.forEach( node  => {
            let contains = node.classList.contains('empty-cell');
            if(contains) result.push(rowIndex,colIndex);
            colIndex++;
        });
        rowIndex++;
        colIndex = 0;
    });
    return result;
}

//returns the absolute difference of 2 numbers
const diff = (a, b) => {
    return Math.abs(a - b);
}

//returns true or false if a pieces is moveable
const isMoveAble = (fourByFour, node) => {
    let emptyIndex = emptyCellIndex(fourByFour);
    let nodeIndex = cellfourByFourIndex(fourByFour, node);

    let rowAdjacent = (diff(emptyIndex[0],nodeIndex[0]) == 1)?true: false;
    let colAdjacent = (diff(emptyIndex[1],nodeIndex[1]) == 1)?true: false;
    // debugger;
    let rowSame = (diff(emptyIndex[0],nodeIndex[0]) == 0)?true: false;
    let colSame = (diff(emptyIndex[1],nodeIndex[1]) == 0)?true: false;

    return (rowAdjacent && colSame)?true:
            (colAdjacent && rowSame)?true:false;
}

//swaps pieces if cell is moveable
const moveCell = () => {
    // console.log(event.target);
    // console.log(puzzle[0].isSameNode(event.target));
    
    if(isMoveAble(matrix, event.target)){
        let emptyIndex = emptyCellIndex(matrix);
        let nodeIndex = cellfourByFourIndex(matrix, event.target);
        swapPieces(emptyIndex, nodeIndex);
        
    }
    
    reform();
    if(winningCondition()) setTimeout(() => alert('you win!'),100);
        
    
}

//
const reform = () => {
    puzzle = document.querySelectorAll('.cell');
    puzzle.forEach( cell => cell.addEventListener('click', moveCell) );
    matrix = to4x4Matrix(puzzle);
}

//
const shufflePuzzle = () => {
    
    for (let i = puzzle.length - 1; i > 0; i--) {
        
        const j = Math.floor(Math.random() * i );
        
        swapNode(puzzle[i],puzzle[j]);
        puzzle = document.querySelectorAll('.cell');
    }

    reform();
}

//
const winningCondition = () => {
    console.log(puzzle[0].textContent);
    for(let i = 0; i < puzzle.length - 1; i++){
        
        //let number = puzzle[i].textContent;
        //console.log(number);
        if(puzzle[i].textContent != i + 1 ) return false;
    }
    return true;
}

window.addEventListener("load", loadPuzzle);
puzzle.forEach( cell => cell.addEventListener('click', moveCell) );
shuffleBtn.addEventListener('click', shufflePuzzle);