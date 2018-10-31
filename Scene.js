"use strict";
const Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.triangleGeometry = new TriangleGeometry(gl);
  this.starGeometry = new StarGeometry(gl);
  this.quadGeometry = new QuadGeometry(gl);
  this.heartGeometry = new HeartGeometry(gl);
  this.camera = new OrthoCamera();
  this.originX = -1;
  this.originY = 1;
  this.positionA = new Vec3(0, 0, 0);
  this.positionB = new Vec3(0, 0, 0);


  this.gameObjects = [];

  this.flashMaterial = new Material(gl, this.solidProgram);
  this.material1 = new Material(gl, this.solidProgram);
  this.flashMaterial.solidColor.set(1, 1, 1);
  this.material1.solidColor.set(1, 1, 1);

  this.currentMillis = Date.now() / 200;
  

  this.mesh1 = new Mesh(this.triangleGeometry, this.material1);
  this.meshStar = new Mesh(this.starGeometry, this.material1);
  this.meshBox = new Mesh(this.quadGeometry, this.material1);
  this.meshHeart = new Mesh(this.heartGeometry, this.flashMaterial);

  this.materialA = new Material(gl, this.solidProgram);
  this.materialA.solidColor.set(0.5, 0.5, 0.5);
  this.materialB = new Materia(gl, this.solidProgram);
  this.materialB.solidColor.set(0, 0, 0);


  var y = 0.9;
  var gameObject;

for (var n = 0; n < 10; n ++) {
  var theList = [];
  var x = -1.2;
  for (var i = 0; i <= 10; i ++) {

    var randomMesh; 

    var randomNum = Math.floor(Math.random() * Math.floor(4));
    

    if (randomNum == 0) {
      randomMesh = this.mesh1;
    } else if (randomNum == 1) {
      randomMesh = this.meshHeart;
    } else if (randomNum == 2) {
      randomMesh = this.meshBox;
    } else {
      randomMesh = this.meshStar;
    }

    gameObject = new GameObject(randomMesh);
    gameObject.gemType = randomNum;
    gameObject.position.set(x + 0.2, y);
    gameObject.scale.set(0.04, 0.03, 0.1);
    theList.push(gameObject);
    x += 0.22;
  }
  this.gameObjects.push(theList);
  y -= 0.2;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

  
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 500.0; //change constant 100.0 to change movement speed 
  this.timeAtLastFrame = timeAtThisFrame;
  
  this.flashMaterial.commit();

  if (keysPressed.D) {
    this.camera.rotation += 0.5 * dt;
    this.camera.updateViewProjMatrix();
  }

  if (keysPressed.A) {
    this.camera.rotation -= 0.5 * dt;
    this.camera.updateViewProjMatrix();
  }
    

  if (keysPressed.Q) {
    var timeNow = Date.now();
    var timeElapsed = timeNow - this.currentMillis;
    var sinTime = Math.sin(timeElapsed) / 100;
    this.camera.position.set(this.camera.position.x + sinTime, this.camera.position.y);
    this.camera.updateViewProjMatrix();
  }  

  

  // clear the screen
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

 


  
  for (var n = 0; n < 10; n++) {
    for (var i = 0; i < 10; i ++) {

      if (keysPressed.Q) {
        var randomNum = Math.floor(Math.random() * Math.floor(1000));
        if (randomNum == 27) {
          this.gameObjects[n][i].gemType = 5;
        }
      }

      if (this.gameObjects[n][i].gemType == 6) {
        var newGem = this.randomNewGem();
        var xCoord1 = this.gameObjects[n][i].position.x;
        var yCoord1 = this.gameObjects[n][i].position.y;
        newGem.position.set(xCoord1, yCoord1, 0);
        newGem.scale.set(0.04, 0.03, 0.1);
        this.gameObjects[n][i] = newGem;
      }

      if (n < 9) {
        if(this.gameObjects[n + 1][i].gemType == 6) {
            var currentGem = this.gameObjects[n][i];
            var gemBelow = this.gameObjects[n + 1][i];
            var xCoordDisappear = this.gameObjects[n + 1][i].position.x;
            var yCoordDisappear = this.gameObjects[n + 1][i].position.y;
            var xCoordKeep = this.gameObjects[n][i].position.x;
            var yCoordKeep = this.gameObjects[n][i].position.y;
            currentGem.position.set(xCoordDisappear, yCoordDisappear, 0);
            gemBelow.position.set(xCoordKeep, yCoordKeep, 0);
            this.gameObjects[n + 1][i] = currentGem;
            this.gameObjects[n][i] = gemBelow;
          }
        }
      
      

      if (this.gameObjects[n][i].gemType == 3 ) {

        this.gameObjects[n][i].orientation += 0.02;

      } else if (this.gameObjects[n][i].gemType == 1) {

        var timeNow = Date.now() / 200;
        var timeElapsed = timeNow - this.currentMillis;
        var sinTime = Math.sin(timeElapsed) + 1.1;
        this.flashMaterial.solidColor.set(sinTime, sinTime, sinTime);

      } else if (this.gameObjects[n][i].gemType == 5 || this.gameObjects[n][i].gemType == 6){

        this.gameObjects[n][i].scale.set(this.gameObjects[n][i].scale.x * 0.95, this.gameObjects[n][i].scale.y * 0.95, 0);
        this.gameObjects[n][i].orientation += 0.05;

        if (this.gameObjects[n][i].scale.x < 0.001 && this.gameObjects[n][i].scale.y < 0.001) {
          this.gameObjects[n][i].gemType = 6;
        }
      } 
      this.gameObjects[n][i].draw(this.camera);
      
    }
  }
  

};

Scene.prototype.ndcToWorldSpace = function(coordinates) {

  var vinv = this.camera.viewProjMatrix.clone().invert();
  var resultCoordinates = coordinates.times(vinv);
  return resultCoordinates;
};

Scene.prototype.gemIndex = function(xCoord, yCoord) {

  var xIndex = Math.floor(Math.abs(((xCoord - this.originX) * 5)));
  var yIndex = Math.floor(Math.abs(((yCoord - this.originY) * 5)));

  var coordinateTuple = new Vec2(xIndex, yIndex);
  return coordinateTuple;
};

Scene.prototype.swapGems = function(coordinatesA, coordinatesB) {

    var rowA = coordinatesA.y;
    var columnA = coordinatesA.x;
    var rowB = coordinatesB.y;
    var columnB = coordinatesB.x;

    if ((Math.abs(rowA - rowB) <= 1 && columnA == columnB) || (rowA == rowB  && Math.abs(columnA - columnB) <= 1) ) {
      if (this.legalMoveCheck(rowA, columnA, rowB, columnB) == true) {
          var gemA = this.gameObjects[rowA][columnA];
          var gemB = this.gameObjects[rowB][columnB];

          this.positionA = gemA.position;
          var xCoordA = this.positionA.x;
          var yCoordA = this.positionA.y;

          this.positionB = gemB.position;
          var xCoordB = this.positionB.x;
          var yCoordB = this.positionB.y;

          gemA.position.set(xCoordB, yCoordB, 0);

          gemB.position.set(xCoordA, yCoordA, 0);

          this.gameObjects[rowA][columnA] = gemB;
          this.gameObjects[rowB][columnB] = gemA;
      }
    }
};



Scene.prototype.legalMoveCheck = function(rowA, columnA, rowB, columnB) {

  var gemA = this.gameObjects[rowA][columnA];
  var gemB = this.gameObjects[rowB][columnB];

  var gemAType = gemA.gemType;
  var gemBType = gemB.gemType;

  var gemASwap = false;
  var gemBSwap = false;

  if (rowA == rowB) { //horizontal swap 
    if (columnA > columnB) { //gemA moves left

      if (columnB > 1) { //two to the LEFT (A)
        if (this.gameObjects[rowA][columnB - 1].gemType == gemAType && this.gameObjects[rowA][columnB - 2].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (rowA > 1) { //two above (A)
        if (this.gameObjects[rowA - 1][columnB].gemType == gemAType && this.gameObjects[rowA - 2][columnB].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (rowA < 8) { //two below (A)
        if (this.gameObjects[rowA + 1][columnB].gemType == gemAType && this.gameObjects[rowA + 2][columnB].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (this.gameObjects[rowA + 1][columnB].gemType == gemAType && this.gameObjects[rowA - 1][columnB].gemType == gemAType) {
        gemASwap = true; //one above one below (A)
        return gemASwap;
      }

      if (columnA < 8) { //two to the RIGHT (B)
        if (this.gameObjects[rowA][columnA + 1].gemType == gemBType && this.gameObjects[rowA][columnA + 2].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        } 
      }

      if (rowA > 1) { //two above (B)
        if (this.gameObjects[rowA - 1][columnA].gemType == gemBType && this.gameObjects[rowA - 2][columnA].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        }
      }

      if (rowA < 8) { //two below (B)
        if (this.gameObjects[rowA + 1][columnA].gemType == gemBType && this.gameObjects[rowA + 2][columnA].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        }
      }
      if (this.gameObjects[rowA + 1][columnA].gemType == gemBType && this.gameObjects[rowA - 1][columnA].gemType == gemBType) {
        gemBSwap = true; //one above one below (A)
        return gemBSwap;
      }
    

    } else if (columnA < columnB) { //gemA moves right
      
      if (columnB < 8) { //two to the right (A)
        if (this.gameObjects[rowA][columnB + 1].gemType == gemAType && this.gameObjects[rowA][columnB + 2].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (rowA > 1) { //two above (A)
        if (this.gameObjects[rowA - 1][columnB].gemType == gemAType && this.gameObjects[rowA - 2][columnB].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (rowA < 8) { //two below (A)
        if (this.gameObjects[rowA + 1][columnB].gemType == gemAType && this.gameObjects[rowA + 2][columnB].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (this.gameObjects[rowA + 1][columnB].gemType == gemAType && this.gameObjects[rowA - 1][columnB].gemType == gemAType) {
        gemASwap = true; //one above one below (A)
        return gemASwap;
      }

      if (columnA > 1) { //two to the left (B)
        if (this.gameObjects[rowA][columnA - 1].gemType == gemBType && this.gameObjects[rowA][columnA - 2].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        } 
      }

      if (rowA > 1) { //two above (B)
        if (this.gameObjects[rowA - 1][columnA].gemType == gemBType && this.gameObjects[rowA - 2][columnA].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        }
      }

      if (rowA < 8) { //two below (B)
        if (this.gameObjects[rowA + 1][columnA].gemType == gemBType && this.gameObjects[rowA + 2][columnA].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        }
      }
      if (this.gameObjects[rowA + 1][columnA].gemType == gemBType && this.gameObjects[rowA - 1][columnA].gemType == gemBType) {
        gemBSwap = true; //one above one below (A)
        return gemBSwap;
      }
    }

    } else if (columnA == columnB) { //vertical swap 

    if (rowA > rowB) { //gemA moves up

      if (rowB > 1) { //two to the above (A)
        if (this.gameObjects[rowB - 1][columnB].gemType == gemAType && this.gameObjects[rowA][rowB - 2].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (columnA < 8) { //two right (A)
        if (this.gameObjects[rowB][columnB + 1].gemType == gemAType && this.gameObjects[rowB][columnB + 2].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (columnA > 1) { //two left (A)
        if (this.gameObjects[rowB][columnB - 1].gemType == gemAType && this.gameObjects[rowB][columnB - 2].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (this.gameObjects[rowB][columnB + 1].gemType == gemAType && this.gameObjects[rowB][columnB -1 ].gemType == gemAType) {
        gemASwap = true; //one RIGHT one LEFT (A)
        return gemASwap;
      }

      if (columnA < 8) { //two below (B)
        if (this.gameObjects[rowA][columnA + 1].gemType == gemBType && this.gameObjects[rowA][columnA + 2].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        } 
      }

      if (rowA > 1) { //two above (B)
        if (this.gameObjects[rowA - 1][columnA].gemType == gemBType && this.gameObjects[rowA - 2][columnA].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        }
      }

      if (rowA < 8) { //two below (B)
        if (this.gameObjects[rowA + 1][columnA].gemType == gemBType && this.gameObjects[rowA + 2][columnA].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        }
      }
      if (this.gameObjects[rowA + 1][columnA].gemType == gemBType && this.gameObjects[rowA - 1][columnA].gemType == gemBType) {
        gemBSwap = true; //one above one below (A)
        return gemBSwap;
      }
   } else if (rowA < rowB) { //gemA moves down

      if (rowB < 8) { //two to the below (A)
        if (this.gameObjects[rowB + 1][columnB].gemType == gemAType && this.gameObjects[rowB + 2][columnB].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (columnB < 8) { //two right (A)
        if (this.gameObjects[rowB][columnB + 1].gemType == gemAType && this.gameObjects[rowB][columnB + 2].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (columnA > 1) { //two left (A)
        if (this.gameObjects[rowB][columnB - 1].gemType == gemAType && this.gameObjects[rowB][columnB - 2].gemType == gemAType) {
          gemASwap = true;
          return gemASwap;
        }
      }

      if (this.gameObjects[rowB][columnB + 1].gemType == gemAType && this.gameObjects[rowB][columnB -1 ].gemType == gemAType) {
        gemASwap = true; //one RIGHT one LEFT (A)
        return gemASwap;
      }

      if (rowA > 1) { //two above (B)
        if (this.gameObjects[rowA - 1][columnA].gemType == gemBType && this.gameObjects[rowA - 2][columnA].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        } 
      }

      if (columnA < 8) { //two right (B)
        if (this.gameObjects[rowA][columnA + 1].gemType == gemBType && this.gameObjects[rowA][columnA + 2].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        }
      }

      if (columnA > 1) { //two left (B)
        if (this.gameObjects[rowA][columnA - 1].gemType == gemBType && this.gameObjects[rowA][columnA -1].gemType == gemBType) {
          gemBSwap = true;
          return gemBSwap;
        }
      }
      if (this.gameObjects[rowA][columnA - 1].gemType == gemBType && this.gameObjects[rowA][columnA + 1].gemType == gemBType) {
        gemBSwap = true; //one right one left (B)
        return gemBSwap;
      }
    }
  }
  return false; 
};

Scene.prototype.dramaticExit = function(coordinates) {
  this.gameObjects[coordinates.y][coordinates.x].gemType = 5;
};


Scene.prototype.randomNewGem = function() {

    var randomMesh; 

    var randomNum = Math.floor(Math.random() * Math.floor(4));
    
    if (randomNum == 0) {
      randomMesh = this.mesh1;
    } else if (randomNum == 1) {
      randomMesh = this.meshHeart;
    } else if (randomNum == 2) {
      randomMesh = this.meshBox;
    } else {
      randomMesh = this.meshStar;
    }

    var gameObject = new GameObject(randomMesh);
    gameObject.gemType = randomNum;

    return gameObject;
}



