
let puzzle = document.querySelectorAll('.cell');
let winNodeList = [];
let backPiece = [];
let matrix = [];
let shuffled = false;
const shuffleBtn = document.querySelector('#shuffle');


const loadPuzzle = () => {
   
    if(window.innerWidth > 550){
        imageDivider(100);
    }
    else{
        
        imageDivider(90);
    }
    
    matrix = to4x4Matrix(puzzle);
    copyNodes();
    
}

const imageDivider = (modder) => {
    let row = 0, right = 0, top = 0;
    for (let i = 0;i < puzzle.length-1; i++){
        
        backPiece[i] = [];
        backPiece[i][0] = right;
        backPiece[i][1] = top;

        puzzle[i].style.backgroundPosition = "-"+backPiece[i][0]+"px -"+backPiece[i][1]+"px";
        row ++;
        if (row === 4)
        {
            top += modder; right = 0; row = 0; 
        } 
        else {
            right +=modder
        }
    }
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
    if(shuffled){
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
    puzzle.forEach( cell => {
        cell.addEventListener('click', moveCell);
        cell.addEventListener('mouseenter', hoverEffect);
        cell.addEventListener('mouseleave', noHover);
    });
    matrix = to4x4Matrix(puzzle);
}

//
const shufflePuzzle = () => {
    shuffled = true;
    for (let i = puzzle.length - 1; i > 0; i--) {
        
        const j = Math.floor(Math.random() * i );
        
        swapNode(puzzle[i],puzzle[j]);
        puzzle = document.querySelectorAll('.cell');
    }

    reform();
    
}

//
const winningCondition = () => {
    
    if(shuffled){
        for(let i = 0; i < puzzle.length - 1; i++){
            if(puzzle[i].textContent != i + 1 ) return false;
        }
        return true;
    }
    return false;
}

let hoverInterval = null;
//applies hover effect to cells
const hoverEffect = () =>{
    const cell = event.target;
    if(isMoveAble(matrix,cell))
    {   
        hoverInterval = setInterval( () => {
            cell.classList.replace('normal-cell', 'moveable');
            hoverTimeout = setTimeout(() => cell.classList.replace('moveable', 'normal-cell') ,500);
        }, 1000);
        
    } 
    
}

// removes hover effect from a moveable cell
const noHover = () => {
    const cell = event.target;
    clearInterval(hoverInterval);
    if(cell.classList.contains('moveable')) cell.classList.replace('moveable', 'normal-cell');
    
}

//event listeners
window.addEventListener("load", loadPuzzle);
puzzle.forEach( cell => {
    cell.addEventListener('click', moveCell);
    cell.addEventListener('mouseenter', hoverEffect);
    cell.addEventListener('mouseleave', noHover);
});

shuffleBtn.addEventListener('click', shufflePuzzle);
