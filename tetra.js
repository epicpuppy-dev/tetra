const canvas = document.getElementById('game');
const holdCanvas = document.getElementById('hold-canvas');
const nextCanvas = document.getElementById('next-canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
/** @type {CanvasRenderingContext2D} */
const holdCtx = holdCanvas.getContext('2d');
/** @type {CanvasRenderingContext2D} */
const nextCtx = nextCanvas.getContext('2d');
let cellSize = 24;
const debug = document.getElementById('debug');
canvas.width = cellSize * 10;
canvas.height = cellSize * 22;
holdCanvas.width = cellSize * 4;
holdCanvas.height = cellSize * 3;
nextCanvas.width = cellSize * 4;
nextCanvas.height = cellSize * 15;
ctx.lineWidth = 2;
//BACKGROUND, I, J, L, O, S, T, Z, GRID, PAGE BG, BORDER
colors = ["#000000", "#00ffff", "#0000ff", "#ff8800", "#ffff00", "#00ff00", "#dd00dd", "#ff0000", "#222222", "#000000", "#555555"];
const officialSkins = [
    "skins/8bit.json",
    "skins/8x8.json",
    "skins/default.json",
    "skins/gameboy.json",
    "skins/gameboycolor.json",
    "skins/legacy.json",
    "skins/minimalist.json",
    "skins/monochrome.json",
    "skins/monochrome8x8.json",
    "skins/neon.json",
    "skins/nes.json",
    "skins/rounded.json",
    "skins/snes.json",
    "skins/tiny.json",
    "skins/wireframe.json",
    "skins/cursed.json"
];
const G = {};
G.display = document.getElementById('score');
G.highscore = 0;
G.level = 0;
G.mode = 0;
G.score = 0;
G.paused = false;
G.lines = 0;
G.btb = -1;
G.lose = false;
G.tsanim = 0;
G.pcanim = 0;
G.nextLevel = 10;
G.connectedTextures = true;
G.gravity = {};
G.gravity.speed = fallSpeed(G.level);
G.gravity.fall = G.gravity.speed;
G.gravity.lock = 60;
G.gravity.are = 60;
G.gravity.speedup = 5;
G.bind = null;
G.hold = null;
G.holdable = true;
G.firstHold = 2;
G.skinLocation = "skins/default.json";
G.skin = {
    src: "img/default.png",
    size: {
        width: 192,
        height: 216
    },
    tileSize: 24
};
G.atlas = {
    "I-": [0, 0],
    "I-d": [1, 0],
    "I-l": [2, 0],
    "I-u": [3, 0],
    "I-r": [4, 0],
    "I-ud": [5, 0],
    "I-rl": [6, 0],
    "J-": [7, 0],
    "J-d": [0, 1],
    "J-l": [1, 1],
    "J-u": [2, 1],
    "J-r": [3, 1],
    "J-ud": [4, 1],
    "J-rl": [5, 1],
    "J-lu": [6, 1],
    "J-ld": [7, 1],
    "J-rd": [0, 2],
    "J-ru": [1, 2],
    "L-": [2, 2],
    "L-d": [3, 2],
    "L-l": [4, 2],
    "L-u": [5, 2],
    "L-r": [6, 2],
    "L-ud": [7, 2],
    "L-rl": [0, 3],
    "L-lu": [1, 3],
    "L-ld": [2, 3],
    "L-rd": [3, 3],
    "L-ru": [4, 3],
    "O-": [5, 3],
    "O-d": [6, 3],
    "O-l": [7, 3],
    "O-u": [0, 4],
    "O-r": [1, 4],
    "O-rd": [2, 4],
    "O-ru": [3, 4],
    "O-lu": [4, 4],
    "O-ld": [5, 4],
    "S-": [6, 4],
    "S-d": [7, 4],
    "S-l": [0, 5],
    "S-u": [1, 5],
    "S-r": [2, 5],
    "S-lu": [3, 5],
    "S-ld": [4, 5],
    "S-rd": [5, 5],
    "S-ru": [6, 5],
    "T-": [7, 5],
    "T-d": [0, 6],
    "T-l": [1, 6],
    "T-u": [2, 6],
    "T-r": [3, 6],
    "T-lu": [4, 6],
    "T-ld": [5, 6],
    "T-rd": [6, 6],
    "T-ru": [7, 6],
    "T-rlu": [0, 7],
    "T-lud": [1, 7],
    "T-rld": [2, 7],
    "T-rud": [3, 7],
    "T-rl": [4, 7],
    "Z-": [5, 7],
    "Z-d": [6, 7],
    "Z-l": [7, 7],
    "Z-u": [0, 8],
    "Z-r": [1, 8],
    "Z-lu": [2, 8],
    "Z-ld": [3, 8],
    "Z-rd": [4, 8],
    "Z-ru": [5, 8]
}
G.pieces = {
    I: {
        width: 4,
        height: 1,
        shape: [["I-r"], ["I-rl"], ["I-rl"], ["I-l"]],
        color: colors[1]
    },
    J: {
        width: 3,
        height: 2,
        shape: [["J-ru", "J-d"], ["J-rl", " "], ["J-l", " "]],
        color: colors[2]
    },
    L: {
        width: 3,
        height: 2,
        shape: [["L-r", " "], ["L-rl", " "], ["L-lu", "L-d"]],
        color: colors[3]
    },
    O: {
        width: 2,
        height: 2,
        shape: [["O-ru", "O-rd"], ["O-lu", "O-ld"]],
        color: colors[4]
    },
    S: {
        width: 3,
        height: 2,
        shape: [["S-r", " "], ["S-lu", "S-rd"], [" ", "S-l"]],
        color: colors[5]
    },
    T: {
        width: 3,
        height: 2,
        shape: [["T-r", " "], ["T-rlu", "T-d"], ["T-l", " "]],
        color: colors[6]
    },
    Z: {
        width: 3,
        height: 2,
        shape: [[" ", "Z-r"], ["Z-ru", "Z-ld"], ["Z-l", " "]],
        color: colors[7]
    }
};
G.srs = {};
G.srs.I = [
    [[" "," ","I-r"," "],[" "," ","I-rl"," "],[" "," ","I-rl"," "],[" "," ","I-l"," "]],
    [[" "," "," "," "],[" "," "," "," "],["I-u","I-ud","I-ud","I-d"],[" "," "," "," "]],
    [[" ","I-r"," "," "],[" ","I-rl"," "," "],[" ","I-rl"," "," "],[" ","I-l"," "," "]],
    [[" "," "," "," "],["I-u","I-ud","I-ud","I-d"],[" "," "," "," "],[" "," "," "," "]]
];
G.srs.J = [
    [[" ","J-ru","J-d"," "],[" ","J-rl"," "," "],[" ","J-l"," "," "],[" "," "," "," "]],
    [[" "," "," "," "],["J-u","J-ud","J-rd"," "],[" "," ","J-l"," "],[" "," "," "," "]],
    [[" ","J-r"," "," "],[" ","J-rl"," "," "],["J-u","J-ld"," "," "],[" "," "," "," "]],
    [["J-r"," "," "," "],["J-lu","J-ud","J-d"," "],[" "," "," "," "],[" "," "," "," "]]
];
G.srs.L = [
    [[" ","L-r"," "," "],[" ","L-rl"," "," "],[" ","L-lu","L-d"," "],[" "," "," "," "]],
    [[" "," "," "," "],["L-ru","L-ud","L-d"," "],["L-l"," "," "," "],[" "," "," "," "]],
    [["L-u","L-rd"," "," "],[" ","L-rl"," "," "],[" ","L-l"," "," "],[" "," "," "," "]],
    [[" "," ","L-r"," "],["L-u","L-ud","L-ld"," "],[" "," "," "," "],[" "," "," "," "]]
];
G.srs.O = [
    [[" "," "," "," "],[" ","O-ru","O-rd"," "],[" ","O-lu","O-ld"," "],[" "," "," "," "]],
    [[" "," "," "," "],[" ","O-ru","O-rd"," "],[" ","O-lu","O-ld"," "],[" "," "," "," "]],
    [[" "," "," "," "],[" ","O-ru","O-rd"," "],[" ","O-lu","O-ld"," "],[" "," "," "," "]],
    [[" "," "," "," "],[" ","O-ru","O-rd"," "],[" ","O-lu","O-ld"," "],[" "," "," "," "]]
];
G.srs.S = [
    [[" ","S-r"," "," "],[" ","S-lu","S-rd"," "],[" "," ","S-l"," "],[" "," "," "," "]],
    [[" "," "," "," "],[" ","S-ru","S-d"," "],["S-u","S-ld"," "," "],[" "," "," "," "]],
    [["S-r"," "," "," "],["S-lu","S-rd"," "," "],[" ","S-l"," "," "],[" "," "," "," "]],
    [[" ","S-ru","S-d"," "],["S-u","S-ld"," "," "],[" "," "," "," "],[" "," "," "," "]]
];
G.srs.T = [
    [[" ","T-r"," "," "],[" ","T-rlu","T-d"," "],[" ","T-l"," "," "],[" "," "," "," "]],
    [[" "," "," "," "],["T-u","T-rud","T-d"," "],[" ","T-l"," "," "],[" "," "," "," "]],
    [[" ","T-r"," "," "],["T-u","T-rld"," "," "],[" ","T-l"," "," "],[" "," "," "," "]],
    [[" ","T-r"," "," "],["T-u","T-lud","T-d"," "],[" "," "," "," "],[" "," "," "," "]]
];
G.srs.Z = [
    [[" "," ","Z-r"," "],[" ","Z-ru","Z-ld"," "],[" ","Z-l"," "," "],[" "," "," "," "]],
    [[" "," "," "," "],["Z-u","Z-rd"," "," "],[" ","Z-lu","Z-d"," "],[" "," "," "," "]],
    [[" ","Z-r"," "," "],["Z-ru","Z-ld"," "," "],["Z-l"," "," "," "],[" "," "," "," "]],
    [["Z-u","Z-rd"," "," "],[" ","Z-lu","Z-d"," "],[" "," "," "," "],[" "," "," "," "]]
];
G.srs.kick = {};
G.srs.kick.JLTSZ = [
    {
        1: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        3: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    },
    {
        2: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        0: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
    },
    {
        3: [[0, 0], [-1, 0], [1, 1], [0, -2], [1, -2]],
        1: [[0, 0], [-1, 0], [1, 1], [0, -2], [1, -2]]
    },
    {
        0: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        2: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
    }
];
G.srs.kick.I = [
    {
        1: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
        3: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    },
    {
        2: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
        0: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]]
    },
    {
        3: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
        1: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]
    },
    {
        0: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
        2: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]]
    }
];
G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
G.next = [];
for (let i = 0; i < 5; i++) {
    let piece = Math.floor(Math.random() * G.bag.length);
    G.next.push(G.bag[piece]);
    if (G.mode != 1) G.bag.splice(piece, 1);
    if (G.bag.length == 0) {
        G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
    }
}
G.key = {};
G.key.bindings = {
    left: "ArrowLeft",
    right: "ArrowRight",
    soft: "ArrowDown",
    hard: "Space",
    rotateCW: "KeyX",
    rotateCCW: "KeyZ",
    hold: "ShiftLeft",
    retry: "KeyR",
};
G.key.das = {
    delay: 15,
    speed: 2,
    left: 10
};
G.key.down = {
    left: false,
    right: false,
    soft: false,
};
G.piece = null;
G.ghost = null;

G.stats = {};
G.stats.pieces = [0];
G.stats.actions = [0];
G.stats.score = [0];
G.stats.totalpieces = 0;

//Load Highscore
const highscoreData = window.localStorage.getItem('highscore');
if (highscoreData !== null) {
    const highscore = JSON.parse(highscoreData);
    if (highscore !== undefined) G.highscore = highscore;
    document.getElementById('high').innerHTML = "HIGH SCORE " + "0".repeat(7 - G.highscore.toString().length) + G.highscore;
}

//Load Settings
const settingsData = window.localStorage.getItem('settings');
if (settingsData !== null) {
    const settings = JSON.parse(settingsData);
    if (settings.bindings !== undefined) G.key.bindings = settings.bindings;
    if (settings.das.speed !== undefined) G.key.das.speed = settings.das.speed;
    if (settings.das.delay !== undefined) G.key.das.delay = settings.das.delay;
    if (settings.softSpeed !== undefined) G.gravity.speedup = settings.softSpeed;
    if (settings.connectedTextures !== undefined) G.connectedTextures = settings.connectedTextures;
    if (settings.skin !== undefined) G.skinLocation = settings.skin;
    for (const binding in G.key.bindings) {
        document.getElementById('key-' + binding).innerHTML = G.key.bindings[binding].replace('Key', '').replace('Arrow', '');
    }
    document.getElementById('das-speed').value = G.key.das.speed;
    document.getElementById('das-delay').value = G.key.das.delay;
    document.getElementById('soft-drop-speed').value = G.gravity.speedup;
    document.getElementById('connected-textures').value = G.connectedTextures;
    if (G.skinLocation !== undefined) {
        if (officialSkins.includes(G.skinLocation)) {
            document.getElementById('select-skin').value = G.skinLocation;
            document.getElementById('skin-file').value = "";
        } else {
            document.getElementById('select-skin').value = "custom";
            document.getElementById('skin-file').value = G.skinLocation;
        }
    }
}

class Piece {
    constructor (type, ghost) {
        this.x = 3;
        this.y = 20;
        this.locked = false;
        this.rotation = 0;
        this.type = type;
        this.mts = false;
        this.tspin = false;
        this.ghost = ghost;
        switch (type) {
            case "I":
                this.color = colors[1];
                this.y = 19;
                this.footprint = [[" ", " ", "I-r", " "],[" ", " ", "I-rl", " "],[" ", " ", "I-rl", " "],[" ", " ", "I-l", " "]];
                break;
            case "J":
                this.color = colors[2];
                this.footprint = [[" ", "J-ru", "J-d", " "],[" ", "J-rl", " ", " "],[" ", "J-l", " ", " "],[" ", " ", " ", " "]];
                break;
            case "L":
                this.color = colors[3];
                this.footprint = [[" ", "L-r", " ", " "],[" ", "L-rl", " ", " "],[" ", "L-lu", "L-d", " "],[" ", " ", " ", " "]];
                break;
            case "O":
                this.color = colors[4];
                this.footprint = [[" ", " ", " ", " "],[" ", "O-ru", "O-rd", " "],[" ", "O-lu", "O-ld", " "],[" ", " ", " ", " "]];
                break;
            case "S":
                this.color = colors[5];
                this.footprint = [[" ", "S-r", " ", " "],[" ", "S-lu", "S-rd", " "],[" ", " ", "S-l", " "],[" ", " ", " ", " "]];
                break;
            case "T":
                this.color = colors[6];
                this.footprint = [[" ", "T-r", " ", " "],[" ", "T-rlu", "T-d", " "],[" ", "T-l", " ", " "],[" ", " ", " ", " "]];
                break;
            case "Z":
                this.color = colors[7];
                this.footprint = [[" ", " ", "Z-r", " "],[" ", "Z-ru", "Z-ld", " "],[" ", "Z-l", " ", " "],[" ", " ", " ", " "]];
                break;
        }
        for (let x = 0; x < this.footprint.length; x++) for (let y = 0; y < this.footprint[x].length; y++) {
            if (this.footprint[x][y] != " ") if (G.grid[this.x + x][this.y + y].solid) {
                G.lose = true;
                if (G.score > G.highscore) {
                    G.highscore = G.score;
                    window.localStorage.setItem('highscore', JSON.stringify(G.highscore));
                    document.getElementById('high').innerHTML = "HIGH SCORE " + "0".repeat(7 - G.highscore.toString().length) + G.highscore;
                }
            }
        }
        for (let x = 0; x < this.footprint.length; x++) for (let y = 0; y < this.footprint[x].length; y++) {
            if (this.footprint[x][y] != " ") G.grid[this.x + x][this.y + y] = new Cell(true, this.color, true, this.footprint[x][y], this.ghost);
        }
    }
    move (mx, my) {
        if (this.locked) return;
        //check if on wall or floor
        for (let px = 0; px < this.footprint.length; px++) for (let py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") if (
                this.x + mx + px < 0 || 
                this.x + mx + px > 9 || 
                this.y + my + py < 0 ||
                (G.grid[this.x + mx + px][this.y + my + py].solid && !G.grid[this.x + mx + px][this.y + my + py].moving)
            ) {
                //debug.innerHTML = JSON.stringify(`${px}, ${py}, ${mx}, ${my}, ${this.x}, ${this.y}, ${px + mx + this.x}, ${py + my + this.y}`);
                return false;
            }
        }
        //remove footprint from grid
        for (let px = 0; px < this.footprint.length; px++) for (let py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(false, "#000", false, null, false);
        }
        //move piece position
        this.x += mx;
        this.y += my;
        //add footprint to new position
        if (this !== G.ghost && G.mode != 1) {
            if (G.ghost === null) G.ghost = new Piece(this.type, true);
            G.ghost.color = this.color + "55";
            G.ghost.move(this.x - G.ghost.x, this.y - G.ghost.y);
            while (!G.ghost.onFloor()) {
                G.ghost.move(0, -1);
            }
        }
        for (let px = 0; px < this.footprint.length; px++) for (let py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, true, this.footprint[px][py], this.ghost);
        }
        //debug.innerHTML = JSON.stringify(`${mx}, ${my}, ${this.x}, ${this.y}, ${px + mx + this.x}, ${py + my + this.y}`);
        this.mts = false;
        this.tspin = false;
        return true;
    }
    remove () {
        //remove footprint from grid
        for (let px = 0; px < this.footprint.length; px++) for (let py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(false, "#000", false, null, false);
        }
    }
    onFloor () {
        //check if on wall or floor
        for (let px = 0; px < this.footprint.length; px++) for (let py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") if (
                this.y - 1 + py < 0 ||
                (G.grid[this.x + px][this.y - 1 + py].solid && !G.grid[this.x + px][this.y - 1 + py].moving)
            ) {
                return true;
            }
        }
        return false;
    }
    lock () {
        //add static footprint to current position
        for (let px = 0; px < this.footprint.length; px++) for (let py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, false, this.footprint[px][py], this.ghost);
        }
        this.locked = true;
        G.ghost = null;
        //clear lines
        let lines = new Array(G.grid[0].length).fill(true);
        for (let x = 0; x < G.grid.length; x++) {
            for (let y = 0; y < G.grid[x].length; y++) {
                if (!G.grid[x][y].solid || G.grid[x][y].moving) {
                    lines[y] = false;
                }
            }
        }
        let cleared = 0;
        for (let l = 0; l < lines.length; l++) {
            if (lines[l]) cleared++;
        }
        G.lines += cleared;
        G.nextLevel -= cleared;
        let tspin = false;
        let mts = false;
        if (this.type == "T" && this.tspin) {
            let corners = 0;
            //debug.innerHTML = "";
            for (const corner of [[0, 0], [2, 0], [2, 2], [0, 2]]) {
                //debug.innerHTML += JSON.stringify(G.grid[this.x + corner[0]][this.y + corner[1]]) + ", ";
                try {if (G.grid[this.x + corner[0]][this.y + corner[1]].solid) corners++} catch {};
            }
            if (corners >= 3) tspin = true;
        }
        if (this.type == "T" && !tspin && this.mts) {
            mts = true;
        }
        if (G.nextLevel <= 0 && G.mode == 0) {
            G.nextLevel += 10;
            G.level++;
            G.gravity.speed = fallSpeed(G.level);
        }
        if (G.mode != 1) switch (cleared) {
            case 4:
                G.score += 800 * (G.level + 1);
                G.stats.score[G.stats.pieces.length - 1] += 800 * (G.level + 1);
                if (G.btb >= 0) {
                    G.score += 400 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 400 * (G.level + 1);
                }
                G.btb++;
                break;
            case 3:
                G.score += 500 * (G.level + 1);
                G.stats.score[G.stats.pieces.length - 1] += 500 * (G.level + 1);
                if (tspin) {
                    G.score += 1100 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 1100 * (G.level + 1);
                    if (G.btb >= 0) {
                        G.score += 800 * (G.level + 1);
                        G.stats.score[G.stats.pieces.length - 1] += 800 * (G.level + 1);
                    }
                    G.tsanim = 120;
                    document.getElementById('tspin').innerHTML = "T-SPIN TRIPLE";
                    G.btb++;
                } else {
                    G.btb = -1;
                }
                break;
            case 2:
                G.score += 300 * (G.level + 1);
                G.stats.score[G.stats.pieces.length - 1] += 300 * (G.level + 1);
                if (tspin) {
                    G.score += 900 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 900 * (G.level + 1);
                    if (G.btb >= 0) {
                        G.score += 600 * (G.level + 1);
                        G.stats.score[G.stats.pieces.length - 1] += 600 * (G.level + 1);
                    }
                    G.tsanim = 120;
                    document.getElementById('tspin').innerHTML = "T-SPIN DOUBLE";
                    G.btb++;
                } else if (mts) {
                    G.score += 100 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 100 * (G.level + 1);
                    if (G.btb >= 0) {
                        G.score += 200 * (G.level + 1);
                        G.stats.score[G.stats.pieces.length - 1] += 200 * (G.level + 1);
                    }
                    G.tsanim = 90;
                    document.getElementById('tspin').innerHTML = "MINI T-SPIN DOUBLE";
                    G.btb++;
                } else {
                    G.btb = -1;
                }
                break;
            case 1:
                G.score += 100 * (G.level + 1);
                G.stats.score[G.stats.pieces.length - 1] += 100 * (G.level + 1);
                if (tspin) {
                    G.score += 700 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 700 * (G.level + 1);
                    if (G.btb >= 0) {
                        G.score += 400 * (G.level + 1);
                        G.stats.score[G.stats.pieces.length - 1] += 400 * (G.level + 1);
                    }
                    G.tsanim = 120;
                    document.getElementById('tspin').innerHTML = "T-SPIN SINGLE";
                    G.btb++;
                } else if (mts) {
                    G.score += 100 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 100 * (G.level + 1);
                    G.tsanim = 90;
                    document.getElementById('tspin').innerHTML = "MINI T-SPIN SINGLE";
                    G.btb++;
                } else {
                    G.btb = -1;
                }
                break;
            default:
                if (tspin) {
                    G.score += 400 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 400 * (G.level + 1);
                    G.tsanim = 120;
                    document.getElementById('tspin').innerHTML = "T-SPIN";
                }
                if (mts) {
                    G.score += 100 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 100 * (G.level + 1);
                    G.tsanim = 90;
                    document.getElementById('tspin').innerHTML = "MINI T-SPIN";
                }
        }
        if (G.mode == 1) {
            G.gravity.are = 10 + Math.floor(this.y / 4) * 2;
            switch (cleared) {
                case 1:
                    G.score += 40 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 40 * (G.level + 1);
                    break;
                case 2:
                    G.score += 100 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 100 * (G.level + 1);
                    break;
                case 3:
                    G.score += 300 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 300 * (G.level + 1);
                    break;
                case 4:
                    G.score += 1200 * (G.level + 1);
                    G.stats.score[G.stats.pieces.length - 1] += 1200 * (G.level + 1);
                    break;
            }
            if (cleared > 0) G.gravity.are += 20;
        }
        for (let x = 0; x < G.grid.length; x++) {
            let line = lines.concat();
            for (let y = 0; y < G.grid[x].length; y++) {
                if (line[y]) {
                    try {
                    //remove down component to cells above
                    if (G.grid[x][y + 1].type !== null) G.grid[x][y + 1].type = G.grid[x][y + 1].type.replace('d', '');
                    //remove up component to cells below
                    if (y > 0) if (G.grid[x][y - 1].type !== null) G.grid[x][y - 1].type = G.grid[x][y - 1].type.replace('u', '');
                    G.grid[x].splice(y, 1);
                    G.grid[x].push(new Cell(false, "#000", false, null, false));
                    line.splice(y, 1);
                    y--;
                    } catch (e) {
                        alert(e.stack);
                    }
                }
            }
        }
        let pc = true;
        for (let px = 0; px < G.grid.length; px++) for (let py = 0; py < G.grid[px].length; py++) {
            if (G.grid[px][py].solid) {
                pc = false;
                //debug.innerHTML = `${px}, ${py}`;
                break;
            }
        }
        if (pc) {
            //debug.innerHTML = `yoy`;
            G.pcanim = 200;
            G.score += 2000 * (G.level + 1);
            G.stats.score[G.stats.pieces.length - 1] += 2000 * (G.level + 1);
            if (G.btb > 0) {
                G.score += 2000 * (G.level + 1);
                G.stats.score[G.stats.pieces.length - 1] += 2000 * (G.level + 1);
            }
        }
        G.stats.pieces[G.stats.pieces.length - 1]++;
        G.stats.totalpieces++;
        if (G.btb > 0) {
            document.getElementById("b2b").innerHTML = "B2B x" + G.btb;
            document.getElementById("b2b").style.display = '';
        } else {
            document.getElementById("b2b").style.display = 'none';
        }

    }
    rotate (rot) {
        let newRot = this.rotation + rot;
        if (newRot > 3) {
            newRot -= 4;
        }
        if (newRot < 0) {
            newRot += 4;
        }
        let kickTable;
        //check if clear
        if (this.type == "I") {
            kickTable = G.srs.kick.I;
        } else {
            kickTable = G.srs.kick.JLTSZ;
        }
        //debug.innerHTML = G.srs[this.type][newRot];
        let valid = false;
        let kickOffset;
        for (let k = 0; k < 5; k++) {
            kickOffset = kickTable[this.rotation][newRot][k];
            let test = true;
            for (let px = 0; px < G.srs[this.type][newRot].length; px++) for (let py = 0; py < G.srs[this.type][newRot][px].length; py++) {
                if (G.srs[this.type][newRot][px][py] != " ") if (
                    this.x + px + kickOffset[0] < 0 || 
                    this.x + px + kickOffset[0] > 9 || 
                    this.y + py + kickOffset[1] < 0) {
                    //debug.innerHTML = JSON.stringify(`${px}, ${py}, ${mx}, ${my}, ${this.x}, ${this.y}, ${px + mx + this.x}, ${py + my + this.y}`);
                    test = false;
                    break;
                } else if (G.grid[this.x + px + kickOffset[0]][this.y + py + kickOffset[1]].solid && !G.grid[this.x + px + kickOffset[0]][this.y + py + kickOffset[1]].moving) {
                    test = false;
                    break;
                }
            }
            if (G.mode == 1) {
                if (test) valid = true;
                break;
            }
            if (!test) continue;
            valid = true;
            break;
        }
        if (!valid) {
            return false;
        }
        //debug.innerHTML = `${this.x}, ${this.y}, ${JSON.stringify(this.footprint)}`;
        //remove footprint from grid
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(false, "#000", false, null, false);
        }
        //rotate
        this.rotation = newRot;
        this.footprint = G.srs[this.type][newRot];
        this.x += kickOffset[0];
        this.y += kickOffset[1];
        if (this !== G.ghost && G.mode != 1) {
            if (G.ghost === null) G.ghost = new Piece(this.type, true);
            G.ghost.color = this.color + "55";
            G.ghost.move(this.x - G.ghost.x, this.y - G.ghost.y);
            G.ghost.rotate(rot);
            while (!G.ghost.onFloor()) {
                G.ghost.move(0, -1);
            }
        }
        //add footprint to new position
        for (let px = 0; px < this.footprint.length; px++) for (let py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, true, this.footprint[px][py], this.ghost);
        }
        this.tspin = true;
        if (kickOffset[0] != 0 || kickOffset[1] != 0) {
            this.mts = true;
        }
        return true;
    }
}

class Cell {
    constructor (solid, color, moving, type, ghost) {
        this.solid = solid;
        this.color = color;
        this.moving = moving;
        this.type = type;
        this.ghost = ghost;
        if (!G.connectedTextures && this.type !== null) {
            this.type = this.type.replace(/[rlud]+/, '');
        }
    }
}

function fallSpeed(level) {
    if (level > 29) return 1;
    return Math.ceil((0.8-((level-1)*-0.0024))**(level)*60);
}

/** @type {Cell[][]} */
G.grid = new Array(10);
for (let x = 0; x < G.grid.length; x++) {
    G.grid[x] = new Array(40);
    for (let y = 0; y < G.grid[x].length; y++) {
        G.grid[x][y] = new Cell(false, "#000", false, null, false);
    }
}

function drawGrid() {
    ctx.strokeStyle = colors[8];
    for (let x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.moveTo(0, 0 + cellSize * 2);
    ctx.lineTo(canvas.width, cellSize * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
}
function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (G.paused) {
        nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
        return;
    }
    if (!G.lose) {
        G.stats.actions.push(0);
        G.stats.pieces.push(0);
        G.stats.score.push(0);
    }
    /*if (G.stats.actions.length > 1800) G.stats.actions.shift();
    if (G.stats.pieces.length > 1800) G.stats.pieces.shift();
    if (G.stats.score.length > 1800) G.stats.score.shift();*/
    try {
        if (G.key.down.left || G.key.down.right) {
            G.key.das.left--;
            if (G.key.das.left <= 0) {
                if (G.key.down.left) G.piece.move(-1, 0);
                if (G.key.down.right) G.piece.move(1, 0);
                G.key.das.left = G.key.das.speed;
            }
        }
    } catch {};
    if (G.level.toString().length < 2) levelDisplay = "0".repeat(2 - G.level.toString().length) + G.level;
    else levelDisplay = G.level;
    if (G.lines.toString().length < 4) lineDisplay = "0".repeat(4 - G.lines.toString().length) + G.lines;
    else lineDisplay = G.line;
    if (G.score.toString().length < 7) scoreDisplay = "0".repeat(7 - G.score.toString().length) + G.score;
    else scoreDisplay = G.score;
    G.display.innerHTML = `LEVEL ${levelDisplay} | LINES ${lineDisplay} | SCORE ${scoreDisplay}`;
    drawGrid();
    for (let x = 0; x < G.grid.length; x++) for (let y = 0; y < G.grid[x].length; y++) {
        ctx.fillStyle = G.grid[x][y].color;
        if (G.grid[x][y].solid) {
            try {
                if (G.grid[x][y].ghost) {
                    ctx.globalAlpha = 0.5;
                }
                let atlasKey = G.grid[x][y].type;
                if (!G.connectedTextures) atlasKey = atlasKey.replace(/[rlud]+/, '');
                ctx.drawImage(G.img, G.atlas[atlasKey][0] * 24, G.atlas[atlasKey][1] * 24, 24, 24, x * (cellSize), (G.grid[x].length - y - 19) * (cellSize), cellSize, cellSize);
                ctx.globalAlpha = 1;
            } catch (err) {
                //debug.innerHTML = err.stack;
            }
        }
    }
    if (G.lose == true) {
        document.body.style.backgroundColor = "#300";
        return;
    } else {
        document.body.style.backgroundColor = "#000";
    }
    if (G.piece == null) {
        if (--G.gravity.are <= 0) {
            let piece = Math.floor(Math.random() * G.bag.length);
            G.piece = new Piece(G.next.shift(), false);
            G.next.push(G.bag[piece]);
            if (G.firstHold) {
                G.firstHold--;
            } else {
                G.holdable = true;
            }
            G.gravity.fall = 0;
            G.bag.splice(piece, 1);
            if (G.bag.length == 0) {
                G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
            }
            if (G.mode != 1) G.gravity.lock = 60;
            else G.gravity.lock = 0;
            drawNext();
        }
    } else {
        if (G.mode != 1) G.gravity.are = 60 / (G.level + 1);
    }
    //debug.innerHTML = `${G.gravity.fall}, ${G.gravity.speed}, ${G.gravity.speedup}`;
    G.gravity.fall--;
    while (G.gravity.fall <= 0) {
        if (G.piece.move(0, -1) && G.key.down.soft) G.score++;
        G.gravity.fall += G.gravity.speed;
    }
    if (G.piece.onFloor()) {
        if (--G.gravity.lock <= 0) {
            try {
                G.piece.lock();
            } catch (err) {
                //debug.innerHTML = err.stack;
            }
            G.piece = null;
        }
    } else {
        if (G.mode != 1) G.gravity.lock = 60;
        else G.gravity.lock = 5;
    }
    G.tsanim--;
    if (G.tsanim > 60) {
        document.getElementById('tspin').style.opacity = 1;
    }
    if (G.tsanim <= 60) {
        document.getElementById('tspin').style.opacity = G.tsanim / 60;
    }
    G.pcanim--;
    if (G.pcanim > 100) {
        document.getElementById('pc').style.opacity = 1;
    }
    if (G.pcanim <= 100) {
        document.getElementById('pc').style.opacity = G.pcanim / 100;
    }
    //debug.innerHTML = `${G.stats.pieces.length}, ${G.stats.actions.length}, ${G.stats.score.length}`
    document.getElementById('pcs').innerHTML = "Pieces: " + G.stats.totalpieces;
    document.getElementById('pps').innerHTML = "PPS: " + (G.stats.pieces.reduce((a, b) => a + b) / G.stats.pieces.length * 60).toFixed(2) + "/s";
    document.getElementById('apm').innerHTML = "APM: " + (G.stats.actions.reduce((a, b) => a + b) / G.stats.actions.length * 3600).toFixed(1) + "/m";
    document.getElementById('sps').innerHTML = "SPS: " + (G.stats.score.reduce((a, b) => a + b) / G.stats.score.length * 60).toFixed(1) + "/s";
}

function newGame() {
    G.level = parseInt(document.getElementById('start-level').value);
    G.paused = false;
    G.gravity.speed = fallSpeed(G.level);
    G.gravity.fall = G.gravity.speed;
    G.gravity.lock = 60;
    G.gravity.are = 60;
    G.lose = false;
    G.key.down = {
        left: false,
        right: false,
        soft: false,
    };
    G.mode = parseInt(document.getElementById('mode').value);
    G.score = 0;
    G.lines = 0;
    G.btb = -1;
    G.tsanim = 0;
    document.getElementById("b2b").style.display = 'none';
    G.nextLevel = Math.min(G.level * 10 + 10, Math.max(100, G.level * 10 - 50));
    G.piece = null;
    G.ghost = null;
    G.firstHold = 2;
    G.holdable = true;
    G.hold = null;
    G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
    G.next = [];
    for (let i = 0; i < 5; i++) {
        let piece = Math.floor(Math.random() * G.bag.length);
        G.next.push(G.bag[piece]);
        if (G.mode != 1) G.bag.splice(piece, 1);
        if (G.bag.length == 0) {
            G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
        }
    }
    drawNext();
    holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
    G.grid = new Array(10);
    for (let x = 0; x < G.grid.length; x++) {
        G.grid[x] = new Array(40);
        for (let y = 0; y < G.grid[x].length; y++) {
            G.grid[x][y] = new Cell(false, "#000", false, null, false);
        }
    }
    G.display.innerHTML = `LEVEL ${"0".repeat(2 - G.level.toString.length) + G.level} | LINES 0000 | SCORE 0000000`;
    G.stats.pieces = [0];
    G.stats.actions = [0];
    G.stats.score = [0];
    G.stats.totalpieces = 0;
}

function drawNext() {
    //update next display
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    for (n = 0; n < 5; n++) {
        nextStartLeft = (4 - G.pieces[G.next[n]].width) / 2;
        nextStartTop = (3 - G.pieces[G.next[n]].height) / 2;
        nextCtx.fillStyle = G.pieces[G.next[n]].color;
        for (let x = 0; x < G.pieces[G.next[n]].width; x++) for(let y = 0; y < G.pieces[G.next[n]].height; y++) {
            let atlasKey = G.pieces[G.next[n]].shape[x][y];
            if (!G.connectedTextures) atlasKey = atlasKey.replace(/[rlud]+/, "");
            if (G.pieces[G.next[n]].shape[x][y] != " ") nextCtx.drawImage(G.img, G.atlas[atlasKey][0] * 24, G.atlas[atlasKey][1] * 24, cellSize, cellSize, (nextStartLeft + x) * cellSize, (nextStartTop + (G.pieces[G.next[n]].height - y - 1 + (n * 3))) * cellSize, cellSize, cellSize);
        }
        if (G.mode == 1) break;
    }
}

function updateSettings() {
    try {
    let dasDelay = parseInt(document.getElementById('das-delay').value);
    G.key.das.delay = dasDelay;
    let dasSpeed = parseInt(document.getElementById('das-speed').value);
    G.key.das.speed = dasSpeed;
    let softSpeed = parseInt(document.getElementById('soft-drop-speed').value);
    G.gravity.speedup = softSpeed;
    let connectedTextures = document.getElementById('connected-textures').value;
    let reload = false;
    let newSkin = document.getElementById('select-skin').value;
    if (newSkin == "custom") {
        newSkin = document.getElementById('skin-file').value;
    }
    if (G.skinLocation != newSkin) reload = true;
    G.skinLocation = newSkin;
    if (connectedTextures == "true") {
        G.connectedTextures = true;
    } else {
        G.connectedTextures = false;
    }
    let settingsExport = {
        bindings: G.key.bindings,
        das: G.key.das,
        softSpeed: G.gravity.speedup,
        connectedTextures: G.connectedTextures,
        skin: G.skinLocation,
    }
    window.localStorage.setItem("settings", JSON.stringify(settingsExport));
    if (reload) {
        alert("Skin location change detected. This page will now be reloaded.");
        location.reload();
    }
    } catch (e) {
        alert(e.stack);
    } 
}

function rebind(key) {
    if (G.bind == null) {
        G.bind = key;
        document.getElementById('key-' + key).innerHTML = "PRESS KEY";
    }
}

function pause() {
    G.paused = !G.paused;
    if (G.paused) {
        document.getElementById('pause').innerHTML = "RESUME";
    } else {
        document.getElementById('pause').innerHTML = "PAUSE";
        drawNext();
    }
}

document.addEventListener('keydown', (e) => {
    if (["ArrowDown", "Space"].includes(e.code)) e.preventDefault();
    if (G.bind != null) {
        G.key.bindings[G.bind] = e.code;
        document.getElementById('key-' + G.bind).innerHTML = e.code.replace("Arrow", "").replace("Key", "");
        G.bind = null;
        return;
    }
    if (e.code == G.key.bindings.retry) {
        newGame();
        return;
    }
    if (G.lose) return;
    if (e.code == G.key.bindings.pause) {
        pause();
    }
    if (e.code == G.key.bindings.left) {
        if (!G.key.down.left) {
            G.piece.move(-1, 0);
            G.key.das.left = G.key.das.delay;
        }
        G.key.down.left = true;
        G.stats.actions[G.stats.pieces.length - 1]++;
    }
    if (e.code == G.key.bindings.right) {
        if (!G.key.down.right) {
            G.piece.move(1, 0);
            G.key.das.left = G.key.das.delay;
        }
        G.key.down.right = true;
        G.stats.actions[G.stats.pieces.length - 1]++;
    }
    if (e.code == G.key.bindings.soft) {
        if (!G.key.down.soft) {
            G.gravity.speed = fallSpeed(G.level) / G.gravity.speedup;
            G.gravity.fall = G.gravity.speed;
        }
        G.key.down.soft = true;
        G.stats.actions[G.stats.pieces.length - 1]++;
    }
    if (e.code == G.key.bindings.hard && G.mode != 1) {
        while (!G.piece.onFloor()) {
            G.piece.move(0, -1);
            G.score += 2;
            G.stats.score[G.stats.pieces.length - 1] += 2;
        }
        G.piece.lock();
        G.piece = null;
        G.gravity.are = 0;
        G.gravity.fall = 0;
        G.stats.actions[G.stats.pieces.length - 1]++;
    }
    if (e.code == G.key.bindings.hold && G.holdable && G.mode != 1) {
        let newPiece = G.hold;
        G.hold = G.piece.type;
        G.piece.remove();
        G.ghost.remove();
        G.ghost = null;
        if (newPiece !== null) {
            G.piece = new Piece(newPiece, false);
            G.gravity.fall = 0;
        } else {
            G.piece = null;
        }
        G.gravity.are = 0;
        //update hold display
        holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
        holdStartLeft = (4 - G.pieces[G.hold].width) / 2;
        holdStartTop = (3 - G.pieces[G.hold].height) / 2;
        holdCtx.fillStyle = G.pieces[G.hold].color;
        for (let x = 0; x < G.pieces[G.hold].width; x++) for(let y = 0; y < G.pieces[G.hold].height; y++) {
            let atlasKey = G.pieces[G.hold].shape[x][y];
            if (!G.connectedTextures) atlasKey = atlasKey.replace(/[rlud]+/, '');
            if (G.pieces[G.hold].shape[x][y] != " ") holdCtx.drawImage(G.img, G.atlas[atlasKey][0] * 24, G.atlas[atlasKey][1] * 24, 24, 24, (holdStartLeft + x) * cellSize, (holdStartTop + (G.pieces[G.hold].height - y - 1)) * cellSize, cellSize, cellSize);
        }
        G.holdable = false;
        G.stats.actions[G.stats.pieces.length - 1]++;
    }
    try {
        if (e.code == G.key.bindings.rotateCW) {
            G.piece.rotate(1);
            G.stats.actions[G.stats.pieces.length - 1]++;
        }
        if (e.code == G.key.bindings.rotateCCW) {
            G.piece.rotate(-1);
            G.stats.actions[G.stats.pieces.length - 1]++;
        }
    } catch (err) {
        //debug.innerHTML = err.stack;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code == G.key.bindings.left) {
        G.key.down.left = false;
    }
    if (e.code == G.key.bindings.right) {
        G.key.down.right = false;
    }
    if (e.code == G.key.bindings.soft) {
        if (G.key.down.soft) {
            G.gravity.speed = fallSpeed(G.level);
        }
        G.key.down.soft = false;
    }
});

G.img = new Image();
async function Load() {
    let response, data;
    try {
        response = await fetch(G.skinLocation);
        data = await response.json();
    } catch (e) {
        response = await fetch("skins/default.json");
        data = await response.json();
    }
    G.skin = data;
    G.img.src = G.skin.src;
    G.img.onload = () => setInterval(main, 1000/60);
}

Load();