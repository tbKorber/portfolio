import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { InstancedInterleavedBuffer } from 'three';

function main() {
    
    // Loaders
    const gltfLoader = new GLTFLoader();

    // Debug
    const gui = new dat.GUI();
    
    // GUI
    const light1 = gui.addFolder('Light 1')
    
    // Canvas
    const canvas = document.querySelector('canvas.webgl');
    
    // Scene
    const scene = new THREE.Scene();
    
    var logo;
    gltfLoader.load(
        // resource URL
        '/models/DexLab_LOGO.glb',
        // executes when resource loaded
        function (mesh) {
            logo = mesh.scene;
            logo.position.set(0,-.5,-3)
            logo.scale.set(0.04, 0.04, 0.04)
            scene.add(logo)
        }
        )
        
    // Raycasting
    const raycaster = new THREE.Raycaster()
    let INTERSECTED;

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
    //const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    
    //scene.add(particlesMesh);
    
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
    
    var camMouse = new THREE.Vector2()

    function onDocumentMouseMove ( event ) {
        mouseX = (event.clientX - windowX)
        mouseY = (event.clientY - windowY)

        camMouse.setX(( event.clientX / window.innerWidth ) * 2 - 1)
        camMouse.setY(( event.clientY / window.innerHeight ) * 2 + 1)
    };
    
    const onScrollUpdate = ( event ) => {
    };
    
    window.addEventListener('scroll', onScrollUpdate);

    window.onclick = onClickEvent;

    function onClickEvent(){
        console.log(camMouse)
        raycaster.setFromCamera (camMouse, camera)
        const intersects = raycaster.intersectObjects( scene.children, false );
        if( intersects.length > 0 ) {
            if( INTERSECTED != intersects[0].object) {
                console.log(intersects[0].object)
            }
        }
    }
    
    //
    // UPDATE
    //

    const clock = new THREE.Clock();
    
    const tick = () =>
    {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        const elapsedTime = clock.getElapsedTime();
        
        // Update objects
        if(logo){
            logo.rotation.y += .5 * (targetX - logo.rotation.y)
            logo.rotation.x += .05 * (targetY - logo.rotation.x)
            //mesh.rotation.z += .05 * (targetY - mesh.rotation.x)

            logo.position.x = 2 * targetX
            logo.position.y = (-2 * targetY) - 0.5
        }
        
        // particlesMesh.rotation.y = -(.004 * elapsedTime);
        
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