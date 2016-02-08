var fs = require('fs');
//var mathjs = require('mathjs');

var buffer;
var pathPicture = 'logo.in';
//piture markers
var empty = '.';
var full = '#';

var solution = [];

if(pathPicture != null){
  buffer =  fs.readFileSync(pathPicture, 'utf8');
}
var pictureFile = buffer.split('\n');
picRows = pictureFile[0].split(' ')[0];
picCols = pictureFile[0].split(' ')[1];

//clone
picture = pictureFile.slice(0);

//eliminate first row
picture.splice(0,1);
//now, picture is a perfect matrix of points. nj element = picture[n][j]


createTrivialSolution();



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
