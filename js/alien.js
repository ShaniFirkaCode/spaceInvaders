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
    // if(getRightAlienInRowIdx(pos.j)===null) //if was last alien on row
}

function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (isAliensReachedRightWall(board)) {
        (console.log('got in if'))
        clearInterval(gIntervalAliens)
        gIntervalAliens = setInterval(shiftBoardDown, ALIEN_SPEED, board, gAliensTopRowIdx, gAliensBottomRowIdx)
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
    if (isAliensReachedLeftWall(board)) {
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
    if (gAliensBottomRowIdx + 1 === gHero.pos.i) {
        loss()
        return
    }
    else {
        for (var i = toI + 1; i >= fromI; i--) {
            for (var j = 0; j < board[0].length; j++) {
                if (i === 0 || i === gAliensTopRowIdx) board[i][j].gameObject = null
                else {
                    var cellAboveObj = board[i - 1][j].gameObject
                    if (cellAboveObj === LASER) handleAlienHit({ i, j })
                    board[i][j].gameObject = (cellAboveObj === ALIEN) ? ALIEN : null
                }
            }
        }
        gAliensTopRowIdx++
        gAliensBottomRowIdx++
        gBoard = board
        renderBoard(board)

        clearInterval(gIntervalAliens)
        if (isAliensReachedRightWall(board)) {
            gIntervalAliens = setInterval(shiftBoardLeft, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        } else gIntervalAliens = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
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
