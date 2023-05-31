var trex, trexRunner;
var ground;
var groundImg;
var invisibalground;
var cloud;
var cloudImg;
var cactu, cactuImg1, cactuImg2, cactuImg3, cactuImg4, cactuImg5, cactuImg6;
var record = 0;
var score = 0;
var play = 1;
var end = 0;
var gameState = play;
var cactusGp,cloudGp;
var trexColided;
var gameOver,gameOverImg;
var restart,restartImg;
var jumpsound , pointsound , deathsound ; 

//preload carrega as midías
function preload() {
  //animação do Trex
  trexRunner = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  cactuImg1 = loadImage("obstacle1.png");
  cactuImg2 = loadImage("obstacle2.png");
  cactuImg3 = loadImage("obstacle3.png");
  cactuImg4 = loadImage("obstacle4.png");
  cactuImg5 = loadImage("obstacle5.png");
  cactuImg6 = loadImage("obstacle6.png");
  trexColided = loadAnimation("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  pointsound = loadSound("checkpoint.mp3");
  deathsound  = loadSound("die.mp3");
}

//setup faz a configuração
function setup() {
  createCanvas(windowWidth,windowHeight);//600,200

  trex = createSprite(50, height-40, 20, 50);
  //adiciona animação 
  trex.addAnimation("running", trexRunner);
  trex.addAnimation("collided",trexColided);
  //tamanho da sprite 
  trex.scale = 0.5;
  trex.debug = false; 
 // trex.setCollider("rectangle",0,0,80,100,);
  trex.setCollider("circle",-5,0,30);
  trex.x = 50;
//cria uma sprite 
  ground = createSprite(width/2,height-30,width, 2);
  //adiciona uma animação 
  ground.addAnimation("ground", groundImg);
 // deixa uma sprite ou um grupo invisível 
  invisibalground = createSprite(width/2,height-10,width, 2);
  invisibalground.visible = false;
   //cria um grupo 
  cactusGp=createGroup();
  cloudGp=createGroup();

  gameOver = createSprite (width/2,height-120);
  gameOver.addImage (gameOverImg);
  gameOver.scale = 0.5 ;
  gameOver.visible = false ;

  restart = createSprite (width/2,height-80);
  restart.addImage (restartImg);
  restart.scale = 0.5 ;
  restart.visible = false ;
  
}

//draw faz o movimento, a ação do jogo
function draw() {
  background("white");
  textSize(18);
  fill("black");
  text("Score: " + score, width-150,height-150); 
  text("Record: " + record, width-150,height-134);

  if (gameState == play) {
    score += Math.round(getFrameRate()/60);
    if (score>0 && score%100===0){
    pointsound.play();
    }
    ground.velocityX = -(4+1*score/100);
    if (ground.x < 800) {
      ground.x = ground.width / 2
    }
    //se uma tecla é precionada  acontece um ação desejada 
    if (touches.length>0||keyDown("space") && trex.y > height-40) {
      //da uma velocidade à sprite 
      trex.velocityY = -15;
      //a cada pulo faz um som 
      jumpsound.play();
      touches=[]
    }
    createCloud();
    createCactus();
  }
 

if (trex.isTouching(cactusGp)){
    gameState=end;
    //deathsound.play();
 }
  if (gameState == end) {
    trex.changeAnimation("collided",trexColided);
    ground.velocityX = 0 ;
    cloudGp.setVelocityXEach(0)  ;
    cactusGp.setVelocityXEach(0)  ;
    cloudGp.setLifetimeEach(-1);
    cactusGp.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true ;
    if (record<score) {
     record=score ; 
    }
    if (mousePressedOver(restart)){
      gameState=play;
    restart.visible=false ;
    gameOver.visible=false;
    cactusGp.destroyEach();
    cloudGp.destroyEach();
    trex.changeAnimation("running", trexRunner);
    score = 0;

    }
  }

  //criando a gravidade
  trex.velocityY += 1;

  //coordenadas do mouse na tela
  text("X: " + mouseX + "  / Y: " + mouseY, mouseX, mouseY);

  //colisão do trex com as bordas
  trex.collide(invisibalground);

  drawSprites();
}

function createCloud() {
  if (frameCount % 60 == 0) {
    cloud = createSprite(width ,random(height-190,height-100), 40, 10);
    cloud.velocityX = -(4+score/100);
    cloud.addImage(cloudImg);
    cloud.scale = random(0.4, 1.4);
    cloud.depth = trex.depth - 1;
    cloud.lifetime = width/cloud.velocityX;
    cloudGp.add(cloud);
  }
}
function createCactus() {
  if (frameCount % 60 == 0) {
    cactu = createSprite(width,height-30, 40, 10);
    cactu.velocityX = -(4+score/100);
    cactu.lifetime = width/cactu.velocityX;
    cactusGp.add(cactu);
    cactu.scale = 0.5;
    var sorte = Math.round(random(1, 6));
    switch (sorte) {
      case 1: cactu.addImage(cactuImg1);
        break;
      case 2: cactu.addImage(cactuImg2);
        break;
      case 3: cactu.addImage(cactuImg3);
        break;
      case 4: cactu.addImage(cactuImg4);
        break;
      case 5: cactu.addImage(cactuImg5);
        break;
      case 6: cactu.addImage(cactuImg6);

    }
  }
}

