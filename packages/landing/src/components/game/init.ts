import {
  Animation,
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  GlowLayer,
  HemisphericLight,
  Mesh,
  PointerEventTypes,
  PointerInfo,
  Scene,
  SceneLoader,
  Vector3
} from "@babylonjs/core"
import { colorVertexShader } from "@babylonjs/core/Shaders/color.vertex"
import "@babylonjs/loaders/glTF"

const pink = new Color3(197 / 255, 41 / 255, 112 / 255)
const purple = new Color3(147 / 255, 82 / 255, 148 / 255)
const blue = new Color3(19 / 255, 52 / 255, 164 / 255)

const init = async (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas, true)
  const createScene = async () => {
    const scene = new Scene(engine)
    scene.clearColor = new Color4(0, 0, 0, 0)

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      75,
      new Vector3(-10, 0, 0)
    )
    scene.useRightHandedSystem = true
    // camera.attachControl(canvas, false)

    const globe = await SceneLoader.ImportMeshAsync(
      "earth",
      "/Earth-Final/",
      "new-earth.gltf",
      scene
    )
    const m1 = globe.meshes[1] as Mesh
    const m2 = globe.meshes[2] as Mesh
    const m3 = globe.meshes[3] as Mesh

    const newMesh = (await Mesh.MergeMeshesAsync([m1, m2, m3], true, true)) as Mesh
    newMesh.material?.getActiveTextures().forEach((text) => {
      console.log(text.toString())
    })
    // var gl = new GlowLayer("glow", scene)
    //ß gl.intensity = 0.0001

    // // Method 1
    // newMesh.bakeCurrentTransformIntoVertices(true)

    //animate
    startAnimation()
    //interaction
    scene.onPointerObservable.add(onPointer)
    function startAnimation() {
      scene.hoverCursor = "pointer"
      //Begin animation - object to animate, first frame, last frame and loop if true
      Animation.AllowMatricesInterpolation = true
      newMesh.animations = []
      let earthKeys = []
      var rotationSpeed = 0.1
      let animEarth = new Animation(
        "animEarth",
        "rotation",
        120,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_RELATIVE
      )
      animEarth.vector3InterpolateFunction = (startValue, endValue, gradient) => {
        return Vector3.Lerp(startValue, endValue, gradient)
      }

      //At the animation key 0, the value of rotation.y is 0
      earthKeys.push(
        {
          frame: 0,
          value: newMesh.rotation
        },
        {
          frame: 120,
          value: new Vector3(0, newMesh.rotation.y + rotationSpeed, 0)
        }
      )

      // camera.setTarget(newMesh)

      animEarth.setKeys(earthKeys)

      newMesh.animations = [animEarth]
      newMesh.animations.push(animEarth)
      scene.beginAnimation(newMesh, 0, 120, true)
      console.log(newMesh)
    }
    function stopAnimationandRotate() {
      scene.stopAllAnimations()
    }
    scene.defaultCursor = "grab"

    let isMouseDown = false

    function onPointer(pointerInfo: PointerInfo) {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          scene.defaultCursor = "grabbing"

          isMouseDown = true
          stopAnimationandRotate()
          break
        case PointerEventTypes.POINTERMOVE:
          if (isMouseDown) {
            const rotationAmount = pointerInfo.event.movementX * 0.01
            console.log(rotationAmount)

            newMesh.addRotation(0, -rotationAmount, 0)
          }
          break
        case PointerEventTypes.POINTERUP:
          isMouseDown = false
          scene.defaultCursor = "grab"

          startAnimation()
          break
      }
    }

    const hemiLight = new HemisphericLight("hemiLight", new Vector3(1, 0, 0), scene)
    hemiLight.diffuse = pink
    hemiLight.groundColor = blue
    hemiLight.intensity = 9
    hemiLight.specular = purple
    return scene
  }
  const scene = await createScene()
  engine.runRenderLoop(() => {
    scene.render()
  })
}
export default init
