/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *the file is written for drawing maze generation graphics on the browser window using
 *HTML5 canvas and WebGL library and javascript. to run the code open the HTML file in the browser
 *and make sure it is run in WebGL enabled browser like Google Chrome, Firefox. and allow javascript and
 *webgl in the browser.
 */

// vertex shader source
var VSHADER_SRC =   'uniform mat4 u_xformMatrix;'+'\n'+
                    'attribute vec4 a_Position;'+'\n'+
                    'attribute vec4 a_Color;'+'\n'+
                    'varying vec4 v_Color;'+'\n'+
                    'attribute float a_PointSize;'+'\n'+
                    'void main(){'+'\n'+
                    '   gl_Position = u_xformMatrix * a_Position;'+'\n'+
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
 *@Variable u_xformMatrix storeslocation of attribute u_xformMatrix
 *@Variable a_PointSize stores location of attribute a_PointSize
 *@Variable a_Color stores location of attribute a_Color
 */
var a_Position;
var u_xformMatrix;
var a_PointSize;
var a_Color;
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
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('unable to retrive webgl context');
    }
    
    // initializing shaders
    if(!initShaders(gl,VSHADER_SRC,FSHADER_SRC)){
        console.log('unable to initialize shaders');
    }
    
    a_Position = gl.getAttribLocation(gl.program,'a_Position');
    a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
    u_xformMatrix = gl.getUniformLocation(gl.program,'u_xformMatrix');
    a_Color = gl.getAttribLocation(gl.program,'a_Color');
    
    if(a_Position<0){
        console.log('unable to retrive location of a_Position from shader programs');
    }
    if(a_PointSize<0){
        console.log('unable to retrive location of a_PointSize from shader programs');
    }
    if(u_xformMatrix<0){
        console.log('unable to retrive location of u_xformMatrix from shader programs');
    }
    if(a_Color<0){
        console.log('unable to retrive location of a_Color from shader programs');
    }
    
    
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}