class Person {
    constructor(xCoord, yCoord, infectedChance, infected){
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.infectionChance = infectedChance;
        this.infected = false;
    }
}

function immunity () {
    var maxImmunity = 0;
    switch(document.getElementById('maxImmunity').value){
        case 'hardest':
        maxImmunity = 10;
        break;
        case 'hard':
        maxImmunity = 20;
        break;
        case 'normal':
        maxImmunity = 30;
        break;
        case 'easy':
        maxImmunity = 40;
        break;
    }
    // Calculation:
    return Math.floor(Math.random()*(maxImmunity+1));
}

function infectionChance() {
    return document.getElementById('infectionRate').value - immunity();
}


function infectedStatus() {
    var infectedCount = 0;
    for(i=0;i<gridSize;i++){
        if (people[i].infected){
            infectedCount++;
        }
    }
    if (infectedCount == gridSize) {
        return true;
    } else {
        return false;
    }
}

function randomPercentage() {
    return Math.floor(Math.random()*100);
}

function tickLoop(){
    setTimeout(function() {
        tickEnder = infectedStatus(); // Checks if all 100 are infected, if true the loop will end at the bottom.
        for (i=0;i<gridSize;i++) {
            if (people[i].infected) {
                var x = people[i].xCoord;
                var y = people[i].yCoord;
                if (x-1 > 0 && people[i-1]) {
                    if (randomPercentage() <= people[i-1].infectionChance) {
                        document.getElementById((x-1) + "," + y).className = (cellSize + " infected");
                        people[i-1].infected = true;
                    }
                }
                if (x+1 <= maxCols && people[i+1]) {
                    if (randomPercentage() <= people[i+1].infectionChance) {
                        document.getElementById((x+1) + "," + y).className = (cellSize + " infected");
                        people[i+1].infected = true;
                    }
                }
                if (y-1 > 0 && people[i-maxCols]) {
                    if (randomPercentage() <= people[i-maxCols].infectionChance) {
                        document.getElementById(x + "," + (y-1)).className = (cellSize + " infected");
                        people[i-maxCols].infected = true;
                    }
                }
                if (y+1 <= maxCols && people[i+maxCols]) {
                    if (randomPercentage() <= people[i+maxCols].infectionChance) {
                        document.getElementById(x + "," + (y+1)).className = (cellSize + " infected");
                        people[i+maxCols].infected = true;
                    }
                }
            }
        }

        if (tickEnder == false){ // Keep looping if there's still less than 100 infected.
            tickLoop();
        }
    },document.getElementById("tickRate").value); // Tick rate
}

function grid () {
    switch (document.getElementById("grid").value) {
        case 'cells1':
        maxCols = 10;
        cellSize = "cells1";
        break;
        case 'cells2':
        maxCols = 20;
        cellSize = "cells2";
        break;
        case 'cells3':
        maxCols = 50;
        cellSize = "cells3";
        break;
        case 'cells4':
        maxCols = 100;
        cellSize = "cells4";
        break;
        case 'cells5':
        maxCols = 250;
        cellSize = "cells5";
        break;
    }
    return maxCols;
}

// Global variables
var people = [];
var tickEnder = false;
var cellSize = "";
var gridSize;
var maxCols = 0;
// Called when the program begins:
function app () {
    // Ensuring these are reset.
    people = [];
    tickEnder = false;

    // Cleanse previous DIV's
    var game = document.getElementById("game");
    for (i=0;i<gridSize;i++) {
        if (game.firstElementChild) {
            game.removeChild(game.firstElementChild);
        }
    }

    maxCols = grid();
    gridSize = grid()*grid();
    // Setting Coordinates and creating objects.
    // no longer working for some reason..
    for (column = 1; column <= maxCols; column++) {
        for (row = 1; row <= maxCols; row++) { // wont even activate.
            var newPerson = new Person(row, column, infectionChance(), false);
            var newDiv = document.getElementById("game").appendChild(document.createElement("DIV"));
            newDiv.className = (cellSize + " healthy"); // Ensuring they look like cells.
            newDiv.id = row + "," + column;
            people.push(newPerson); //Add to array.
        }
    }

    // First Infection
    var firstInfected = Math.floor(Math.random()*(gridSize));
    people[firstInfected].infected = true;
    document.getElementById(people[firstInfected].xCoord + "," + people[firstInfected].yCoord).className = cellSize + " infected"; // Turning the first infected to Red, might be able to add this to the for loop below.

    tickLoop();
    return false;
}


function init() {
    document.getElementById('settings').onsubmit = app;
}

window.onload = init;
