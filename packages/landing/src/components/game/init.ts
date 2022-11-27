import {
  Animation,
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  Scene,
  SceneLoader,
  Vector3
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"

const pink = new Color3(197 / 255, 41 / 255, 112 / 255)
const purple = new Color3(147 / 255, 82 / 255, 148 / 255)
const blue = new Color3(19 / 255, 52 / 255, 164 / 255)

const init = async (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas, true)
  const createScene = async () => {
    const scene = new Scene(engine)
    //scene.clearColor = Color3.White();

    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 150, Vector3.Zero())
    camera.attachControl(canvas, true)

    const globe = await SceneLoader.ImportMeshAsync(
      "earth",
      "/Earth-Final/",
      "earth-bnw.gltf",
      scene
    )
    const m1 = globe.meshes[1] as Mesh
    const m2 = globe.meshes[2] as Mesh
    const m3 = globe.meshes[3] as Mesh

    const newMesh = await Mesh.MergeMeshesAsync([m1, m2, m3], true, true)
    // globeMat.rotate(new Vector3(0, 80, 0), 3)
    // // var gl = new GlowLayer("glow", scene);
    // // gl.intensity = 100;

    const animEarth = new Animation(
      "animEarth",
      "rotation.y",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )

    const earthKeys = []

    //At the animation key 0, the value of rotation.y is 0
    earthKeys.push({
      frame: 0,
      value: 0
    })

    earthKeys.push({
      frame: 120,
      value: 2 * Math.PI
    })

    camera.target = newMesh

    animEarth.setKeys(earthKeys)

    newMesh.animations = [animEarth]

    //Begin animation - object to animate, first frame, last frame and loop if true
    scene.beginAnimation(newMesh, 0, 120, true)

    const hemiLight = new HemisphericLight("hemiLight", new Vector3(1, 0, 0), scene)
    hemiLight.diffuse = pink
    hemiLight.groundColor = blue
    hemiLight.intensity = 7
    hemiLight.specular = purple

    return scene
  }
  const scene = await createScene()
  engine.runRenderLoop(() => {
    scene.render()
  })
}
export default init
