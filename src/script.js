import * as THREE from 'three'
import GUI from 'lil-gui'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'

/**
 * Debug
 */
const gui = new GUI({title: 'Ambient Controls', width: 280, closeFolders: true})

const global = {}

const fogFolder = gui.addFolder('Fog')
const moonFolder = gui.addFolder('Moonlight')
const doorFolder = gui.addFolder('Door Light')
const ghostFolder = gui.addFolder('Ghosts')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.webp')
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Wall
const wallColorTexture = textureLoader.load('./wall/mossy_brick_1k/mossy_brick_diff_1k.webp')
const wallARMTexture = textureLoader.load('./wall/mossy_brick_1k/mossy_brick_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./wall/mossy_brick_1k/mossy_brick_nor_gl_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Door
const doorColorTexture = textureLoader.load('./door/color.webp')
const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('./door/height.webp')
const doorNormalTexture = textureLoader.load('./door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

// Bush
const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// Grave
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture, 
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: - 0.2
    })
)
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
    })
)
walls.position.y += 1.25 // (2.5 / 2)
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        color: '#29180c',
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.rotation.y = Math.PI / 4
roof.position.y = 2.5 + 0.75
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: - 0.04
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes 
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
}) 

const bushOne = new THREE.Mesh(bushGeometry, bushMaterial)
bushOne.rotation.x = - 0.75
bushOne.position.set(0.8, 0.2, 2.2)
bushOne.scale.set(0.5, 0.5, 0.5)

const bushTwo = new THREE.Mesh(bushGeometry, bushMaterial)
bushTwo.rotation.x = - 0.75
bushTwo.position.set(1.4, 0.1, 2.1)
bushTwo.scale.set(0.25, 0.25, 0.25)

const bushThree = new THREE.Mesh(bushGeometry, bushMaterial)
bushThree.rotation.x = - 0.75
bushThree.position.set(-0.8, 0.1, 2.2)
bushThree.scale.set(0.4, 0.4, 0.4)

const bushFour = new THREE.Mesh(bushGeometry, bushMaterial)
bushFour.rotation.x = - 0.75
bushFour.position.set(-1, 0.05, 2.6)
bushFour.scale.set(0.15, 0.15, 0.15)

house.add(bushOne, bushTwo, bushThree, bushFour)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
    const angle = ((i + Math.random()) / 30) * Math.PI * 2
    const radius = Math.sqrt(9 + Math.random() * 40) 
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // Mesh 
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave) // add to the graves group
}

/**
 * Lights
 */
// Ambient light
global.ambientColor = '#86cdff'

const ambientLight = new THREE.AmbientLight(global.ambientColor, 0.275)
scene.add(ambientLight)

moonFolder
    .addColor(global, 'ambientColor')
    .name('ambient color')
    .onChange((value) => {
        ambientLight.color.set(value)
    })
moonFolder.add(ambientLight, 'intensity').min(0).max(2).step(0.01).name('ambient intensity')

// Directional light
global.directionalColor = '#86cdff'

const directionalLight = new THREE.DirectionalLight(global.directionalColor, 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

moonFolder
    .addColor(global, 'directionalColor')
    .name('directional color')
    .onChange((value) => {
        directionalLight.color.set(value)
    })
moonFolder.add(directionalLight, 'intensity').min(0).max(5).step(0.01).name('directional intensity')

// Door light
global.doorColor = '#ff5c46'

const doorLight = new THREE.PointLight(global.doorColor, 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

doorFolder
    .addColor(global, 'doorColor')
    .name('color')
    .onChange((value) => {
        doorLight.color.set(value)
    })
doorFolder.add(doorLight, 'intensity').min(0).max(15).step(0.01).name('intensity')

/**
 * Ghosts
 */
const ghostParams = { intensity: 6, speed: 1 }

global.ghostOneColor = '#6600ff'
global.ghostTwoColor = '#ff0088'
global.ghostThreeColor = '#ff7d46'

const ghostOne = new THREE.PointLight(global.ghostOneColor, ghostParams.intensity)
const ghostTwo = new THREE.PointLight(global.ghostTwoColor, ghostParams.intensity)
const ghostThree = new THREE.PointLight(global.ghostThreeColor, ghostParams.intensity)
scene.add(ghostOne, ghostTwo, ghostThree)

ghostFolder
    .addColor(global, 'ghostOneColor')
    .name('ghost 1')
    .onChange((value) => {
        ghostOne.color.set(value)
    })
ghostFolder
    .addColor(global, 'ghostTwoColor')
    .name('ghost 2')
    .onChange((value) => {
        ghostTwo.color.set(value)
    })
ghostFolder
    .addColor(global, 'ghostThreeColor')
    .name('ghost 3')
    .onChange((value) => {
        ghostThree.color.set(value)
    })
ghostFolder.add(ghostParams, 'intensity').min(0).max(20).step(0.1).name('intensity')
    .onChange(v => { ghostOne.intensity = ghostTwo.intensity = ghostThree.intensity = v })
ghostFolder.add(ghostParams, 'speed').min(0).max(3).step(0.01).name('speed')

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

// Cast and receive
directionalLight.castShadow = true
ghostOne.castShadow = true
ghostTwo.castShadow = true
ghostThree.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for ( const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghostOne.shadow.mapSize.width = 256
ghostOne.shadow.mapSize.height = 256
ghostOne.shadow.camera.far = 10

ghostTwo.shadow.mapSize.width = 256
ghostTwo.shadow.mapSize.height = 256
ghostTwo.shadow.camera.far = 10

ghostThree.shadow.mapSize.width = 256
ghostThree.shadow.mapSize.height = 256
ghostThree.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms.turbidity.value = 10
sky.material.uniforms.rayleigh.value = 3
sky.material.uniforms.mieCoefficient.value = 0.1
sky.material.uniforms.mieDirectionalG.value = 0.95
sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95)

/**
 * Fog
 */
global.fogColor = '#04343f'

scene.fog = new THREE.FogExp2(global.fogColor, 0.08)

fogFolder
    .addColor(global, 'fogColor')
    .name('color')
    .onChange((value) => {
        scene.fog.color.set(value)
    })
fogFolder.add(scene.fog, 'density').min(0).max(0.3).step(0.001).name('density')

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update ghosts
    const ghostOneAngle = elapsedTime * 0.6 * ghostParams.speed
    ghostOne.position.x = Math.cos(ghostOneAngle) * 3.5
    ghostOne.position.z = Math.sin(ghostOneAngle) * 3.5
    ghostOne.position.y = Math.sin(ghostOneAngle) * Math.sin(ghostOneAngle * 2.34) * Math.sin(ghostOneAngle * 3.45)

    const ghostTwoAngle = - elapsedTime * 0.4 * ghostParams.speed
    ghostTwo.position.x = Math.cos(ghostTwoAngle) * 5
    ghostTwo.position.z = Math.sin(ghostTwoAngle) * 5
    ghostTwo.position.y = Math.sin(ghostTwoAngle) * Math.sin(ghostTwoAngle * 2.34) * Math.sin(ghostTwoAngle * 3.45)

    const ghostThreeAngle = elapsedTime * 0.8 * ghostParams.speed
    ghostThree.position.x = Math.cos(ghostThreeAngle) * 6.5
    ghostThree.position.z = Math.sin(ghostThreeAngle) * 6.5
    ghostThree.position.y = Math.sin(ghostThreeAngle) * Math.sin(ghostThreeAngle * 2.34) * Math.sin(ghostThreeAngle * 3.45)
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
