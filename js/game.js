'use strict'
const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const SKY = 'sky'
const EARTH = 'earth'

const ALIEN_IMG = '<img src="img/alien.png">'
const HERO_IMG = '<img src="img/hero.png">'

var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0,
    superAttack: 3
}

function init() {
    gBoard = createBoard()
    renderBoard(gBoard)
    gGame.isOn = false
    gIsAlienFreeze = true
}

function createBoard() {
    var board = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = []
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = createCell()
            if (i === BOARD_SIZE - 1) board[i][j].type = EARTH
        }
    }
    createHero(board)
    createAliens(board)
    //console.log('aliensCount=', gGame.aliensCount)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {

            const cellObject = board[i][j].gameObject || ''
            const cellData = `data-i='${i}' data-j='${j}'`
            const cellClass = board[i][j].type

            strHTML += `<td class="${cellClass}" ${cellData}>
                     ${cellObject} </td>`
        }
        strHTML += '\n</tr>\n'
    }
    const elBoard = document.querySelector('table')
    elBoard.innerHTML = strHTML
}

function startGame(elBtn) {
    // var elSpan = elBtn.querySelector('span')
    if (elBtn.innerHTML === 'Start') {
        elBtn.innerHTML = 'Restart'
        closeModal()
        gIsAlienFreeze = false
        gGame.isOn = true
        moveAliens()

    } else if ((elBtn.innerHTML === 'Restart')) { // restart
        stopGame()
        gGame.aliensCount = 0
        gGame.score = 0
        gGame.superAttack = 3
        renderScore()
        renderSuper()
        closeModal()
        elBtn.innerHTML = 'Start'
        init()
    }
}

function victory() {
    stopGame()
    openModal('VICTORY 🥇')
}

function loss() {
    stopGame()
    openModal('GAME OVER 💀')
}

function stopGame() {
    var elBtn = document.querySelector('.btn')
    elBtn.innerHTML = 'Restart'
    gGame.isOn = false
    gIsAlienFreeze = true
    stopLaser()
    clearInterval(gIntervalAliens)
    gIntervalAliens = null
    console.log('game stoped!')
}

function renderScore() {
    const elSpan = document.querySelector('span')
    elSpan.innerHTML = gGame.score
}

function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}