import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { TextureLoader } from 'three';
import { DEG2RAD, degToRad } from 'three/src/math/mathutils';

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
    const textureLoader = new TextureLoader();

    // Textures
    const profileTexture = textureLoader.load('/textures/selfie.jpg');

    // Debug
    //const gui = new dat.GUI();

    // GUI
    //const light1 = gui.addFolder('Light 1')

    // Canvas
    const canvas = document.querySelector('canvas.webgl');

    // Scene
    const scene = new THREE.Scene();

    var DexLabLogo;
    gltfLoader.load(
        // resource URL
        '/models/DexLab_LOGO.glb',
        // executes when resource loaded
        function (mesh) {
            DexLabLogo = mesh.scene;
            DexLabLogo.position.set(0,-.5,-3)
            DexLabLogo.scale.set(0.02, 0.02, 0.02)
            scene.add(DexLabLogo)
        }
    )
    var MagesLogo;
    gltfLoader.load(
        // resource URL
        '/models/MAGES_Logo.glb',
        // executes when resource loaded
        function (mesh) {
            MagesLogo = mesh.scene;
            MagesLogo.position.set(0,-.5,-3)
            MagesLogo.scale.set(.4, .4, .4)
            MagesLogo.rotateX(1.570796)
            scene.add(MagesLogo)
        }
    )

    // Raycasting
    // const raycaster = new THREE.Raycaster()
    // raycaster.layers.set(1)
    // let INTERSECTED;

    // Objects
    const shapeGeometry = new THREE.IcosahedronGeometry();
    const profileGeometry = new THREE.CircleGeometry(1, 32);

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
        color: 0xffffff,
        opacity: 0.2
    }
    );

    const shapeMaterial = new THREE.MeshStandardMaterial({
        color: 0xA0A0A0,
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

    const profileMesh = new THREE.Mesh(profileGeometry, 
        new THREE.MeshBasicMaterial(
            {
                map: profileTexture,
                side: THREE.DoubleSide
            }
        )
    )
    profileMesh.position.set(-1, -2, 0)
    profileMesh.scale.set(0.4, 0.4, 0.4)

    const Menu = new THREE.Mesh(marker, transparentMat);
    Menu.position.set(0, 1.35, 0);
    Menu.scale.set(0.05, 0.05, 0.05);

    const TextBody = new THREE.Mesh(marker, transparentMat);
    TextBody.position.set(0, -1.8, .2);
    TextBody.scale.set(0.05, 0.05, 0.05);

    const ProficiencyBody = new THREE.Mesh(marker, transparentMat);
    ProficiencyBody.position.set(0, -3.8, 0)
    ProficiencyBody.scale.set(0.05, 0.05, 0.05);
    
    scene.add(particlesMesh, shape, profileMesh);
    scene.add(Menu, TextBody, ProficiencyBody);

    // testBox.scale.set(.5,.5,.5)
    // testBox.position.set((testBox.scale.x * .25) -1 ,-2.7, 0)
    // console.log(testBox)

    // scene.add(testBox)

    // Lights
    
    const pointLight = new THREE.PointLight(0x888888, 2)
    pointLight.position.set(2,2.3,0.85)
    pointLight.intensity = 2
    scene.add(pointLight)
    
    const pointLight2 = new THREE.PointLight(0x888888, 2)
    pointLight2.position.set(0,-4, 2)
    pointLight2.intensity = 1.2
    scene.add(pointLight2)
    
    // light1.add(pointLight.position, 'x').min(-6).max(6).step(0.01)
    // light1.add(pointLight.position, 'y').min(-3).max(3).step(0.01)
    // light1.add(pointLight.position, 'z').min(-3).max(3).step(0.01)
    // light1.add(pointLight, 'intensity').min(0).max(10).step(0.01)

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
        // menuRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

    const menuStyles = {
        // https://en.wikipedia.org/wiki/X11_color_names#Color_name_chart
        Color: {
            active: 'white',
            inactive: 'gray',
            hover: 'gainsboro'
        },
        // https://www.w3schools.com/csSref/pr_font_weight.asp
        Weight: {
            active: 'bold',
            inactive: 'normal'
        }
    }
    
    let title = document.getElementById("title");
    title.textContent = pageStates.About[0];

    document.addEventListener('keypress', function ( event ) {
        switch(event.code){
            case 'KeyH':
            case 'KeyA':
                switch(currentPage){
                    case pageStates.About:
                        NavigateMenu(pageStates.Showcase, showcaseMenuDiv);
                        break;
                    case pageStates.Contact:
                        NavigateMenu(pageStates.About, aboutMenuDiv);
                        break;
                    case pageStates.Showcase:
                        NavigateMenu(pageStates.Contact, contactMenuDiv);
                        break;
                }
                break;
            case 'KeyL':
            case 'KeyD':
                switch(currentPage){
                    case pageStates.About:
                        NavigateMenu(pageStates.Contact, contactMenuDiv);
                        break;
                    case pageStates.Contact:
                        NavigateMenu(pageStates.Showcase, showcaseMenuDiv);
                        break;
                    case pageStates.Showcase:
                        NavigateMenu(pageStates.About, aboutMenuDiv);
                        break;
                }
                break;
        }
    })

    const showcaseMenuDiv = document.createElement( 'div' );
    showcaseMenuDiv.className = 'menu';
    showcaseMenuDiv.textContent = 'SHOWCASE';
    showcaseMenuDiv.style.marginTop = '1em';
    showcaseMenuDiv.style.fontSize = "2.5vh"
    showcaseMenuDiv.style.color = menuStyles.Color.inactive;
    const showcaseMenuLabel = new CSS2DObject( showcaseMenuDiv );
    showcaseMenuLabel.position.set( -10, 0, 0);
    Menu.add( showcaseMenuLabel )
    showcaseMenuDiv.addEventListener('pointerdown', () => {
        // Function runs when clicked on Menu item
        NavigateMenu(pageStates.Showcase, showcaseMenuDiv);
    })
    showcaseMenuDiv.addEventListener('pointerenter', () => {
        // On Hover
        pointerHover(true, showcaseMenuDiv, pageStates.Showcase)
    })
    showcaseMenuDiv.addEventListener('pointerleave', () => {
        // Leave Hover
        pointerHover(false, showcaseMenuDiv, pageStates.Showcase)
    })

    const aboutMenuDiv = document.createElement( 'div' );
    aboutMenuDiv.className = 'menu';
    aboutMenuDiv.textContent = 'ABOUT';
    aboutMenuDiv.style.marginTop = '1em';
    aboutMenuDiv.style.fontSize = "2.5vh"
    aboutMenuDiv.style.color = menuStyles.Color.active;
    aboutMenuDiv.style.fontWeight = menuStyles.Weight.active;
    const aboutMenuLabel = new CSS2DObject( aboutMenuDiv );
    aboutMenuLabel.position.set(0, 0, 0);
    Menu.add( aboutMenuLabel )
    aboutMenuDiv.addEventListener('pointerdown', () => {
        // Function runs when clicked on Menu item
        NavigateMenu(pageStates.About, aboutMenuDiv);
    })
    aboutMenuDiv.addEventListener('pointerenter', () => {
        // On Hover
        pointerHover(true, aboutMenuDiv, pageStates.About)
    })
    aboutMenuDiv.addEventListener('pointerleave', () => {
        // Leave Hover
        pointerHover(false, aboutMenuDiv, pageStates.About)

    })

    const contactMenuDiv = document.createElement( 'div' );
    contactMenuDiv.className = 'menu';
    contactMenuDiv.textContent = 'CONTACT';
    contactMenuDiv.style.marginTop = '1em';
    contactMenuDiv.style.fontSize = "2.5vh"
    contactMenuDiv.style.color = menuStyles.Color.inactive;
    const contactMenuLabel = new CSS2DObject( contactMenuDiv );
    contactMenuLabel.position.set(10, 0, 0);
    Menu.add( contactMenuLabel )
    contactMenuDiv.addEventListener('pointerdown', () => {
        // Function runs when clicked on Menu item
        NavigateMenu(pageStates.Contact, contactMenuDiv)
    })
    contactMenuDiv.addEventListener('pointerenter', () => {
        // On Hover
        pointerHover(true, contactMenuDiv, pageStates.Contact)
    })
    contactMenuDiv.addEventListener('pointerleave', () => {
        // Leave Hover
        pointerHover(false, contactMenuDiv, pageStates.Contact)
    })

    function pointerHover(enter, div, state){
        if(enter){
            div.style.color = menuStyles.Color.hover;
        }
        else{
            if(currentPage != state){
                div.style.color = menuStyles.Color.inactive;
            }
            else{
                div.style.color = menuStyles.Color.active;
            }
        }
    }

    const menuDivs = [ showcaseMenuDiv, aboutMenuDiv, contactMenuDiv ];

    function NavigateMenu(page, div){
        currentPage = page;
        console.log(currentPage[0]);
        title.textContent = currentPage[0]
        menuDivs.forEach(element => {
            element.style.color = menuStyles.Color.inactive;
            element.style.fontWeight = menuStyles.Weight.inactive;
        });
        div.style.color = menuStyles.Color.active;
        div.style.fontWeight = menuStyles.Weight.active;

        lerpLoop = false;
        lerpTargetX = currentPage[1];
        LerpMenu();
    }

    // Body

    // const showcaseBodyDiv = document.createElement( 'div' );
    // showcaseBodyDiv.className = 'textbody';
    // showcaseBodyDiv.textContent = 'Trevor ';
    // const showcaseBodyText = new CSS2DObject( showcaseBodyDiv );
    // showcaseBodyText.position.set(-10, 0, 0);

    const aboutBodyDivOne = document.createElement( 'div' );
    aboutBodyDivOne.className = 'textbody';
    aboutBodyDivOne.textContent = "Hi there! Thank you for checking out my portfolio. Here you will know a little more about me. If you'd like to get in contact with me you can head over to the Contact Section from the menu above.";
    aboutBodyDivOne.style.marginTop = '1em';
    aboutBodyDivOne.style.fontSize = '2vh';
    aboutBodyDivOne.style.color = 'white';
    aboutBodyDivOne.style.textAlign = 'justify';
    aboutBodyDivOne.style.width = '30vw';
    const aboutBodyTextOne = new CSS2DObject( aboutBodyDivOne );
    aboutBodyTextOne.position.set(8 , -3, 0);
    TextBody.add( aboutBodyTextOne );

    const aboutBodyDivTwo = document.createElement( 'div' );
    aboutBodyDivTwo.className = 'textbody';
    aboutBodyDivTwo.textContent = "(-psst!- Alternatively you could navigate with [A] and [D] keys too, or if youre a unix geek you can use [H] and [L] respectively).";
    aboutBodyDivTwo.style.marginTop = '1em';
    aboutBodyDivTwo.style.fontSize = '1.7vh';
    aboutBodyDivTwo.style.color = 'gray';
    aboutBodyDivTwo.style.textAlign = 'justify';
    aboutBodyDivTwo.style.width = '30vw';
    const aboutBodyTextTwo = new CSS2DObject( aboutBodyDivTwo );
    aboutBodyTextTwo.position.set(8 , -7, 0);
    TextBody.add( aboutBodyTextTwo );

    const aboutBodyDivThree = document.createElement( 'div' );
    aboutBodyDivThree.className = 'textbody';
    aboutBodyDivThree.textContent = "I graduated from MAGES Institute of Excellence in Singapore with a Diploma in Game Technolody at the end of 2021. I'm currently employed at Dex-Lab Pte. Ltd. as a Game Designer.";
    aboutBodyDivThree.style.marginTop = '1em';
    aboutBodyDivThree.style.fontSize = '2vh';
    aboutBodyDivThree.style.color = 'white';
    aboutBodyDivThree.style.textAlign = 'justify';
    aboutBodyDivThree.style.width = '40vw';
    const aboutBodyTextThree = new CSS2DObject( aboutBodyDivThree );
    aboutBodyTextThree.position.set(0, -15, 0);
    TextBody.add( aboutBodyTextThree );

    // const contactBodyDiv = document.createElement( 'div' );
    // aboutcontactBodyDivBodyDiv.className = 'textbody';
    // contactBodyDiv.textContent = 'Trevor ';
    // const contactBodyText = new CSS2DObject( contactBodyDiv );
    // contactBodyText.position.set(10, 0, 0);

    //
    // Proficiency Meters
    //
    
    // Geometry
    const proficiencyGeometry = new THREE.BoxGeometry(.5, .5, .5)

    // Mesh
    const proficienyBarSettings = {
        // World spacy position
        position: new THREE.Vector3(0, ProficiencyBody.position.y - .1, 0),
        // Scale
        scale: new THREE.Vector3(0.7, 0.4, 1),
        // Gap between each bar
        gap: .4,
    }
    const proficiencies = {
        //Proficiency
        Programming: {
            // Relative Proficieny Value
            level: 4,
            mesh: new THREE.Mesh(
                proficiencyGeometry,
                new THREE.MeshStandardMaterial({
                    // Bar Color
                    color: 0x418282
                })
            )
        },
        Design: {
            level: 3,
            mesh: new THREE.Mesh(
                proficiencyGeometry,
                new THREE.MeshStandardMaterial({
                    color: 0xAE3B3B
                })
            )
        },
        Shading: {
            level: 1,
            mesh: new THREE.Mesh(
                proficiencyGeometry,
                new THREE.MeshStandardMaterial({
                    color: 0xA7CA66
                })
            )
        }
    };
    
    // Don't Touch
    let profGap = 0;
    Object.values(proficiencies).forEach(element => {
        element.mesh.scale.set(
            proficienyBarSettings.scale.x * element.level,
            proficienyBarSettings.scale.y,
            proficienyBarSettings.scale.z);
        element.mesh.position.set(
            proficienyBarSettings.position.x + (- element.mesh.scale.x * .25),
            proficienyBarSettings.position.y - profGap,
            proficienyBarSettings.position.z + (- element.mesh.scale.z * .25))
        scene.add(element.mesh)
        profGap += proficienyBarSettings.gap;
    });

    const aboutProfProgrammingDiv = document.createElement( 'div' );
    aboutProfProgrammingDiv.className = 'proficiencybody';
    aboutProfProgrammingDiv.textContent = "Programming";
    aboutProfProgrammingDiv.style.marginTop = '1em';
    aboutProfProgrammingDiv.style.fontSize = '3vh';
    aboutProfProgrammingDiv.style.color = 'white';
    aboutProfProgrammingDiv.style.textAlign = 'left';
    aboutProfProgrammingDiv.style.width = '30vw';
    aboutProfProgrammingDiv.style.textTransform = 'uppercase'
    const aboutProfProgrammingLabel = new CSS2DObject( aboutProfProgrammingDiv );
    aboutProfProgrammingLabel.position.set(20, 0, 0);
    ProficiencyBody.add( aboutProfProgrammingLabel );

    const aboutProfDesignDiv = document.createElement( 'div' );
    aboutProfDesignDiv.className = 'proficiencybody';
    aboutProfDesignDiv.textContent = "Design";
    aboutProfDesignDiv.style.marginTop = '1em';
    aboutProfDesignDiv.style.fontSize = '3vh';
    aboutProfDesignDiv.style.color = 'white';
    aboutProfDesignDiv.style.textAlign = 'left';
    aboutProfDesignDiv.style.width = '30vw';
    aboutProfDesignDiv.style.textTransform = 'uppercase'
    const aboutProfDesignLabel = new CSS2DObject( aboutProfDesignDiv );
    aboutProfDesignLabel.position.set(20, -8, 0);
    ProficiencyBody.add( aboutProfDesignLabel );

    const aboutProfShadingDiv = document.createElement( 'div' );
    aboutProfShadingDiv.className = 'proficiencybody';
    aboutProfShadingDiv.textContent = "Shading";
    aboutProfShadingDiv.style.marginTop = '1em';
    aboutProfShadingDiv.style.fontSize = '3vh';
    aboutProfShadingDiv.style.color = 'white';
    aboutProfShadingDiv.style.textAlign = 'left';
    aboutProfShadingDiv.style.width = '30vw';
    aboutProfShadingDiv.style.textTransform = 'uppercase'
    const aboutProfShadingLabel = new CSS2DObject( aboutProfShadingDiv );
    aboutProfShadingLabel.position.set(20, -16, 0);
    ProficiencyBody.add( aboutProfShadingLabel );

    //
    // Listeners
    //

    let scrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        let math1 = scrollY * 0.005
        camera.position.y = - math1
        profileMesh.rotation.y = math1 + 4
        profileMesh.rotation.z = math1 + 4
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

    // console.log(scene.children)

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
        // console.log(lerpDelta)
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
        switch(currentPage){
            case pageStates.About:
                if(shape){
                    shape.rotation.y += .2 * (targetX - shape.rotation.y)
                    shape.rotation.x += .02 * (targetY - shape.rotation.x)
                    shape.position.z = -(1.8 * targetY) - .5;
        
                    // shape.position.x = .5 * targetX
                    // shape.position.y = (-.5 * targetY)
                }
                break;
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