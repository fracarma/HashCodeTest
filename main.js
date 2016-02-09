var fs = require('fs');
//var mathjs = require('mathjs');
var buffer;
var pathPicture = 'input/logo.in';
//piture markers
var empty = '.';
var full = '#';

var solution = [];

if(pathPicture != null){
  buffer =  fs.readFileSync(pathPicture, 'utf8');
}
var pictureFile = buffer.split('\n');

//clone
picture = pictureFile.slice(0);

//eliminate first row
picture.splice(0,1);
//eliminate last row (is blank!)
picture.pop();
for (var i = 0; i < picture.length; i++) {
  picture[i] = picture[i].split('');
}

var picRows = picture.length;
var picCols = picture[0].length;

/* --------------------- PICTURE SET FINISHED------------------------------------------ */

//FROM now, var picture is a perfect matrix of points. nj element = picture[n][j]


createSquareArray(0,0,picRows,picCols);

var hArray = createHorizontalArray(0,0,picRows,picCols);
var vArray = createVerticalArray(0,0,picRows,picCols);

var bestSolution = (hArray.length < vArray.length) ? hArray : vArray;

for (var i in bestSolution) {
  if(bestSolution[i]){
    var elem = bestSolution[i];
    pushPaintLine(elem[0],elem[1],elem[2],elem[3]);
  }
}
outputSolution();



/* ----------------------- FUNCTIONS --------------------------------------------- */

function pushPaintSquare(r,c,s) {
  solution.push('PAINT_SQUARE '+r+' '+c+' '+s);
}
function pushPaintLine(r1,c1,r2,c2) {
  solution.push('PAINT_LINE '+r1+' '+c1+' '+r2+' '+c2);
}
function pushEraseCell(r,c) {
  solution.push('ERASE_CELL '+r+' '+c);
}

function outputSolution() {

  //write solution dimension as first row in the file
  solution.unshift(solution.length);

  var file = fs.createWriteStream('solutions/solution'+Date.now()+'.txt');
  file.on('error', function(err){
  });
  solution.forEach(function(v){
    file.write(v + '\n');
  });
  file.end();
}

function createTrivialSolution(){
  for (var r in picture) {
    for(var c in picture[r]){
      if(picture[r][c] === full){
        pushPaintSquare(r,c,0);
      }
    }
  }
  outputSolution();
}


function createHorizontalArray(startRow, startCol, endRow, endCol){

  var hArray = [];

  for (var r = startRow; r < endRow; r++) {
    var startPoint = null;
    var endPoint = null;
    for(var c = startCol; c < endCol; c++){
      if(picture[r][c] === full && c != endCol-1){
        endPoint = c;
        if(startPoint == null){
          startPoint = c;
        }
      } else if ( (picture[r][c] !== full && startPoint != null && endPoint != null) ||
                  (startPoint != null && picture[r][c] === full && c == endCol-1)
      ){
        if(picture[r][c] === full){
          endPoint = c;
        }
        hArray.push([r,startPoint,r,endPoint]);
        startPoint = null;
        endPoint = null;
      }
    }
  }
  return hArray;
}

function createVerticalArray(startRow, startCol, endRow, endCol){

  var vArray = [];

  for (var c = startCol; c < endCol; c++) {
    var startPoint = null;
    var endPoint = null;
    for(var r = startRow; r < endRow; r++){
      if(picture[r][c] === full && r != endRow-1){
        endPoint = r;
        if(startPoint == null){
          startPoint = r;
        }
      } else if ( (picture[r][c] !== full && startPoint != null && endPoint != null) ||
                  (startPoint != null && picture[r][c] === full && r == endRow-1)
      ){
        if(picture[r][c] === full){
          endPoint = r;
        }
        vArray.push([startPoint,c,endPoint,c]);
        startPoint = null;
        endPoint = null;
      }
    }
  }
  return vArray;
}

function createSquareArray(startRow, startCol, endRow, endCol) {

  var pictureTmp = picture.slice(0);

  for (var c = startCol; c < endCol; c++) {
    for(var r = startRow; r < endRow; r++){
      var unitLength = 1;
      var isSquare = true;
      if(pictureTmp[r][c] === full){
        while(isSquare){
          for(var i = 0;i<=unitLength;i++){
            if(r+unitLength >= endRow -1 ||
               c+unitLength >= endCol -1 ||
              pictureTmp[r+i][c+unitLength+1] === empty ||
              pictureTmp[r+unitLength+1][c+i] === empty
            ){
              isSquare = false;
            }
          }
          if(isSquare){
            unitLength++;
          }
        }


      }

      if(unitLength%2 === 0){
        pushPaintSquare(r+unitLength/2,c+unitLength/2,unitLength/2);
        for(var i = r; i <= r + unitLength; i++){
          for (var j = c; j <= c + unitLength; j++) {
            pictureTmp[i][j] = empty;
          }
        }

      }


    }
  }
console.log(pictureTmp);
picture = pictureTmp;

}
