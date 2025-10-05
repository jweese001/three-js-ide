import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import Editor from './components/Editor.tsx';
import Preview from './components/Preview.tsx';
import SnippetDrawer from './components/SnippetDrawer.tsx';
import Resizer from './components/Resizer.tsx';
import StatusBar from './components/StatusBar.tsx';
import ErrorOverlay from './components/ErrorOverlay.tsx'; // Import ErrorOverlay

const defaultCode = `// A fairly random example scene
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

function App() {
  const [code, setCode] = useState(defaultCode);
  const [editorWidth, setEditorWidth] = useState(50);
  const [isEditorStowed, setIsEditorStowed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnippetDrawerOpen, setIsSnippetDrawerOpen] = useState(false); // State for snippet drawer
  const [error, setError] = useState(null); // Add error state
  const editorRef = useRef(null);
  const iframeRef = useRef(null);
  const [isIframeReady, setIsIframeReady] = useState(false);

  // Load saved code on startup
  useEffect(() => {
    const savedCode = localStorage.getItem('threejs-ide-code');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Auto-save code changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('threejs-ide-code', code);
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [code]);

  const runCode = useCallback(() => {
    if (iframeRef.current && isIframeReady) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'executeCode', code },
        window.location.origin
      );
    }
  }, [code, isIframeReady]);

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const { type, payload } = event.data;
      if (type === 'error') {
        setError(payload);
      } else if (type === 'ready') {
        setIsIframeReady(true);
      } else if (type === 'reset') {
        runCode();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [runCode]);

  // Run code on initial load and on subsequent changes
  useEffect(() => {
    runCode();
  }, [runCode]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setError(null); // Clear error on code change
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // Cmd/Ctrl+R to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, runCode);

    // Cmd/Ctrl+Shift+R to reset to default code
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR,
      () => {
        if (
          window.confirm(
            'Are you sure you want to reset the code to the default?'
          )
        ) {
          setCode(defaultCode);
          localStorage.removeItem('threejs-ide-code');
        }
      }
    );
  };

  const handleSnippetInsert = (snippetCode) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      editorRef.current.executeEdits('snippet-inserter', [
        {
          range: new window.monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          text: snippetCode,
        },
      ]);
      editorRef.current.focus();
    }
  };

  const handleResize = (newWidthPercentage) => {
    setEditorWidth(newWidthPercentage);
  };

  const handleStow = () => {
    setIsEditorStowed(!isEditorStowed);
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage({ type: 'resize' }, '*');
      }
    }, 300);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ type: 'resize' }, '*');
    }
  };

  const toggleSnippetDrawer = () => {
    setIsSnippetDrawerOpen(!isSnippetDrawerOpen);
  };

  return (
    <div className="App">
      <div className="ide-container">
        <SnippetDrawer
          isOpen={isSnippetDrawerOpen}
          onClose={() => setIsSnippetDrawerOpen(false)}
          onSnippetInsert={handleSnippetInsert}
        />
        <div
          id="editor-container"
          className={isEditorStowed ? 'stowed' : ''}
          style={{ flexBasis: isEditorStowed ? '0%' : `${editorWidth}%` }}
        >
          <Editor
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorMount}
          />
        </div>

        <Resizer
          onResize={handleResize}
          onStow={handleStow}
          editorWidth={editorWidth}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        />

        <div id="preview-container">
          <Preview ref={iframeRef} isDragging={isDragging} />
          <ErrorOverlay error={error} onClose={() => setError(null)} />
        </div>
      </div>
      <StatusBar
        onToggleSnippets={toggleSnippetDrawer}
        isSnippetDrawerOpen={isSnippetDrawerOpen}
      />
    </div>
  );
}

export default App;
