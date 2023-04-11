const button = document.querySelector('button');
const controlCenter = document.querySelector('.controlCenter')
const singlePlayer = document.createElement('button')
const twoPlayer = document.createElement('button')
const title = document.querySelector('h1')
const startGame = { game: false, single: false, two: false }
const winningMoves = { '123': [1, 2, 3], '456': [4, 5, 6], '789': [7, 8, 9], '147': [1, 4, 7], '258': [2, 5, 8], '369': [3, 6, 9], '159': [1, 5, 9], '357': [3, 5, 7] }
const cells = document.querySelectorAll('.cell')
let player1Turn = true
let player2Turn = false
let player1Moves = []
let player2Moves = []
let keys = Object.keys(winningMoves)
let values = Object.values(winningMoves)
let spotsTaken = 0

singlePlayer.innerHTML = 'Single Player Mode'
singlePlayer.classList = 'singlePlayer'

twoPlayer.innerHTML = 'Two Player Mode'
twoPlayer.classList = 'twoPlayer'


function determineWinner(playerMoves, header) {
    let counter = 0
    let hold = []
    for (let x of keys) {
        if (counter === 3) break
        counter = 0
        hold = []
        for (let y of x) {
            if (playerMoves.join('').includes(y)) {
                counter++
                hold.push(y)
                if (counter === 3) {
                    break
                }
            }
        }
    }
    if (counter === 3) {
        for (let x of hold) {
            let cell = document.getElementById(x)
            cell.classList.remove('cell')
            cell.classList.add('winningCells')
            title.innerHTML = header
            startGame['game'] = false
        }
    }
}



button.addEventListener('click', () => {
    controlCenter.removeChild(button)
    controlCenter.appendChild(singlePlayer)
    controlCenter.appendChild(twoPlayer)
    startGame['game'] = true
})


// -------------- Two Player Logic -----------------------
twoPlayer.addEventListener('click', () => {
    title.innerHTML = 'Player1 Turn'
    controlCenter.removeChild(singlePlayer)
    controlCenter.removeChild(twoPlayer)
    startGame['two'] = true
    for (let cell of cells) {
        cell.addEventListener('click', () => {
            if (startGame['game']) {
                if (player1Turn) {
                    if (!cell.innerHTML) {
                        cell.innerHTML = 'X'
                        spotsTaken++
                        if (spotsTaken === 9) {
                            startGame['game'] = false
                            title.innerHTML = 'DRAW'
                        }
                        else {
                            title.innerHTML = 'Player2 Turn'
                        }
                        player1Moves.push(cell.id)
                        determineWinner(player1Moves, 'Player1 Wins Refresh To Play Again')
                        player1Turn = false
                        player2Turn = true
                    }
                }
                else if (player2Turn) {
                    if (!cell.innerHTML) {
                        title.innerHTML = 'Player1 Turn'
                        cell.innerHTML = 'O'
                        spotsTaken++
                        player2Moves.push(cell.id)
                        determineWinner(player2Moves, 'Player2 Wins Refresh To Play Again')
                        player2Turn = false
                        player1Turn = true
                    }
                }
            }
        })
    }


})


// ------------------Single Player Logic----------------------------

singlePlayer.addEventListener('click', () => {
    title.innerHTML = 'Player1 Turn'
    controlCenter.removeChild(singlePlayer)
    controlCenter.removeChild(twoPlayer)
    startGame['single'] = true
    for (let cell of cells) {
        cell.addEventListener('click', () => {
            if (startGame['game']) {
                if (player1Turn) {
                    if (!cell.innerHTML) {
                        cell.innerHTML = 'X'
                        spotsTaken++
                        if (spotsTaken === 9) {
                            startGame['game'] = false
                            title.innerHTML = 'DRAW'
                        }
                        else {
                            title.innerHTML = 'Computer Turn'
                            title.id = '2turn'
                        }
                        player1Moves.push(cell.id)
                        let counter = 0
                        let hold = []
                        for (let x of keys) {
                            if (counter === 3) break
                            counter = 0
                            hold = []
                            for (let y of x) {
                                if (player1Moves.join('').includes(y)) {
                                    counter++
                                    hold.push(y)
                                    if (counter === 3) {
                                        break
                                    }
                                }
                            }
                        }
                        if (counter === 3) {
                            for (let x of hold) {
                                let cell = document.getElementById(x)
                                cell.classList.remove('cell')
                                cell.classList.add('winningCells')
                                title.innerHTML = 'Player1 Wins Refresh To Play Again'
                                startGame['game'] = false
                            }
                        }
                        player1Turn = false
                        player2Turn = true
                    }
                }
            }
        })
    }
})

let mutationObsever = new MutationObserver((mutation) => {
    if (mutation[0].target.innerHTML === 'Computer Turn' && startGame['single']) {
// ---------------Starting Point Logic-----------------------------------

        if (player2Moves.length === 0) {
            let startingCells = ['1', '3', '7', '9']
            for (let x of startingCells) {
                let cell = document.getElementById(x)
                if (cell.innerHTML !== 'X') {
                    cell.innerHTML = 'O'
                    player2Moves.push(x)
                    break
                }
            }
        }
// --------------------Loss Threat Logic------------------------------

        else {
            let lossThreat = false
            let counter = 0
            let holder = []
            for (let x = 0; x < keys.length; x++){
                if (counter === 2) break
                counter = 0
                holder = []
                for (let y of keys[x]) {
                    if (player1Moves.join('').includes(y)) {
                        counter++
                        holder.push(y)
                        if (counter === 2) {
                            let cell = document.getElementById(keys[x][keys[x].length - 1])
                            if (cell.innerHTML !== 'X' && cell.innerHTML !== 'O') {
                                cell.innerHTML = 'O'
                                player2Moves.push(cell.id)
                                lossThreat = true
                                keys.splice(x, 1)
                            }
                            else {
                                cell = document.getElementById(keys[x][1])
                                if (cell.innerHTML !== 'X' && cell.innerHTML !== 'O') {
                                    cell.innerHTML = 'O'
                                    player2Moves.push(cell.id)
                                    lossThreat = true
                                    keys.splice(x, 1)
                                }
                                else {
                                    cell = document.getElementById(keys[x][0])
                                    if (cell.innerHTML !== 'X' && cell.innerHTML !== 'O') {
                                        cell.innerHTML = 'O'
                                        player2Moves.push(cell.id)
                                        lossThreat = true
                                        keys.splice(x, 1)
                                    }
                                }
                            }
                        }
                    }
                }
            }
// ------------------No Threat Logic-----------------------------------------

            if (!lossThreat) {
                while (true) {
                    let position = Math.round(Math.random() * 10)
                    while (position < 1 || position === 10) {
                        position = Math.round(Math.random() * 10)
                    }
                    let cell = document.getElementById(position)
                    if (cell.innerHTML !== 'O' && cell.innerHTML !== 'X') {
                        cell.innerHTML = 'O'
                        player2Moves.push(cell.id)
                        break
                    }
                }
            }
        }

        let endCounter = 0
        let endHold = []
        for (let x of Object.keys(winningMoves)) {
            if (endCounter === 3) break
            endCounter = 0
            endHold = []
            for (let y of x) {
                if (player2Moves.join('').includes(y)) {
                    endCounter++
                    endHold.push(y)
                    if (endCounter === 3) {
                        break
                    }
                }
            }
        }
        if (endCounter === 3) {
            for (let x of endHold) {
                let cell = document.getElementById(x)
                cell.classList.remove('cell')
                cell.classList.add('winningCells')
                title.innerHTML = 'Computer Wins Refresh To Play Again'
                startGame['game'] = false
            }
        }
        else {
            mutation[0].target.id = null
            player1Turn = true
            player2Turn = false
            title.innerHTML = "Player1 Turn"
            spotsTaken++
        }
    }


})
mutationObsever.observe(title, { attributes: true, attributeOldValue: true })



