
import * as THREE from 'three';
import {getData} from './services/services'

window.addEventListener('DOMContentLoaded', init);

function init() {

    let container, camera, scene, renderer, effect;

	const spheres = [];
	let mouseX = 0, mouseY = 0;
	let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    container = document.querySelector('.three_js');
	document.addEventListener( 'mousemove', onDocumentMouseMove );
	run();
    animate();

    function run() {
        container = document.querySelector('.three_js');
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.z = 1000;
        scene = new THREE.Scene();
        const texture = new THREE.TextureLoader().load('assets/img/bg_img.png');
        texture.minFilter = THREE.LinearFilter;
        scene.background = texture;


        getData('assets/img_db.json')
            .then(data => createPlane(data));
       

        renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        
        window.addEventListener( 'load', ()=> onWindowResize(texture) );
        window.addEventListener('resize', () => onWindowResize(texture));
        
    };
	function onWindowResize(bgTexture) {
          const canvasAspect = container.clientWidth / container.clientHeight;
          const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
          const aspect = imageAspect / canvasAspect;

		  camera.aspect = window.innerWidth / window.innerHeight;
		  camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);

          bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
          bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;

          bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
          bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
    }
    function createPlane(data) {
        for (let i = 0; i < data.img.length; i++) {
            const texture_pic = new THREE.TextureLoader().load(data.img[i].src);
            texture_pic.minFilter = THREE.LinearFilter;
            const geometry = new THREE.PlaneGeometry(data.img[i].width, data.img[i].heigth);
            const material = new THREE.MeshBasicMaterial({ map : texture_pic });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.x = data.img[i].pos_x;
            plane.position.y = data.img[i].pos_y;
            plane.position.z = data.img[i].pos_z;
            scene.add( plane );
        };
        
    }
    function onDocumentMouseMove(event) {
        const  mouseTolerance = 0.03;
		mouseX = (event.clientX - windowHalfX) * mouseTolerance;
        mouseY = (event.clientY - windowHalfY) * mouseTolerance;
        
	}
	//
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	function render() {
		camera.position.x = mouseX;
        camera.position.y = -mouseY;
        
		// camera.lookAt( scene.position );
		renderer.render( scene, camera );
	}
}