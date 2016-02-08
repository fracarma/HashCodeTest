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

for (var i in hArray) {
  if(hArray[i]){
    var elem = hArray[i];
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
        if(!startPoint){
          startPoint = c;
        }
        endPoint = c;
      } else if ( (picture[r][c] !== full && startPoint && endPoint) ||
                  (startPoint && picture[r][c] === full && c == picCols-1)
      ){
        if(!endPoint){
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
