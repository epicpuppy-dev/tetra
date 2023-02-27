const canvas = document.getElementById('game');
const holdCanvas = document.getElementById('hold-canvas');
const nextCanvas = document.getElementById('next-canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
/** @type {CanvasRenderingContext2D} */
const holdCtx = holdCanvas.getContext('2d');
/** @type {CanvasRenderingContext2D} */
const nextCtx = nextCanvas.getContext('2d');
var cellSize = 24;
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
const G = {};
G.display = document.getElementById('score');
G.level = 0;
G.mode = 0;
G.score = 0;
G.lines = 0;
G.btb = -1;
G.lose = false;
G.tsanim = 0;
G.pcanim = 0;
G.nextLevel = 10;
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
G.img = new Image();
G.img.src = 'img.png';
G.img.onload = setInterval(main, 1000/60);
G.atlas = {
    I: [0, 0],
    J: [24, 0],
    L: [48, 0],
    O: [72, 0],
    S: [0, 24],
    T: [24, 24],
    Z: [48, 24]
}
G.pieces = {
    I: {
        width: 4,
        height: 1,
        shape: ["i", "i", "i", "i"],
        color: colors[1]
    },
    J: {
        width: 3,
        height: 2,
        shape: ["jj", "j ", "j "],
        color: colors[2]
    },
    L: {
        width: 3,
        height: 2,
        shape: ["l ", "l ", "ll"],
        color: colors[3]
    },
    O: {
        width: 2,
        height: 2,
        shape: ["oo", "oo"],
        color: colors[4]
    },
    S: {
        width: 3,
        height: 2,
        shape: ["s ", "ss", " s"],
        color: colors[5]
    },
    T: {
        width: 3,
        height: 2,
        shape: ["t ", "tt", "t "],
        color: colors[6]
    },
    Z: {
        width: 3,
        height: 2,
        shape: [" z", "zz", "z "],
        color: colors[7]
    }
};
G.srs = {};
G.srs.I = [
    ["  i ","  i ","  i ","  i "],
    ["    ","    ","iiii","    "],
    [" i  "," i  "," i  "," i  "],
    ["    ","iiii","    ","    "]
];
G.srs.J = [
    [" jj "," j  "," j  ","    "],
    ["    ","jjj ","  j ","    "],
    [" j  "," j  ","jj  ","    "],
    ["j   ","jjj ","    ","    "]
];
G.srs.L = [
    [" l  "," l  "," ll ","    "],
    ["    ","lll ","l   ","    "],
    ["ll   "," l  "," l ","    "],
    ["  l ","lll ","    ","    "]
];
G.srs.O = [
    ["    "," oo "," oo ","    "],
    ["    "," oo "," oo ","    "],
    ["    "," oo "," oo ","    "],
    ["    "," oo "," oo ","    "]
];
G.srs.S = [
    [" s  "," ss ","  s ","    "],
    ["    "," ss ","ss  ","    "],
    ["s   ","ss  "," s  ","    "],
    [" ss ","ss  ","    ","    "]
];
G.srs.T = [
    [" t  "," tt "," t  ","    "],
    ["    ","ttt "," t  ","    "],
    [" t  ","tt  "," t  ","    "],
    [" t  ","ttt ","    ","    "]
];
G.srs.Z = [
    ["  z "," zz "," z  ","    "],
    ["    ","zz  "," zz ","    "],
    [" z  ","zz  ","z   ","    "],
    ["zz  "," zz ","    ","    "]
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
for (var i = 0; i < 5; i++) {
    var piece = Math.floor(Math.random() * G.bag.length);
    G.next.push(G.bag[piece]);
    if (G.mode != 1) G.bag.splice(piece, 1);
    if (G.bag.length == 0) {
        G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
    }
}
drawNext();
G.key = {};
G.key.bindings = {
    left: "ArrowLeft",
    right: "ArrowRight",
    soft: "ArrowDown",
    hard: "Space",
    rotateCW: "KeyX",
    rotateCCW: "KeyZ",
    hold: "ShiftLeft"
};
bindingsData = window.localStorage.getItem("bindings");
if (bindingsData !== null) {
    G.key.bindings = JSON.parse(bindingsData);
    for (const key of ["left", "right", "soft", "hard", "rotateCW", "rotateCCW", "hold"]) {
        document.getElementById('key-' + key).innerHTML = G.key.bindings[key];
    }
}
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
                this.footprint = ["  i ","  i ","  i ","  i "];
                break;
            case "J":
                this.color = colors[2];
                this.footprint = [" jj "," j  "," j  ","    "];
                break;
            case "L":
                this.color = colors[3];
                this.footprint = [" l  "," l  "," ll ","    "];
                break;
            case "O":
                this.color = colors[4];
                this.footprint = ["    "," oo "," oo ","    "];
                break;
            case "S":
                this.color = colors[5];
                this.footprint = [" s  "," ss ","  s ","    "];
                break;
            case "T":
                this.color = colors[6];
                this.footprint = [" t  "," tt "," t  ","    "];
                break;
            case "Z":
                this.color = colors[7];
                this.footprint = ["  z "," zz "," z  ","    "];
                break;
        }
        for (var x = 0; x < this.footprint.length; x++) for (var y = 0; y < this.footprint[x].length; y++) {
            if (this.footprint[x][y] != " ") if (G.grid[this.x + x][this.y + y].solid) lose = true;
        }
        for (var x = 0; x < this.footprint.length; x++) for (var y = 0; y < this.footprint[x].length; y++) {
            if (this.footprint[x][y] != " ") G.grid[this.x + x][this.y + y] = new Cell(true, this.color, true, this.type, this.ghost);
        }
    }
    move (mx, my) {
        if (this.locked) return;
        //check if on wall or floor
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
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
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
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
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, true, this.type, this.ghost);
        }
        //debug.innerHTML = JSON.stringify(`${mx}, ${my}, ${this.x}, ${this.y}, ${px + mx + this.x}, ${py + my + this.y}`);
        this.mts = false;
        this.tspin = false;
        return true;
    }
    remove () {
        //remove footprint from grid
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(false, "#000", false, null, false);
        }
    }
    onFloor () {
        //check if on wall or floor
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
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
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, false, this.type, this.ghost);
        }
        this.locked = true;
        G.ghost = null;
        //clear lines
        var lines = new Array(G.grid[0].length).fill(true);
        for (var x = 0; x < G.grid.length; x++) {
            for (var y = 0; y < G.grid[x].length; y++) {
                if (!G.grid[x][y].solid || G.grid[x][y].moving) {
                    lines[y] = false;
                }
            }
        }
        var cleared = 0;
        for (var l = 0; l < lines.length; l++) {
            if (lines[l]) cleared++;
        }
        G.lines += cleared;
        G.nextLevel -= cleared;
        var tspin = false;
        var mts = false;
        if (this.type == "T" && this.tspin) {
            var corners = 0;
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
        for (var x = 0; x < G.grid.length; x++) {
            var line = lines.concat();
            for (var y = 0; y < G.grid[x].length; y++) {
                if (line[y]) {
                    G.grid[x].splice(y, 1);
                    G.grid[x].push(new Cell(false, "#000", false, null, false));
                    line.splice(y, 1);
                    y--;
                }
            }
        }
        var pc = true;
        for (var px = 0; px < G.grid.length; px++) for (var py = 0; py < G.grid[px].length; py++) {
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
        var newRot = this.rotation + rot;
        if (newRot > 3) {
            newRot -= 4;
        }
        if (newRot < 0) {
            newRot += 4;
        }
        //check if clear
        if (this.type == "I") {
            var kickTable = G.srs.kick.I;
        } else {
            var kickTable = G.srs.kick.JLTSZ;
        }
        //debug.innerHTML = G.srs[this.type][newRot];
        var valid = false;
        for (var k = 0; k < 5; k++) {
            var kickOffset = kickTable[this.rotation][newRot][k];
            var test = true;
            for (var px = 0; px < G.srs[this.type][newRot].length; px++) for (var py = 0; py < G.srs[this.type][newRot][px].length; py++) {
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
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, true, this.type, this.ghost);
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
    }
}

function fallSpeed(level) {
    if (level > 29) return 1;
    return Math.ceil((0.8-((level-1)*-0.0024))**(level)*60);
}

/** @type {Cell[][]} */
G.grid = new Array(10);
for (var x = 0; x < G.grid.length; x++) {
    G.grid[x] = new Array(40);
    for (var y = 0; y < G.grid[x].length; y++) {
        G.grid[x][y] = new Cell(false, "#000", false, null, false);
    }
}

function drawGrid() {
    ctx.strokeStyle = colors[8];
    for (var x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (var y = 0; y < canvas.height; y += cellSize) {
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
    G.stats.actions.push(0);
    G.stats.pieces.push(0);
    G.stats.score.push(0);
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
    for (var x = 0; x < G.grid.length; x++) for (var y = 0; y < G.grid[x].length; y++) {
        ctx.fillStyle = G.grid[x][y].color;
        if (G.grid[x][y].solid) {
            try {
                if (G.grid[x][y].ghost) {
                    ctx.globalAlpha = 0.5;
                }
                ctx.drawImage(G.img, G.atlas[G.grid[x][y].type][0], G.atlas[G.grid[x][y].type][1], 24, 24, x * (cellSize), (G.grid[x].length - y - 19) * (cellSize), cellSize, cellSize);
                ctx.globalAlpha = 1;
            } catch (err) {
                //debug.innerHTML = err.stack;
            }
        }
    }
    if (G.piece == null) {
        if (--G.gravity.are <= 0) {
            var piece = Math.floor(Math.random() * G.bag.length);
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
    debug.innerHTML = G.gravity.fall;
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
    G.gravity = {};
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
    G.btb = 0;
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
    for (var i = 0; i < 5; i++) {
        var piece = Math.floor(Math.random() * G.bag.length);
        G.next.push(G.bag[piece]);
        if (G.mode != 1) G.bag.splice(piece, 1);
        if (G.bag.length == 0) {
            G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
        }
    }
    drawNext();
    holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
    G.grid = new Array(10);
    for (var x = 0; x < G.grid.length; x++) {
        G.grid[x] = new Array(40);
        for (var y = 0; y < G.grid[x].length; y++) {
            G.grid[x][y] = new Cell(false, "#000", false, null, false);
        }
    }
    G.display.innerHTML = `LEVEL ${G.level} | LINES 0000 | SCORE 0000000`;
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
        for (var x = 0; x < G.pieces[G.next[n]].width; x++) for(var y = 0; y < G.pieces[G.next[n]].height; y++) {
            if (G.pieces[G.next[n]].shape[x][y] != " ") nextCtx.drawImage(G.img, G.atlas[G.next[n]][0], G.atlas[G.next[n]][1], cellSize, cellSize, (nextStartLeft + x) * cellSize, (nextStartTop + (G.pieces[G.next[n]].height - y - 1 + (n * 3))) * cellSize, cellSize, cellSize);
        }
        if (G.mode == 1) break;
    }
}

function updateSettings() {
    var dasDelay = parseInt(document.getElementById('das-delay').value);
    G.key.das.delay = dasDelay;
    var dasSpeed = parseInt(document.getElementById('das-speed').value);
    G.key.das.speed = dasSpeed;
    var softSpeed = parseInt(document.getElementById('soft-drop-speed').value);
    G.gravity.speedup = softSpeed;
    window.localStorage.setItem("bindings", JSON.stringify(G.key.bindings));
    window.localStorage.setItem("das", JSON.stringify(G.key.das));
}

function rebind(key) {
    if (G.bind == null) {
        G.bind = key;
        document.getElementById('key-' + key).innerHTML = "PRESS KEY";
    }
}

document.addEventListener('keydown', (e) => {
    if (["ArrowDown", "Space"].includes(e.code)) e.preventDefault();
    if (G.bind != null) {
        G.key.bindings[G.bind] = e.code;
        document.getElementById('key-' + G.bind).innerHTML = e.code;
        G.bind = null;
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
        var newPiece = G.hold;
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
        for (var x = 0; x < G.pieces[G.hold].width; x++) for(var y = 0; y < G.pieces[G.hold].height; y++) {
            if (G.pieces[G.hold].shape[x][y] != " ") holdCtx.drawImage(G.img, G.atlas[G.hold][0], G.atlas[G.hold][1], 24, 24, (holdStartLeft + x) * cellSize, (holdStartTop + (G.pieces[G.hold].height - y - 1)) * cellSize, cellSize, cellSize);
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