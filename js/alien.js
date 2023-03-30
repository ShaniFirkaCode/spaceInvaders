'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens
var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze = true

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
    else if (!isRowHasAlien(gBoard[pos.i])) updateAlienRowIdxs()
}

function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (isAliensReachedRightWall(board)) {
        clearInterval(gIntervalAliens)
        gIntervalAliens = setInterval(shiftBoardDown, ALIEN_SPEED, board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = board[0].length - 1; j >= 0; j--) {
                if (j === 0) board[i][j].gameObject = null
                else {
                    var lastCellObj = board[i][j - 1].gameObject
                    if (lastCellObj === LASER) handleAlienHit({ i, j })
                    board[i][j].gameObject = (lastCellObj === ALIEN) ? ALIEN : null
                }
            }
        }
        gBoard = board
        renderBoard(board)
    }
}

function shiftBoardLeft(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (isAliensReachedLeftWall(board)) {
        clearInterval(gIntervalAliens)
        gIntervalAliens = setInterval(shiftBoardDown, ALIEN_SPEED, board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = 0; j < board[0].length; j++) {
                if (j === board[0].length - 1) board[i][j].gameObject = null
                else {
                    var nextCellObj = board[i][j + 1].gameObject
                    if (nextCellObj === LASER) handleAlienHit({ i, j })
                    board[i][j].gameObject = (nextCellObj === ALIEN) ? ALIEN : null
                }
            }
        }
        gBoard = board
        renderBoard(gBoard)
    }
}

function shiftBoardDown(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (gAliensBottomRowIdx + 1 === gHero.pos.i) {
        loss()
        return
    }
    else {
        for (var i = toI + 1; i >= fromI; i--) {
            for (var j = 0; j < board[0].length; j++) {
                if (i === 0 || i === fromI) board[i][j].gameObject = null
                else {
                    var cellAboveObj = board[i - 1][j].gameObject
                    if (cellAboveObj === LASER) {
                        handleAlienHit({ i, j })
                        board[i][j].gameObject = null
                    }
                    board[i][j].gameObject = (cellAboveObj === ALIEN) ? ALIEN : null
                }
            }
        }
        updateAlienRowIdxs()
        console.log('top: ' + gAliensTopRowIdx + ' bottom: ' + gAliensBottomRowIdx)
        gBoard = board
        renderBoard(gBoard)

        clearInterval(gIntervalAliens)
        var func = (isAliensReachedRightWall(gBoard)) ? shiftBoardLeft : shiftBoardRight
        gIntervalAliens = setInterval(func, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    }
}


// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    gIntervalAliens = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
}

function isAliensReachedRightWall(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][board.length - 1].gameObject === ALIEN) return true
    }
    return false
}

function isAliensReachedLeftWall(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][0].gameObject === ALIEN) return true
    }
    return false
}

function updateAlienRowIdxs() {
    for (var i = 0; i < gBoard.length; i++) {
        if (isRowHasAlien(gBoard[i])) {
            gAliensTopRowIdx = i
            break
        }
    }
    for (var i = gBoard.length - 1; i >= 0; i--) {
        if (isRowHasAlien(gBoard[i])) {
            gAliensBottomRowIdx = i
            break
        }
    }
}


function isRowHasAlien(row) {
    var rowObjects = []
    for (var j = 0; j < row.length; j++) {
        rowObjects.push(row[j].gameObject)
    }
    if (rowObjects.includes(ALIEN)) return true
    else return false
}

