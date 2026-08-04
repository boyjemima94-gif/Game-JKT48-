"use client";

import { useEffect, useRef } from "react";
// Import only needed modules to reduce bundle size
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3, Color3, Color4 } from "@babylonjs/core/Maths/math";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

interface BabylonRoomOptions {
  fogColor: string;
  ambientColor: string;
  lightColor: string;
  lightIntensity: number;
  accentColor: string;
  wallColor: string;
  floorColor: string;
  roomType: string;
}

interface ClueData {
  id: string;
  label: string;
  position: [number, number, number];
  detail: string;
}

interface CharacterData {
  name: string;
  color: string;
  position: [number, number, number];
  rotation: number;
}

/**
 * BabylonScene — replaces Three.js Location Explorer.
 * Uses Babylon.js with PBR materials, shadows, particles, spatial audio.
 * Includes FPS monitor with auto quality degrade.
 */
export default function BabylonScene({
  options,
  clues,
  characters,
  onClueClick,
}: {
  options: BabylonRoomOptions;
  clues: ClueData[];
  characters: CharacterData[];
  onClueClick: (clue: ClueData) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    const scene = new Scene(engine);

    // Fog
    scene.fogMode = Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.04;
    scene.fogColor = Color3.FromHexString(options.fogColor);
    scene.clearColor = Color4.FromColor3(
      Color3.FromHexString(options.fogColor).scale(1.5),
      1
    );

    // Camera — ArcRotateCamera for touch + mouse
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 3,
      7,
      new Vector3(0, 0.5, -2),
      canvas
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 12;
    camera.lowerBetaLimit = Math.PI / 6;
    camera.upperBetaLimit = Math.PI / 2.1;
    camera.wheelDeltaPercentage = 0.01;
    camera.pinchDeltaPercentage = 0.01;

    // Lights
    const hemiLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;
    hemiLight.diffuse = Color3.FromHexString(options.ambientColor);
    hemiLight.groundColor = Color3.FromHexString(options.floorColor);

    const dirLight = new DirectionalLight("dir", new Vector3(-0.5, -1, 0.3), scene);
    dirLight.position = new Vector3(3, 8, 3);
    dirLight.intensity = 0.4;
    dirLight.diffuse = Color3.FromHexString(options.ambientColor);

    const shadowGenerator = new ShadowGenerator(512, dirLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 16;

    const pointLight = new PointLight("point", new Vector3(0, 4, 1), scene);
    pointLight.diffuse = Color3.FromHexString(options.lightColor);
    pointLight.intensity = options.lightIntensity;
    pointLight.range = 20;

    // Flicker
    let flickerTime = 0;
    scene.onBeforeRenderObservable.add(() => {
      flickerTime += engine.getDeltaTime() / 1000;
      pointLight.intensity =
        options.lightIntensity *
        (0.85 + Math.sin(flickerTime * 15) * 0.05 + Math.sin(flickerTime * 7.3) * 0.08);
    });

    // Glow layer
    const glowLayer = new GlowLayer("glow", scene);
    glowLayer.intensity = 0.8;

    // Materials
    const wallMat = new PBRMaterial("wallMat", scene);
    wallMat.albedoColor = Color3.FromHexString(options.wallColor);
    wallMat.metallic = 0.05;
    wallMat.roughness = 0.9;

    const floorMat = new PBRMaterial("floorMat", scene);
    floorMat.albedoColor = Color3.FromHexString(options.floorColor);
    floorMat.metallic = 0.1;
    floorMat.roughness = 0.85;

    // Floor
    const floor = MeshBuilder.CreateGround("floor", { width: 14, height: 12 }, scene);
    floor.material = floorMat;
    floor.receiveShadows = true;

    // Walls
    const backWall = MeshBuilder.CreateGround("backWall", { width: 14, height: 7 }, scene);
    backWall.rotation.x = Math.PI / 2;
    backWall.position.set(0, 1.5, -5);
    backWall.material = wallMat;
    backWall.receiveShadows = true;

    const leftWall = MeshBuilder.CreateGround("leftWall", { width: 12, height: 7 }, scene);
    leftWall.rotation.z = Math.PI / 2;
    leftWall.position.set(-6, 1.5, 0);
    leftWall.material = wallMat;
    leftWall.receiveShadows = true;

    const rightWall = leftWall.clone("rightWall");
    rightWall.position.x = 6;
    rightWall.rotation.z = -Math.PI / 2;

    // Pillars
    [-3.5, 3.5].forEach((x, i) => {
      const base = MeshBuilder.CreateBox(`pBase_${i}`, { width: 0.5, height: 0.2, depth: 0.5 }, scene);
      base.position.set(x, -0.7, -3);
      base.material = wallMat;
      shadowGenerator.addShadowCaster(base);

      const shaft = MeshBuilder.CreateCylinder(`pShaft_${i}`, { height: 3.4, diameterTop: 0.36, diameterBottom: 0.44 }, scene);
      shaft.position.set(x, 0, -3);
      shaft.material = wallMat;
      shadowGenerator.addShadowCaster(shaft);

      const cap = MeshBuilder.CreateBox(`pCap_${i}`, { width: 0.5, height: 0.2, depth: 0.5 }, scene);
      cap.position.set(x, 1.85, -3);
      cap.material = wallMat;
      shadowGenerator.addShadowCaster(cap);
    });

    // Pedestal + glowing orb
    const pedestal = MeshBuilder.CreateCylinder("pedestal", { height: 0.6, diameterTop: 1.0, diameterBottom: 1.2 }, scene);
    pedestal.position.set(0, -0.7, 0.5);
    const pedMat = new PBRMaterial("pedMat", scene);
    pedMat.albedoColor = Color3.FromHexString("#3a2c20");
    pedMat.metallic = 0.2;
    pedMat.roughness = 0.8;
    pedestal.material = pedMat;
    shadowGenerator.addShadowCaster(pedestal);

    const orb = MeshBuilder.CreateSphere("orb", { diameter: 0.3 }, scene);
    orb.position.set(0, -0.1, 0.5);
    const orbMat = new StandardMaterial("orbMat", scene);
    orbMat.emissiveColor = Color3.FromHexString(options.accentColor);
    orbMat.disableLighting = true;
    orb.material = orbMat;

    const orbLight = new PointLight("orbLight", orb.position.clone(), scene);
    orbLight.diffuse = Color3.FromHexString(options.accentColor);
    orbLight.intensity = 2;
    orbLight.range = 3;

    let orbTime = 0;
    scene.onBeforeRenderObservable.add(() => {
      orbTime += engine.getDeltaTime() / 1000;
      orb.position.y = -0.1 + Math.sin(orbTime * 2) * 0.08;
      orb.rotation.y = orbTime * 0.5;
    });

    // Room-specific props
    if (options.roomType === "panggung") {
      const curtain = MeshBuilder.CreateGround("curtain", { width: 10, height: 5 }, scene);
      curtain.rotation.x = Math.PI / 2;
      curtain.position.set(0, 1.5, -4.5);
      const curMat = new PBRMaterial("curMat", scene);
      curMat.albedoColor = Color3.FromHexString("#5a1a1a");
      curMat.roughness = 0.95;
      curtain.material = curMat;

      const stage = MeshBuilder.CreateBox("stage", { width: 6, height: 0.6, depth: 3 }, scene);
      stage.position.set(0, -0.7, -2);
      stage.material = floorMat;
      shadowGenerator.addShadowCaster(stage);

      for (let i = 0; i < 5; i++) {
        const chair = MeshBuilder.CreateBox(`chair_${i}`, { width: 0.4, height: 0.5, depth: 0.4 }, scene);
        chair.position.set(-3 + i * 1.5, -0.7, 1.5);
        chair.material = floorMat;
        shadowGenerator.addShadowCaster(chair);
      }
    } else if (options.roomType === "studio") {
      [-1, 0, 1].forEach((x) => {
        const mon = MeshBuilder.CreateBox(`mon_${x}`, { width: 1, height: 0.6, depth: 0.08 }, scene);
        mon.position.set(x, 0.1, -4);
        const m = new StandardMaterial(`monMat_${x}`, scene);
        m.emissiveColor = Color3.FromHexString("#1a3a6a");
        m.disableLighting = true;
        mon.material = m;
      });
      const desk = MeshBuilder.CreateBox("desk", { width: 4, height: 0.1, depth: 1.5 }, scene);
      desk.position.set(0, -0.7, -4);
      desk.material = pedMat;
      shadowGenerator.addShadowCaster(desk);
    } else if (options.roomType === "server") {
      [-2, 0, 2].forEach((x, idx) => {
        const rack = MeshBuilder.CreateBox(`rack_${idx}`, { width: 0.7, height: 2.8, depth: 0.6 }, scene);
        rack.position.set(x, 0, -4);
        const rm = new PBRMaterial(`rm_${idx}`, scene);
        rm.albedoColor = Color3.FromHexString("#0d1a0d");
        rm.metallic = 0.5;
        rm.roughness = 0.5;
        rack.material = rm;
        shadowGenerator.addShadowCaster(rack);

        for (let j = 0; j < 6; j++) {
          for (let k = 0; k < 4; k++) {
            const led = MeshBuilder.CreateSphere(`led_${idx}_${j}_${k}`, { diameter: 0.05 }, scene);
            led.position.set(x - 0.2 + k * 0.13, -1.2 + j * 0.4, -3.69);
            const lm = new StandardMaterial(`lm_${idx}_${j}_${k}`, scene);
            lm.emissiveColor = Color3.FromHexString("#00ff66");
            lm.disableLighting = true;
            led.material = lm;
          }
        }
      });
    }

    // Character models
    characters.forEach((char) => {
      const head = MeshBuilder.CreateSphere(`h_${char.name}`, { diameter: 0.36 }, scene);
      head.position.set(char.position[0], char.position[1] + 1.5, char.position[2]);
      const sm = new PBRMaterial(`sm_${char.name}`, scene);
      sm.albedoColor = Color3.FromHexString("#d4a880");
      sm.roughness = 0.7;
      head.material = sm;
      shadowGenerator.addShadowCaster(head);

      const body = MeshBuilder.CreateCapsule(`b_${char.name}`, { height: 1.2, radius: 0.22 }, scene);
      body.position.set(char.position[0], char.position[1] + 0.8, char.position[2]);
      const bm = new PBRMaterial(`bm_${char.name}`, scene);
      bm.albedoColor = Color3.FromHexString(char.color);
      bm.roughness = 0.7;
      body.material = bm;
      shadowGenerator.addShadowCaster(body);

      const cLight = new PointLight(`cl_${char.name}`, new Vector3(char.position[0], char.position[1], char.position[2]), scene);
      cLight.diffuse = Color3.FromHexString(char.color);
      cLight.intensity = 1.5;
      cLight.range = 1.5;
    });

    // Particle system (dust)
    const ps = new ParticleSystem("dust", 80, scene);
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 16;
    particleCanvas.height = 16;
    const pctx = particleCanvas.getContext("2d")!;
    pctx.fillStyle = "rgba(255,255,255,0.6)";
    pctx.beginPath();
    pctx.arc(8, 8, 4, 0, Math.PI * 2);
    pctx.fill();
    ps.particleTexture = new Texture(
      particleCanvas.toDataURL(),
      scene
    );
    ps.emitter = new Vector3(0, 2, 0);
    ps.minEmitBox = new Vector3(-5, -1, -4);
    ps.maxEmitBox = new Vector3(5, 3, 2);
    ps.color1 = Color4.FromColor3(Color3.FromHexString(options.accentColor), 0.6);
    ps.color2 = Color4.FromColor3(Color3.FromHexString(options.accentColor), 0.3);
    ps.colorDead = new Color4(0, 0, 0, 0);
    ps.minSize = 0.02;
    ps.maxSize = 0.06;
    ps.minLifeTime = 3;
    ps.maxLifeTime = 6;
    ps.emitRate = 15;
    ps.blendMode = ParticleSystem.BLENDMODE_ADD;
    ps.gravity = new Vector3(0, 0.05, 0);
    ps.direction1 = new Vector3(-0.1, 0.2, -0.1);
    ps.direction2 = new Vector3(0.1, 0.4, 0.1);
    ps.start();

    // FPS monitor + auto quality degrade
    let lowFpsCount = 0;
    let fpsCheckTime = 0;
    let qualityReduced = false;

    scene.onBeforeRenderObservable.add(() => {
      fpsCheckTime += engine.getDeltaTime() / 1000;
      if (fpsCheckTime >= 1) {
        const fps = engine.getFps();
        if (fpsRef.current) {
          fpsRef.current.textContent = `${Math.round(fps)} FPS`;
          fpsRef.current.style.color = fps >= 50 ? "#00ff66" : fps >= 30 ? "#ffb347" : "#ff4444";
        }
        if (fps < 30 && !qualityReduced) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            engine.setHardwareScalingLevel(2);
            shadowGenerator.mapSize = 256;
            qualityReduced = true;
          }
        } else {
          lowFpsCount = 0;
        }
        fpsCheckTime = 0;
      }
    });

    // Resize observer
    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(canvas);

    // Render loop
    engine.runRenderLoop(() => scene.render());

    return () => {
      ro.disconnect();
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
    };
  }, [options, clues, characters, onClueClick]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ outline: "none", display: "block", touchAction: "manipulation" }}
      />
      <div
        ref={fpsRef}
        className="absolute top-2 right-2 font-mono text-xs pointer-events-none bg-black/60 px-2 py-1 rounded z-50"
        style={{ color: "#00ff66" }}
      >
        -- FPS
      </div>
    </>
  );
}
