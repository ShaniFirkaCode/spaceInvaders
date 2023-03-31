'use strict'

var LASER_SPEED = 80
var gHero = { pos: { i: 12, j: 5 }, isShoot: false, isBlowUp: false, isSuper: false };
var gLaserPos = { i: null, j: null }
var gBlinkInterval

function createHero(board) {
    gHero.pos.i = 12
    gHero.pos.j = 5
    gHero.isShoot = false
    gHero.isBlowUp = false
    gHero.isSuper = false
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

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
        case 'n':
            console.log(ev.key)
            if (gHero.isShoot) {
                gHero.isBlowUp = true
                // blowUpNegs()
            }
            break
        case 'x':
            console.log(ev.key)
            superMode()
            break
    }
}

function moveHero(dir) {// Move the hero right (1) or left (-1)
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

function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true
    gLaserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    gBlinkInterval = setInterval(blinkLaser, LASER_SPEED)
}

function blinkLaser() {// renders a LASER at specific cell for short time and removes it
    if (!gHero.isShoot) return
    if (gLaserPos.i === 0) {
        stopLaser()
        return
    } else if (gBoard[gLaserPos.i][gLaserPos.j].gameObject === ALIEN) {
        handleAlienHit(gLaserPos)
        stopLaser()
        return
    }
    if (gHero.isBlowUp) blowUpNegs()
    var time = (gHero.isSuper) ? LASER_SPEED : LASER_SPEED * 2
    updateCell(gLaserPos, LASER)
    setTimeout(function () {
        updateCell(gLaserPos)
        gLaserPos.i--
    }, time)
}

function stopLaser() {
    gHero.isShoot = false
    if (gHero.isBlowUp) gHero.isBlowUp = false
    if (gHero.isSuper) gHero.isSuper = false
    clearInterval(gBlinkInterval)
    gBlinkInterval = null
}

function blowUpNegs() {
    console.log('blowUpNegs() is on!')
    for (var i = gLaserPos.i - 1; i <= gLaserPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = gLaserPos.j - 1; j <= gLaserPos.j + 1; j++) {
            if (i === gLaserPos.i && j === gLaserPos.j) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].gameObject === ALIEN) handleAlienHit({ i, j })
        }
    }
    if (gHero.isShoot) stopLaser()
}

function superMode() {
    console.log('superMode() is on!')
    if (gHero.isShoot && gGame.superAttack > 0) {
        gHero.isSuper = true
        gGame.superAttack--
        renderSuperCount()
    }
}

function renderSuperCount() {
    const elSuperMode = document.querySelector('.super-mode')
    const elSpan = elSuperMode.querySelector('span')
    var txt = ''
    for (var i = 0; i < gGame.superAttack; i++) {
        txt += '⬆️'
    }
    elSpan.innerHTML = txt
}


