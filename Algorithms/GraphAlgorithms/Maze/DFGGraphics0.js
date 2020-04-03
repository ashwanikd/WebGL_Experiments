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

// number of nodes in horizontal direction
var H_NUMBER = 100;
// number of nodes in vertical direction
var V_NUMBER = 60;


/**
 *@Variable vertexBuffer buffer for vertices
 */
var vertexBuffer;

/**
 *@variable FSIZE to store size of single data element in bytes of array
 */
var FSIZE;

// webgl context
var gl;

// canvas element in html
var canvas;

// animation function
var animate;

// id of requestAnimationFrame
var animationID;

// stack for implementation of DFS
var nodeStack;

/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function main
 *exectuion starts from main function
 */
function main(){
    // retriving canvas element
    canvas = document.getElementById('drawing_canvas');
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
    
    // binding buffer object to ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    // initializing all nodes
    initializeNodes();
    
    // starting animation
    animate = function(){
        var curNode;
        if(nodeStack.length > 0){
            curNode = nodeStack.pop();
            if(dfs(curNode)){
                points.push(curNode.parent.X,curNode.parent.Y,5.0,
                        1.0,1.0,1.0,
                        curNode.X,curNode.Y,5.0,
                        1.0,1.0,1.0);
                n+=2;
                draw();
            }
            animationID = requestAnimationFrame(animate);
        }else {
            console.log(points);
            cancelAnimationFrame(animationID);
        }
    };
    
    // start DFS algorithm for maze generation from a random point
    algorithm();
    
}

/**
 *Data about all the shapes stored in this variable
 *form of the data will be
 *x coordinate,y coordinate,pointsize,color(RGB)
 */
var points = [];

// number of shapes
var n=0;

var check = false;

/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function draw
 *Draw the graphics on the canvas by taking data from the variables
 */
var t=0;
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
    if(!check){
        gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*6,0);
        gl.enableVertexAttribArray(a_Position);
        
        // passing data to a_PointSize attribute
        gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,FSIZE*6,FSIZE*2);
        gl.enableVertexAttribArray(a_PointSize);
        
        // passing data to a_Color attribute
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*6,FSIZE*3);
        gl.enableVertexAttribArray(a_Color);
        check = true;
    }
    
    // drawing command to webgl graphics
    gl.drawArrays(gl.LINES,0,n);
}

/**
 *@author Ashwani Kumar Dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function node constructor for a single coordinate in canvas
 *@param name name of node(usually an integer index which can be used to refer to node)
 *@param x_value x coordinate
 *@param y_value y_coordinate
 */
function Node(name,x_value,y_value){
    this.Name = name;
    this.X = x_value;
    this.Y = y_value;
    this.theta = function(){
        return Math.atan(this.y/this.x);
    };
    this.r = function(){
        return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
    };
    this.Connection = new Array();
    this.Visited = false;
}

// list of nodes
var nodes;

// number of nodes
var num_of_nodes;

// used in node initialization
var dx,dy;

/**
 *@author Ashwani Kumar Dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function initializeNodes initialize a number of nodes 
 */
function initializeNodes(){
    dx = 1.99/H_NUMBER;
    dy = 1.99/V_NUMBER;
    num_of_nodes = 0;
    nodes = new Array(V_NUMBER);
    for(var i=0;i<V_NUMBER;i++){
        nodes[i] = new Array(H_NUMBER);
        for(var j=0;j<H_NUMBER;j++){
            nodes[i][j] = new Node(num_of_nodes++,-0.99+(dx*j),0.99-(dy*i));
            if(j>0){
                nodes[i][j].Connection.push(nodes[i][j-1]);
                nodes[i][j-1].Connection.push(nodes[i][j]);
            }
            if(i>0){
                nodes[i][j].Connection.push(nodes[i-1][j]);
                nodes[i-1][j].Connection.push(nodes[i][j]);
            }
        }
    }
}

/**
 *@author Ashwani Kumar Dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function algorithm initializes preliminaries and starts dfs algorithm 
 */
function algorithm(){
    var i = Math.floor(Math.random()*V_NUMBER);
    var j = Math.floor(Math.random()*H_NUMBER);
    nodeStack = new Array();
    nodeStack.push(nodes[i][j]);
    nodes[i][j].parent = nodes[i][j];
    animationID = requestAnimationFrame(animate);
}

/**
 *@author Ashwani Kumar Dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function dfs Recursive Depth first search algortihm
 *@param node initial node from which searching starts
 */
function dfs(node){
    if(node.Visited){
        return false;
    }
    node.Visited = true;
    var Connection = node.Connection;
    shuffle(Connection);
    for(var i=0;i<Connection.length;i++){
        if(!Connection[i].Visited){
            nodeStack.push(Connection[i]);
            Connection[i].parent = node;
        }
    }
    return true;
}

/**
 *@author Ashwani Kumar Dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function shuffle shuffles an arry places elements in random order
 *@param array array that needed to be shuffled
 */
function shuffle(array){
    var j,temp;
    for(var i=array.length-1;i>0;i--){
        j = Math.floor(Math.random()*i);
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
}
