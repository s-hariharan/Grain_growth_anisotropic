var canvas = document.getElementById('theCanvas');
var bound = document.getElementById('bound')
var canvas1 = document.getElementById('theCanvas1');
var bound1 = document.getElementById('bound1')
var context = canvas.getContext('2d');
var ctx = bound.getContext('2d');
var context1 = canvas1.getContext('2d');
var ctx1 = bound1.getContext('2d');
var image = context.createImageData(canvas.width, canvas.height);
var ima = ctx.createImageData(bound.width,bound.height);
var image1 = context1.createImageData(canvas.width, canvas.height);
var ima1 = ctx1.createImageData(bound.width,bound.height);
var tempSlider = document.getElementById('tempSlider');
var aaslider = document.getElementById('aaslider');
var bbslider = document.getElementById('bbslider');
var abslider = document.getElementById('abslider');
var numaa = document.getElementById('numaa');
var numbb = document.getElementById('numbb');
var numab = document.getElementById('numab');


var states = 1000;
var size = 100;
var stepsPerFrame =10000;
var startTime = 0;
var squareWidth = canvas.width/size;
var accept = 0;
var running = false;
var lattice = false; //false is for square
//initialization
var aonly;
var bonly;
var abonly;

var volumeafrac;
var volumebfrac;
var volumeabfrac;

var col = new Array(states);
for( var i=0;i<states;i++){
  col[i] = new Array(3);
  for(var j=0; j<3;j++){
    col[i][j] = Math.floor(Math.random()*255);
    col[i][j] = Math.floor(Math.random()*255);
    col[i][j] = Math.floor(Math.random()*255);
  }
}


var s = new Array(size);
for(var i=0;i<size;i++){
  s[i] = new Array(size);
  for( var j=0; j< size; j++){
    s[i][j] = {o: Math.floor(Math.random()*states),c: Math.floor(Math.random()*2) };
    colorSquare(i,j);
  }
}
boundaryplot();
context.putImageData(image,0,0);
context1.putImageData(image1,0,0);
//ctx.putImageData(ima,0,0);
//ctx1.putImageData(ima1,0,0);
simulate();

function simulate(){
  if(running){
  var T =0;
  var r,t;

  for( var step=0; step<stepsPerFrame; step++){
    var i = Math.floor(Math.random()*size);
    var j = Math.floor(Math.random()*size);
    r=i+1;
    t=j+1;
    if(i==size-1){
      r=0;
    }
    if(j==size-1){
      t=0;
    }


    if(lattice){
      deltaU(i,j);
    }
    else{
       deltaUt(i,j,T);
    }


}
  calcvolfrac();

  //boundaryplot();
  context.putImageData(image,0,0);
  context1.putImageData(image1,0,0);
  //ctx.putImageData(ima,0,0);
  //ctx1.putImageData(ima1,0,0);
}
  window.setTimeout(simulate,50);

}

function colorSquare(i,j) {

  var red,green,blue;
  var val=s[i][j].o;
  var component = s[i][j].o;

  red=col[val][0];
  green=col[val][1];
  blue=col[val][2];

  jheight=Math.floor(squareWidth*0.87);
   for(pj=j*jheight;pj<((j+1)*jheight);pj++){
   newi=i*squareWidth+240+Math.floor((jheight*100-pj)*Math.tan(0.523599));
   newi1=i*squareWidth+Math.floor((jheight*100-pj)*Math.tan(0.523599));
   if(newi>500){newi=newi-500;}
   if(newi1>500){newi1=newi1-500;}
   for(pi=newi;pi<(newi+squareWidth);pi++){
     index=(pi+pj*image.width)*4;
     image.data[index]= red;
     image.data[index+1]= green;
     image.data[index+2]=blue;
     image.data[index+3]= 255;
 }
 for(pi=newi1;pi<(newi1+squareWidth);pi++){
   index=(pi+pj*image.width)*4;
   image1.data[index]= red;
   image1.data[index+1]= green;
   image1.data[index+2]=blue;
   image1.data[index+3]= 255;
}
 }
}

function deltaU(i,j){
  var leftS, rightS, topS, bottomS;
  if (i == 0) leftS = s[size-1][j]; else leftS = s[i-1][j];
  if (i == size-1) rightS = s[0][j]; else rightS = s[i+1][j];
  if (j == 0) topS = s[i][size-1]; else topS = s[i][j-1];
  if (j == size-1) bottomS = s[i][0]; else bottomS = s[i][j+1];
  var neighbour = [bottomS,topS,rightS,leftS];
  var aa = Number(aaslider.value);
  var bb = Number(bbslider.value);
  var ab = Number(abslider.value);
  var ranval = Math.floor(Math.random()*4);
  temp = s[i][j];
  sigma1=0;
  sigma2=0;
  for(var k=0; k<4; k++){
    if(s[i][j].o!=neighbour[k].o && s[i][j].c==neighbour[k].c && neighbour[k].c == 0){sigma1+=aa;}
    if(s[i][j].o!=neighbour[k].o && s[i][j].c==neighbour[k].c && neighbour[k].c == 1){sigma1+=bb;}
    if(s[i][j].o!=neighbour[k].o && s[i][j].c!=neighbour[k].c){sigma1+=ab;}

    if(neighbour[ranval].o!=neighbour[k].o && neighbour[ranval].c==neighbour[k].c && neighbour[k].c == 0){sigma2+=aa;}
    if(neighbour[ranval].o!=neighbour[k].o && neighbour[ranval].c==neighbour[k].c && neighbour[k].c == 1){sigma2+=bb;}
    if(neighbour[ranval].o!=neighbour[k].o && neighbour[ranval].c!=neighbour[k].c){sigma2+=ab;}

  }
  var ediff=sigma2-sigma1;
  var re = [ediff,neighbour[ranval]];
  return re;
}

function deltaUt(i,j,T) {
  var b,t,r,l;
  b=j-1;
  t=j+1;
  r=i+1;
  l=i-1;

  if(i==0)
    l=size-1;
  if(i==size-1)
    r=0;
  if(j==0)
    b=size-1;
  if(j==size-1)
    t=0;
    var aa = Number(aaslider.value);
    var bb = Number(bbslider.value);
    var ab = Number(abslider.value);
    var compare = s[i][j];
    var hexaneigh = [s[r][j],s[l][j],s[l][b],s[r][t],s[i][b],s[i][t],compare];
    var ranval = Math.floor(Math.random()*6);
    temp = s[i][j];
    temp1 = hexaneigh[ranval];


    sigma1=0;
    sigma2=0;
    for(var k=0; k<6; k++){
      if(s[i][j].o!=hexaneigh[k].o && s[i][j].c==hexaneigh[k].c && hexaneigh[k].c == 0){sigma1+=aa;}
      if(s[i][j].o!=hexaneigh[k].o && s[i][j].c==hexaneigh[k].c && hexaneigh[k].c == 1){sigma1+=bb;}
      if(s[i][j].o!=hexaneigh[k].o && s[i][j].c!=hexaneigh[k].c){sigma1+=ab;}
    }
      hexaneigh[6]=hexaneigh[ranval];
      //hexaneigh[ranval] = s[i][j];



     for(var k=0;k<6;k++){
      if(hexaneigh[6].o!=hexaneigh[k].o && hexaneigh[6].c==hexaneigh[k].c && hexaneigh[k].c == 0){sigma2+=aa;}
      if(hexaneigh[6].o!=hexaneigh[k].o && hexaneigh[6].c==hexaneigh[k].c && hexaneigh[k].c == 1){sigma2+=bb;}
      if(hexaneigh[6].o!=hexaneigh[k].o && hexaneigh[6].c!=hexaneigh[k].c){sigma2+=ab;}
    }

    var ediff=sigma2-sigma1;

    if ((ediff <= 0) || (Math.random() < Math.exp(-ediff/T))){
      s[i][j]=temp1;
      colorSquare(i,j);




      /*if(ranval == 0){
        s[r][j]=temp;
        colorSquare(r,j);

      }
      if(ranval == 1){
        s[l][j]=temp;
        colorSquare(l,j);

      }
      if(ranval == 2){
        s[l][b]=temp;
        colorSquare(l,b);

      }
      if(ranval == 3){
        s[r][t]=temp;
        colorSquare(r,t);

      }
      if(ranval == 4){
        s[i][b]=temp;
        colorSquare(i,b);

      }
      if(ranval == 5){
        s[i][t]=temp;
        colorSquare(i,t);
      }*/
    }

}




function showTemp(){
  tempReadout.value = Number(tempSlider.value).toFixed(2);
}
function showaa(){
  aabond.value= Number(aaslider.value).toFixed(2);
}
function showbb(){
  bbbond.value= Number(bbslider.value).toFixed(2);
}
function showab(){
  abbond.value= Number(abslider.value).toFixed(2);
}

function startStop() {
  running = !running;
  if(running){
  startButton.value = " Pause ";
}
else {
  startButton.value = " Resume ";
}
}

function latticeSwitch() {
  lattice = !lattice;
  if(lattice){
  Lattice.value = " Triangular ";
}
else {
  Lattice.value = " square ";
}
}

function boundaryplot(){

  jheight=Math.floor(squareWidth*0.87);
  for(i=0;i<size;i++){
    for(j=0;j<size;j++){
      var r,t;
      r=i+1;
      t=j+1;
      if(i==size-1){
        r=0;
      }
      if(j==size-1){
        t=0;
      }
      if(s[i][j].o!=s[i][t].o){
      pj= (j+1)*jheight;
        newi=i*squareWidth+250+Math.floor((400-pj)*Math.tan(0.523599));
        newi1=i*squareWidth+Math.floor((400-pj)*Math.tan(0.523599));
        for(pi=newi;pi<(newi+squareWidth-1);pi++){
          index=(pi+pj*image.width)*4;

          ima.data[index]= 0;
          ima.data[index+1]= 0;
          ima.data[index+2]=0;
          ima.data[index+3]= 255;
        }
        for(pi=newi1;pi<(newi1+squareWidth-1);pi++){

          ima1.data[index]= 0;
          ima1.data[index+1]= 0;
          ima1.data[index+2]=0;
          ima1.data[index+3]= 255;
        }

      }

      if(s[i][j].o==s[i][t].o){
      pj= (j+1)*jheight;
        newi=i*squareWidth+250+Math.floor((400-pj)*Math.tan(0.523599));
        newi1=i*squareWidth+Math.floor((400-pj)*Math.tan(0.523599));
        for(pi=newi;pi<(newi+squareWidth-1);pi++){
          index=(pi+pj*image.width)*4;


          ima.data[index]= 0;
          ima.data[index+1]= 0;
          ima.data[index+2]=0;
          ima.data[index+3]= 0;
        }
        for(pi=newi1;pi<(newi1+squareWidth-1);pi++){

          ima1.data[index]= 0;
          ima1.data[index+1]= 0;
          ima1.data[index+2]=0;
          ima1.data[index+3]= 0;
        }
      }

      if(s[i][j].o!=s[r][j].o){
        for(pj=j*jheight;pj<((j+1)*jheight);pj++){
          pi=(i+1)*squareWidth+250+Math.floor((400-pj)*Math.tan(0.523599));
          pi1=(i+1)*squareWidth+Math.floor((400-pj)*Math.tan(0.523599));
            index=(pi+pj*image.width)*4;
            index1=(pi1+pj*image.width)*4;

            ima.data[index]= 0;
            ima.data[index+1]= 0;
            ima.data[index+2]=0;
            ima.data[index+3]= 255;

            ima1.data[index1]= 0;
            ima1.data[index1+1]= 0;
            ima1.data[index1+2]=0;
            ima1.data[index1+3]= 255;

          }
        }

        if(s[i][j].o==s[r][j].o){
          for(pj=j*jheight;pj<((j+1)*jheight);pj++){
            pi=(i+1)*squareWidth+250+Math.floor((400-pj)*Math.tan(0.523599));
            pi1=(i+1)*squareWidth+Math.floor((400-pj)*Math.tan(0.523599));
              index=(pi+pj*image.width)*4;
              index1=(pi1+pj*image.width)*4;



              ima.data[index]= 0;
              ima.data[index+1]= 0;
              ima.data[index+2]=0;
              ima.data[index+3]= 0;

              ima1.data[index1]= 0;
              ima1.data[index1+1]= 0;
              ima1.data[index1+2]=0;
              ima1.data[index1+3]= 0;

            }
          }

    }
  }

}


function calcvolfrac(){
  aonly=0;
  bonly=0;
  abonly=0;
  for(i=0;i<size;i++){
    for(j=0;j<size;j++){
      var b,t,r,l;
      b=j-1;
      t=j+1;
      r=i+1;
      l=i-1;

      if(i==0)
        l=size-1;
      if(i==size-1)
        r=0;
      if(j==0)
        b=size-1;
      if(j==size-1)
        t=0;



        if(s[i][j].o!=s[r][j].o){
          if(s[i][j].c==s[r][j].c && s[i][j].c==0){aonly++;}
          else if(s[i][j].c==s[r][j].c && s[i][j].c==1){bonly++;}
          else {abonly++;}
        }

        if(s[i][j].o!=s[i][t].o){
          if(s[i][j].c==s[i][t].c && s[i][j].c==0){aonly++;}
          else if(s[i][j].c==s[i][t].c && s[i][j].c==1){bonly++;}
          else {abonly++;}
        }

    }
  }
  var total = aonly+bonly+abonly;
  volumeafrac= aonly/total;
  volumebfrac= bonly/total;
  volumeabfrac = 1 -(volumeafrac+volumebfrac);



    numaa.value= volumeafrac;
    numbb.value= volumebfrac;
    numab.value= volumeabfrac;



}
