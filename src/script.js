import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { loadModel } from './components/loadModels.js';
import { setupModel } from './components/setupModel.js';

function main() {
    
    // Debug
    const gui = new dat.GUI();
    
    // GUI
    const light1 = gui.addFolder('Light 1')
    
    // Canvas
    const canvas = document.querySelector('canvas.webgl');
    
    // Scene
    const scene = new THREE.Scene();
    
    // Objects
    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCnt = 5000;
    
    const posArray = new Float32Array(particlesCnt * 3);
    
    for(let i = 0; i < particlesCnt *3; i++){
    // posArray[i] = Math.random()
    // posArray[i] = Math.random() - .5
    posArray[i] = (Math.random() - .5) * 40
    };
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Materials
    
    const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            transparent: true,
            //map: cross,
            color: 0x666666
        }
    );

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    
    scene.add(particlesMesh);
    
    // Lights
    
    const pointLight = new THREE.PointLight(0x00ffff, 2)
    // pointLight.position.x = 2
    // pointLight.position.y = 3
    // pointLight.position.z = 4
    pointLight.position.set(2,2.3,0.85)
    pointLight.intensity = 2
    scene.add(pointLight)
    
    light1.add(pointLight.position, 'x').min(-6).max(6).step(0.01)
    light1.add(pointLight.position, 'y').min(-3).max(3).step(0.01)
    light1.add(pointLight.position, 'z').min(-3).max(3).step(0.01)
    light1.add(pointLight, 'intensity').min(0).max(10).step(0.01)
    
    const light1Color = {
        color: 0xff0000
    }

    light1.addColor(light1Color, 'color')
    .onChange(() => {
        pointLight.color.set(light1Color.color)
    })

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    
    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
        
        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    });
    
    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;
    scene.add(camera);
    
    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true
    
    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
    antialias: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    /**
     * Animate
     */
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    let mouseX = 0;
    let mouseY = 0;
    
    let targetX = 0;
    let targetY = 0;
    
    const windowX = window.innerWidth * 0.5;
    const windowY = window.innerHeight * 0.5;
    
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowX)
        mouseY = (event.clientY - windowY)
    };
    
    const onScrollUpdate = (event) => {
        sphere.position.y = window.scrollY * 0.001
        sphere.position.z = window.scrollY * 0.003
    };
    
    window.addEventListener('scroll', onScrollUpdate);
    
    const clock = new THREE.Clock();
    
    const tick = () =>
    {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        const elapsedTime = clock.getElapsedTime();
        
        // Update objects
        
        // console.log(logo)
        
        // logo.rotation.y += .5 * (targetX - logo.rotation.y)
        // logo.rotation.x += .05 * (targetY - logo.rotation.x)
        // logo.rotation.z += .05 * (targetY - logo.rotation.x)
        
        particlesMesh.rotation.y = -(.004 * elapsedTime);
        
        // Update Orbital Controls
        //controls.update()
        
        // Render
        renderer.render(scene, camera);
        
        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    };
    
    tick();
}

main();