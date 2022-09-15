import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function main() {
    
    // Loaders
    const gltfLoader = new GLTFLoader();

    // Debug
    //const gui = new dat.GUI();

    // GUI
    //const light1 = gui.addFolder('Light 1')

    // Canvas
    const canvas = document.querySelector('canvas.webgl');

    // Scene
    const scene = new THREE.Scene();

    // var shape;
    // gltfLoader.load(
    //     // resource URL
    //     '/models/DexLab_LOGO.glb',
    //     // executes when resource loaded
    //     function (mesh) {
    //         shape = mesh.scene;
    //         shape.position.set(0,-.5,-3)
    //         shape.scale.set(0.04, 0.04, 0.04)
    //         scene.add(shape)
    //     }
    // )

    // Raycasting
    const raycaster = new THREE.Raycaster()
    raycaster.layers.set(1)
    let INTERSECTED;

    // Objects
    const shapeGeometry = new THREE.IcosahedronGeometry();

    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCnt = 5000;

    const posArray = new Float32Array(particlesCnt * 3);

    for(let i = 0; i < particlesCnt * 3; i++){
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

    const shapeMaterial = new THREE.MeshStandardMaterial({
        color: 0x232323,
        metalness: 0.7,
        roughness: 0.7
    })

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shape.layers.enable(1);
    
    scene.add(particlesMesh, shape);
    
    // Lights
    
    const pointLight = new THREE.PointLight(0x888888, 2)
    pointLight.position.set(2,2.3,0.85)
    pointLight.intensity = 10
    scene.add(pointLight)
    
    // light1.add(pointLight.position, 'x').min(-6).max(6).step(0.01)
    // light1.add(pointLight.position, 'y').min(-3).max(3).step(0.01)
    // light1.add(pointLight.position, 'z').min(-3).max(3).step(0.01)
    // light1.add(pointLight, 'intensity').min(0).max(10).step(0.01)
    
    const light1Color = {
        color: 0x888888
    }

    // light1.addColor(light1Color, 'color')
    // .onChange(() => {
    //     pointLight.color.set(light1Color.color)
    // })

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
    window.addEventListener('pointermove', onPointerMove);
    //window.addEventListener('mousedown', onClickEvent);
    
    let scrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;

        camera.position.y = - scrollY * 0.005
    })

    let currentCamPos = camera.position;

    console.log(currentCamPos)
    
    let mouseX = 0;
    let mouseY = 0;
    
    let targetX = 0;
    let targetY = 0;
    
    const windowX = window.innerWidth * 0.5;
    const windowY = window.innerHeight * 0.5;
    
    function onDocumentMouseMove ( event ) {
        mouseX = (event.clientX - windowX)
        mouseY = (event.clientY - windowY)
    };

    var pointer = new THREE.Vector2()

    function onPointerMove ( event ) {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }


    // function onClickEvent( event ){
    //     // console.log(pointer);
    //     raycaster.setFromCamera(pointer, camera)
    //     const intersects = raycaster.intersectObjects( scene.children, false );
    //     if( intersects.length > 0 ) {
    //         if( INTERSECTED != intersects[0].object) {
    //             INTERSECTED = intersects[0].object;
    //         }
    //     }
    //     console.log(intersects)
    // }
    
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
        if(shape){
            shape.rotation.y += .2 * (targetX - shape.rotation.y)
            shape.rotation.x += .02 * (targetY - shape.rotation.x)
            //mesh.rotation.z += .05 * (targetY - mesh.rotation.x)

            // shape.position.x = .5 * targetX
            // shape.position.y = (-.5 * targetY)
        }

        particlesMesh.rotateY(0.0001)
        
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