'use strict'

var LASER_SPEED = 80;
var gHero = { pos: { i: 12, j: 5 }, isShoot: false, isBlowUp: false, isSuper: false };
var gLaserPos = { i: null, j: null }
var gBlinkInterval

// creates the hero and place it on board
function createHero(board) {
    gHero.pos.i = 12
    gHero.pos.j = 5
    isShoot: false
    isBlowUp: false
    isSuper: false
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

// Handle game keys
function onKeyDown(ev) {
    console.log(ev.key)
    if (!gGame.isOn) return
    if (ev.code === 'Space') shoot()

    switch (ev.key) {
        case 'ArrowLeft':
            moveHero(-1)
            break
        case 'ArrowRight':
            moveHero(1)
            break
        case 'n':
            if (gHero.isShoot) gHero.isBlowUp = true
            break
        case 'x':
            superMode()
            break
    }
}
// Move the hero right (1) or left (-1)
function moveHero(dir) {
    const i = gHero.pos.i
    const j = gHero.pos.j

    const newJ = gHero.pos.j + dir
    if (newJ === BOARD_SIZE || newJ < 0) return // not in range

    // remove from curr pos:
    updateCell(gHero.pos, null)

    // add hero to new pos:
    gHero.pos.j = newJ
    updateCell(gHero.pos, HERO)
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true
    gLaserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    gBlinkInterval = setInterval(blinkLaser, LASER_SPEED)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser() {
    if (!gHero.isShoot) return
    if (gLaserPos.i < 0) {
        stopLaser()
        return
    }
    if (gBoard[gLaserPos.i][gLaserPos.j].gameObject === ALIEN) {
        handleAlienHit(gLaserPos)
    }
    // if (gHero.isSuper) {
    //     // LASER = '⬆️'
    //     LASER_SPEED *= 4
    // }
    if (gHero.isBlowUp) blowUpNegs()

    updateCell(gLaserPos, LASER)
    setTimeout(function () {
        updateCell(gLaserPos)
        gLaserPos.i--
    }, LASER_SPEED)

}

function stopLaser() {
    if (gHero.isBlowUp) gHero.isBlowUp = false
    if (gHero.isSuper) {
        gHero.isSuper = false
        // LASER = '⤊'
        // LASER_SPEED = 80
    }
    gHero.isShoot = false
    clearInterval(gBlinkInterval)
    gBlinkInterval = null
}

function blowUpNegs() {
    for (var i = gLaserPos.i - 1; i <= gLaserPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = gLaserPos.j - 1; j <= gLaserPos.j + 1; j++) {
            if (i === gLaserPos.i && j === gLaserPos.j) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].gameObject === ALIEN) handleAlienHit({ i, j })
        }
    }
}

function superMode() {
    if (gHero.isShoot && gGame.superAttack > 0) {
        gHero.isSuper = true
        gGame.superAttack--
        renderSuper()
        // LASER_SPEED *= 4
    }
}

function renderSuper() {
    const elSuperMode = document.querySelector('.super-mode')
    const elSpan = elSuperMode.querySelector('span')
    var txt = ''
    for (var i = 0; i < gGame.superAttack; i++) {
        txt += '⬆️'
    }
    elSpan.innerHTML = txt
}

// function blinkBlowLaser() {
//     if (!gHero.isShoot) return
//     if (gLaserPos.i < 0) {
//         stopLaser()
//         return
//     } else if (gBoard[gLaserPos.i][gLaserPos.j].gameObject === ALIEN) {
//         handleAlienHit(gLaserPos)
//     }

//     updateCell(gLaserPos, LASER)
//     if (gHero.isBlowUp) blowUpNegs
//     setTimeout(function () {
//         updateCell(gLaserPos)
//         gLaserPos.i--
//     }, LASER_SPEED)
// }

