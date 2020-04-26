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
            infectedCount++; // Counting how many are infected.
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
    setTimeout(function() { // I'm thinking this is the issue.. the people array isn't getting parsed.
        tickEnder = infectedStatus(); // Checks if all 100 are infected, if true the loop will end at the bottom.
        for (i=0;i<gridSize;i++) {
            if (people[i].infected) {
                var x = people[i].xCoord;
                var y = people[i].yCoord;
                if (x-1 > 0 && people[i-1]) {
                    if (randomPercentage() <= people[i-1].infectionChance) {
                        document.getElementById((x-1) + "," + y).className = "cells infected";
                        people[i-1].infected = true;
                    }
                }
                if (x+1 <= 10 && people[i+1]) {
                    if (randomPercentage() <= people[i+1].infectionChance) {
                        document.getElementById((x+1) + "," + y).className = "cells infected";
                        people[i+1].infected = true;
                    }
                }
                if (y-1 > 0 && people[i-10]) {
                    if (randomPercentage() <= people[i-10].infectionChance) {
                        document.getElementById(x + "," + (y-1)).className = "cells infected";
                        people[i-10].infected = true;
                    }
                }
                if (y+1 <= 10 && people[i+10]) {
                    if (randomPercentage() <= people[i+10].infectionChance) {
                        document.getElementById(x + "," + (y+1)).className = "cells infected";
                        people[i+10].infected = true;
                    }
                }
            }
        }

        if (tickEnder == false){ // Keep looping if there's still less than 100 infected.
            tickLoop();
        }
    },document.getElementById("tickRate").value); // Tick rate
}

var people = [];
var maxRows = 10;
var maxCols = 10;
var gridSize = maxRows*maxCols;
var tickEnder = false;

// Called when the program begins:
function app () {
    // Cleanse previous DIV's
    var game = document.getElementById("game");
    for (i=0;i<100;i++) {
        if (game.firstElementChild) {
            game.removeChild(game.firstElementChild);
        }
    }

    // Ensuring these are reset.
    people = [];
    tickEnder = false;

    // Setting Coordinates and creating objects.
    for (column = 1; column < maxCols+1; column++) {
        for (row = 1; row < maxRows+1; row++) {
            var newPerson = new Person(row, column, infectionChance(), false);
            var newDiv = document.getElementById("game").appendChild(document.createElement("DIV"));
            newDiv.className = "cells healthy"; // Ensuring they look like cells.
            newDiv.id = row + "," + column;
            people.push(newPerson); //Add to array.
        }
    }

    // First Infection
    var firstInfected = Math.floor(Math.random()*(gridSize));
    people[firstInfected].infected = true;
    document.getElementById(people[firstInfected].xCoord + "," + people[firstInfected].yCoord).className = "cells infected"; // Turning the first infected to Red, might be able to add this to the for loop below.

    tickLoop();
    return false;
}


function init() {
    document.getElementById('settings').onsubmit = app;
}

window.onload = init;
