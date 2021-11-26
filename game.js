var config = {
    type: Phaser.AUTO,
    width : 1340,
    height : 750,
    parent : 'gameContainer',
    scale: {
        mode: Phaser.scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
        arcade: {
        gravity:{ y: 0},
        debug: false
        }
    }
};


var game = new Phaser.Game(config);
var scene;
var player;
var keyUp, keyDown;
var keyLeft, keyRight;
var keyFire;
var bulletSpeed = 1200;
var playerBulletGrp;

var ufoGrp;
var ufoSpacing = 130;


function preload() {
    //console.log("preloading");
    scene = this;
    scene.load.image('superhero','./assets/img/superhero.png');
    scene.load.image('bone_bullet', './assets/img/bone_bullet.png');
    scene.load.image('ufo','./assets/img/ufo.png');
}

function create() {
    //console.log("create");
   createPlayer();

   playerBulletGrp = scene.add.group();

   ufoGrp = scene.add.group();
   createUFO();
   
   // check collission
   scene.physics.add.overlap(ufoGrp, playerBulletGrp, onUFOHit);


    keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function createPlayer() {
    player = scene.physics.add.sprite(config.width/2, config.height/2, 'corgi');
    player.speed = 400;
    player.setScale(0.3);

}

function createUFO() {
    for (var i = 0; i < 5; i++) {
        var ufo = scene.physics.add.sprite(1000, 100 + (i * ufoSpacing), "ufo");
        ufo.setScale(0.25);
        ufo.speed = (Math.random() * 2) + 1;
        ufo.startX = config.width + (ufo.width/2);
        ufo.startY = 100 + (i * ufoSpacing);
        ufo.x = ufo.startX;
        ufo.Y = ufo.startY;
        ufo.magnitude = Math.random() * 40;

        ufoGrp.add(ufo);

    }
}


function update() {
    updatePlayer();
    updatePlayerBullets();

    updateUFO();
}

function updatePlayer(){
    //console
    if (keyUp.isDown) {
        player.setVelocityY(-player.speed);
    }
    else if (keyDown.isDown) {
        player.setVelocityY(player.speed);
    }
    else {
        player.setVelocityY(0);
    }

    // check for left and right keys
    if (keyLeft.isDown) {
        player.setVelocityX(-player.speed);
    }
    else if (keyRight.isDown) {
        player.setVelocityX(player.speed);
    }
    else {
        player.setVelocityX(0);
    }

    if (player.y < 0 +(player.getBounds().height/2)) {
        player.y = (player.getBounds().height/2);
    }
    else if (player.y > config.height - (player.getBounds().height/2)) {
        //console.log("hit the bottom screen");
        player.y = config.height - (player.getBounds().height/2);
    }

    if (player.x < 0 +(player.getBounds().width/2)) {
        player.x = (player.getBounds().width/2);
    }
    else if (player.x > config.width -(player.getBounds().width/2)){
        //console.log("hit the right screen");
        player.x = config.width - (player.getBounds().width/2);
    }
    // check for spacebar to fire a bullet
    if (Phaser.Input.keyboard.Justdown(keyFire)) {
        Fire();
    }
}

function updatePlayerBullets() {
    for (var i = 0; i <playerBulletGrp.getChildren().length; i++) {
        //console.log(playerBulletGrp.getChildren()[i]);
        var bullet = playerBulletGrp.getChildren()[i];
        bullet.rotation += 0.2;

        if (bullet.x > config.width) {
            bullet.destroy();
        }
    }
    //console.log("================");
}

function updateUFO() {
    for (var i = 0; i < ufoGrp.getChildren().length; i++) {
        var enemy = ufoGrp.getChildren()[i];
        enemy.x -= enemy.speed;
        enemy.y = enemy.startY + (Math.sin(game.getTime()/1000) * enemy.magnitude);

        if (enemy.x < 0 - (enemy.width/2)) {
            enemy.speed = (Math.random() * 2) + 1;
            enemy.x = enemy.startX;
            enemy.magnitude = Math.random() * 60;
        }
    }
}

function fire() {
    console.log("Fire a bullet");
    var bullet = scene.physics.add.sprite(player.x + 50, player.y + 10, "bone_bullet");
    bullet.body.velocity.x = bulletSpeed;

    playerBulletGrp.add(bullet);
    //console.log(playerBulletGrp.children);
}

function onUFOHit(ufo,bullet) {
    bullet.destroy();
    ufo.x = ufo.startX;
    ufo.speed = (Math.random() * 2) + 1;
}