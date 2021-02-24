var Pipe = function(){
    this.x = 0;
    this.y = 0;

    this.active = 0;

    // Up, Right, Down, Left
    this.connections = Array.apply(null, new Array(4)).map(Number.prototype.valueOf,0);

    this.isActive = function() {
        return this.active === 1;
    };

    this.setActive = function(active) {
        this.active = (active ? 1 : 0);
    };

    /**
     * Get the neighbouring pipe in the given direction
     *
     * @param {grid.direction} direction
     */
    this.getNeighbouringPipe = function(direction) {
        var dx = 0;
        var dy = 0;

        if (direction == grid.direction.RIGHT) {
            dx = 1;
        } else if(direction == grid.direction.LEFT) {
            dx = -1;
        }

        if (direction == grid.direction.UP) {
            dy = 1;
        } else if(direction == grid.direction.DOWN) {
            dy = -1;
        }

        return grid.getThisPipe(this.x + dx, this.y + dy);
    };

    this.hasConnection = function(direction) {
        return this.connections[direction] === 1;
    };

    this.rotate = function() {
        this.connections.splice(0, 0, this.connections.splice((this.connections.length-1), 1)[0]);
    }
};
var stopgame=false;
/**
  * the grid
  */
var grid = {

    size: 0,

    pipes: [],

    direction: {
        DOWN: 2,
        LEFT: 3,
        RIGHT: 1,
        UP: 0
    },

    reverse_direction: {
        2: 0,
        3: 1,
        1: 3,
        0: 2
    },

    /**
      * function to initialize the grid
      */
    initializeGrid: function(size) {
        if (size % 2 == false) {
            console.log("Cannot create grid with even number of rows/columns");
            return;
        }

        this.initializeAllPipes(size);
        this.buildPipesConnection();
        this.randomisePipes();
        this.checkPipesConnection();
        this.drawGrid();
    },

    /**
      * function to get pipe from specified coordinates
      *
      * @param {Number} x
      * @param {Number} y
      */
    getThisPipe: function(x, y) {
        if (typeof this.pipes[x] !== "undefined" && typeof this.pipes[x][y] !== "undefined") {
            return this.pipes[x][y];
        }
    },

    /**
      * function to get all pipes in game
      */
    getAllPipes: function() {
        var pipes = [];
        for (x in this.pipes) {
            for(y in this.pipes[x]) {
                pipes.push(this.getThisPipe(x, y));
            }
        }

        return pipes;
    },

    /**
      * function to initialize all pipes into the grid
      *
      * @param {Number} size
      */
    initializeAllPipes: function(size) {
        this.size = size;
        this.pipes = [];
        for (x = 1; x <= size; x++) {
            this.pipes[x] = [];
            for (y = 1; y <= size; y++) {
                pipe = new Pipe();
                pipe.x = x;
                pipe.y = y;

                this.pipes[x][y] = pipe;
            }
        }
    },

    /**
      * function to build the connections for all pipes
      */
    buildPipesConnection: function() {
        // Define variables
        var all_pipes = this.size * this.size;
        var pipes_with_connection = [];

        // Add a random first pipe
        var x = Math.ceil(this.size / 2);
        var y = Math.ceil(this.size / 2);

        pipe = this.getThisPipe(x, y);
        pipe.active = 1;

        pipes_with_connection.push(pipe);

        while (pipes_with_connection.length < all_pipes) {
            // Get a pipe in the set
            var pipe = pipes_with_connection[Math.floor(Math.random() * pipes_with_connection.length)];

            // Create a random direction
            var direction = Math.floor(Math.random() * 4);

            var neighbor = pipe.getNeighbouringPipe(direction);
            var reverse_direction = this.reverse_direction[direction];

            if (typeof neighbor != "undefined" && neighbor.connections.indexOf(1) == -1) {
                pipe.connections[direction] = 1;
                neighbor.connections[reverse_direction] = 1;

                pipes_with_connection.push(neighbor);
            }
        }
    },

    /**
      * function to randomise pipes by rotating them a random number of times
      */
    randomisePipes: function() {
        //Get a random number from 1 to 3 everytime the randomisePipes function is called
        var computerResponse = this.getRandomInt(1,3)
        //Store the random number as a session object
        sessionStorage.setItem("computerResponse", computerResponse.toString());
        for (x = 1; x < this.pipes.length; x++) {
            for (y = 1; y < this.pipes.length; y++) {
                var pipe = this.getThisPipe(x, y);
                var random = Math.floor(Math.random() * 4);

                for (i = 0; i < random; i++) {
                    pipe.rotate();
                }
            }
        }
    },

    /**
      * function to deactivate all pipes
      */
    deactivateAllPipes: function() {
        for (x = 1; x < this.pipes.length; x++) {
            for (y = 1; y < this.pipes.length; y++) {
                this.getThisPipe(x, y).setActive(false);
            }
        }
    },
    /**
     * function to get a random integer
     *
     * @param {Number} min
     * @param {Number} max
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
      * function to check all pipes to see if they are connected to an active pipe
      */
    checkPipesConnection: function() {
        pipes_with_connection = [];
        pipes_to_check = [];

        // Disable all pipes
        this.deactivateAllPipes();

        // Get the center pipe, set is to active, an add it to the set to be checked
        var center_pipe = this.getThisPipe(Math.ceil(this.size/2), Math.ceil(1));
        center_pipe.setActive(true);

        pipes_with_connection.push(center_pipe);
        pipes_to_check.push(center_pipe);

        // While there are still pipes left to be checked
        while (pipes_to_check.length > 0) {
            var pipe = pipes_to_check.pop();
            var x = pipe.x;
            var y = pipe.y


            // Check if this pipe has a connection down
            if(pipe.hasConnection(grid.direction.DOWN)) {
                var pipe_below = this.getThisPipe(x+1, y);
                if (typeof pipe_below !== "undefined" && pipe_below.hasConnection(grid.direction.UP) && !pipe_below.isActive()) {
                    pipe_below.setActive(true);

                    pipes_with_connection.push(pipe_below);
                    pipes_to_check.push(pipe_below);
                }
            }

            // Check if this pipe has a connection up
            if (pipe.hasConnection(grid.direction.UP)) {
                var pipe_above = this.getThisPipe(x-1, y);
                if (typeof pipe_above !== "undefined" && pipe_above.hasConnection(grid.direction.DOWN) && !pipe_above.isActive()) {
                    pipe_above.setActive(true);

                    pipes_with_connection.push(pipe_above);
                    pipes_to_check.push(pipe_above);
                }
            }
            // Check if the pipe has a connection left
            if (pipe.hasConnection(grid.direction.LEFT)) {
                var pipe_previous = this.getThisPipe(x, y-1);
                if (typeof pipe_previous !== "undefined" && pipe_previous.hasConnection(grid.direction.RIGHT) && !pipe_previous.isActive()) {
                    pipe_previous.setActive(true);

                    pipes_with_connection.push(pipe_previous);
                    pipes_to_check.push(pipe_previous);
                }
            }

            // Check if this pipe has a connection right
            if (pipe.hasConnection(grid.direction.RIGHT)) {
                var pipe_next = this.getThisPipe(x, y+1);
                if (typeof pipe_next !== "undefined" && pipe_next.hasConnection(grid.direction.LEFT) && !pipe_next.isActive()) {
                    pipe_next.setActive(true);

                    pipes_with_connection.push(pipe_next);
                    pipes_to_check.push(pipe_next);
                }
            }
        }
        // variables for the coordinates of the 3 possible end positions
        var top = this.getThisPipe(Math.ceil(1), Math.ceil(this.size));
        var mid = this.getThisPipe(Math.ceil(this.size/2), Math.ceil(this.size));
        var bot = this.getThisPipe(Math.ceil(this.size), Math.ceil(this.size));
        losingOptions=[];
        //assign top corner as winning coordinates
        if (sessionStorage.getItem("computerResponse")==1){
            var winningOption = top;
            losingOptions= [mid,bot];
        }
        //assign middle pipe as winning coordinate
        else if (sessionStorage.getItem("computerResponse")==2){
            var winningOption = mid;
            losingOptions= [top,bot];
        }
        //assign bottom corner as winning coordinate
        else if (sessionStorage.getItem("computerResponse")==3){
            var winningOption = bot;
            losingOptions = [top,mid];

        }

        //if more than two answer pipes are activated
        if((pipes_with_connection.includes(top)&&pipes_with_connection.includes(mid))||(pipes_with_connection.includes(top)&&pipes_with_connection.includes(bot))||(pipes_with_connection.includes(bot)&&pipes_with_connection.includes(mid))||(pipes_with_connection.includes(top)&&pipes_with_connection.includes(bot))){
                 document.getElementById("status").innerText = "Two pipes are connected at the same time. Please disconnect one of them"
            }else{

            //status messages for when right answer corresponds to top pipe
             if(winningOption===top){

                if (pipes_with_connection.includes(top)) {
                    //convert time to seconds
                     let hms = document.getElementById("timer").innerText;
                    let a = hms.split(':');
                    let timeLeft = (+a[0]) * 60 + (+a[1]);
                    let score = 120 - timeLeft;
                    document.getElementById("status").innerText = "You have won in: "+
                        (score) + " seconds.";
                    document.getElementById("sub-btn").classList.remove("hide")
                    document.getElementById("score-holder").value = score
                    let grid1 = document.getElementById("grid");
                    let q = document.getElementById("question");
                    let a1 = document.getElementById("answer1");
                    let a2 = document.getElementById("answer2");
                    let a3 = document.getElementById("answer3");
                    grid1.style.display = "none";
                    q.style.display = "none";
                    a1.style.display = "none";
                    a2.style.display = "none";
                    a3.style.display = "none";
                    stopgame=true;

                }


                else if (pipes_with_connection.includes(mid)) {
                    document.getElementById("status").innerText = "Incorrect pipe. Please try again."

                }
                else if (pipes_with_connection.includes(bot)) {
                    document.getElementById("status").innerText = "Incorrect pipe. Please try again."

                }

                //status messages for when right answer corresponds to middle pipe
            }else if(winningOption===mid){

                if (pipes_with_connection.includes(top)) {
                    document.getElementById("status").innerText = "Incorrect pipe. Please try again."

                }

                else if (pipes_with_connection.includes(mid)) {
                    //convert time to seconds
                    let hms = document.getElementById("timer").innerText;
                    let a = hms.split(':');
                    let timeLeft = (+a[0]) * 60 + (+a[1]);
                    let score = 120 - timeLeft;
                    document.getElementById("status").innerText = "You have won in: "+
                        (score) + " seconds.";
                    document.getElementById("sub-btn").classList.remove("hide")
                    document.getElementById("score-holder").value = score
                    let grid1 = document.getElementById("grid");
                    let q = document.getElementById("question");
                    let a1 = document.getElementById("answer1");
                    let a2 = document.getElementById("answer2");
                    let a3 = document.getElementById("answer3");
                    grid1.style.display = "none";
                    q.style.display = "none";
                    a1.style.display = "none";
                    a2.style.display = "none";
                    a3.style.display = "none";
                    stopgame=true;



                }
                else if (pipes_with_connection.includes(bot)) {
                    document.getElementById("status").innerText = "Incorrect pipe. Please try again."
                }

             //status messages for when right answer corresponds to bottom pipe
            }else if(winningOption===bot){
                if (pipes_with_connection.includes(top)) {
                    document.getElementById("status").innerText = "Incorrect pipe. Please try again."

                }

                else if (pipes_with_connection.includes(mid)) {
                    document.getElementById("status").innerText = "Incorrect pipe. Please try again."

                }
                else if (pipes_with_connection.includes(bot)) {
                    //convert time to seconds
                    let hms = document.getElementById("timer").innerText;
                    let a = hms.split(':');
                    let timeLeft = (+a[0]) * 60 + (+a[1]);
                    let score = 120 - timeLeft;
                    document.getElementById("status").innerText = "You have won in: "+
                        (score) + " seconds.";
                    document.getElementById("sub-btn").classList.remove("hide")
                    document.getElementById("score-holder").value = score
                    let grid1 = document.getElementById("grid");
                    let q = document.getElementById("question");
                    let a1 = document.getElementById("answer1");
                    let a2 = document.getElementById("answer2");
                    let a3 = document.getElementById("answer3");
                    grid1.style.display = "none";
                    q.style.display = "none";
                    a1.style.display = "none";
                    a2.style.display = "none";
                    a3.style.display = "none";
                    stopgame=true;


                }

            }
        }

     }
        ,

    /**
     * function to draw the grid
     */
    drawGrid: function() {
        var grid_div = document.getElementById("grid");
        grid_div.innerHTML = '';

        for (x in this.pipes) {
            var row = this.pipes[x];

            var row_div = document.createElement('div');
            row_div.className = "row";

            for (y in row) {
                var pipe = row[y];
                var pipe_div = document.createElement('div');

                pipe_div.className = "pipe";

                pipe_div.setAttribute('data-x', x);
                pipe_div.setAttribute('data-y', y);

                pipe_div.setAttribute('onClick', 'rotatePipe(this)');

                if (pipe.connections[0] === 1) {
                    pipe_div.className += " u";
                }

                if (pipe.connections[1] === 1) {
                    pipe_div.className += " r";
                }

                if (pipe.connections[2] === 1) {
                    pipe_div.className += " d";
                }

                if (pipe.connections[3] === 1) {
                    pipe_div.className += " l";
                }

                //makes pipes that are connected to the stream and the ones that corresponds to the answers look active
                if ((pipe.active === 1)||(pipe.x ===1 && pipe.y===7)||(pipe.x ===4 && pipe.y===7)||(pipe.x ===7 && pipe.y===7)) {
                    pipe_div.className += " a";
                }

                row_div.appendChild(pipe_div);
            }

            grid_div.appendChild(row_div);
        }
    }
};


/**
 * function to create a timer
 * @param {Number} duration
 * @param
 */
function startTimer() {
    var duration = 119, // your time in seconds here
    display = document.querySelector('#timer');
    var timer = duration, minutes, seconds;
    var myInterval =setInterval(function () {
        //if game is still going keep refreshing time
        if(stopgame===false){
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            //if timer reaches 0 end game
            if (--timer < 0) {
                timer = 0;
                document.getElementById("status").innerText = "Game Over"
                document.getElementById("timer").classList.add("hide")
                document.getElementById("mybutton-1").classList.remove("hide")
                document.getElementById("mybutton-2").classList.remove("hide")
                let grid1 = document.getElementById("grid");
                let q = document.getElementById("question");
                let a1 = document.getElementById("answer1");
                let a2 = document.getElementById("answer2");
                let a3 = document.getElementById("answer3");
                grid1.style.display = "none";
                q.style.display = "none";
                a1.style.display = "none";
                a2.style.display = "none";
                a3.style.display = "none";
            }

        }
    }, 1000);
}
//start timer when page is loaded
window.onload = function () {
    startTimer();
};

/**
 * function to rotate the pipe called on click
 */
function rotatePipe(element) {
    var x = element.dataset.x;
    var y = element.dataset.y;
    grid.getThisPipe(x,y).rotate();
    grid.checkPipesConnection();
    grid.drawGrid();
}

grid.initializeGrid(7);
