import solarSystemSnippet from './snippets/solar-system.js?raw';

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
  'icosahedron-geometry': `// An icosahedron shape
const geometry = new THREE.IcosahedronGeometry( 1, 0 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );`,
  'capsule-geometry': `// A capsule shape
const geometry = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
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
  starfield: `// Creates a starfield as a THREE.Points object
function getStarfield({ numStars = 500, textureURL = '/images/whiteDot32.png' } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }
  const verts = [];
  for (let i = 0; i < numStars; i += 1) {
    verts.push(...randomSpherePoint().toArray());
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    map: new THREE.TextureLoader().load(textureURL),
    transparent: true
  });
  const points = new THREE.Points(geo, mat);
  return points;
}`,
  'solar-system': solarSystemSnippet,
  'obj-loader': `// Loads .obj files
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const loader = new OBJLoader();
loader.load(
    // resource URL
    '/models/spiked.obj',
    // called when resource is loaded
    function ( object ) {
        // For example, add the object to the scene
        // and scale it if it's too big or small
        object.scale.setScalar(0.1);
        scene.add( object );
    },
    // called when loading is in progress
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened while loading the model' );
    }
);`,
  'obj-loader-scene': `// A full scene that loads and animates a .obj model
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Set up the scene, camera, and renderer
let camera, scene, renderer;
let controls;
let loadedModel;
let mesh;

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
    const fov = 45;
    const aspect = w / h;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(5, 5, 5);

    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.target.set(0, 1, 0);

    // Add lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(3, 10, 10);
    scene.add(dirLight);

    // Load the .obj model
    const loader = new OBJLoader();
    loader.load(
        '/models/spiked.obj',
        function ( object ) {
            
            const mainMaterial = new THREE.MeshBasicMaterial({
                color: 'hotpink',
            });

            object.traverse( function ( child ) {
                if ( child.isMesh && !child.userData.isWireframe ) {
                    child.material = mainMaterial;

                    const wireframeMaterial = new THREE.MeshBasicMaterial({
                        color: 'white',
                        wireframe: true
                    });

                    const wireframe = new THREE.Mesh( child.geometry, wireframeMaterial );
                    wireframe.userData.isWireframe = true;
                    wireframe.scale.setScalar(1.001); 
                    child.add( wireframe );
                }
            });
            
            object.position.y = -0.5; 
            scene.add( object );

            loadedModel = object; //Assign the loaded object to variable
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.error( 'An error happened loading the .obj model', error );
        }
    );

    window.addEventListener('resize', handleResize);
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

    // 3. Check if the model has been loaded before trying to animate it
    if (loadedModel) {
        loadedModel.rotation.y += -0.01; // Use a smaller value for smoother rotation
    }

    if (mesh) {
        mesh.rotation.y += -0.01;
    }

    renderer.render(scene, camera);
}

init();`,
  'spinning-red-cube': `// A complete scene with a spinning red cube
import * as THREE from 'three';

let camera, scene, renderer, cube;

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // Camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 3;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';

    // The Cube
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    // Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}

init();`,
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

    window.addEventListener('resize', handleResize);
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

init();`,
};

export const defaultCode = `// A fairly random example scene
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Set up the scene, camera, and renderer
let camera, scene, renderer;
let controls;
let loadedModel;
let torus, torus2, torus3, torus4;
let toriToAnimate = []; // Declare the array here

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
    const fov = 60;
    const aspect = w / h;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set( 4.5, 1, -0.5 );

    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x34c0eb); //light blue

    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.target.set(0, 1, 0);

    // Add lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(3, 10, 10);
    scene.add(dirLight);

    // Make Torus
    const geometry = new THREE.TorusGeometry(2.16, 0.024, 8, 64);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xF2D8E6, 
        wireframe: true
        });

    torus = new THREE.Mesh( geometry, material );
    torus.position.y = 1;
    torus.rotation.x = Math.PI / 2;

    torus2 = new THREE.Mesh( geometry, material );
    torus2.position.y = 1;
    torus2.rotation.x = Math.PI / 1;

    torus3 = new THREE.Mesh( geometry, material );
    torus3.position.y = 1;
    torus3.rotation.x = Math.PI / 4;

    torus4 = new THREE.Mesh( geometry, material );
    torus4.position.y = 1;
    torus4.rotation.x = Math.PI / -4;

    //Add all tori to the scene
    scene.add( torus, torus2, torus3, torus4 );
    
    // 2. Add them to the animation array
    toriToAnimate.push(torus, torus2, torus3, torus4);


    // Load the .obj model
    const loader = new OBJLoader();
    loader.load(
        '/models/spiked.obj',
        function ( object ) {
            
            const mainMaterial = new THREE.MeshBasicMaterial({
                color: 'hotpink',
            });

            object.traverse( function ( child ) {
                if ( child.isMesh && !child.userData.isWireframe ) {
                    child.material = mainMaterial;

                    const wireframeMaterial = new THREE.MeshBasicMaterial({
                        color: 'white',
                        wireframe: true
                    });

                    const wireframe = new THREE.Mesh( child.geometry, wireframeMaterial );
                    wireframe.userData.isWireframe = true;
                    wireframe.scale.setScalar(1.001); 
                    child.add( wireframe );
                }
            });
            
            object.position.y = -0.5;
            scene.add( object );

            loadedModel = object; //Assign the loaded object to variable
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.error( 'An error happened loading the .obj model', error );
        }
    );

    window.addEventListener('resize', handleResize);
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

    // Check if the model has been loaded before trying to animate it
    if (loadedModel) {
        loadedModel.rotation.y += -0.004;
    }

    for (const torus of toriToAnimate) {
        torus.rotation.x += -0.005;
        torus.rotation.z += -0.5;
    };

    renderer.render(scene, camera);
}

init();`;

export const snippetCategories = {
  Geometries: [
    'box-geometry',
    'sphere-geometry',
    'plane-geometry',
    'torus-geometry',
    'icosahedron-geometry',
    'capsule-geometry',
  ],
  Materials: [
    'basic-material',
    'lambert-material',
    'standard-material',
    'wireframe-material',
    'matcap-material',
  ],
  Lights: ['ambient-light', 'point-light', 'directional-light'],
  Helpers: ['axes-helper', 'grid-helper', 'starfield'],
  Examples: ['spinning-red-cube', 'empty-scene', 'solar-system'],
  Loaders: ['obj-loader', 'obj-loader-scene'],
};
