import * as THREE from '../dependencies/three/build/three.module.js';

import {
  TWEEN
} from '../dependencies/three/examples/jsm/libs/tween.module.min.js';
import {
  ColladaLoader
} from '../dependencies/three/examples/jsm/loaders/ColladaLoader.js';
import {
  OrbitControls
} from '../dependencies/three/examples/jsm/controls/OrbitControls.js';
var container;

var camera, scene, renderer;
var particleLight;
var dae;

var kinematics;
var kinematicsTween;
var tweenParameters = {};

var loader = new ColladaLoader();
// loader.load( './models/collada/kawada-hironx.dae', function ( collada ) {
loader.load('../dependencies/three/examples/models/collada/abb_irb52_7_120.dae', function (collada) {

  dae = collada.scene;

  dae.traverse(function (child) {

    if (child.isMesh) {

      // model does not have normals
      child.material.flatShading = true;

    }

  });

  dae.scale.x = dae.scale.y = dae.scale.z = 10.0;
  dae.updateMatrix();

  kinematics = collada.kinematics;

  init();
  animate();

});

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(2, 2, 3);

  scene = new THREE.Scene();

  // Grid

  var grid = new THREE.GridHelper(20, 20);
  scene.add(grid);

  // Add the COLLADA

  scene.add(dae);

  particleLight = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 8, 8), new THREE.MeshBasicMaterial({
    color: 0xffffff
  }));
  scene.add(particleLight);

  // Lights

  var light = new THREE.HemisphereLight(0xffeeee, 0x111122);
  scene.add(light);

  var pointLight = new THREE.PointLight(0xffffff, 0.3);
  particleLight.add(pointLight);

  particleLight.position.x = 3000; //Math.sin(timer * 4) * 3009;
  particleLight.position.y = 3000; //Math.cos(timer * 5) * 4000;
  particleLight.position.z = 3000; //Math.cos(timer * 4) * 3009;




  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  heartBeat();

  //setupTween();

  //

  // controls
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0;
  controls.maxDistance = 1000;
  controls.target.set(-00, 5, -00);
  controls.update();
  camera.position.x = 20; //Math.cos(timer) * 20;
  camera.position.y = 20;
  camera.position.z = 20; //Math.sin(timer) * 20;
  camera.lookAt(0, 5, 0);



  window.addEventListener('resize', onWindowResize, false);


}

function moveRobot() {

  var duration = state.duration;

  var target = {};

  for (var prop in kinematics.joints) {

    if (kinematics.joints.hasOwnProperty(prop)) {

      if (!kinematics.joints[prop].static) {

        var joint = kinematics.joints[prop];

        var old = tweenParameters[prop];

        var position = old ? old : joint.zeroPosition;

        tweenParameters[prop] = position;

        if (state.pos[prop]<joint.limits.min) {
          target[prop] = joint.limits.min;
        } else if (state.pos[prop]>joint.limits.max) {
          target[prop] = joint.limits.min;
        } else if (!!state.pos[prop] || state.pos[prop] === 0) {
          target[prop] = state.pos[prop];
        } else {
          target[prop] = joint.zeroPosition;
        }
        // console.log(prop);
        // console.log(joint.limits);
        // console.log(target[prop]);
      }

    }

  }

  kinematicsTween = new TWEEN.Tween(tweenParameters).to(target, duration).easing(TWEEN.Easing.Quadratic.Out);

  kinematicsTween.onUpdate(function (object) {

    for (var prop in kinematics.joints) {

      if (kinematics.joints.hasOwnProperty(prop)) {

        if (!kinematics.joints[prop].static) {

          kinematics.setJointValue(prop, object[prop]);

        }

      }

    }

  });

  kinematicsTween.start();

}

function setupTween() {

  var duration = THREE.MathUtils.randInt(1000, 5000);

  var target = {};

  for (var prop in kinematics.joints) {

    if (kinematics.joints.hasOwnProperty(prop)) {

      if (!kinematics.joints[prop].static) {

        var joint = kinematics.joints[prop];

        var old = tweenParameters[prop];

        var position = old ? old : joint.zeroPosition;

        tweenParameters[prop] = position;

        target[prop] = THREE.MathUtils.randInt(joint.limits.min, joint.limits.max);
        console.log(prop);
      }

    }

  }

  kinematicsTween = new TWEEN.Tween(tweenParameters).to(target, duration).easing(TWEEN.Easing.Quadratic.Out);

  kinematicsTween.onUpdate(function (object) {

    for (var prop in kinematics.joints) {

      if (kinematics.joints.hasOwnProperty(prop)) {

        if (!kinematics.joints[prop].static) {

          kinematics.setJointValue(prop, object[prop]);

        }

      }

    }

  });

  kinematicsTween.start();

  setTimeout(setupTween, duration);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

  requestAnimationFrame(animate);

  render();
  TWEEN.update();

}

function render() {


  renderer.render(scene, camera);

}