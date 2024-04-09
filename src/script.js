import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import init from './init';

import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(0, 2, 5);

// Scene floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: '#444444',
		metalness: 0,
		roughness: 0.5
	})
)

floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor)

// Light:
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

// Light:
const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, -8);
// dirLight.position.set(0, 10, 10);
scene.add(dirLight);

// Loader:
const loader = new GLTFLoader();

let mixer = null;

loader.load(
	'/models/BrainStem/BrainStem.gltf',
	(gltf) => {
		// console.log('success');
		// console.log(gltf);
		mixer = new THREE.AnimationMixer(gltf.scene);
		const action = mixer.clipAction(gltf.animations[0]);
		action.play();
		scene.add(gltf.scene);
	}
)

// loader.load(
// 	'/models/FlightHelmet/FlightHelmet.gltf',
// 	(gltf) => {
// 		console.log('success');
// 		console.log(gltf);
// 		gltf.scene.scale.set(5, 5, 5);
// 		scene.add(gltf.scene);
// 	}
// )

// loader.load(
// 	'/models/Avocado/Avocado.gltf',
// 	(gltf) => {
// 		console.log('success');
// 		console.log(gltf);
// 		gltf.scene.children[0].scale.set(50, 50, 50);
// 		scene.add(gltf.scene.children[0]);
// 	},
// 	(progress) => {
// 		console.log('progress');
// 		console.log(progress);
// 	},
// 	(error) => {
// 		console.log('error');
// 		console.log(error);
// 	}
// )

// Animation:
const clock = new THREE.Clock();

const tick = () => {
	controls.update();
	renderer.render(scene, camera);

	const delta = clock.getDelta();
	if (mixer) { mixer.update(delta); }

	window.requestAnimationFrame(tick);
};
tick();

/** Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener('resize', () => {
	// Обновляем размеры
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Обновляем соотношение сторон камеры
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Обновляем renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
