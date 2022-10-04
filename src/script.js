import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { TextureLoader } from 'three'

function main() {

    function getBaseUrl() {
        var re = new RegExp(/^.*\//)
        return re.exec(window.location.href)
    }
    const root = getBaseUrl()

    // PageStates
    const pageStates = {
        Showcase: {
            name: 'Showcase',
            position: new THREE.Vector3(-10, 0, 0)
        },
        About: {
            name: 'Trevor\nKörber',
            position: new THREE.Vector3(0, 0, 0)
        },
        Contact: {
            name: 'Contact',
            position: new THREE.Vector3(10, 0, 0)
        }
    }
    Object.freeze(pageStates)
    var currentPage = pageStates.About
    
    // Loaders
    const gltfLoader = new GLTFLoader()
    const textureLoader = new TextureLoader()

    // Textures
    const profileTexture = textureLoader.load(root + 'resources/textures/selfie.jpg')

    // Debug
    //const gui = new dat.GUI();

    // GUI
    //const light1 = gui.addFolder('Light 1')

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    const logoScale = new THREE.Vector3(0.7, 0.7, 0.7)

    const logoMeshs = {
        DexLabLogo: {
            // Name for debug
            name: 'DexLabLogo',
            // Resource URL
            glb: root + 'resources/models/DexLab_LOGO.glb',
            // Worldspace Position
            position: [.8,-3.3, 0],
            // Scale * logoScale (Increase logoScale to increase all logos)
            scale: [0.014, 0.014, 0.022],
            // Rotation in Degrees (gets converted to radians in process)
            rotation: [0, 0, 0],
            // Specify Color Hex (eg. 0x00FFFF for cyan not as string) or color name as string (eg. 'cyan')
            color: 'ffffff',
            // Don't touch this, this will be the actual Mesh reference which becomes available when model loaded.
            mesh: null
        },
        MagesLogo: {
            name: 'MagesLogo',
            glb: root + 'resources/models/MAGES_Logo.glb',
            position: [-1.7,-3.3,0],
            scale: [0.2, 0.2, 0.1],
            rotation: [180, 0, 0],
            color: 'ffffff',
            mesh: null
        }
    }

    function setTransform(params, target) {
        // Set Target Position xyz (Vector3)
        target.position.set(
            params.position[0], // x
            params.position[1], // y
            params.position[2]  // z
        )
        // Set Target Rotation xyz (Vector3) Input: Degrees, Output: Radians
        target.rotation.set(
            THREE.MathUtils.degToRad(params.rotation[0]), // x
            THREE.MathUtils.degToRad(params.rotation[1]), // y
            THREE.MathUtils.degToRad(params.rotation[2])  // z
        )
        // Set Target Scale xyz (Vector3)
        target.scale.set(
            params.scale[0] * logoScale.x, // x
            params.scale[1] * logoScale.y, // y
            params.scale[2] * logoScale.z  // z
        )
    }

    async function asyncLoadModels(params){
        // Load GLTF data
        let data = await gltfLoader.loadAsync(params.glb)
        // Ref Model
        let model = data.scene.children[0]
        // Set Model Transform
        setTransform(params, model)
        // Set Model name (for debug)
        model.name = params.name
        // set reference
        params.mesh = model
        // Attach Object to Scene
        scene.add(model)
    }

    // DO NOT TOUCH
    Object.values(logoMeshs).forEach(element => {
        console.log(element)

        asyncLoadModels(element)
        // gltfLoader.load(
        //     // resource url,
        //     element.glb,
        //     // execute when resource loaded,
        //     function (mesh) {
        //         element.mesh = mesh.scene
        //         element.mesh.position.set(element.position.x, element.position.y, element.position.z)
        //         element.mesh.scale.set(element.scale.x * logoScale.x, element.scale.y * logoScale.y, element.scale.z * logoScale.z)
        //         element.mesh.rotation.x = THREE.MathUtils.degToRad(element.rotation.x)
        //         element.mesh.rotation.y = THREE.MathUtils.degToRad(element.rotation.y)
        //         element.mesh.rotation.z = THREE.MathUtils.degToRad(element.rotation.z)
        //         element.mesh.children[0].material.color = element.color
        //         element.mesh.children[0].material.metalness = 0.9
        //         element.mesh.children[0].material.roughness = 0.4
        //         scene.add(element.mesh)
        //     }
        // )
    })

    // Raycasting
    // const raycaster = new THREE.Raycaster()
    // raycaster.layers.set(1)
    // let INTERSECTED;

    // Objects
    const shapeGeometry = new THREE.IcosahedronGeometry()
    const profileGeometry = new THREE.CircleGeometry(1, 32)

    const marker = new THREE.SphereGeometry()

    const particlesGeometry = new THREE.BufferGeometry
    const particlesCnt = 5000

    const posArray = new Float32Array(particlesCnt * 3)

    for(let i = 0; i < particlesCnt * 3; i++){
        // posArray[i] = Math.random()
        // posArray[i] = Math.random() - .5
        posArray[i] = (Math.random() - .5) * 40
    };

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

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
        color: 0x777777,
        metalness: 1,
        roughness: 0.5
    })

    const transparentMat = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0
    })

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    const shape = new THREE.Mesh(shapeGeometry, shapeMaterial)
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

    const Menu = new THREE.Mesh(marker, transparentMat)
    Menu.position.set(0, 1.2, .3)
    Menu.scale.set(0.05, 0.05, 0.05)

    const TextBody = new THREE.Mesh(marker, transparentMat)
    TextBody.position.set(0, -1.8, .2)
    TextBody.scale.set(0.05, 0.05, 0.05)

    const ProficiencyBody = new THREE.Mesh(marker, transparentMat)
    ProficiencyBody.position.set(0, -4.8, 0)
    ProficiencyBody.scale.set(0.05, 0.05, 0.05)
    
    scene.add(particlesMesh, shape, profileMesh)
    scene.add(Menu, TextBody, ProficiencyBody)

    // Lights
    
    const pointLight = new THREE.PointLight(0xFFFFFF, 2)
    pointLight.position.set(0,2.3,0.85)
    pointLight.intensity = 2
    scene.add(pointLight)
    
    const pointLight2 = new THREE.PointLight(0x888888, 2)
    pointLight2.position.set(-2,-6.5, 5)
    pointLight2.intensity = 1.2
    scene.add(pointLight2)

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, .3)
    scene.add(ambientLight)

    const pointlightHelper = new THREE.PointLightHelper(pointLight2, 1)
    scene.add(pointlightHelper)

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
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
    })
    
    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 2
    scene.add(camera)
    
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
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const menuRenderer = new CSS2DRenderer()
    menuRenderer.setSize( window.innerWidth, window.innerHeight )
    menuRenderer.domElement.style.position = 'fixed'
    menuRenderer.domElement.style.top = '0px'
    document.body.appendChild( menuRenderer.domElement )

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
    
    let title = document.getElementById("title")
    title.textContent = pageStates.About.name

    document.addEventListener('keypress', function ( event ) {
        switch(event.code){
            case 'KeyH':
            case 'KeyA':
                switch(currentPage){
                    case pageStates.About:
                        NavigateMenu(pageStates.Showcase, showcaseMenuDiv)
                        break
                    case pageStates.Contact:
                        NavigateMenu(pageStates.About, aboutMenuDiv)
                        break
                    case pageStates.Showcase:
                        NavigateMenu(pageStates.Contact, contactMenuDiv)
                        break
                }
                break
            case 'KeyL':
            case 'KeyD':
                switch(currentPage){
                    case pageStates.About:
                        NavigateMenu(pageStates.Contact, contactMenuDiv)
                        break
                    case pageStates.Contact:
                        NavigateMenu(pageStates.Showcase, showcaseMenuDiv)
                        break
                    case pageStates.Showcase:
                        NavigateMenu(pageStates.About, aboutMenuDiv)
                        break
                }
                break
            case 'KeyT':
                console.log(scene)
                break
        }
    })

    const KeyAMenuDiv = document.createElement( 'div' )
    KeyAMenuDiv.className = 'menu'
    KeyAMenuDiv.textContent = '[A]'
    KeyAMenuDiv.title = 'Navigate Left'
    KeyAMenuDiv.style.marginTop = '1em'
    KeyAMenuDiv.style.fontSize = '2.5vh'
    KeyAMenuDiv.style.color = menuStyles.Color.inactive
    KeyAMenuDiv.style.fontWeight = menuStyles.Weight.inactive
    KeyAMenuDiv.style.background = 'black'
    KeyAMenuDiv.style.padding = '.3em'
    const KeyAMenuLabel = new CSS2DObject( KeyAMenuDiv )
    KeyAMenuLabel.position.set(
        pageStates.Showcase.position.x - 8,
        pageStates.Showcase.position.y,
        pageStates.Showcase.position.z
        )
    Menu.add( KeyAMenuLabel )

    const showcaseMenuDiv = document.createElement( 'div' )
    showcaseMenuDiv.className = 'menu'
    showcaseMenuDiv.textContent = 'SHOWCASE'
    showcaseMenuDiv.style.marginTop = '1em'
    showcaseMenuDiv.style.fontSize = '2.5vh'
    showcaseMenuDiv.style.color = menuStyles.Color.inactive
    showcaseMenuDiv.style.fontWeight = menuStyles.Weight.inactive
    showcaseMenuDiv.style.background = 'black'
    showcaseMenuDiv.style.padding = '.3em'
    const showcaseMenuLabel = new CSS2DObject( showcaseMenuDiv )
    showcaseMenuLabel.position.set(
        pageStates.Showcase.position.x,
        pageStates.Showcase.position.y,
        pageStates.Showcase.position.z
        );
    Menu.add( showcaseMenuLabel )
    showcaseMenuDiv.addEventListener('pointerdown', () => {
        // Function runs when clicked on Menu item
        NavigateMenu(pageStates.Showcase, showcaseMenuDiv)
    })
    showcaseMenuDiv.addEventListener('pointerenter', () => {
        // On Hover
        pointerHover(true, showcaseMenuDiv, pageStates.Showcase)
    })
    showcaseMenuDiv.addEventListener('pointerleave', () => {
        // Leave Hover
        pointerHover(false, showcaseMenuDiv, pageStates.Showcase)
    })

    const aboutMenuDiv = document.createElement( 'div' )
    aboutMenuDiv.className = 'menu'
    aboutMenuDiv.textContent = 'ABOUT'
    aboutMenuDiv.style.marginTop = '1em'
    aboutMenuDiv.style.fontSize = '2.5vh'
    aboutMenuDiv.style.color = menuStyles.Color.active
    aboutMenuDiv.style.fontWeight = menuStyles.Weight.active
    aboutMenuDiv.style.background = 'black'
    aboutMenuDiv.style.padding = '.3em'
    const aboutMenuLabel = new CSS2DObject( aboutMenuDiv )
    aboutMenuLabel.position.set(
        pageStates.About.position.x,
        pageStates.About.position.y,
        pageStates.About.position.z
        )
    Menu.add( aboutMenuLabel )
    aboutMenuDiv.addEventListener('pointerdown', () => {
        // Function runs when clicked on Menu item
        NavigateMenu(pageStates.About, aboutMenuDiv)
    })
    aboutMenuDiv.addEventListener('pointerenter', () => {
        // On Hover
        pointerHover(true, aboutMenuDiv, pageStates.About)
    })
    aboutMenuDiv.addEventListener('pointerleave', () => {
        // Leave Hover
        pointerHover(false, aboutMenuDiv, pageStates.About)

    })

    const contactMenuDiv = document.createElement( 'div' )
    contactMenuDiv.className = 'menu'
    contactMenuDiv.textContent = 'CONTACT'
    contactMenuDiv.style.marginTop = '1em'
    contactMenuDiv.style.fontSize = '2.5vh'
    contactMenuDiv.style.color = menuStyles.Color.inactive
    contactMenuDiv.style.fontWeight = menuStyles.Weight.inactive
    contactMenuDiv.style.background = 'black'
    contactMenuDiv.style.padding = '.3em'
    const contactMenuLabel = new CSS2DObject( contactMenuDiv )
    contactMenuLabel.position.set(
        pageStates.Contact.position.x,
        pageStates.Contact.position.y,
        pageStates.Contact.position.z
        )
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

    const KeyDMenuDiv = document.createElement( 'div' )
    KeyDMenuDiv.className = 'menu'
    KeyDMenuDiv.textContent = '[D]'
    KeyDMenuDiv.title = 'Navigate Right'
    KeyDMenuDiv.style.marginTop = '1em'
    KeyDMenuDiv.style.fontSize = '2.5vh'
    KeyDMenuDiv.style.color = menuStyles.Color.inactive
    KeyDMenuDiv.style.fontWeight = menuStyles.Weight.inactive
    KeyDMenuDiv.style.background = 'black'
    KeyDMenuDiv.style.padding = '.3em'
    const KeyDMenuLabel = new CSS2DObject( KeyDMenuDiv )
    KeyDMenuLabel.position.set(
        pageStates.Contact.position.x + 8,
        pageStates.Contact.position.y,
        pageStates.Contact.position.z
        );
    Menu.add( KeyDMenuLabel )

    function pointerHover(enter, div, state){
        if(enter){
            div.style.color = menuStyles.Color.hover
        }
        else{
            if(currentPage != state){
                div.style.color = menuStyles.Color.inactive
            }
            else{
                div.style.color = menuStyles.Color.active
            }
        }
    }

    const menuDivs = [ showcaseMenuDiv, aboutMenuDiv, contactMenuDiv ]

    function NavigateMenu(page, div){
        currentPage = page
        console.log(currentPage.name)
        title.textContent = currentPage.name
        menuDivs.forEach(element => {
            element.style.color = menuStyles.Color.inactive
            element.style.fontWeight = menuStyles.Weight.inactive
        })
        div.style.color = menuStyles.Color.active
        div.style.fontWeight = menuStyles.Weight.active

        lerpLoop = false
        lerpTargetX = currentPage.position.x
        LerpMenu()
    }

    // Body

    const aboutBodyDivOne = document.createElement( 'div' )
    aboutBodyDivOne.className = 'textbody'
    aboutBodyDivOne.textContent = "Hi there! Thank you for checking out my portfolio. Here you will know a little more about me. If you'd like to get in contact with me you can head over to the Contact Section from the menu above."
    aboutBodyDivOne.style.marginTop = '1em'
    aboutBodyDivOne.style.fontSize = '2vh'
    aboutBodyDivOne.style.color = 'white'
    aboutBodyDivOne.style.textAlign = 'justify'
    aboutBodyDivOne.style.width = '30vw'
    const aboutBodyTextOne = new CSS2DObject( aboutBodyDivOne )
    aboutBodyTextOne.position.set(8 , -2, 0)
    TextBody.add( aboutBodyTextOne )

    const aboutBodyDivTwo = document.createElement( 'div' )
    aboutBodyDivTwo.className = 'textbody'
    aboutBodyDivTwo.textContent = "(-psst!- Alternatively you could navigate with [A] and [D] keys too, or if youre a unix geek you can use [H] and [L] respectively)."
    aboutBodyDivTwo.style.marginTop = '1em'
    aboutBodyDivTwo.style.fontSize = '1.7vh'
    aboutBodyDivTwo.style.color = 'gray'
    aboutBodyDivTwo.style.textAlign = 'justify'
    aboutBodyDivTwo.style.width = '30vw'
    aboutBodyDivTwo.style.fontStyle = "italic"
    const aboutBodyTextTwo = new CSS2DObject( aboutBodyDivTwo )
    aboutBodyTextTwo.position.set(8 , -8, 0)
    TextBody.add( aboutBodyTextTwo )

    const aboutBodyDivThree = document.createElement( 'div' )
    aboutBodyDivThree.className = 'textbody'
    aboutBodyDivThree.textContent = "I graduated from MAGES Institute of Excellence in Singapore with a Diploma in Game Technolody at the end of 2021. I'm currently employed at Dex-Lab Pte. Ltd. as a Game Designer."
    aboutBodyDivThree.style.marginTop = '1em'
    aboutBodyDivThree.style.fontSize = '2vh'
    aboutBodyDivThree.style.color = 'white'
    aboutBodyDivThree.style.textAlign = 'justify'
    aboutBodyDivThree.style.width = '40vw'
    const aboutBodyTextThree = new CSS2DObject( aboutBodyDivThree )
    aboutBodyTextThree.position.set(0, -16, 0)
    TextBody.add( aboutBodyTextThree )

    //
    // Proficiency Meters
    //
    
    // Geometry
    const proficiencyGeometry = new THREE.BoxGeometry(.5, .5, .5)

    // Mesh
    const proficienyBarSettings = {
        // World spacy position
        leftPosition: new THREE.Vector3(-.5, ProficiencyBody.position.y - .1, 0),
        rightPosition: new THREE.Vector3(.5, ProficiencyBody.position.y - .1, 0),
        // Scale
        scale: new THREE.Vector3(.4, 0.4, 1),
        // Gap between each bar
        gap: .4,
    }
    const proficienciesLeft = {
        //Proficiency
        Programming: {
            // Relative Proficieny Value
            level: 4,
            mesh: new THREE.Mesh(
                proficiencyGeometry,
                new THREE.MeshStandardMaterial({
                    // Bar Color
                    color: 0x56ea58
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
                    color: 0xff9b78
                })
            )
        }
    };

    const proficienciesRight = {
        //Proficiency
        Unity: {
            // Relative Proficieny Value
            level: 4,
            mesh: new THREE.Mesh(
                proficiencyGeometry,
                new THREE.MeshStandardMaterial({
                    // Bar Color
                    color: 0x08a6af
                })
            )
        },
        UnrealEngine: {
            level: 3,
            mesh: new THREE.Mesh(
                proficiencyGeometry,
                new THREE.MeshStandardMaterial({
                    color: 0xffc22c
                })
            )
        },
        ThreeJS: {
            level: 2,
            mesh: new THREE.Mesh(
                proficiencyGeometry,
                new THREE.MeshStandardMaterial({
                    color: 0x9474be
                })
            )
        }
    }
    
    // Don't Touch
    let profGap = 0;
    Object.values(proficienciesLeft).forEach(element => {
        element.mesh.scale.set(
            // proficienyBarSettings.scale.x * element.level,
            // proficienyBarSettings.scale.y,
            // proficienyBarSettings.scale.z
            0.01,
            proficienyBarSettings.scale.y,
            proficienyBarSettings.scale.z
            )
        element.mesh.position.set(
            proficienyBarSettings.leftPosition.x + (- element.mesh.scale.x * .25),
            proficienyBarSettings.leftPosition.y - profGap,
            proficienyBarSettings.leftPosition.z + (- element.mesh.scale.z * .25)
            )
        scene.add(element.mesh)
        profGap += proficienyBarSettings.gap;
    })

    profGap = 0
    Object.values(proficienciesRight).forEach(element => {
        element.mesh.scale.set(
            // proficienyBarSettings.scale.x * element.level,
            // proficienyBarSettings.scale.y,
            // proficienyBarSettings.scale.z
            0.01,
            proficienyBarSettings.scale.y,
            proficienyBarSettings.scale.z
            )
        element.mesh.position.set(
            proficienyBarSettings.rightPosition.x + (element.mesh.scale.x * .25),
            proficienyBarSettings.rightPosition.y - profGap,
            proficienyBarSettings.rightPosition.z + (- element.mesh.scale.z * .25)
            )
        scene.add(element.mesh)
        profGap += proficienyBarSettings.gap;
    })

    const gridHelperLeft = new THREE.GridHelper(20,5)
    gridHelperLeft.rotation.x = THREE.MathUtils.degToRad(90)
    gridHelperLeft.position.set(-20,-10,0)
    ProficiencyBody.add(gridHelperLeft)
    const gridHelperRight = new THREE.GridHelper(20,5)
    gridHelperRight.rotation.x = THREE.MathUtils.degToRad(90)
    gridHelperRight.position.set(20,-10,0)
    ProficiencyBody.add(gridHelperRight)

    const aboutProfProgrammingDiv = document.createElement( 'div' )
    aboutProfProgrammingDiv.className = 'proficiencybody'
    aboutProfProgrammingDiv.textContent = "Programming"
    aboutProfProgrammingDiv.style.marginTop = '1em'
    aboutProfProgrammingDiv.style.fontSize = '3vh'
    aboutProfProgrammingDiv.style.color = 'white'
    aboutProfProgrammingDiv.style.textAlign = 'left'
    aboutProfProgrammingDiv.style.textTransform = 'uppercase'
    aboutProfProgrammingDiv.style.background = 'black'
    const aboutProfProgrammingLabel = new CSS2DObject( aboutProfProgrammingDiv )
    aboutProfProgrammingLabel.position.set(-12, 0, 0)
    ProficiencyBody.add( aboutProfProgrammingLabel )

    const aboutProfDesignDiv = document.createElement( 'div' )
    aboutProfDesignDiv.className = 'proficiencybody'
    aboutProfDesignDiv.textContent = "Design"
    aboutProfDesignDiv.style.marginTop = '1em'
    aboutProfDesignDiv.style.fontSize = '3vh'
    aboutProfDesignDiv.style.color = 'white'
    aboutProfDesignDiv.style.textAlign = 'left'
    aboutProfDesignDiv.style.textTransform = 'uppercase'
    aboutProfDesignDiv.style.background = 'black'
    const aboutProfDesignLabel = new CSS2DObject( aboutProfDesignDiv )
    aboutProfDesignLabel.position.set(-12, -8, 0)
    ProficiencyBody.add( aboutProfDesignLabel )

    const aboutProfShadingDiv = document.createElement( 'div' )
    aboutProfShadingDiv.className = 'proficiencybody'
    aboutProfShadingDiv.textContent = "Shading"
    aboutProfShadingDiv.style.marginTop = '1em'
    aboutProfShadingDiv.style.fontSize = '3vh'
    aboutProfShadingDiv.style.color = 'white'
    aboutProfShadingDiv.style.textAlign = 'left'
    aboutProfShadingDiv.style.textTransform = 'uppercase'
    aboutProfShadingDiv.style.background = 'black'
    const aboutProfShadingLabel = new CSS2DObject( aboutProfShadingDiv )
    aboutProfShadingLabel.position.set(-12, -16, 0)
    ProficiencyBody.add( aboutProfShadingLabel )

    const aboutProfUnityDiv = document.createElement( 'div' )
    aboutProfUnityDiv.className = 'proficiencybody'
    aboutProfUnityDiv.textContent = "Unity Engine"
    aboutProfUnityDiv.style.marginTop = '1em'
    aboutProfUnityDiv.style.fontSize = '3vh'
    aboutProfUnityDiv.style.color = 'white'
    aboutProfUnityDiv.style.textAlign = 'left'
    aboutProfUnityDiv.style.textTransform = 'uppercase'
    aboutProfUnityDiv.style.background = 'black'
    const aboutProfUnityLabel = new CSS2DObject( aboutProfUnityDiv )
    aboutProfUnityLabel.position.set(12, 0, 0)
    ProficiencyBody.add( aboutProfUnityLabel )

    const aboutProfUnrealDiv = document.createElement( 'div' )
    aboutProfUnrealDiv.className = 'proficiencybody'
    aboutProfUnrealDiv.textContent = "Unreal Engine"
    aboutProfUnrealDiv.style.marginTop = '1em'
    aboutProfUnrealDiv.style.fontSize = '3vh'
    aboutProfUnrealDiv.style.color = 'white'
    aboutProfUnrealDiv.style.textAlign = 'left'
    aboutProfUnrealDiv.style.textTransform = 'uppercase'
    aboutProfUnrealDiv.style.background = 'black'
    const aboutProfUnrealLabel = new CSS2DObject( aboutProfUnrealDiv )
    aboutProfUnrealLabel.position.set(12, -8, 0)
    ProficiencyBody.add( aboutProfUnrealLabel )

    const aboutProfThreeDiv = document.createElement( 'div' )
    aboutProfThreeDiv.className = 'proficiencybody'
    aboutProfThreeDiv.textContent = "ThreeJS"
    aboutProfThreeDiv.style.marginTop = '1em'
    aboutProfThreeDiv.style.fontSize = '3vh'
    aboutProfThreeDiv.style.color = 'white'
    aboutProfThreeDiv.style.textAlign = 'left'
    aboutProfThreeDiv.style.textTransform = 'uppercase'
    aboutProfThreeDiv.style.background = 'black'
    const aboutProfThreeLabel = new CSS2DObject( aboutProfThreeDiv )
    aboutProfThreeLabel.position.set(12, -16, 0)
    ProficiencyBody.add( aboutProfThreeLabel )

    //
    // Listeners
    //

    let scrollY = window.scrollY

    const pageMarkers = {
        header: 300,
        aboutMe: 476,
        proficiency: {
            start: 600,
            end: 900
        }
    }

    let header = document.getElementsByTagName('h1')[0]

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        
        let scrollRate = scrollY * 0.005
        camera.position.y = - scrollRate

        Menu.position.y = camera.position.y + 1.2

        header.style.opacity = 1 - (scrollY / pageMarkers.header)
        
        // console.log(scrollY)

        switch(currentPage){
            case pageStates.About:
                let scrollScale = ((scrollY / pageMarkers.aboutMe) * 0.4)
        
                if(scrollY < pageMarkers.aboutMe)
                {
                    profileMesh.rotation.y = scrollRate + 4
                    profileMesh.rotation.z = scrollRate + 4
                    profileMesh.scale.set(scrollScale, scrollScale, scrollScale)
                }
                else{
                    profileMesh.rotation.y = 6.35
                    profileMesh.rotation.z = 6.35
                    profileMesh.scale.set(0.4, 0.4, 0.4)
                }
                if( pageMarkers.proficiency.start < scrollY && scrollY < pageMarkers.proficiency.end){
                    let proficienyDelta = (scrollY - pageMarkers.proficiency.start) / (pageMarkers.proficiency.end - pageMarkers.proficiency.start)
                    Object.values(proficienciesLeft).forEach(element => {
                        element.mesh.scale.x = THREE.MathUtils.lerp(0, proficienyBarSettings.scale.x * element.level, proficienyDelta)
                        element.mesh.position.x = proficienyBarSettings.leftPosition.x + (- element.mesh.scale.x * .25)
                    })
                    Object.values(proficienciesRight).forEach(element => {
                        element.mesh.scale.x = - THREE.MathUtils.lerp(0, proficienyBarSettings.scale.x * element.level, proficienyDelta)
                        element.mesh.position.x = proficienyBarSettings.rightPosition.x + (- element.mesh.scale.x * .25)
                    })
                }
                else if(scrollY > pageMarkers.proficiency.end){
                    Object.values(proficienciesLeft).forEach(element => {
                        element.mesh.scale.x = proficienyBarSettings.scale.x * element.level
                        element.mesh.position.x = proficienyBarSettings.leftPosition.x + (- element.mesh.scale.x * .25)
                    })
                    Object.values(proficienciesRight).forEach(element => {
                        element.mesh.scale.x = - proficienyBarSettings.scale.x * element.level
                        element.mesh.position.x = proficienyBarSettings.rightPosition.x + (- element.mesh.scale.x * .25)
                    })
                }
                break
        }
    })
    
    let mouseX = 0
    let mouseY = 0
    
    let targetX = 0
    let targetY = 0
    
    const windowX = window.innerWidth * 0.5
    const windowY = window.innerHeight * 0.5
    
    document.addEventListener('mousemove', onDocumentMouseMove)
    function onDocumentMouseMove ( event ) {
        mouseX = (event.clientX - windowX)
        mouseY = (event.clientY - windowY)
    }
    
    window.addEventListener('pointermove', onPointerMove)
    var pointer = new THREE.Vector2()
    
    function onPointerMove ( event ) {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    }
    
    //
    // UPDATE
    //

    // console.log(scene.children)

    var lerpDelta = 0
    var lerpLoop = false
    var lerpOriginalPos
    var lerpTargetX = null

    function LerpMenu() {
        if(!lerpLoop) {
            lerpOriginalPos = Menu.position
            lerpDelta = 0
        }
        lerpDelta += 0.005

        Menu.position.lerpVectors(lerpOriginalPos, new THREE.Vector3(lerpTargetX, lerpOriginalPos.y, lerpOriginalPos.z), lerpDelta)
        camera.position.x = Menu.position.x

        if(lerpDelta < .3){
            lerpLoop = true
            window.requestAnimationFrame(LerpMenu)
        }
        else{
            lerpTargetX = lerpOriginalPos = null
        }
    }

    const clock = new THREE.Clock()

    const tick = () =>
    {
        targetX = mouseX * 0.001
        targetY = mouseY * 0.001
        
        const elapsedTime = clock.getElapsedTime()
        
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
                break
        }

        particlesMesh.rotateY(0.0001)
        
        // Update Orbital Controls
        //controls.update()
        
        // Render
        renderer.render(scene, camera)
        menuRenderer.render( scene, camera)
        
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    };
    
    tick()
}

main()