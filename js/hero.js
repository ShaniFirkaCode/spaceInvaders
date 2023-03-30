'use strict'

const LASER_SPEED = 80;
var gHero = { pos: { i: 12, j: 5 }, isShoot: false };
var gLaserPos = { i: null, j: null }
var gBlinkInterval

// creates the hero and place it on board
function createHero(board) {
    gHero.pos.i = 12
    gHero.pos.j = 5
    gHero.isShoot = false
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

// Handle game keys
function onKeyDown(ev) {
    if (!gGame.isOn) return
    if (ev.code === 'Space') shoot()

    switch (ev.key) {
        case 'ArrowLeft':
            moveHero(-1)
            break
        case 'ArrowRight':
            moveHero(1)
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
    gBlinkInterval = setInterval(blinkLaser, 2 * LASER_SPEED)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser() {
    if (!gHero.isShoot) return
    if (gLaserPos.i < 0) {
        stopLaser()
        return
    } else if (gBoard[gLaserPos.i][gLaserPos.j].gameObject === ALIEN) {
        handleAlienHit(gLaserPos)
    }

    updateCell(gLaserPos, LASER)
    setTimeout(function () {
        updateCell(gLaserPos)
        gLaserPos.i--
    }, LASER_SPEED)
}

function stopLaser() {
    gLaserPos = null
    gHero.isShoot = false
    clearInterval(gBlinkInterval)
    gBlinkInterval = null
}
