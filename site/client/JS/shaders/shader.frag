precision highp float;

const int MAX_LIGHTS = 8;

struct LightInfo {
    // Light colour intensities
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    // Light geometry
    vec4 position;  // Position/direction of light (in camera coordinates)
    vec3 axis;
    float cutoff;
    float aperture;
};

struct MaterialInfo {
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float shininess;
};

uniform highp int uNLights; //     Effective number of lights used

uniform LightInfo uLights[MAX_LIGHTS]; // The array of lights present in the scene
uniform MaterialInfo uMaterial;        // The material of the object being drawn

varying vec3 fNormal;
varying vec3 fViewer;

void main() {
    vec3 iPixel = vec3 (0.0,0.0,0.0);

    for(int i=0; i<MAX_LIGHTS; i++) {
        if(i==uNLights) { break; }
        
        // Light Color
        vec3 ambientColor = (uLights[i].ambient / 255.0) * (uMaterial.Ka / 255.0);
        vec3 diffuseColor = (uLights[i].diffuse / 255.0) * (uMaterial.Kd / 255.0);
        vec3 specularColor = (uLights[i].specular / 255.0) * (uMaterial.Ks / 255.0);

        vec3 L;
        float C = 1.0;
        if(uLights[i].position.w == 0.0) {
            L = normalize(uLights[i].axis);
        } else {
            L = normalize(uLights[i].position.xyz + fViewer);
            if(uLights[i].aperture < 1.0) {
                float alpha = dot(L,normalize(uLights[i].axis));       
                if (alpha > uLights[i].aperture)
                    C = pow(alpha,uLights[i].cutoff);
                else
                    C = 0.0; 
            }
        }
        

        vec3 V = normalize(fViewer);
        vec3 N = normalize(fNormal);
        vec3 H = normalize(L+V);

        float diffuseFactor = max( dot(L,N), 0.0 );
        vec3 diffuse = diffuseFactor * diffuseColor;

        float specularFactor = pow(max(dot(N,H), 0.0), uMaterial.shininess);
        vec3 specular = specularFactor * specularColor;

        if( dot(L,N) < 0.0 ) {
            specular = vec3(0.0, 0.0, 0.0);
        }

        iPixel += vec3(C * ambientColor + C * diffuse + C * specular);        
    }

    gl_FragColor = vec4(iPixel, 1.0);
}