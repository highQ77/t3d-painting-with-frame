import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { texture } from 'three/tsl';
import { TextureLoader, Vector3 } from 'three/webgpu';

(async () => {
    await new Promise(resolve => {
        window.addEventListener('DOMContentLoaded', resolve)
    })
    document.body.style.margin = '0px'

    let pt = await new Promise(resolve => {
        // './starry-night-filter.png'
        new THREE.TextureLoader().load('./portrait.jpg', (tex) => {
            resolve(tex)
        });
    })
    console.log(pt)

    const gui = new GUI();

    const scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0x000000, 0.66, 10)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(new Vector3)
    // renderer
    const renderer = new THREE.WebGLRenderer({
        powerPreference: "high-performance",
        antialias: true,
        stencil: true,
        depth: true
    });
    // 顏色空間設置
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    // 預設背景顏色 透明
    renderer.setClearColor(0, 0.0)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    //建構環境光源
    const light = new THREE.AmbientLight(0xFFFFFF);
    light.intensity = 5
    //將光源加進場景中
    scene.add(light);

    // 主光源
    const lightD = new THREE.DirectionalLight(0xffffff, Math.PI)
    lightD.position.set(-5.9, 7.5, 7.26)
    lightD.intensity = 3.15
    scene.add(lightD)

    // 反射光源
    const lightFloor = new THREE.DirectionalLight(0xffffff, Math.PI)
    lightFloor.position.set(100, -100, -100)
    lightFloor.intensity = 1.55
    scene.add(lightFloor)

    const axes = new THREE.AxesHelper(5)
    scene.add(axes)

    const controls = new OrbitControls(camera, renderer.domElement);

    const ratio = pt.image.naturalWidth / pt.image.naturalHeight
    // painting box
    let w = 5 * ratio
    let h = 5
    let painting_thick = .1
    let inner_frame_thick = painting_thick * 2
    let outter_frame_thick = painting_thick * 4
    let outter_frame_thick_factor = .9

    const paintingBoxGeo = new THREE.BoxGeometry(w, h, painting_thick)
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.666, metalness: 0.508, map: pt });
    const paintingBox = new THREE.Mesh(paintingBoxGeo, material);
    scene.add(paintingBox);

    {
        // inner
        const materialInner = new THREE.MeshStandardMaterial({ color: 0xFFFFCC, roughness: 0.666, metalness: 0.263 });

        const topBoxGeo = new THREE.BoxGeometry(w, inner_frame_thick, inner_frame_thick)
        const topBox = new THREE.Mesh(topBoxGeo, materialInner);
        topBox.position.y = (h + inner_frame_thick) * .5
        scene.add(topBox);

        const bottomBoxGeo = new THREE.BoxGeometry(w, inner_frame_thick, inner_frame_thick)
        const bottomBox = new THREE.Mesh(bottomBoxGeo, materialInner);
        bottomBox.position.y = -(h + inner_frame_thick) * .5
        scene.add(bottomBox);

        const leftBoxGeo = new THREE.BoxGeometry(inner_frame_thick, h, inner_frame_thick)
        const leftBox = new THREE.Mesh(leftBoxGeo, materialInner);
        leftBox.position.x = -(w + inner_frame_thick) * .5
        scene.add(leftBox);

        const rightBoxGeo = new THREE.BoxGeometry(inner_frame_thick, h, inner_frame_thick)
        const rightBox = new THREE.Mesh(rightBoxGeo, materialInner);
        rightBox.position.x = (w + inner_frame_thick) * .5
        scene.add(rightBox);

        const leftTopBoxGeo = new THREE.BoxGeometry(inner_frame_thick, inner_frame_thick, inner_frame_thick)
        const leftTopBox = new THREE.Mesh(leftTopBoxGeo, materialInner);
        leftTopBox.position.x = -(w + inner_frame_thick) * .5
        leftTopBox.position.y = (h + inner_frame_thick) * .5
        scene.add(leftTopBox);

        const leftBottomBoxGeo = new THREE.BoxGeometry(inner_frame_thick, inner_frame_thick, inner_frame_thick)
        const leftBottomBox = new THREE.Mesh(leftBottomBoxGeo, materialInner);
        leftBottomBox.position.x = -(w + inner_frame_thick) * .5
        leftBottomBox.position.y = -(h + inner_frame_thick) * .5
        scene.add(leftBottomBox);

        const rightTopBoxGeo = new THREE.BoxGeometry(inner_frame_thick, inner_frame_thick, inner_frame_thick)
        const rightTopBox = new THREE.Mesh(rightTopBoxGeo, materialInner);
        rightTopBox.position.x = (w + inner_frame_thick) * .5
        rightTopBox.position.y = (h + inner_frame_thick) * .5
        scene.add(rightTopBox);

        const rightBottomBoxGeo = new THREE.BoxGeometry(inner_frame_thick, inner_frame_thick, inner_frame_thick)
        const rightBottomBox = new THREE.Mesh(rightBottomBoxGeo, materialInner);
        rightBottomBox.position.x = (w + inner_frame_thick) * .5
        rightBottomBox.position.y = -(h + inner_frame_thick) * .5
        scene.add(rightBottomBox);
    }

    {
        // outter
        const materialOutter = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.666, metalness: 0.263 });

        const topBoxGeo = new THREE.BoxGeometry(w + inner_frame_thick * 2, outter_frame_thick, outter_frame_thick / outter_frame_thick_factor)
        const topBox = new THREE.Mesh(topBoxGeo, materialOutter);
        topBox.position.y = (h + outter_frame_thick) * .5 + inner_frame_thick
        scene.add(topBox);

        const bottomBoxGeo = new THREE.BoxGeometry(w + inner_frame_thick * 2, outter_frame_thick, outter_frame_thick / outter_frame_thick_factor)
        const bottomBox = new THREE.Mesh(bottomBoxGeo, materialOutter);
        bottomBox.position.y = -(h + outter_frame_thick) * .5 - inner_frame_thick
        scene.add(bottomBox);

        const leftBoxGeo = new THREE.BoxGeometry(outter_frame_thick, h + inner_frame_thick * 2, outter_frame_thick / outter_frame_thick_factor)
        const leftBox = new THREE.Mesh(leftBoxGeo, materialOutter);
        leftBox.position.x = -(w + outter_frame_thick) * .5 - inner_frame_thick
        scene.add(leftBox);

        const rightBoxGeo = new THREE.BoxGeometry(outter_frame_thick, h + inner_frame_thick * 2, outter_frame_thick / outter_frame_thick_factor)
        const rightBox = new THREE.Mesh(rightBoxGeo, materialOutter);
        rightBox.position.x = (w + outter_frame_thick) * .5 + inner_frame_thick
        scene.add(rightBox);

        const leftTopBoxGeo = new THREE.BoxGeometry(outter_frame_thick, outter_frame_thick, outter_frame_thick / outter_frame_thick_factor)
        const leftTopBox = new THREE.Mesh(leftTopBoxGeo, materialOutter);
        leftTopBox.position.x = -(w + outter_frame_thick) * .5 - inner_frame_thick
        leftTopBox.position.y = (h + outter_frame_thick) * .5 + inner_frame_thick
        scene.add(leftTopBox);

        const leftBottomBoxGeo = new THREE.BoxGeometry(outter_frame_thick, outter_frame_thick, outter_frame_thick / outter_frame_thick_factor)
        const leftBottomBox = new THREE.Mesh(leftBottomBoxGeo, materialOutter);
        leftBottomBox.position.x = -(w + outter_frame_thick) * .5 - inner_frame_thick
        leftBottomBox.position.y = -(h + outter_frame_thick) * .5 - inner_frame_thick
        scene.add(leftBottomBox);

        const rightTopBoxGeo = new THREE.BoxGeometry(outter_frame_thick, outter_frame_thick, outter_frame_thick / outter_frame_thick_factor)
        const rightTopBox = new THREE.Mesh(rightTopBoxGeo, materialOutter);
        rightTopBox.position.x = (w + outter_frame_thick) * .5 + inner_frame_thick
        rightTopBox.position.y = (h + outter_frame_thick) * .5 + inner_frame_thick
        scene.add(rightTopBox);

        const rightBottomBoxGeo = new THREE.BoxGeometry(outter_frame_thick, outter_frame_thick, outter_frame_thick / outter_frame_thick_factor)
        const rightBottomBox = new THREE.Mesh(rightBottomBoxGeo, materialOutter);
        rightBottomBox.position.x = (w + outter_frame_thick) * .5 + inner_frame_thick
        rightBottomBox.position.y = -(h + outter_frame_thick) * .5 - inner_frame_thick
        scene.add(rightBottomBox);
    }

    // let frameFolder = gui.addFolder('Frame Settings')
    // frameFolder.add(leftBox.position, 'x', -10, 10).name('position x');
    // frameFolder.add(leftBox.position, 'y', -10, 10).name('position y');
    // frameFolder.add(leftBox.position, 'z', -10, 10).name('position z');

    // let camFolder = gui.addFolder('Camera Settings')
    // camFolder.add(camera.position, 'x', -10, 10).name('position x');
    // camFolder.add(camera.position, 'y', -10, 10).name('position y');
    // camFolder.add(camera.position, 'z', -10, 10).name('position z');
    // let mainLightFolder = gui.addFolder('Env Settings')
    // mainLightFolder.addColor(light, 'color').name('Ambient Color');
    // mainLightFolder.add(light, 'intensity', 0, 50).name('Ambient Intensity');
    // // mainLightFolder.addColor(lightD, 'color').name('Main Light Color');
    // mainLightFolder.add(lightD, 'intensity', 0, 50).name('Main Light Intensity');
    // mainLightFolder.add(lightFloor, 'intensity', 0, 50).name('Reflect Light Intensity');
    // mainLightFolder.addColor(scene.fog, 'color').name('Fog Color');
    // mainLightFolder.add(scene.fog, 'near', 0, 10).name('Fog Near');
    // mainLightFolder.add(scene.fog, 'far', 0, 10).name('Fog Far');
    // // mainLightFolder.add(lightFloor.position, 'x', -100, 100).name('Reflect Light x');
    // // mainLightFolder.add(lightFloor.position, 'y', -100, 100).name('Reflect Light y');
    // // mainLightFolder.add(lightFloor.position, 'z', -100, 100).name('Reflect Light z');

    let materialFolder = gui.addFolder('Material')
    materialFolder.addColor(material, 'color').name('Material Color');
    materialFolder.addColor(material, 'emissive').name('Material Emissive');
    materialFolder.add(material, 'metalness', 0, 1).name('Material Metalness');
    materialFolder.add(material, 'roughness', 0, 1).name('Material Roughness');

    function animate() {
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onWindowResize()

    document.body.style.background = `linear-gradient(rgb(11,11,11),rgb(99, 99, 99))`
})()