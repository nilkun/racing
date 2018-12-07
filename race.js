const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const screenHeight = canvas.height;
const screenWidth = canvas.width;
const track = [];
const carPos = 0;
const spriteSize = 10 / 2;
let elapsedTime = 0;
const carImg = new Image();
carImg.src = "./car.png";
let speed = 0;

let curvature = 0;
let trackCurvature = 0;
let playerCurvature = 0;
let trackDistance = 0;
let distance = 0;

class Section {
    constructor(curvature, length) {
        this.curvature = curvature;
        this.length = length;
    }
} 

track.push(new Section(0, 10));
track.push(new Section(0, 200));
track.push(new Section(1, 200));
track.push(new Section(0, 400));
track.push(new Section(-1, 100));
track.push(new Section(0, 200));
track.push(new Section(-1, 200));
track.push(new Section(1, 200));
track.push(new Section(0, 200));
track.push(new Section(1, 200));
track.push(new Section(0, 400));
track.push(new Section(-1, 100));
track.push(new Section(0, 200));
track.push(new Section(-1, 200));
track.push(new Section(1, 200));

for(let section of track) {
    trackDistance += section.length;
}

let lapTimes = [0, 0, 0, 0, 0];
let currentTime = 0;
getTime = () => {
    const date = new Date();
    return date.getTime();
}

let currentDelta = getTime();
let currentLapTime = 0;

class Car {
    constructor() {
        this.xDimension = 17;
        this.yDimension = 17;
        this.position = 0;
        this.yPos = screenHeight - screenHeight * .2;
        this.xPos = (screenWidth/2 + (screenWidth * this.position / 2)) - (this.xDimension/2);
    }
    getPosition() {
        return (screenWidth/2 + (screenWidth * this.position / 8)) - (this.xDimension/2);
    }
    setPosition() {
        this.xPos =  (screenWidth/2 + (screenWidth * this.position / 2)) - (this.xDimension/2);
    }

}
const updateDelta = () => {
    const newDelta = getTime();
    elapsedTime = (newDelta - currentDelta) * .001;
    currentDelta = newDelta;
}
const race = new Car;
const render = () => {
    for(let y = 0; y < screenHeight / 2; y++) {
        for(let x = 0; x < screenWidth; x++) {
            context.fillStyle = "lightblue";
            context.fillRect(x, y, 1, 1);
        }
    }
    for(let x = 0; x < screenWidth; x++) {
        let hillHeight = Math.abs(Math.sin(x * .01 + trackCurvature) * 36);
        // for(let y = (screenHeight/2) - hillHeight; y < screenHeight / 2; y++) {
            context.fillStyle = "brown";
            context.fillRect(x, (screenHeight/2) - hillHeight, 1, hillHeight);
        
    }
    for(let y = 0; y < screenHeight / 2; y++) {
        for(let x = 0; x < screenWidth; x++) {
            
            const perspective = y / (screenHeight / 2);
            const middlePoint = .5 + curvature * (1 - perspective)**3;
            let roadWidth = 0.1 + perspective * .8;
            const clipWidth = roadWidth * .15;

            roadWidth *= .5;
            const leftGrass = (middlePoint - roadWidth - clipWidth) * screenWidth;
            const leftClip = (middlePoint - roadWidth) * screenWidth;
            const rightGrass = (middlePoint + roadWidth + clipWidth) * screenWidth;
            const rightClip = (middlePoint + roadWidth) * screenWidth;

            const row = screenHeight / 2 + y;

            const grassColor = Math.sin(20 * (1-perspective)**3 + distance * .1) > 0 ? "green" : "darkgreen";
            const clipColor = Math.sin(80 * (1-perspective)**2 + distance* .1) > 0 ? "red" : "white";

            context.beginPath();
            if(x >= 0 && x < leftGrass) {
                context.fillStyle = grassColor;
                context.fillRect(x, row, 1, 1);
            }
            if(x >= leftGrass && x < leftClip) {
                context.fillStyle = clipColor;
                context.fillRect(x, row, 1, 1);
            }
            if(x >= leftClip && x <= rightClip) {
                context.fillStyle = "gray";
                context.fillRect(x, row, 1, 1);
            }
            if(x > rightClip && x <= rightGrass) {
                context.fillStyle = clipColor;
                context.fillRect(x, row, 1, 1);
            }
            if(x > rightGrass && x < screenWidth) {
                context.fillStyle = grassColor;
                context.fillRect(x, row, 1, 1);
            }
        }

    }


    context.beginPath();
    const x = race.xPos + (race.xDimension/2);
    const y = race.yPos + (race.yDimension); ///2);
    context.fillStyle = "orange";
    context.translate(x, y);
    context.rotate((playerCurvature - trackCurvature)/2);

    context.drawImage(carImg,
        -race.xDimension/2,
        -(race.yDimension) - Math.abs((playerCurvature - trackCurvature))*5,
        race.xDimension, race.yDimension);
    // context.fillRect(race.xPos, race.yPos, race.xDimension, race.yDimension);
    // context.fillRect(0, 0, race.xDimension, race.yDimension);
    //-(race.yDimension/2) - Math.abs((playerCurvature - trackCurvature)*5),

    context.resetTransform();
}

const steer = (e) => {
    switch(e.key) {
        case "a": {
            speed+= 2 * elapsedTime;
            break;
        }
        case "z": {
            speed-= 1 * elapsedTime;
            break;
        }
        case "x": {
            playerCurvature -= .7 * elapsedTime;
            break;
        }
        case "c": {
            playerCurvature += .7 * elapsedTime;
            break;
        }
    }
}

const renderTimes = () => {

    const time = currentLapTime;
    let minutes = Math.floor(time / 60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = Math.floor(time - (minutes * 60));
    if(seconds < 10) seconds = "0" + seconds;
    const ms =  (time % 1).toFixed(3).substring(2);
    
    // Math.floor(time - (minutes * 60 + seconds)) * 1000;
    currentTime = minutes + ":" + seconds + ":" + ms;
    context.fillStyle = "black";
    context.font = "1vw Arial";
    context.fillText(currentTime, screenWidth / 20, 20);
    context.font = "0.5vw Arial";
    for(let i = 0; i < lapTimes.length; i++) {
        context.fillText(lapTimes[i] , screenWidth / 20, 30 + i * 10);
    }
}

const update = () => {
    updateDelta();
    if(Math.abs(playerCurvature - trackCurvature) > .8) speed -= 5 * elapsedTime;

    race.position = playerCurvature - trackCurvature;
    race.setPosition();

    if(speed < 0) speed = 0;
    if(speed > 1) speed = 1;

    const gameSpeed = 500;
    distance += (gameSpeed * speed) * elapsedTime;

    let offset = 0;
    let index = 0;

    currentLapTime += elapsedTime;

    if(distance >= trackDistance){
        distance -= trackDistance;
        lapTimes.pop();
        lapTimes.unshift(currentTime);

        currentLapTime = 0;
    } 

    while(index < track.length && offset <= distance) {
        offset += track[index].length;
        index++;
    }

    const targetCurvature = track[index - 1].curvature;

    const trackCurveDiff = (targetCurvature - curvature) * elapsedTime * speed;
    curvature += trackCurveDiff;

    trackCurvature += curvature * elapsedTime * speed;

    // console.log(
    //     "Distance: ", distance,
    //     "\nTarget Curvature: ", targetCurvature,
    //     "\nPlayer Curvature: ", playerCurvature,
    //     "\nPlayer speed: ", speed,
    //     "\nTrack Curvature: ", trackCurvature
    // )
    render();
    renderTimes();
};

render();
window.addEventListener("keypress", (e) => steer(e));

setInterval(update, 1000/60);

// window.onload(() => console.log("started..."));