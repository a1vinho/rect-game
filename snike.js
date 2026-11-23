const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');

let x = Math.floor(Math.random() * canvas.width);
let y = Math.floor(Math.random() * canvas.height);

let speedX = 3;
let speedY = 2;

const foods = [];
const obs = [];

let score = 0;
let foods_qs = 5;
let quantity_obs = 5;

let game_over = false;
const ids_animations = {};

function drawScore() {
    let text = `Seu score: ${score}`;
    ctx.font = 'bold 12px Arial'
    ctx.fillText(text, 15 / 2, 15);
};


function StopGame() {
    foods.length = 0;
    obs.length = 0;
    score = 0;

    window.cancelAnimationFrame(ids_animations.obs);
    window.cancelAnimationFrame(ids_animations.moveRect);

    console.log(ids_animations);

    window.removeEventListener('keydown', MoveRect);
}

function ObstaculesDraw() {

    ctx.fillStyle = '#9195fa'

    for (let i = 0; i < quantity_obs; i++) {
        let x_obs = Math.floor(Math.random() * canvas.width);
        let y_obs = Math.floor(Math.random() * canvas.height);
        ctx.fillRect(x_obs, y_obs, 5, 5);

        obs.push({ x_obs, y_obs });
    }

    function Collision() {
        for (let i = 0; i < quantity_obs; i++) {

            if (obs[i]) {
                // collission with user
                const Xobs = obs[i].x_obs;
                const Yobs = obs[i].y_obs;


                let foodX = foods[i].x_food;
                let foodY = foods[i].y_food;
                if (x < Xobs + 5 && x + 5 > Xobs && y < Yobs + 5 && y + 5 > Yobs) {
                    ctx.fillText('Você perdeu D: Game over', canvas.width / 2, 10);
                    StopGame();
                    game_over = true;
                    return;
                }

                if (Xobs < foodX + 5 && Xobs + 5 > foodX && Yobs < foodY + 5 && Yobs + 5 > foodY) {
                    console.log(true)
                }

                for (let j = 0; j < foods.length; j++) {
                    const food = foods[j];
                    if (food.x_food !== null && food.y_food !== null) {
                        let foodX = food.x_food;
                        let foodY = food.y_food;

                        if (Xobs < foodX + 5 && Xobs + 5 > foodX && Yobs < foodY + 5 && Yobs + 5 > Yobs) {
                            ctx.clearRect(foodX, foodY, 5, 5);

                            food.x_food = Math.floor(Math.random() * canvas.width);
                            food.y_food = Math.floor(Math.random() * canvas.height);

                           ctx.fillStyle = 'red';
                            ctx.fillRect(food.x_food, food.y_food, 5, 5);
                        }
                    }
                }
            }
        }
    }
    function MoveObstacules() {

        // x < foodX + 5 &&
        //     x + 5 > foodX &&
        //     y < foodY + 5 &&
        //     y + 5 > foodY
        Collision();

        obs.forEach(obstacule => {
            ctx.fillStyle = '#9195fa'

            ctx.clearRect(obstacule.x_obs, obstacule.y_obs, 5, 5);


            if (obstacule.x_obs >= canvas.width) {
                obstacule.x_obs = 0;
            }
            obstacule.x_obs += speedX;
            ctx.fillRect(obstacule.x_obs, obstacule.y_obs, 5, 5);

        });
        const id = requestAnimationFrame(MoveObstacules);

        ids_animations.obs = id;
    };

    MoveObstacules();
}



function drawRect() {
    if (x >= canvas.width || x <= canvas.width || y >= canvas.height || y <= canvas.height) {
        x = Math.floor(Math.random() * canvas.width);
        y = Math.floor(Math.random() * canvas.height);
    }

    ctx.fillStyle = '#802f38';
    ctx.fillRect(x, y, 5, 5);
    ctx.save();
};
function drawFood() {

    for (let i = 0; i < foods_qs; i++) {
        ctx.fillStyle = 'red';
        let x_food = Math.floor(Math.random() * canvas.width);
        let y_food = Math.floor(Math.random() * canvas.height);
        if (x_food >= canvas.width || x_food <= canvas.width || y_food >= canvas.height || y_food <= canvas.height) {
            x_food = Math.floor(Math.random() * canvas.width);
            y_food = Math.floor(Math.random() * canvas.height);
        };
        ctx.fillRect(x_food, y_food, 5, 5);

        foods.push({
            x_food,
            y_food
        });
    };
};




function MoveRectAutomatic() {
    if (x >= canvas.width) {
        // logica para derrota
    }

    x + 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillRect(x, y, 5, 5);


    requestAnimationFrame(MoveRectAutomatic);
};

function MoveRect(key) {
    ctx.fillStyle = '#802f38';

    ctx.clearRect(x, y, 5, 5);
    switch (key) {
        case 'w': {
            y -= speedY;
            break;
        }
        case "d": {
            x += speedX;
            break;
        }
        case "s": {
            y += speedY;
            break;
        }
        case "a": {
            x -= speedX;
            break;
        }
    }
    ctx.fillRect(x, y, 5, 5);

    const id = requestAnimationFrame(MoveRect);
    ids_animations.moveRect = id;
};

function CollisionFood() {
    for (const food of foods) {
        let foodX = food.x_food;
        let foodY = food.y_food;


        // console.log({ foodX, foodY, x, y });
        if (
            x < foodX + 5 &&
            x + 5 > foodX &&
            y < foodY + 5 &&
            y + 5 > foodY
        ) {
            ctx.clearRect(foodX, foodY, 5, 5);
            ctx.fillText("", canvas.width / 2, canvas.height / 2);
            score = score + 1;
            console.log(score);

            food.x_food = null
            food.y_food = null
            drawScore();

        }
    };

    if (score === foods_qs) {
        alert('Você venceu,parabens')
        score = 0;
        foods_qs *= 2;
        quantity_obs *= 2;
        speedX = 3;
        foods.length = 0;
        Main();
    }
};

function Main() {
    drawFood();
    drawRect();
    drawScore();
    ObstaculesDraw()
}

window.addEventListener('keydown', event => {
    if (game_over) {
        return;
    }
    MoveRect(event.key);
    CollisionFood();

})
Main();