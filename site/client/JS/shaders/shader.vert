precision highp float;

uniform mat4 mModelView;
uniform mat4 mNormals;
uniform mat4 mProjection;

attribute vec4 vPosition;
attribute vec3 vNormal;

varying vec3 fNormal;   
varying vec3 fViewer;
varying vec3 vPos;

void main() {
    vec3 posC = (mModelView * vPosition).xyz;

    // Normal vector in camera coordinates
    fNormal = (mNormals*vec4(vNormal,0.0)).xyz;  
    fViewer = -posC;
    gl_Position = mProjection * mModelView * vPosition;
}