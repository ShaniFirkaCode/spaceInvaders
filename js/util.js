'use strict'

function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

function renderScore() {
    const elSpan = document.querySelector('span')
    elSpan.innerHTML = gGame.score
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

function showInstructions() {
    const elInstructions = document.querySelector('.instructions')
    renderInstructions()
    elInstructions.style.display = 'block'
}

function closeInstructions() {
    const elInstructions = document.querySelector('.instructions')
    elInstructions.style.display = 'none'
}

function renderInstructions() {
    var elDiv = document.querySelector('.instructions')
    var instructions = `
    INSTRUCTIONS :\n
    👾 You win when all aliens clear\n
    👾 You lose when aliens reach your row\n
    👾 Move with left and right arrows\n
    👾 Press 'space' to shoot aliens\n
    👾 Blow up aliens around your laser by pressing 'n'\n
    👾 Super mode - press 'x' to shoot faster\n
    GO show them what you've got!`
    elDiv.innerText = instructions
}
