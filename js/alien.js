'use strict'

const ALIEN_SPEED = 500;
var gIntervalAliens;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gIsAlienFreeze = true;

function createAliens(board) {
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = gAliensTopRowIdx + ALIENS_ROW_COUNT - 1
    for (var i = gAliensTopRowIdx; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            board[i][j] = createCell(ALIEN)
            gGame.aliensCount++
        }
    }
}

function handleAlienHit(pos) {
    gGame.aliensCount--
    gGame.score += 10
    renderScore()
    stopLaser()
    updateCell(pos)
    if (gGame.aliensCount === 0) victory()
    // if(getRightAlienInRowIdx(pos.j)===null) //if was last alien on row
}

function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return
    var rightAlienIdx = getMostRightAlienOnBoardIdx(board)
    if (rightAlienIdx === board[0].length - 1) {
        clearInterval(gIntervalAliens)
        gIntervalAliens = setInterval(shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx), ALIEN_SPEED)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = board[0].length - 1; j >= 0; j--) {
                if (j === 0) board[i][j].gameObject = null
                else {
                    var leftCellObj = board[i][j - 1].gameObject
                    if (leftCellObj === LASER) handleAlienHit({ i, j })
                    board[i][j].gameObject = (leftCellObj === ALIEN) ? ALIEN : null
                }
            }
        }
        gBoard = board
        renderBoard(board)
    }
}

function shiftBoardLeft(board, fromI, toI) {
    if (gIsAlienFreeze) return
    var leftAlienIdx = getMostLeftAlienOnBoardIdx(gBoard)
    console.log('left:', leftAlienIdx)
    if (leftAlienIdx === 0) {
        clearInterval(gIntervalAliens)
        gIntervalAliens = setInterval(shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx), ALIEN_SPEED)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = 0; j < board[0].length; j++) {
                if (j === board[0].length - 1) board[i][j].gameObject = null
                else {
                    var leftCellObj = board[i][j + 1].gameObject
                    if (leftCellObj === LASER) handleAlienHit({ i, j })
                    board[i][j].gameObject = (leftCellObj === ALIEN) ? ALIEN : null
                }
            }
        }
        gBoard = board
        renderBoard(board)
    }
}

function shiftBoardDown(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (gAliensBottomRowIdx + 1 === gHero.pos.i) stopGame()// aliens reaching the hero row
    else {
        for (var i = toI + 1; i >= fromI; i--) {
            for (var j = 0; j < board[0].length; j++) {
                if (i === 0 || i === gAliensTopRowIdx) {
                    board[i][j].gameObject = null
                } else {
                    var cellAboveObj = board[i - 1][j].gameObject
                    if (cellAboveObj === LASER) handleAlienHit({ i, j })
                    board[i][j].gameObject = (cellAboveObj === ALIEN) ? ALIEN : board[i][j].gameObject
                }
            }
        }
        gAliensTopRowIdx++
        gAliensBottomRowIdx++
        gBoard = board
        renderBoard(board)
        var rightAlienIdx = getMostRightAlienOnBoardIdx(board)
        clearInterval(gIntervalAliens)
        if (rightAlienIdx === board.length - 1) {
            gIntervalAliens = setInterval(shiftBoardLeft, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        } else gIntervalAliens = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    }
}


// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    if (!gIsAlienFreeze) return // 
    gIntervalAliens = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)

}

function getLeftAlienInRowIdx(row) {
    var rowObjects = []
    for (var j = 0; j < row.length; j++) {
        rowObjects.push(row[j].gameObject)
    }
    console.log(rowObjects)
    if (rowObjects.includes(ALIEN)) {
        for (var j = 0; j < row.length; j++) {
            // console.log(rowObjects[j])
            if (row[j].gameObject === ALIEN) return j
        }
    } else return null
}

function getMostLeftAlienOnBoardIdx(board) {
    var leftJ = board.length - 1
    for (var i = 0; i < board.length; i++) {
        var currIdx = getLeftAlienInRowIdx(board[i])
        if (currIdx < leftJ) leftJ = currIdx
    }
    return leftJ
}

function getRightAlienInRowIdx(row) {
    var rowObjects = []
    for (var j = row.length - 1; j >= 0; j--) {
        rowObjects.push(row[j].gameObject)
    }
    if (rowObjects.includes(ALIEN)) {
        for (var j = row.length - 1; j >= 0; j--) {
            if (row[j].gameObject === ALIEN) return j
        }
    }
    else return null
}

function getMostRightAlienOnBoardIdx(board) {
    var rightJ = 0
    for (var i = 0; i < board.length; i++) {
        var rightIncurrRow = getRightAlienInRowIdx(board[i])
        if (rightIncurrRow > rightJ) rightJ = rightIncurrRow
    }
    return rightJ
}


