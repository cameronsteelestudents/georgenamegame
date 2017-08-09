var gameCanvas = document.getElementById('gameCanvas');
var context = gameCanvas.getContext('2d');

var entities = []; 

/*
TO DO LIST
  1.completed
  2.make a store (buy armor,weapons,etc.)
  3.make some armor
  4.make some weapons
  5.powerups
  6.more enemies
  7.make levels/stages
  8.make a maze, castle,structure,etc.
  9.make complicated 'gravity' maze (extra hard)
  10.
  11.
  12.
  13.
  14.
  15.

*/

var xDirection = 0;
var yDirection = 0;
var attackXDirection = 0;
var attackYDirection = 0;
var currentMoney = 0;
var speed = 0.55;

var player;
var supaSword;
function initialize() {
  player = new Character(0, -100, 50, 50,'images/player.png');

  // var dragon = new Enemy(0, 0, 50, 50, 'dragon');
  // var dragon = new Enemy(0, 0, 50, 50, 'dragon');
  // var flyingEnemy = new Enemy(0, 0, 125, 125, 'stickman');
  var spikeguy = new Enemy(400, -300, 150, 150, 'spikeball');
  spikeguy.tags.push('keyful');

  var vaultDoor = new Entity(800, -400, 100, 100, 'images/vaultDoor.png');

  var superShuriken = new Item(900, -200, 100, 100, 'images/MetallicaStar.png', 'metallicStar');
  superShuriken.static = true;
  var supaHammer = new Item (500, -200, 150, 150, 'images/supahamma.png', 'supaHamma');
  supaHammer.static = true;
  supaSword = new Item (0, 0, 100, 100, 'images/megasword.png');
  supaSword.static = true;
  supaSword.visible = false;

  var brick = new Entity(0,-550, 600, 50, 'images/brick.jpg');
  brick.static = true;
  var brick2 = new Entity(800,-550, 50, 50, 'images/brick.jpg');
  brick2.static = true;
  var brick3 = new Entity(900, -100, 100, 50, 'images/brick.jpg');
  brick3.static = true;
  var saw = new Entity(175,-515 ,75 , 75, 'images/saw.png');
  saw.tags.push('saw');
  saw.static = true;

}

var shopButton = document.getElementById('shopButton');
shopButton.addEventListener('click', function() {
  var shop = document.getElementById('shop');
  shop.style.display = 'block';
});

var swordButton = document.getElementById('swordButton');
swordButton.addEventListener('click', function() {
  // buy?
  // ask?
  // price?
  // how to remove coins?
  if(currentMoney > 170) {
    alert('u bot dat sowd');
    player.equippedItem = supaSword;
    supaSword.visible = true;
    supaSword.relativeTo = player;

    currentMoney -= 170;
  } else {
    alert('naw man u aint got dat $$$$');
  }
});

var iceArmor = document.getElementById('iceArmor');
iceArmor.addEventListener('click', function() {
  if(currentMoney > 230) {
    player.changeHealth(50);
    alert('u bot dat amor');
  } else {
    alert('naw man yo aint got dat $$$$$$$$');
  }
});


window.addEventListener('keydown', function(event) {
  if(event.keyCode == 87) {
  	// w
    yDirection = 1;
  } else if(event.keyCode == 65) {
    // a
    xDirection = -1;
  } else if(event.keyCode == 83) {
    // s
    yDirection = -1;
  } else if(event.keyCode == 68) { 
    // d
    xDirection = 1;
  } else if (event.keyCode == 32) {
    // #outerspacebar
    attack('shuriken');
  } else if (event.keyCode == 37) {
    // left arrow
    attackXDirection = -1;
  } else if (event.keyCode == 38) {
    // up arrow
    attackYDirection = 1;
  } else if (event.keyCode == 39) {
    // right arrow
    attackXDirection = 1;
  } else if(event.keyCode == 40) {
    // down arrow
    attackYDirection = -1;
  } else if(event.keyCode == 74 && player.isGrounded == true) {
    //j just jump
    player.velocity.y = 100;
    player.position.y += 100;
    player.isGrounded = false;
  } else if(event.keyCode == 77) {
    //money
    currentMoney += 1200;
  }
});

window.addEventListener('keyup', function(event) {
  if(event.keyCode == 87) {
    // w
    yDirection = 0;
  } else if(event.keyCode == 65) {
    // a
    xDirection = 0;
  } else if(event.keyCode == 83) {
    // s
    yDirection = 0;
  } else if(event.keyCode == 68) { 
    // d
    xDirection = 0;
  } else if (event.keyCode == 32) {
    //#outerspacebar
  } else if (event.keyCode == 37) {
    // left arrow
    attackXDirection = 0;
  } else if (event.keyCode == 38) {
    // up arrow
    attackYDirection = 0;
  } else if (event.keyCode == 39) {
    // right arrow
    attackXDirection = 0;
  } else if(event.keyCode == 40) {
    // down arrow
    attackYDirection = 0;
  }
});

function Vector2D(x, y) {
  var me = this;

  me.x = x;
  me.y = y;

  me.add = function(vector) {
    me.x += vector.x;
    me.y += vector.y;
  }

  me.subtract = function(vector){
    var newVector = new Vector2D(0, 0);
    newVector.x = me.x - vector.x;
    newVector.y = me.y - vector.y;
    return newVector;
  }

  me.getMagnitude = function() {
    var magnitude = Math.sqrt(me.x * me.x + me.y * me.y);
    return magnitude;
  }

  me.normalize = function() {
    var magnitude = me.getMagnitude();
    me.x /= magnitude;
    me.y /= magnitude;
  }

  me.scale = function(amount) {
    me.x *= amount;
    me.y *= amount;
  }
}

var v1 = new Vector2D();
var v2 = new Vector2D();
v1.add(v2);

var characters = [];
function Character(x, y, w, h, imageURL, type) {
  Entity.call(this, x, y, w, h, imageURL);

  var me = this;
                 
  me.tags.push('character');

  me.type = type;

  me.health = 500;
  me.maxHealth = 500;

  me.healthbar = new Entity(0, 20, me.dimensions.x, 10);
  me.healthbar.relativeTo = me;
  me.healthbar.static = true;
  me.healthbar.tags.push('healthbar');
  me.equippedItem = null;
  // me.equippedItems = [];

  me.remove = function() {
    characters.splice(characters.indexOf(me), 1);
    entities.splice(entities.indexOf(me), 1);
  }

  me.changeHealth = function(amount) {
    me.health += amount;
    var decimal = me.health / me.maxHealth;
    me.healthbar.dimensions.x = me.dimensions.x * decimal;

    if(me.health <= 0) {
      me.remove();
      generateRandomLoot(me.position.x, me.position.y);

      if(me.tags.indexOf('keyful') + 1 > 0) {
        // LEFT OFF HERE MAKE A KEY, AND MAKE IT WORK WITH THE DOOR!
      }
    } 
  }

  characters.push(me);
}

function Enemy(x, y, w, h, type) {
  var imageURL = false;

  if(type == 'dragon') {
    imageURL = 'images/dragon.png';
  } else if(type == "stickman"){
    imageURL = 'images/stickman.png';
  } else if(type == 'spikeball') {
    imageURL = 'images/spikeguy.png'
  }

  var me = this;

  Character.call(this, x, y, w, h, imageURL, 'enemy');

  me.tags.push('enemy');
  me.tags.push(type);

  var attackSpeed = 2;
  var attackTimer = 0;

  me.think = function(deltaTime) {
    if(type == 'dragon') {
      attackTimer += deltaTime;
      if(attackTimer > 1 / attackSpeed) {
        me.attack();
        attackTimer = 0;
      }
    } else if(type == 'stickman') {
      //
      me.velocity.y += 0.08 * me.mass;
      // console.log(player.position);
      var targetPosition = new Vector2D(player.position.x, me.position.y);
      var targetDirection = targetPosition.subtract(me.position);
      targetDirection.normalize();
      me.velocity = targetDirection;

      // check x difference
      // if it's small, create rock and drop it on player
    } else if(type == 'spikeball') {
      var targetPosition = new Vector2D(player.position.x, me.position.y);
      var targetDirection = targetPosition.subtract(me.position);
      targetDirection.normalize();
      me.velocity = targetDirection;
    }
  }

  me.attack = function() {
    if(type == 'dragon') {
      var fireball = new Projectile(me.position.x, me.position.y, 50, 50, 'images/fireball.png', me);
      fireball.velocity = new Vector2D(5, 5);
    }
  }
}

function Projectile(x, y, w, h, imageURL, owner) {
  Entity.call(this, x, y, w, h, imageURL);

  var me = this;
  this.damage = 2;
  me.tags.push('projectile')
  me.owner = owner;
}

function Coin(x, y, value) {
  if(value == null) {
    
    value = 10;
  }

  Entity.call(this, x, y, 50, 50, 'images/coin.png');

  var me = this;
  me.tags.push('coin');
  me.value = value;
}

function Item(x, y, w, h, imageURL, purpose){
  Entity.call(this, x, y, w, h, imageURL);

  var me = this;
  me.tags.push('item');
  me.purpose = purpose;
  me.damage = 10;
}

function Entity(x, y, w, h, imageURL) {
  var me = this;

  this.position = new Vector2D(x, y);
  this.worldPosition = new Vector2D(x, y);
  this.dimensions = new Vector2D(w, h);
  this.velocity = new Vector2D(0, 0);
  this.static = false;
  this.isGrounded = false;
  this.mass = 1;
  this.relativeTo = null;
  this.tags = [];
  this.visible = true;

  this.imageURL = imageURL;
  if(imageURL) {
    this.img = new Image();
    this.img.src = imageURL;
  }

  me.remove = function() {
    entities.splice(entities.indexOf(me), 1);
  }

  entities.push(this);
}

/* 40% coins
 30% weapons
 15% powerups
 14% vehicles
 1% new cool glasses
 /* 40% coins
 30% weapons
 15% powerups
 1% new cool glasses
 coins: Platinum, Gold, Siver, Copper
 weapons:
 powerups: Supa speed, High jump
 coins: Platinum, Gold, Siver, Copper
 weapons:
 powerups: Supa speed, High jump, More lives, More powerful attack
 vehicles: Car, Truck, Go kart


      }
     } else if(type == 'henchman') {
       
     }
   }

   me.attack = function() {
     if(type == 'dragon') {
       var fireball = new Projectile(me.position.x, me.position.y, 50, 50, 'images/fireball.png', me);
       fireball.velocity = new Vector2D(5, 5);
     }
   }
 }
*/
function attack(type) {
  if(attackXDirection == 0 && attackYDirection == 0) {
    return;
  }                                                                               

  if(player.equippedItem == null) {
    // default attack code

    var shuriken = new Projectile(player.position.x, player.position.y, 30, 30, 'images/shuriken.png', player);
    var shurikenSpeed = 10;

    shuriken.velocity.x = shurikenSpeed * attackXDirection;
    shuriken.velocity.y = shurikenSpeed * attackYDirection;
  } else if(player.equippedItem.purpose == 'metallicStar') {
    var superShuriken = new Projectile(player.position.x, player.position.y, 100, 100, 'images/MetallicaStar.png', player);
    superShuriken.damage = 2;
    var superShurikenSpeed = 10;

    superShuriken.velocity.x = superShurikenSpeed * attackXDirection;
    superShuriken.velocity.y = superShurikenSpeed * attackYDirection;
  } else if(player.equippedItem.purpose == 'supaHammer') {
    // LEFT OFF ON HAMMER
    var supaHammer = new Projectile(player.position.x, player.position.y, 50, 50, 'images/supahamma.png', player);
    supaHammer.damage = 5;
    var supaHammerSpeed = 10;
    supaHammer.mass = 1.75;

    supaHammer.velocity.x = supaHammerSpeed * attackXDirection;
    supaHammer.velocity.y = supaHammerSpeed * attackYDirection;
  } else if(player.equippedItem.purpose == 'supaSword') {

  }
}


function generateRandomLoot(x, y) {
   Math.random();
  var newCoin = new Coin(x, y);
}

function movePlayer(x, y) {
  player.position.x += x;
  player.position.y += y;
}

function checkCollision(entity1, entity2) {
  var leftX1 = entity1.worldPosition.x;
  var rightX1 = entity1.worldPosition.x + entity1.dimensions.x;
  var topY1 = entity1.worldPosition.y;
  var bottomY1 = entity1.worldPosition.y - entity1.dimensions.y;

  var leftX2 = entity2.worldPosition.x;
  var rightX2 = entity2.worldPosition.x + entity2.dimensions.x;
  var topY2 = entity2.worldPosition.y;
  var bottomY2 = entity2.worldPosition.y - entity2.dimensions.y;

  if(
    rightX1 < leftX2
    || leftX1 > rightX2
    || bottomY1 > topY2
    || topY1 < bottomY2
  ) {
    return false;
  }

  return true;
}

var lastTime = new Date();
function update() {
  var currentTime = new Date();
  var milliseconds = currentTime - lastTime;
  var deltaTime = milliseconds / 1000;
  lastTime = currentTime;

  console.log(player.velocity.y);

  // movePlayer(xDirection * speed, yDirection);
  player.velocity.x += xDirection * speed;

  context.fillStyle = 'purple';

  context.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

  // context.fillRect(playerX, playerY, 25, 25);

  context.fillText(currentMoney, 0, 10);

  for (var characterIndex = 0; characterIndex < characters.length; characterIndex++) {
    var character = characters[characterIndex];
    if(character.type == 'enemy') {
      character.think(deltaTime);
    }
  }

  for (var entityIndex = 0; entityIndex < entities.length; entityIndex++) {
    var entity = entities[entityIndex]; 

    if(!entity.static && !entity.isGrounded) {
      entity.velocity.y -= 0.1 * entity.mass;
    }

    entity.position.add(entity.velocity);

    if(!entity.visible) {
      continue;
    }

    var staticCollision = false;

    for (var colliderIndex = 0; colliderIndex < entities.length; colliderIndex++) {
      var collider = entities[colliderIndex];

      if(entity == collider || !collider.visible) {
        continue;
      }

      if(checkCollision(entity, collider)) {
        if(entity == player) {
          if(collider.tags.indexOf('coin') != -1) {
            currentMoney += collider.value;
            collider.remove();
          }

          if(collider.tags.indexOf('item') != -1) {
            entity.equippedItem = collider;
            collider.remove();
          }

          if(collider.tags.indexOf('spikeball') != -1) {
            player.changeHealth(-200);
            var throwVelocity = player.position.subtract(collider.position);
            throwVelocity.normalize();
            throwVelocity.scale(10);
            player.velocity = throwVelocity;
          }

          if(collider.tags.indexOf('saw') != -1) {
            // the player hit a saw
            player.changeHealth(-375);
            var throwVelocity = player.position.subtract(collider.position);
            throwVelocity.normalize();
            throwVelocity.scale(10);
            player.velocity = throwVelocity;
          }
        }

        if(collider.static && collider.tags.indexOf('healthbar') == -1) {
          entity.isGrounded = true;
          entity.velocity.y = 0;
          staticCollision = true;
        }

        if(entity.tags.indexOf('character') != -1) {
          if(collider.tags.indexOf('projectile') != -1 && collider.owner != entity) {
            entity.changeHealth(-collider.damage);
          }
        }

        if(entity.tags.indexOf('enemy') != -1) {
          // entity is an enemy
          if(collider == supaSword) {
            enemy.changeHealth(-collider.damage);
          }
        }
      }
    }

    entity.isGrounded = staticCollision;

    var drawX = entity.position.x;
    var drawY = entity.position.y;
    if(entity.relativeTo != null) {
      drawX += entity.relativeTo.position.x;
      drawY += entity.relativeTo.position.y;
    }

    entity.worldPosition.x = drawX;
    entity.worldPosition.y = drawY;

    if(entity.imageURL) {
      context.drawImage(
        entity.img,
        drawX,
        -drawY,
        entity.dimensions.x,
        entity.dimensions.y)
    } else {
      context.fillRect(
        drawX,
        -drawY,
        entity.dimensions.x,
        entity.dimensions.y
      );
    }
  }

  setTimeout(update, 15);
}


initialize();
update();
