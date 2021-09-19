
import * as THREE from 'three';

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
        camera.position.z = 3200;
        scene = new THREE.Scene();
		const texture = new THREE.TextureLoader().load( 'assets/img/bg_img.png' );
		const texture_1 = new THREE.TextureLoader().load( 'assets/img/child_horo.png' );
        scene.background = texture;

        const geometry = new THREE.PlaneGeometry( 500, 800 );
        // const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        const material = new THREE.MeshBasicMaterial({ map : texture_1 });
        const plane = new THREE.Mesh( geometry, material );
        scene.add( plane );

        renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        
        window.addEventListener( 'load', ()=> onWindowResize(texture) );
		window.addEventListener( 'resize', ()=> onWindowResize(texture) );
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
	function onDocumentMouseMove( event ) {
		mouseX = ( event.clientX - windowHalfX ) * 2;
		mouseY = ( event.clientY - windowHalfY ) * 2;
	}
	//
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	function render() {
		camera.position.x += ( mouseX - camera.position.x ) * .05;
		camera.position.y += ( - mouseY - camera.position.y ) * .05;
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
	}
}