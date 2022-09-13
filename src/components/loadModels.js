import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";

async function loadModel() {
    const loader = new GLTFLoader();
    const logodata = await loader.loadAsync(
        '/models/DexLab_LOGO.glb'
        )
    console.log("Loaded", logodata)
}

export { loadModel };