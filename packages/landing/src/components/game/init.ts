import "@babylonjs/loaders/OBJ";
import {
  ArcRotateCamera,
  Animation,
  AutoRotationBehavior,
  Color3,
  Color4,
  CreateScreenshotWithResizeAsync,
  Curve3,
  DirectionalLight,
  Engine,
  FramingBehavior,
  FreeCamera,
  HemisphericLight,
  HighlightLayer,
  Light,
  Mesh,
  MeshAssetTask,
  MeshBuilder,
  PlayAnimationAction,
  PointerInfo,
  PointLight,
  PositionNormalTextureVertex,
  Scene,
  SceneComponentConstants,
  SceneLoader,
  SpotLight,
  StandardMaterial,
  Texture,
  Vector3,
  Vector4,
  GlowLayer,
  Axis,
} from "@babylonjs/core";
import { GLTFFileLoader } from "@babylonjs/loaders/glTF";
import { helperFunctions } from "@babylonjs/core/Shaders/ShadersInclude/helperFunctions";
import { extractHighlightsPixelShader } from "@babylonjs/core/Shaders/extractHighlights.fragment";

const pink = new Color3(197 / 255, 41 / 255, 112 / 255);
const purple = new Color3(147 / 255, 82 / 255, 148 / 255);
const blue = new Color3(19 / 255, 52 / 255, 164 / 255);

const init = async (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas, true);
  const createScene = async () => {
    const scene = new Scene(engine);
    //scene.clearColor = Color3.White();

    var globe = await SceneLoader.ImportMeshAsync(
      "earth",
      "/Earth-Final/",
      "earth-bnw.gltf",
      scene
    );
    console.log("globe", globe);

    let globeMat = globe.meshes[0];
    globeMat.position.y = -20;
    // var gl = new GlowLayer("glow", scene);
    // gl.intensity = 100;

    const camera = new ArcRotateCamera(
      "Camera",
      (3 * -Math.PI) / 2,
      Math.PI / 4,
      150,
      Vector3.Zero()
    );
    camera.useFramingBehavior = true;
    camera.framingBehavior.defaultElevation = Math.PI / 4;
    camera.framingBehavior.elevationReturnTime = 500;
    camera.framingBehavior.elevationReturnWaitTime = 200;

    camera.attachControl(canvas, true);
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 1.5;
    camera.autoRotationBehavior.idleRotationWaitTime = 500;
    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(1, 0, 0),
      scene
    );
    hemiLight.diffuse = pink;
    hemiLight.groundColor = blue;
    hemiLight.intensity = 7;
    hemiLight.specular = purple;

    return scene;
  };
  const scene = await createScene();
  engine.runRenderLoop(() => {
    scene.render();
  });
};
export default init;
