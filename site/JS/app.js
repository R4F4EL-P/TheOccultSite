import { buildProgramFromSources, loadShadersFromURLS, setupWebGL } from "./libs/utils.js";
import { ortho, lookAt, flatten, normalMatrix, mult, inverse, vec4 } from "./libs/MV.js";
import {modelView, loadMatrix, multRotationX, multRotationY, multRotationZ, multScale, multTranslation, pushMatrix, popMatrix } from "./libs/stack.js"

import * as CUBE from './libs/objects/cube.js';
import * as PYRAMID from './libs/objects/pyramid.js';
import { perspective } from "./libs/MV.js";



const hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', function () {
    this.classList.toggle('is-active');
});



/** @type WebGLRenderingContext */
let gl;

let mode;              // Drawing mode (gl.LINES or gl.TRIANGLES)
let vp;
let frame = 0;
let apperture = 0;

const VP_DISTANCE = 7;


let camera = {
    at: { x:0, y:0, z:0},
    up: { x:0, y:1, z:0},
    fovy: 45,
    near: 0.1,
    far: 10
};

let lights = [
    {
        ambient: [50, 50, 50],
        diffuse: [60, 60, 60],
        specular: [200, 200, 200],
        position: { x: 10,y: 0,z: 10,w: 1 },
        axis: { x:0.0, y:0.0, z:-1.0 },
        aperture: 0,
        cutoff: 0
    },
    {
        ambient: [50, 0, 50],
        diffuse: [50, 0, 0],
        specular: [150, 0, 0],
        position: { x:-20.0, y:5.0, z:5.0,w:0.0 },
        axis: { x:20.0, y:-5.0, z:-5.0 },
        aperture: 100.0,
        cutoff: -1
    },
    {
        ambient: [255, 255, 255],
        diffuse: [255, 255, 255],
        specular: [200, 200, 200],
        position: { x:0.0, y:0.0, z:10.0, w:1.0 },
        axis: { x:0.0, y:0.0, z:-1 },
        aperture: 10.0,
        cutoff: 0.1
    }
];

// Objects Material
let cubeMaterial =
    {
        Ka: [100, 0, 0],
        Kd: [0, 155, 155],
        Ks: [20, 20, 20],
        shininess: 60.0
    };  

let groundMaterial = 
    {
        Ka: [255, 130, 65],
        Kd: [100, 0, 10],
        Ks: [255, 100, 60],
        shininess: 4.0
    };

let exitMaterial =
    {
        Ka: [255, 255, 255],
        Kd: [255, 255, 255],
        Ks: [255, 255, 255],
        shininess: 0.0
    };

function setup(shaders)
{
    let canvas = document.getElementById("gl-canvas");
    let aspect = canvas.width / canvas.height;

    gl = setupWebGL(canvas);

    mode = gl.TRIANGLES; 

    let program = buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);

    let mProjection = perspective(camera.fovy,aspect, camera.near, camera.far);

    resize_canvas();
    window.addEventListener("resize", resize_canvas);

    gl.clearColor(0.01, 0.01, 0.01, 1.0);
    CUBE.init(gl);
    PYRAMID.init(gl);
    gl.enable(gl.DEPTH_TEST);   // Enables Z-buffer depth test
    
    window.requestAnimationFrame(render);

    function resize_canvas(event)
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        aspect = canvas.width / canvas.height;

        gl.viewport(0,0,canvas.width, canvas.height);

        mProjection = perspective(camera.fovy,aspect, camera.near, camera.far);
    }

    function uploadModelView()
    {
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mModelView"), false, flatten(modelView()));
    }

    function cube(material) {
        uploadModelView();

        let uKa = gl.getUniformLocation(program, "uMaterial.Ka");
        gl.uniform3fv(uKa,material.Ka);

        let uKd = gl.getUniformLocation(program, "uMaterial.Kd");
        gl.uniform3fv(uKd,material.Kd);

        let uKs = gl.getUniformLocation(program, "uMaterial.Ks");
        gl.uniform3fv(uKs,material.Ks);

        let uShininess = gl.getUniformLocation(program, "uMaterial.shininess")
        gl.uniform1f(uShininess,material.shininess);

        CUBE.draw(gl,program,mode);
    }

    function pyramid(material) {
        uploadModelView();

        let uKa = gl.getUniformLocation(program, "uMaterial.Ka");
        gl.uniform3fv(uKa,material.Ka);

        let uKd = gl.getUniformLocation(program, "uMaterial.Kd");
        gl.uniform3fv(uKd,material.Kd);

        let uKs = gl.getUniformLocation(program, "uMaterial.Ks");
        gl.uniform3fv(uKs,material.Ks);

        let uShininess = gl.getUniformLocation(program, "uMaterial.shininess")
        gl.uniform1f(uShininess,material.shininess);

        PYRAMID.draw(gl,program,mode);
    }

    function doorway(){
        pushMatrix();
        multTranslation([2.15,2.5,-3]);
        multScale([2.2,5,0.5]);
        cube(cubeMaterial);
        popMatrix();

        pushMatrix();
        multTranslation([-2.2,2.5,-3]);
        multScale([2.2,5,0.5]);
        cube(cubeMaterial);
        popMatrix();

        pushMatrix();
        multTranslation([0,4.25,-3]);
        multScale([2.2,1.5,0.5]);
        cube(cubeMaterial);
        popMatrix();

        // Door
        pushMatrix();
        multTranslation([-1.1,0,-3])
        multRotationY(-apperture);
        multTranslation([1.1,1.75,0]);
        multScale([2.2,3.5,0.5]);
        cube(cubeMaterial);
        popMatrix();

        pushMatrix();
        multTranslation([0,1.75,-3.5]);
        multScale([2.2,3.5,0.5]);
        cube(exitMaterial);
        popMatrix();
    }

    function world() {
        multTranslation([0,-3,0]);

        // Wall right
        pushMatrix();
        multTranslation([0,5.25,-2.75]);
        multScale([6.5,0.5,1]);
        cube(cubeMaterial);
        popMatrix();

        pushMatrix();
        doorway();
        popMatrix();

        // Wall left
        pushMatrix();
        multTranslation([-2.75,5.25,0]);
        multScale([1,0.5,6.5]);
        cube(cubeMaterial)
        popMatrix();

        pushMatrix();
        multTranslation([-3,2.5,0]);
        multScale([0.5,5,6.5]);
        cube(cubeMaterial);
        popMatrix();

        // Ground
        pushMatrix();
        multTranslation([0,-0.25,0]);
        multScale([7,0.5,7]);
        cube(groundMaterial);
        popMatrix();
    }

    // Inicialize the Ligths uniforms
    function addLight() {

        let uNLights = gl.getUniformLocation(program, "uNLights");
        gl.uniform1i(uNLights,lights.length);       // For now we only consider one ligth source

        for(let i=0;i< lights.length;i++) {
            let uLAmbient = gl.getUniformLocation(program, "uLights["+i+"].ambient");
            gl.uniform3fv(uLAmbient, lights[i].ambient);

            let uLdiffuse = gl.getUniformLocation(program, "uLights["+i+"].diffuse");
            gl.uniform3fv(uLdiffuse, lights[i].diffuse);

            let uLSpecular = gl.getUniformLocation(program, "uLights["+i+"].specular");
            gl.uniform3fv(uLSpecular, lights[i].specular);

            let uLPosition = gl.getUniformLocation(program, "uLights["+i+"].position");
            gl.uniform4fv(uLPosition,[lights[i].position.x,lights[i].position.y,lights[i].position.z,lights[i].position.w]);

            let uLaxis = gl.getUniformLocation(program, "uLights["+i+"].axis");
            gl.uniform3fv(uLaxis,[lights[i].axis.x, lights[i].axis.y, lights[i].axis.z]);

            let uCutoff = gl.getUniformLocation(program, "uLights["+i+"].cutoff");
            gl.uniform1f(uCutoff,lights[i].cutoff);

            let uAperture = gl.getUniformLocation(program, "uLights["+i+"].aperture");
            gl.uniform1f(uAperture,Math.cos(lights[i].aperture*Math.PI/180));
        }
    }

    function render()
    {
        apperture = 45 *(Math.sin(frame) + 1)/2;
        frame+=0.01;

        window.requestAnimationFrame(render);

        vp = lookAt([VP_DISTANCE,VP_DISTANCE,VP_DISTANCE],[0,0,0],[0,1,0]);
        
        gl.enable(gl.CULL_FACE)

        gl.enable(gl.DEPTH_TEST)
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mProjection = ortho(-VP_DISTANCE*aspect,VP_DISTANCE*aspect,-VP_DISTANCE,VP_DISTANCE,-3*VP_DISTANCE,3*VP_DISTANCE);

        gl.useProgram(program);
        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "mProjection"), false, flatten(mProjection));
    
        loadMatrix(vp);

        const uNormals = gl.getUniformLocation(program,"mNormals");
        gl.uniformMatrix4fv(uNormals,false,flatten(normalMatrix(modelView())));

        addLight();
        world();
    }
}

const urls = ["shader.vert", "shader.frag"];
loadShadersFromURLS(urls).then(shaders => setup(shaders))