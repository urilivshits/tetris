//----------------------- Defining the global variables
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

width = canvas.width;
height = canvas.height;
time = 400;
lost = false;
tetris = [];
elements = 0;
activeBlocks = [];
position = 0;
blocksSpliced = 0;
paused = false;
speed = 1;
score = 0;

//----------------------- Dividing the Canvas into Blocks
blockSize = 10;
widthInBlocks = width / blockSize;
heightInBlocks = height / blockSize;

//----------------------- Adding the Start Over container
startOver = () => {
    if (lost === true) {
        $("#buttonsContainer").hide();
        $("#startContainer").show();
        $("#start").css({
            width: "100%",
            height: "100%"
        })
    }
    else if (lost === false) {
        $("#buttonsContainer").show();
        $("#startContainer").hide();
    
    }
}

//----------------------- Displaying the Score
drawScore = () => {
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "blanchedalmond";
    ctx.font = "20px Comic Sans";
    ctx.fillText("Score: " + score, blockSize, blockSize);
};

//----------------------- Displaying the Speed
drawSpeed = () => {
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "blanchedalmond";
    ctx.font = "20px Comic Sans";
    ctx.fillText("Speed: " + speed, width - 90, blockSize);
};

//----------------------- Adding random X for the starting element;
x = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
xBorderCheck = () => {
    tetris[elements].segments.map((oldX) => {
        if (oldX.col < 1) {
            tetris[elements].segments.map(newX => newX.col += 1);
        }
        else if (oldX.col < 0) {
            tetris[elements].segments.map(newX => newX.col += 2);
        }
        else if (oldX.col > widthInBlocks - 2) {
            tetris[elements].segments.map(newX => newX.col -= 1);
        }
        else if (oldX.col > widthInBlocks - 1) {
            tetris[elements].segments.map(newX => newX.col -= 2);
        }
    });
};

//----------------------- Drawing the Border
drawBorder = () => {
    ctx.fillStyle = "#2b3445";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

//----------------------- Drawing all the active tetris elements
drawAllActiveBlocks = () => {
    activeBlocks.map((value => value.drawSquare()));
};

//----------------------- Splicing all the occupied rows
spliceAllBlocks = () => {
    for (let i = 0; i < heightInBlocks; i++) {
        activeBlocksFull = activeBlocks.filter((value) => {
            return value.row === i;
        });
        for (let y = 0; y < activeBlocks.length; y++) {
            if (activeBlocksFull.length === widthInBlocks - 2 && i === activeBlocks[y].row) {
                activeBlocks.splice(y, 1);
                y--;
                blocksSpliced++;
                score++;
            }
        }
    }
    if (blocksSpliced > 0) {
        activeBlocks.map((value) => {
            if (value.row + blocksSpliced/(widthInBlocks - 2) > heightInBlocks - 2) {
                return;
            }
            else {
                return value.row += blocksSpliced/(widthInBlocks - 2); 
            }
        })
        blocksSpliced = 0;
    }
};

//----------------------- Ending the Game
gameOver = () => {
    clearTimeout(timeOutId);
    lost = true;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "blanchedalmond";
    ctx.font = "60px Comic Sans";
    ctx.fillText("Game Over", width / 2, height / 2);
};

//----------------------- Building the Block Constructor
class Block {
    constructor (col, row, color) {
        this.col = col;
        this.row = row;
        this.color = color;
    };

    drawSquare () {
        var x = this.col * blockSize;
        var y = this.row * blockSize;
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, blockSize, blockSize);
    };

    equal (otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row - 1;
    };

    equal2 (otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    };
};

//----------------------- Building the Tetris Constructor
class TetrisLine {
    constructor () {
        this.segments = [
            new Block(x, -3, "blue"),
            new Block(x, -2, "blue"),
            new Block(x, -1, "blue"),
            new Block(x, 0, "blue")
        ];
        this.collision = false;
        this.collisionContainer = [];
    };

    addLine (color) {
        this.segments = [
            new Block(x, -3, color),
            new Block(x, -2, color),
            new Block(x, -1, color),
            new Block(x, 0, color)
        ];
    };

    addSquare (color) {
        this.segments = [
            new Block(x, -1, color),
            new Block(x, 0, color),
            new Block(x+1, -1, color),
            new Block(x+1, 0, color)
        ];
    };
    
    addCenter (color) {
        this.segments = [
            new Block(x, -1, color),
            new Block(x-1, 0, color),
            new Block(x, 0, color),
            new Block(x+1, 0, color)
        ];
    };

    addLightning1 (color) {
        this.segments = [
            new Block(x, -1, color),
            new Block(x+1, -1, color),
            new Block(x-1, 0, color),
            new Block(x, 0, color)
        ];
    };

    addLightning2 (color) {
        this.segments = [
            new Block(x, -1, color),
            new Block(x+1, -1, color),
            new Block(x+1, 0, color),
            new Block(x+2, 0, color)
        ];
    };

    addLShape1 (color) {
        this.segments = [
            new Block(x, 0, color),
            new Block(x+1, 0, color),
            new Block(x+2, 0, color),
            new Block(x+2, -1, color)
        ];
    };

    addLShape2 (color) {
        this.segments = [
            new Block(x, -1, color),
            new Block(x, 0, color),
            new Block(x+1, 0, color),
            new Block(x+2, 0, color)
        ];
    };

    randomize () {
        x = Math.floor(Math.random() * (widthInBlocks - 2) + 1);
        let addLine = new TetrisLine();
        addLine.addLine("blue");
        let addSquare = new TetrisLine();
        addSquare.addSquare("grey");
        let addCenter = new TetrisLine();
        addCenter.addCenter("green");
        let addLightning1 = new TetrisLine();
        addLightning1.addLightning1("orange");
        let addLightning2 = new TetrisLine();
        addLightning2.addLightning2("red");
        let addLShape1 = new TetrisLine();
        addLShape1.addLShape1("purple");
        let addLShape2 = new TetrisLine();
        addLShape2.addLShape2("yellow");
        let allTetrisElements = [addLine, addSquare, addCenter, addLightning1, addLightning2, addLShape1, addLShape2];
        tetris.push(allTetrisElements[Math.floor(Math.random() * allTetrisElements.length)]);
        elements++;
    };

    draw () {
        for (let i = 0; i < this.segments.length; i++) {
                this.segments[i].drawSquare();
        }
    };

    move () {
        for (let i = 0; i < this.segments.length; i++) {
            if (this.collision === false && paused === false) {
                this.segments[i].row++;
            }
            else if (this.collision === false && paused === true) {
                return;
            }
        }   
    };

    selfCollision () {
        if (this.collision === false) {
            for (let i = 0; i < this.segments.length; i++) {
                for (let y = 0; y < activeBlocks.length; y++) {
                    this.collisionContainer.push(this.segments[i].equal(activeBlocks[y]));
                    if (this.collisionContainer.includes(true)) {
                            this.collision = true;
                    }
                }
            }
        }
        if (this.collision === true) {
            for (let i = 0; i < this.segments.length; i++) {
                if (this.segments[i].row === 1) {
                    gameOver();
                }
            }
            this.randomize();
            xBorderCheck();
            position = 0;
            for (let i = 0; i < this.segments.length; i++) {
                activeBlocks.push(this.segments[i]);
            }
        }
    };

    wallCollisionBottom () {
        if (this.collision === false) {
            for (let i = 0; i < this.segments.length; i++) {
                if (this.segments[i].row === heightInBlocks - 2) {
                    this.collision = true;
                }
            }
        }
        if (this.collision === true) {
            this.randomize();
            xBorderCheck();
            position = 0;
            for (let i = 0; i < this.segments.length; i++) {
                activeBlocks.push(this.segments[i]);
            }
        }
    };

    wallCollisionLeft () {
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i].col === 1) {
                return true;
            }
        }
    };

    wallCollisionRight () {
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i].col === widthInBlocks - 2) {
                return true;
            }
        }
    };

    selfCollisionLeft () {
        for (let i = 0; i < this.segments.length; i++) {
            for (let y = 0; y < activeBlocks.length; y ++) {
                if (this.segments[i].col - 1 === activeBlocks[y].col && this.segments[i].row === activeBlocks[y].row) {
                    return true;
                }
            }
        }
    };

    selfCollisionRight () {
        for (let i = 0; i < this.segments.length; i++) {
            for (let y = 0; y < activeBlocks.length; y ++) {
                if (this.segments[i].col + 1 === activeBlocks[y].col && this.segments[i].row === activeBlocks[y].row) {
                    return true;
                }
            }
        }
    };
    
    wallCollisionTurn () {
        if (this.segments[0].color === "green" && this.segments[2].col - 1 < 1 || this.segments[2].col + 1 > widthInBlocks - 2) {
            return true;
        }
        else if (this.segments[0].color === "purple" && this.segments[1].col - 1 < 1 || this.segments[1].col + 1 > widthInBlocks - 2) {
            return true;
        }
        else if (this.segments[0].color === "yellow" && this.segments[2].col - 1 < 1 || this.segments[2].col + 1 > widthInBlocks - 2) {
            return true;
        }
        else if (this.segments[0].color === "blue" 
        &&  this.segments[1].col + 1 !== this.segments[2].col 
        &&  this.segments[1].col - 2 < 1 || this.segments[1].col + 2 > widthInBlocks - 2) {
            return true;
        }
    };
};

// //----------------------- Creating the first tetris element
tetris.push(new TetrisLine());
xBorderCheck();

//----------------------- Defining the timeOut (enables speed control)
repeat = () => {
    ctx.clearRect(blockSize, blockSize, width-blockSize, height-blockSize);
    drawAllActiveBlocks();
    tetris[elements].draw();
    tetris[elements].selfCollision();
    tetris[elements].move();
    tetris[elements].wallCollisionBottom();
    spliceAllBlocks();
    drawScore();
    drawSpeed();
    drawBorder();
    startOver();
    if (lost === false) {
        timeOutId = setTimeout(repeat, time);
    }
};
repeat();

//----------------------- Adding the buttons
$("#start").click(() => location.reload());

$("#pause").click(() => {
    if (paused === false && speed > 0) {
        paused = true;
        $("#pause").text("Continue");
    }
    else if (paused === true && speed > 0) {
        paused = false;
        $("#pause").text("Pause");
    }
});

$("#speedUp").click(() => {
    speed++;
    time -= 20;
    if (speed === 1) {
        paused = false;
        speed = 1;
        time = 400;
    }
});
$("#speedDown").click(() => {
    speed--;
    time += 20;
    if (speed <= 0) {
        paused = true;
        speed = 0;
        time = 400;
    }
});

var leftInterval;
var rightInterval;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {

$("#left").on("touchstart", (e) => {
    // e.preventDefault();
    if (tetris[elements].selfCollisionLeft()) {
        return;
    }
    if (tetris[elements].wallCollisionLeft()) {
        return;
    }
    else {
        tetris[elements].segments.map(value => value.col--);
        // tetris[elements].collisionContainer = [];        
    }
    touchTimeCheck = setTimeout (() => {
        leftInterval = setInterval(() => {
            if (tetris[elements].selfCollisionLeft()) {
                return;
            }
            if (tetris[elements].wallCollisionLeft()) {
                return;
            }
            else {
                tetris[elements].segments.map(value => value.col--);
                // tetris[elements].collisionContainer = [];        
            }
        }, time);
    }, 100);   
});

$("#left").on("touchend", () => {
    clearInterval(leftInterval);
    clearTimeout(touchTimeCheck);
});

$("#right").on("touchstart", () => {
    if (tetris[elements].selfCollisionRight()) {
        return;
    }
    if (tetris[elements].wallCollisionRight()) {
        return;
    }
    else {
    tetris[elements].segments.map(value => value.col++);
    // tetris[elements].collisionContainer = [];
    }
    touchTimeCheck = setTimeout (() => {
        rightInterval = setInterval(() => {
            if (tetris[elements].selfCollisionRight()) {
                return;
            }
            if (tetris[elements].wallCollisionRight()) {
                return;
            }
            else {
            tetris[elements].segments.map(value => value.col++);
            // tetris[elements].collisionContainer = [];
            }
        }, time);
    }, 100);   
});

$("#right").on("touchend", () => {
    clearInterval(rightInterval);
    clearTimeout(touchTimeCheck);
});

$("#turn").on("touchstart", () => {
    if (tetris[elements].selfCollisionRight() || tetris[elements].selfCollisionLeft()) {
        return;
    }
    if (tetris[elements].wallCollisionTurn()) {
        return;
    }
    if (position === 0) {
        if (tetris[elements].segments[0].color === "blue") {
            linePosition1();
        }
        else if (tetris[elements].segments[0].color === "green") {
            centerPosition1();
        }
        else if (tetris[elements].segments[0].color === "orange" || tetris[elements].segments[0].color === "red") {
            lightningPosition1();
        }
        else if (tetris[elements].segments[0].color === "purple") {
            lShape1Position1();
        }
        else if (tetris[elements].segments[0].color === "yellow") {
            lShape2Position1();
        }
        position = 1;
    }
    else if (position === 1) {
        if (tetris[elements].segments[0].color === "blue") {
            linePosition2();
        }
        else if (tetris[elements].segments[0].color === "green") {
            centerPosition2();
        }
        else if (tetris[elements].segments[0].color === "orange" || tetris[elements].segments[0].color === "red") {
            lightningPosition2();
        }
        else if (tetris[elements].segments[0].color === "purple") {
            lShape1Position2();
        }
        else if (tetris[elements].segments[0].color === "yellow") {
            lShape2Position2();
        }
        position = 2;
    }
    else if (position === 2) {
        if (tetris[elements].segments[0].color === "blue") {
            linePosition3();
        }
        else if (tetris[elements].segments[0].color === "green") {
            centerPosition3();
        }
        else if (tetris[elements].segments[0].color === "orange" || tetris[elements].segments[0].color === "red") {
            lightningPosition1();
        }
        else if (tetris[elements].segments[0].color === "purple") {
            lShape1Position3();
        }
        else if (tetris[elements].segments[0].color === "yellow") {
            lShape2Position3();
        }
        position = 3;
    }
    else if (position === 3) {
        if (tetris[elements].segments[0].color === "blue") {
            linePosition0();
        }
        else if (tetris[elements].segments[0].color === "green") {
            centerPosition0();
        }
        else if (tetris[elements].segments[0].color === "orange" || tetris[elements].segments[0].color === "red") {
            lightningPosition2();
        }
        else if (tetris[elements].segments[0].color === "purple") {
            lShape1Position0();
        }
        else if (tetris[elements].segments[0].color === "yellow") {
            lShape2Position0();
        }
        position = 0;
    }
});

}

else {
    $("#left").on("mousedown", (e) => {
        // e.preventDefault();
        if (tetris[elements].selfCollisionLeft()) {
            return;
        }
        if (tetris[elements].wallCollisionLeft()) {
            return;
        }
        else {
            tetris[elements].segments.map(value => value.col--);
            // tetris[elements].collisionContainer = [];        
        }
        touchTimeCheck = setTimeout (() => {
            leftInterval = setInterval(() => {
                if (tetris[elements].selfCollisionLeft()) {
                    return;
                }
                if (tetris[elements].wallCollisionLeft()) {
                    return;
                }
                else {
                    tetris[elements].segments.map(value => value.col--);
                    // tetris[elements].collisionContainer = [];        
                }
            }, time);
        }, 100);   
    });
    
    $("#left").on("mouseup", () => {
        clearInterval(leftInterval);
        clearTimeout(touchTimeCheck);
    });

    $("#right").on("mousedown", () => {
        if (tetris[elements].selfCollisionRight()) {
            return;
        }
        if (tetris[elements].wallCollisionRight()) {
            return;
        }
        else {
        tetris[elements].segments.map(value => value.col++);
        // tetris[elements].collisionContainer = [];
        }
        touchTimeCheck = setTimeout (() => {
            rightInterval = setInterval(() => {
                if (tetris[elements].selfCollisionRight()) {
                    return;
                }
                if (tetris[elements].wallCollisionRight()) {
                    return;
                }
                else {
                tetris[elements].segments.map(value => value.col++);
                // tetris[elements].collisionContainer = [];
                }
            }, time);
        }, 100);   
    });
    
    $("#right").on("mouseup", () => {
        clearInterval(rightInterval);
        clearTimeout(touchTimeCheck);
    });
    
    $("#turn").on("mousedown", () => {
        if (tetris[elements].selfCollisionRight() || tetris[elements].selfCollisionLeft()) {
            return;
        }
        if (tetris[elements].wallCollisionTurn()) {
            return;
        }
        if (position === 0) {
            if (tetris[elements].segments[0].color === "blue") {
                linePosition1();
            }
            else if (tetris[elements].segments[0].color === "green") {
                centerPosition1();
            }
            else if (tetris[elements].segments[0].color === "orange" || tetris[elements].segments[0].color === "red") {
                lightningPosition1();
            }
            else if (tetris[elements].segments[0].color === "purple") {
                lShape1Position1();
            }
            else if (tetris[elements].segments[0].color === "yellow") {
                lShape2Position1();
            }
            position = 1;
        }
        else if (position === 1) {
            if (tetris[elements].segments[0].color === "blue") {
                linePosition2();
            }
            else if (tetris[elements].segments[0].color === "green") {
                centerPosition2();
            }
            else if (tetris[elements].segments[0].color === "orange" || tetris[elements].segments[0].color === "red") {
                lightningPosition2();
            }
            else if (tetris[elements].segments[0].color === "purple") {
                lShape1Position2();
            }
            else if (tetris[elements].segments[0].color === "yellow") {
                lShape2Position2();
            }
            position = 2;
        }
        else if (position === 2) {
            if (tetris[elements].segments[0].color === "blue") {
                linePosition3();
            }
            else if (tetris[elements].segments[0].color === "green") {
                centerPosition3();
            }
            else if (tetris[elements].segments[0].color === "orange" || tetris[elements].segments[0].color === "red") {
                lightningPosition1();
            }
            else if (tetris[elements].segments[0].color === "purple") {
                lShape1Position3();
            }
            else if (tetris[elements].segments[0].color === "yellow") {
                lShape2Position3();
            }
            position = 3;
        }
        else if (position === 3) {
            if (tetris[elements].segments[0].color === "blue") {
                linePosition0();
            }
            else if (tetris[elements].segments[0].color === "green") {
                centerPosition0();
            }
            else if (tetris[elements].segments[0].color === "orange" || tetris[elements].segments[0].color === "red") {
                lightningPosition2();
            }
            else if (tetris[elements].segments[0].color === "purple") {
                lShape1Position0();
            }
            else if (tetris[elements].segments[0].color === "yellow") {
                lShape2Position0();
            }
            position = 0;
        }
    });
}

linePosition1 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col + 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row + 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col - 1;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row - 1;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col - 2;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row - 2;
};

linePosition2 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col - 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row + 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col + 1;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row - 1;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col + 2;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row - 2;
};

linePosition3 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col - 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row - 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col + 1;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row + 1;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col + 2;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row + 2;
};

linePosition0 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col + 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row - 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col - 1;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row + 1;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col - 2;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row + 2;
};

centerPosition1 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col + 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row + 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col + 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row - 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col - 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row + 1;
};

centerPosition2 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col - 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row + 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col + 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row + 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col - 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row - 1;
};

centerPosition3 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col - 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row - 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col - 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row + 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col + 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row - 1;
};

centerPosition0 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col + 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row - 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col - 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row - 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col + 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row + 1;
};

lightningPosition1 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col - 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row + 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row - 2;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col - 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row - 1;
};

lightningPosition2 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row;
 
    tetris[elements].segments[1].col = tetris[elements].segments[1].col + 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row - 1;
 
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row + 2;
 
    tetris[elements].segments[3].col = tetris[elements].segments[3].col + 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row + 1;

}

lShape1Position1 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col + 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row - 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col - 1;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row + 1;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row + 2;
};

lShape1Position2 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col + 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row + 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col - 1;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row - 1;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col - 2;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row;
};

lShape1Position3 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col - 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row + 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col + 1;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row - 1;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row - 2;
};

lShape1Position0 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col - 1;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row - 1;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col + 1;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row + 1;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col + 2;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row;
};

lShape2Position1 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col + 2;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col + 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row - 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col - 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row + 1;
};

lShape2Position2 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row + 2;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col + 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row + 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col - 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row - 1;
};

lShape2Position3 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col - 2;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col - 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row + 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col + 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row - 1;
};

lShape2Position0 = () => {
    tetris[elements].segments[0].col = tetris[elements].segments[0].col;
    tetris[elements].segments[0].row = tetris[elements].segments[0].row - 2;
    
    tetris[elements].segments[1].col = tetris[elements].segments[1].col - 1;
    tetris[elements].segments[1].row = tetris[elements].segments[1].row - 1;
    
    tetris[elements].segments[2].col = tetris[elements].segments[2].col;
    tetris[elements].segments[2].row = tetris[elements].segments[2].row;
    
    tetris[elements].segments[3].col = tetris[elements].segments[3].col + 1;
    tetris[elements].segments[3].row = tetris[elements].segments[3].row + 1;
};

