import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

function main() {

    // PageStates
    const pageStates = {
        Showcase: ['Showcase', -5],
        About: ['Trevor\nKörber', 0],
        Contact: ['Contact', 5]
    }
    Object.freeze(pageStates);
    var currentPage = pageStates.About;
    
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

    const marker = new THREE.SphereGeometry();

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
        size: 0.02,
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

    const transparentMat = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0
    })

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shape.position.set(0,0,-.5)

    const Menu = new THREE.Mesh(marker, transparentMat);
    Menu.position.set(0, 1.35, 0)
    Menu.scale.set(0.05, 0.05, 0.05)
    
    scene.add(particlesMesh, shape);
    scene.add(Menu)
    
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

        menuRenderer.setSize(sizes.width, sizes.height)
        menuRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

    const menuRenderer = new CSS2DRenderer();
    menuRenderer.setSize( window.innerWidth, window.innerHeight );
    menuRenderer.domElement.style.position = 'fixed';
    menuRenderer.domElement.style.top = '0px';
    document.body.appendChild( menuRenderer.domElement );
    
    /**
     * Animate
     */

    //
    // CSS Objects
    //

    // Menu
    
    let title = document.getElementById("title");
    title.textContent = pageStates.About[0];

    document.addEventListener('keypress', function ( event ) {
        switch(event.code){
            case 'KeyH':
            case 'KeyA':
                switch(currentPage[0]){
                    case 'Trevor\nKörber':
                        NavigateMenu(pageStates.Showcase);
                        showcaseMenuDiv.style.color = 'white';
                        break;
                    case 'Contact':
                        NavigateMenu(pageStates.About);
                        aboutMenuDiv.style.color = 'white';
                        break;
                    case 'Showcase':
                        NavigateMenu(pageStates.Contact);
                        contactMenuDiv.style.color = 'white';
                        break;
                }
                break;
            case 'KeyL':
            case 'KeyD':
                switch(currentPage[0]){
                    case 'Trevor\nKörber':
                        NavigateMenu(pageStates.Contact);
                        contactMenuDiv.style.color = 'white';
                        break;
                    case 'Contact':
                        NavigateMenu(pageStates.Showcase);
                        showcaseMenuDiv.style.color = 'white';
                        break;
                    case 'Showcase':
                        NavigateMenu(pageStates.About);
                        aboutMenuDiv.style.color = 'white';
                        break;
                }
                break;
        }
    })

    // let touchX;

    // document.addEventListener('touchstart', function (event) {
    //     touchX = mouseX;
    // })

    // document.addEventListener('touchend', function (event) {
    //     let delta = mouseX - touchX
    //     let absoluteVal = Math.abs(delta);
    //     if(absoluteVal > 120){
    //         if(delta > 0){
    //             switch(currentPage[0]){
    //                 case 'Trevor\nKörber':
    //                     NavigateMenu(pageStates.Showcase);
    //                     showcaseMenuDiv.style.color = 'white';
    //                     break;
    //                 case 'Contact':
    //                     NavigateMenu(pageStates.About);
    //                     aboutMenuDiv.style.color = 'white';
    //                     break;
    //                 case 'Showcase':
    //                     NavigateMenu(pageStates.Contact);
    //                     contactMenuDiv.style.color = 'white';
    //                     break;
    //             }
    //         }
    //         else{
    //             switch(currentPage[0]){
    //                 case 'Trevor\nKörber':
    //                     NavigateMenu(pageStates.Contact);
    //                     contactMenuDiv.style.color = 'white';
    //                     break;
    //                 case 'Contact':
    //                     NavigateMenu(pageStates.Showcase);
    //                     showcaseMenuDiv.style.color = 'white';
    //                     break;
    //                 case 'Showcase':
    //                     NavigateMenu(pageStates.About);
    //                     aboutMenuDiv.style.color = 'white';
    //                     break;
    //             }
    //         }
    //     }
    // })

    const showcaseMenuDiv = document.createElement( 'div' );
    showcaseMenuDiv.className = 'menu';
    showcaseMenuDiv.textContent = 'SHOWCASE';
    showcaseMenuDiv.style.marginTop = '1em';
    showcaseMenuDiv.style.fontSize = "2.5vh"
    showcaseMenuDiv.style.color = 'gray';
    const showcaseMenuLabel = new CSS2DObject( showcaseMenuDiv );
    showcaseMenuLabel.position.set( -10, 0, 0);
    Menu.add( showcaseMenuLabel )
    showcaseMenuDiv.addEventListener('pointerdown', () => {
        // Function runs when clicked on Menu item
        NavigateMenu(pageStates.Showcase);
        showcaseMenuDiv.style.color = 'white';
    })
    showcaseMenuDiv.addEventListener('pointerenter', () => {
        // On Hover
        showcaseMenuDiv.style.color = "white";
    })
    showcaseMenuDiv.addEventListener('pointerleave', () => {
        // Leave Hover
        if(currentPage != pageStates.Showcase){
            showcaseMenuDiv.style.color = "gray"
        }
    })

    const aboutMenuDiv = document.createElement( 'div' );
    aboutMenuDiv.className = 'menu';
    aboutMenuDiv.textContent = 'ABOUT';
    aboutMenuDiv.style.marginTop = '1em';
    aboutMenuDiv.style.fontSize = "2.5vh"
    aboutMenuDiv.style.color = 'white';
    const aboutMenuLabel = new CSS2DObject( aboutMenuDiv );
    aboutMenuLabel.position.set(0, 0, 0);
    Menu.add( aboutMenuLabel )
    aboutMenuDiv.addEventListener('pointerdown', () => {
        // Function runs when clicked on Menu item
        NavigateMenu(pageStates.About);
        aboutMenuDiv.style.color = 'white';
    })
    aboutMenuDiv.addEventListener('pointerenter', () => {
        // On Hover
        aboutMenuDiv.style.color = "white"
    })
    aboutMenuDiv.addEventListener('pointerleave', () => {
        // Leave Hover
        if(currentPage != pageStates.About){
            aboutMenuDiv.style.color = "gray"
        }
    })

    const contactMenuDiv = document.createElement( 'div' );
    contactMenuDiv.className = 'menu';
    contactMenuDiv.textContent = 'CONTACT';
    contactMenuDiv.style.marginTop = '1em';
    contactMenuDiv.style.fontSize = "2.5vh"
    contactMenuDiv.style.color = 'gray';
    const contactMenuLabel = new CSS2DObject( contactMenuDiv );
    contactMenuLabel.position.set(10, 0, 0);
    Menu.add( contactMenuLabel )
    contactMenuDiv.addEventListener('pointerdown', () => {
        // Function runs when clicked on Menu item
        NavigateMenu(pageStates.Contact)
        contactMenuDiv.style.color = 'white';
    })
    contactMenuDiv.addEventListener('pointerenter', () => {
        // On Hover
        contactMenuDiv.style.color = "white"
    })
    contactMenuDiv.addEventListener('pointerleave', () => {
        // Leave Hover
        if(currentPage != pageStates.Contact){
            contactMenuDiv.style.color = "gray"
        }
    })

    const menuDivs = [ showcaseMenuDiv, aboutMenuDiv, contactMenuDiv ];

    function NavigateMenu(page){
        currentPage = page;
        console.log(currentPage[0]);
        title.textContent = currentPage[0]
        menuDivs.forEach(element => {
            element.style.color = 'gray';
        });

        lerpLoop = false;
        lerpTargetX = currentPage[1];
        LerpMenu();
    }

    // Body

    let scrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        
        camera.position.y = - scrollY * 0.005
    })
    
    let mouseX = 0;
    let mouseY = 0;
    
    let targetX = 0;
    let targetY = 0;
    
    const windowX = window.innerWidth * 0.5;
    const windowY = window.innerHeight * 0.5;
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    function onDocumentMouseMove ( event ) {
        mouseX = (event.clientX - windowX)
        mouseY = (event.clientY - windowY)
    };
    
    window.addEventListener('pointermove', onPointerMove);
    var pointer = new THREE.Vector2()
    
    function onPointerMove ( event ) {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    
    //
    // UPDATE
    //

    console.log(scene.children)

    var lerpDelta = 0;
    var lerpLoop = false;
    var lerpOriginalPos;
    var lerpTargetX = null;

    function LerpMenu() {
        if(!lerpLoop) {
            lerpOriginalPos = Menu.position;
            lerpDelta = 0;
        }
        lerpDelta += 0.005
        console.log(lerpDelta)
        Menu.position.lerpVectors(lerpOriginalPos, new THREE.Vector3(lerpTargetX, lerpOriginalPos.y, lerpOriginalPos.z), lerpDelta)
        camera.position.x = Menu.position.x

        if(lerpDelta < .3){
            lerpLoop = true;
            window.requestAnimationFrame(LerpMenu);
        }
        else{
            lerpTargetX = lerpOriginalPos = null;
        }
    }

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
            shape.position.z = -(2.5 * targetY) - .5 

            // shape.position.x = .5 * targetX
            // shape.position.y = (-.5 * targetY)
        }



        particlesMesh.rotateY(0.0001)
        
        // Update Orbital Controls
        //controls.update()
        
        // Render
        renderer.render(scene, camera);
        menuRenderer.render( scene, camera);
        
        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    };
    
    tick();
}

main();