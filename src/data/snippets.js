export const snippets = {
  'box-geometry': `// A box shape
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );`,
  'sphere-geometry': `// A sphere shape
const geometry = new THREE.SphereGeometry( 1, 32, 16 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );`,
  'plane-geometry': `// A flat plane
const geometry = new THREE.PlaneGeometry( 10, 10 );
const material = new THREE.MeshStandardMaterial( { color: 0xeeeeee, side: THREE.DoubleSide } );
const mesh = new THREE.Mesh( geometry, material );
mesh.rotation.x = -Math.PI / 2; // Rotate to be flat
scene.add( mesh );`,
  'torus-geometry': `// A donut shape
const geometry = new THREE.TorusGeometry( 1, 0.4, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xffa500 } );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );`,
  'basic-material': `// A simple, unlit material
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );`,
  'lambert-material': `// A simple, lit material that is not shiny
const material = new THREE.MeshLambertMaterial( { color: 0xffffff } );`,
  'standard-material': `// A physically-based material (shiny or rough)
const material = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    roughness: 0.5, // 0 is shiny, 1 is matte
    metalness: 0.5  // 0 is non-metallic, 1 is metallic
} );`,
  'wireframe-material': `// A material that shows the edges of the geometry
const material = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    wireframe: true
} );`,
  'matcap-material': `// A material that uses a texture to define the object's appearance
// No lights are needed in the scene for this material.
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load( 'assets/matcap_01.webp' );
const material = new THREE.MeshMatcapMaterial( { matcap: matcapTexture } );`,
  'ambient-light': `// A light that illuminates all objects in the scene equally
// Does not cast shadows.
const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );`,
  'point-light': `// A light that shines from a single point in all directions
const pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
pointLight.position.set( 5, 5, 5 );
scene.add( pointLight );`,
  'directional-light': `// A light that shines from a specific direction, like the sun
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 5, 10, 7.5 );
scene.add( directionalLight );`,
  'axes-helper': `// Shows the X, Y, Z axes for reference
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );`,
  'grid-helper': `// Shows a grid on the ground plane
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );`,
  'spinning-red-cube': `// A red cube that spins
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
}
animate();`,
  'empty-scene': `// A blank scene with camera, lights, and controls.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Set up the scene, camera, and renderer
let camera, scene, renderer;
let controls;

function init() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create the WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';

    // Set up the camera
    const fov = 75;
    const aspect = w / h;
    const near = 0.1;
    const far = 10;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    // Create the scene
    scene = new THREE.Scene();

    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);

    // ------------------------------------------
    // --- ADD YOUR OBJECTS AND GEOMETRY HERE ---
    // ------------------------------------------

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('message', (event) => {
        if (event.data.type === 'resize') {
            handleResize();
        }
    });

    // Start the animation loop
    animate();
}

function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if(camera && renderer) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();`
};

export const defaultCode = `// Import necessary modules
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Set up the scene, camera, and renderer
let camera, scene, renderer;
let controls, mesh;

function init() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create the WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';

    // Set up the camera
    const fov = 75;
    const aspect = w / h;
    const near = 0.1;
    const far = 10;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    // Create the scene
    scene = new THREE.Scene();

    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    // Add Icosahedron primitive
    const geo = new THREE.IcosahedronGeometry(1.0, 2);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true
    });
    mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
    });

    const wireframe = new THREE.Mesh(geo, wireMat);
    wireframe.scale.setScalar(1.001);
    mesh.add(wireframe);

    // Add lights
    const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('message', (event) => {
        if (event.data.type === 'resize') {
            handleResize();
        }
    });

    // Start the animation loop
    animate();
}

function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if(camera && renderer) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
}

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.005;
    controls.update();
    renderer.render(scene, camera);
}

init();`;

export const snippetCategories = {
  'Geometries': ['box-geometry', 'sphere-geometry', 'plane-geometry', 'torus-geometry'],
  'Materials': ['basic-material', 'lambert-material', 'standard-material', 'wireframe-material', 'matcap-material'],
  'Lights': ['ambient-light', 'point-light', 'directional-light'],
  'Helpers': ['axes-helper', 'grid-helper'],
  'Examples': ['spinning-red-cube', 'empty-scene']
};