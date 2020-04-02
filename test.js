/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *the file is written for drawing maze generation graphics on the browser window using
 *HTML5 canvas and WebGL library and javascript. to run the code open the HTML file in the browser
 *and make sure it is run in WebGL enabled browser like Google Chrome, Firefox. and allow javascript and
 *webgl in the browser.
 */

// vertex shader source
var VSHADER_SRC =   'attribute vec4 a_Position;'+'\n'+
                    'attribute vec4 a_Color;'+'\n'+
                    'varying vec4 v_Color;'+'\n'+
                    'attribute float a_PointSize;'+'\n'+
                    'void main(){'+'\n'+
                    '   gl_Position = a_Position;'+'\n'+
                    '   gl_PointSize = a_PointSize;'+'\n'+
                    '   v_Color = a_Color;'+'\n'+
                    '}'+'\n';         

// fragment shader source
var FSHADER_SRC =   'precision mediump float;'+'\n'+
                    'varying vec4 v_Color;'+'\n'+
                    'void main(){'+'\n'+
                    '   gl_FragColor = v_Color;'+'\n'+
                    '}'+'\n';

/**
 *@Variable a_Position stores the location of attribute a_Position
 *@Variable a_PointSize stores location of attribute a_PointSize
 *@Variable a_Color stores location of attribute a_Color
 */
var a_Position;
var a_PointSize;
var a_Color;

/**
 *@Variable vertexBuffer buffer for vertices
 */
var vertexBuffer;

var FSIZE;

// webgl context
var gl;

/**
 *@variable vertexBuffer
 *@variable xformmatrixbuffer
/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function main
 *exectuio n starts from main function
 */
function main(){
    // retriving canvas element
    var canvas = document.getElementById('drawing_canvas');
    if(!canvas){
        console.log('unable to retrive canvas element');
    }
    
    // setting width and height
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // getting webgl context from canvas
    gl = getWebGLContext(canvas);
    if(!gl){
        console.log('unable to retrive webgl context');
    }
    
    // initializing shaders
    if(!initShaders(gl,VSHADER_SRC,FSHADER_SRC)){
        console.log('unable to initialize shaders');
    }
    
    // getting locations of attributes and uniform variables
    a_Position = gl.getAttribLocation(gl.program,'a_Position');
    a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
    a_Color = gl.getAttribLocation(gl.program,'a_Color');
    
    
    if(a_Position<0){
        console.log('unable to retrive location of a_Position from shader programs');
    }
    if(a_PointSize<0){
        console.log('unable to retrive location of a_PointSize from shader programs');
    }
    if(a_Color<0){
        console.log('unable to retrive location of a_Color from shader programs');
    }
    
    // initializing buffers
    vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('unable to create vertex buffer');
    }
    
    // binding buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    draw();
}

/**
 *Data about all the shapes stored in this variable
 *form of the data will be
 *x coordinate,y coordinate,pointsize,color(RGB)
 */
var points = [0.0,0.0, 5.0,
              1.0,0.0,0.0,
              0.5,0.5, 5.0,
              1.0,1.0,1.0];
var n=2;


/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function draw
 *Draw the graphics on the canvas by taking data from the variables
 */
function draw(){
    
    // clearing the canvas for drawing
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // getting data in webgl supported format
    vertices = new Float32Array(points);
    FSIZE = vertices.BYTES_PER_ELEMENT;
    
    // passing data to buffers
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    
    // passing data to a_Position attribute
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*6,0);
    gl.enableVertexAttribArray(a_Position);
    
    // passing data to a_PointSize attribute
    gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,FSIZE*6,FSIZE*2);
    gl.enableVertexAttribArray(a_PointSize);
    
    // passing data to a_Color attribute
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*6,FSIZE*3);
    gl.enableVertexAttribArray(a_Color);
    
    // drawing command to webgl graphics
    gl.drawArrays(gl.LINES,0,n);
}