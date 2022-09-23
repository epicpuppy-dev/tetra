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
canvas.width = cellSize * 10 + 9;
canvas.height = cellSize * 22 + 20;
holdCanvas.width = cellSize * 4 + 3;
holdCanvas.height = cellSize * 3 + 3;
nextCanvas.width = cellSize * 4 + 3;
nextCanvas.height = cellSize * 15 + 14;
ctx.lineWidth = 1;
colors = ["#000000", "#00ffff", "#0000ff", "#ff8800", "#ffff00", "#00ff00", "#dd00dd", "#ff0000", "#222222"];
const G = {};
G.level = 6;
G.gravity = {};
G.gravity.speed = fallSpeed(G.level);
G.gravity.fall = G.gravity.speed;
G.gravity.lock = 60;
G.gravity.are = 60;
G.bind = null;
G.hold = null;
G.holdable = true;
G.firstHold = true;
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
    G.bag.splice(piece, 1);
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

class Piece {
    constructor (type) {
        this.x = 3;
        this.y = 20;
        this.locked = false;
        this.rotation = 0;
        this.type = type;
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
            if (this.footprint[x][y] != " ") G.grid[this.x + x][this.y + y] = new Cell(true, this.color, true);
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
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(false, "#000", false);
        }
        //move piece position
        this.x += mx;
        this.y += my;
        //add footprint to new position
        if (this !== G.ghost) {
            if (G.ghost === null) G.ghost = new Piece(this.type);
            G.ghost.color = this.color + "55";
            G.ghost.move(this.x - G.ghost.x, this.y - G.ghost.y);
            while (!G.ghost.onFloor()) {
                G.ghost.move(0, -1);
            }
        }
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, true);
        }
        //debug.innerHTML = JSON.stringify(`${mx}, ${my}, ${this.x}, ${this.y}, ${px + mx + this.x}, ${py + my + this.y}`);
        return true;
    }
    remove () {
        //remove footprint from grid
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(false, "#000", false);
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
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, false);
        }
        this.locked = true;
        G.ghost = null;
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
            if (!test) {
                continue;
            }
            valid = true;
            break;
        }
        if (!valid) {
            return false;
        }
        //debug.innerHTML = `${this.x}, ${this.y}, ${JSON.stringify(this.footprint)}`;
        //remove footprint from grid
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(false, "#000", false);
        }
        //rotate
        this.rotation = newRot;
        this.footprint = G.srs[this.type][newRot];
        this.x += kickOffset[0];
        this.y += kickOffset[1];
        if (this !== G.ghost) {
            if (G.ghost === null) G.ghost = new Piece(this.type);
            G.ghost.color = this.color + "55";
            G.ghost.move(this.x - G.ghost.x, this.y - G.ghost.y);
            G.ghost.rotate(rot);
            while (!G.ghost.onFloor()) {
                G.ghost.move(0, -1);
            }
        }
        //add footprint to new position
        for (var px = 0; px < this.footprint.length; px++) for (var py = 0; py < this.footprint[px].length; py++) {
            if (this.footprint[px][py] != " ") G.grid[this.x + px][this.y + py] = new Cell(true, this.color, true);
        }
        return true;
    }
}

class Cell {
    constructor (solid, color, moving) {
        this.solid = solid;
        this.color = color;
        this.moving = moving;
    }
}

function fallSpeed(level) {
    return Math.ceil((0.8-((level-1)*0.007))**(level-1)*60);
}

/** @type {Cell[][]} */
G.grid = new Array(10);
for (var x = 0; x < G.grid.length; x++) {
    G.grid[x] = new Array(40);
    for (var y = 0; y < G.grid[x].length; y++) {
        G.grid[x][y] = new Cell(false, "#000", false);
    }
}

function drawGrid() {
    ctx.strokeStyle = colors[8];
    for (var x = -0.5; x < canvas.width; x += cellSize + 1) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (var y = -0.5; y < canvas.height; y += cellSize + 1) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.moveTo(0, -0.5 + cellSize * 2 + 2);
    ctx.lineTo(canvas.width, -0.5 + cellSize * 2 + 2);
    ctx.stroke();
    ctx.lineWidth = 1;
}
function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
        if (G.key.down.left || G.key.down.right) {
            G.key.das.left--;
            if (G.key.das.left <= 0) {
                if (G.key.down.left) G.piece.move(-1, 0);
                if (G.key.down.right) G.piece.move(1, 0);
                G.key.das.left = G.key.das.speed;
            }
        }
    } catch {}
    checkLines();
    for (var x = 0; x < G.grid.length; x++) for (var y = 0; y < G.grid[x].length; y++) {
        ctx.fillStyle = G.grid[x][y].color;
        ctx.fillRect(x * (cellSize + 1), (G.grid[x].length - y - 19) * (cellSize + 1), cellSize, cellSize);
    }
    drawGrid();
    if (G.piece == null) {
        if (--G.gravity.are <= 0) {
            var piece = Math.floor(Math.random() * G.bag.length);
            G.piece = new Piece(G.next.shift());
            G.next.push(G.bag[piece]);
            if (!G.firstHold) {
                G.holdable = true;
            } else {
                G.firstHold = false;
            }
            G.gravity.fall = 0;
            G.bag.splice(piece, 1);
            if (G.bag.length == 0) {
                G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
            }
            drawNext();
        }
    } else {
        G.gravity.are = 60 / G.level;
    }
    G.gravity.fall--;
    if (G.gravity.fall <= 0) {
        G.piece.move(0, -1);
        G.gravity.fall = G.gravity.speed;
    }
    if (G.piece.onFloor()) {
        if (--G.gravity.lock <= 0) {
            G.piece.lock();
            G.piece = null;
        }
    } else {
        G.gravity.lock = 60;
    }
}

function newGame() {
    G.level = 5;
    G.gravity = {};
    G.gravity.speed = fallSpeed(G.level);
    G.gravity.fall = G.gravity.speed;
    G.gravity.lock = 60;
    G.gravity.are = 60;
    G.key.down = {
        left: false,
        right: false,
        soft: false,
    };
    G.piece = null;
    G.ghost = null;
    G.firstHold = true;
    G.hold = null;
    G.bag = ["I", "J", "L", "O", "S", "T", "Z"];
    G.next = [];
    for (var i = 0; i < 5; i++) {
        var piece = Math.floor(Math.random() * G.bag.length);
        G.next.push(G.bag[piece]);
        G.bag.splice(piece, 1);
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
            G.grid[x][y] = new Cell(false, "#000", false);
        }
    }
}

function checkLines() {
    var lines = new Array(G.grid[0].length).fill(true);
    for (var x = 0; x < G.grid.length; x++) {
        for (var y = 0; y < G.grid[x].length; y++) {
            if (!G.grid[x][y].solid || G.grid[x][y].moving) {
                lines[y] = false;
            }
        }
    }
    for (var x = 0; x < G.grid.length; x++) {
        var line = lines.concat();
        for (var y = 0; y < G.grid[x].length; y++) {
            if (line[y]) {
                G.grid[x].splice(y, 1);
                G.grid[x].push(new Cell(false, "#000", false));
                line.splice(y, 1);
                y--;
            }
        }
    }
}

function drawNext() {
    //update next display
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    for (n = 0; n < 5; n++) {
        nextStartLeft = (4 - G.pieces[G.next[n]].width) / 2;
        nextStartTop = (3 - G.pieces[G.next[n]].height) / 2;
        nextCtx.fillStyle = G.pieces[G.next[n]].color;
        for (var x = 0; x < G.pieces[G.next[n]].width; x++) for(var y = 0; y < G.pieces[G.next[n]].height; y++) {
            if (G.pieces[G.next[n]].shape[x][y] != " ") nextCtx.fillRect((nextStartLeft + x) * cellSize, (nextStartTop + (G.pieces[G.next[n]].height - y - 1 + (n * 3))) * cellSize, cellSize, cellSize);
        }
    }
}

setInterval(main, 1000/60);

function updateSettings() {
    var blockSize = parseInt(document.getElementById('cell-size').value);
    cellSize = blockSize;
    canvas.width = cellSize * 10 + 9;
    canvas.height = cellSize * 22 + 20;
    holdCanvas.width = cellSize * 4 + 3;
    holdCanvas.height = cellSize * 4 + 3;
    nextCanvas.width = cellSize * 4 + 3;
    nextCanvas.height = cellSize * 15 + 14;
    var dasDelay = parseInt(document.getElementById('das-delay').value);
    G.key.das.delay = dasDelay;
    var dasSpeed = parseInt(document.getElementById('das-speed').value);
    G.key.das.speed = dasSpeed;
    window.localStorage.setItem("bindings", JSON.stringify(G.key.bindings));
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
    }
    if (e.code == G.key.bindings.right) {
        if (!G.key.down.right) {
            G.piece.move(1, 0);
            G.key.das.left = G.key.das.delay;
        }
        G.key.down.right = true;
    }
    if (e.code == G.key.bindings.soft) {
        if (!G.key.down.soft) {
            G.gravity.speed /= 10;
            G.gravity.fall = 0;
        }
        G.key.down.soft = true;
    }
    if (e.code == G.key.bindings.hard) {
        while (!G.piece.onFloor()) {
            G.piece.move(0, -1);
        }
        G.piece.lock();
        G.piece = null;
        G.gravity.are = 0;
        G.gravity.fall = 0;
    }
    if (e.code == G.key.bindings.hold && G.holdable) {
        var newPiece = G.hold;
        G.hold = G.piece.type;
        G.piece.remove();
        G.ghost.remove();
        G.ghost = null;
        if (newPiece !== null) {
            G.piece = new Piece(newPiece);
            G.gravity.fall = 0;
        } else {
            G.piece = null;
        }
        //update hold display
        holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
        holdStartLeft = (4 - G.pieces[G.hold].width) / 2;
        holdStartTop = (3 - G.pieces[G.hold].height) / 2;
        holdCtx.fillStyle = G.pieces[G.hold].color;
        for (var x = 0; x < G.pieces[G.hold].width; x++) for(var y = 0; y < G.pieces[G.hold].height; y++) {
            if (G.pieces[G.hold].shape[x][y] != " ") holdCtx.fillRect((holdStartLeft + x) * cellSize, (holdStartTop + (G.pieces[G.hold].height - y - 1)) * cellSize, cellSize, cellSize);
        }
        debug.innerHTML = `${holdStartLeft}, ${holdStartBottom}, ${JSON.stringify(G.pieces[G.hold])}`;
        G.holdable = false;
        G.gravity.are = 0;
    }
    try {
        if (e.code == G.key.bindings.rotateCW) {
            G.piece.rotate(1);
        }
        if (e.code == G.key.bindings.rotateCCW) {
            G.piece.rotate(-1);
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
            G.gravity.speed *= 10;
        }
        G.key.down.soft = false;
    }
});