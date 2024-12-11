import * as THREE from './build/three.module.js';
import { ARButton } from './jsm/webxr/ARButton.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './jsm/loaders/RGBELoader.js';

let container;
let camera, scene, renderer;
let controller;

let reticle, pmremGenerator, current_object, controls;

let hitTestSource = null;
let hitTestSourceRequested = false;

init();
animate();

$(".ar-object").click(function(){
    // if(current_object != null){
    //     scene.remove(current_object);
    // }
    // if (window.innerWidth >= 768) {
    //     // Execute the desktop-specific code
    //     console.log("eka");
    //     if (current_object != null) {
    //         console.log("toka");
    //         scene.remove(current_object);
    //     }
    // }
    if (window.matchMedia("(min-width: 768px)").matches) {
        // Execute the desktop-specific code
        console.log("eka");
        if (current_object != null) {
            console.log("toka");
            scene.remove(current_object);
        }
    }
    document.getElementById("mySidenav").style.width = "0";

    loadModel($(this).attr("id"));
});

$("#ARButton").click(function(){
    current_object.visible = false;
});

$("#place-button").click(function(){
    arPlace();
});

function arPlace(){
    if( reticle.visible ){
        current_object.position.setFromMatrixPosition(reticle.matrix);
        current_object.visible = true;

    }
}

export function loadModel(model){
        if (window.innerWidth >= 768) {
        // Execute the desktop-specific code
        
        if (current_object != null) {
            
            scene.remove(current_object);
        }
    }
    new RGBELoader()
        .setDataType(THREE.HalfFloatType)
        .setPath('./textures/')
        .load('photo_studio_01_1k.hdr', function(texture){

            var envmap = pmremGenerator.fromEquirectangular(texture).texture

            scene.environment = envmap;
            texture.dispose();
            pmremGenerator.dispose();
            render();

            var loader = new GLTFLoader().setPath('./scripts/3d/');
            loader.load(model + ".glb", function(glb){

                current_object = glb.scene;
                scene.add(current_object);

                arPlace();

                var box = new THREE.Box3();
                box.setFromObject(current_object);
                box.center(controls.target);

                controls.update();
                render();
            })
        });
}

function init() {
    //extract parameter (the furniture to load)
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let furnitureId = urlParams.get('id');
        if(typeof(furnitureId === 'string') && furnitureId.length < 20){
            console.log(furnitureId);
        }
        else{
            console.log('Invalid parameter');
        }
    } catch (error) {
        console.log('Error occured receiving parameter: ', error);
    }


    container = document.createElement( 'div' );
    document.getElementById("container").appendChild( container );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.001, 200 );

    var directionalLight = new THREE.DirectionalLight(0xdddddd, 1);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    //

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );

    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, -0.2);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    //

    let options = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
    }

    options.domOverlay = { root: document.getElementById('content')};

    document.body.appendChild( ARButton.createButton(renderer, options));

    //document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );

    //

    reticle = new THREE.Mesh(
        new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add( reticle );

    //

    window.addEventListener( 'resize', onWindowResize );

    //
    renderer.domElement.addEventListener('touchstart', function(e){
        e.preventDefault();
        touchDown = true;
        touchX = e.touches[0].pageX;
        touchY = e.touches[0].pageY;
    }, false);

    renderer.domElement.addEventListener('touchend', function(e){
        e.preventDefault();
        touchDown = false;
    }, false);

    renderer.domElement.addEventListener('touchmove', function(e){
        e.preventDefault();
        
        if(!touchDown){
            return;
        }

        deltaX = e.touches[0].pageX - touchX;
        deltaY = e.touches[0].pageY - touchY;
        touchX = e.touches[0].pageX;
        touchY = e.touches[0].pageY;

        rotateObject();

    }, false);

}

var touchDown, touchX, touchY, deltaX, deltaY;

function rotateObject(){
    if(current_object && reticle.visible){
        current_object.rotation.y += deltaX / 100;
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    renderer.setAnimationLoop( render );
    requestAnimationFrame(animate);
    controls.update();

}

function render( timestamp, frame ) {

    if ( frame ) {

        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if ( hitTestSourceRequested === false ) {

            session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {

                session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

                    hitTestSource = source;

                } );

            } );

            session.addEventListener( 'end', function () {

                hitTestSourceRequested = false;
                hitTestSource = null;

                reticle.visible = false;

                var box = new THREE.Box3();
                box.setFromObject(current_object);
                box.center(controls.target);
                
                //this is recommended by gpt4 since box.center seems to be redacted or something but this didnt seem to work
                // var boxCenter = new THREE.Vector3(); 
                // box.getCenter(boxCenter);
                // controls.target.copy(boxCenter);

                document.getElementById("place-button").style.display = "none";
                
            } );

            hitTestSourceRequested = true;

        }

        if ( hitTestSource ) {

            const hitTestResults = frame.getHitTestResults( hitTestSource );

            if ( hitTestResults.length ) {

                const hit = hitTestResults[ 0 ];

                document.getElementById("place-button").style.display = "block";

                reticle.visible = true;
                reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );

            } else {

                reticle.visible = false;

                document.getElementById("place-button").style.display = "none";

            }

        }

    }

    renderer.render( scene, camera );

}

// Function to fetch and populate the sidenav
async function populateSidenav() {
    try {
      console.log("juu");
      const response = await fetch('/modelinforoute/fetchmodeldata');
      if (!response.ok) {
        throw new Error('Failed to fetch sidenav data');
      }
      const data = await response.json();
  
      // Get the sidenav container
      const sidenav = document.getElementById('mySidenav');
  
      // // Clear existing content (if needed)
      // sidenav.innerHTML = `
      // 	<a href="javascript:void(0)" class="closebtn" id="closeNavBtn">&times;</a>
      // `;
  
      // Populate the sidenav with fetched data
      data.forEach(item => {
        const link = document.createElement('a');
        link.className = 'ar-object';
        link.id = item.htmlIdentifier;
        link.href = '#';
        link.textContent = item.displayTitle;
        sidenav.appendChild(link);
      });
  
      // Add event listener to the sidenav for delegation
      sidenav.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('ar-object')) {
          // Close the sidenav
          document.getElementById("mySidenav").style.width = "0";
  
          // Load the model
          const id = event.target.id; // Get the ID of the clicked element
          loadModel(id); // Call the loadModel function with the ID
        }
      });
  
      // Add event listener for close button
      document.getElementById('closeNavBtn').addEventListener('click', () => {
        sidenav.style.width = "0";
      });
    } catch (error) {
      console.error('Error populating sidenav:', error);
    }
  }
  
  // Fetch and populate the sidenav on page load
  window.addEventListener('DOMContentLoaded', populateSidenav);
