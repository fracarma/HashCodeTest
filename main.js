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

var picRows = picture.length;
var picCols = picture[0].length;


//now, picture is a perfect matrix of points. nj element = picture[n][j]

var hArray = createHorizontalArray();
var vArray = createVerticalArray();

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
    console.log('ERROR on write solution:'+err);
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


function createHorizontalArray(){

  var hArray = [];

  for (var r = 0; r < picRows; r++) {
    var startPoint = null;
    var endPoint = null;
    for(var c = 0; c < picCols; c++){
      if(picture[r][c] === full && c != picCols-1){
        endPoint = c;
        if(startPoint == null){
          startPoint = c;
        }
      } else if ( (picture[r][c] !== full && startPoint != null && endPoint != null) ||
                  (startPoint != null && picture[r][c] === full && c == picCols-1)
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

function createVerticalArray(){

  var vArray = [];

  for (var c = 0; c < picCols; c++) {
    var startPoint = null;
    var endPoint = null;
    for(var r = 0; r < picRows; r++){
      if(picture[r][c] === full && r != picRows-1){
        endPoint = r;
        if(startPoint == null){
          startPoint = r;
        }
      } else if ( (picture[r][c] !== full && startPoint != null && endPoint != null) ||
                  (startPoint != null && picture[r][c] === full && r == picRows-1)
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
