import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ThreeMFLoader } from "three/addons/loaders/3MFLoader.js";
import { createColorOption } from "./colors.js";

const dialog = document.querySelector("#viewer-dialog");
const title = document.querySelector("#viewer-title");
const viewport = document.querySelector("#viewer-viewport");
const status = document.querySelector("#viewer-status");
const resetButton = document.querySelector("#viewer-reset");
const threeMfLoader = new ThreeMFLoader();
const unitFactors = { micron: 0.001, millimeter: 1, centimeter: 10, inch: 25.4, foot: 304.8, meter: 1000 };
const standardBuildVolumeMm = [256, 256, 256];

let renderer;
let scene;
let camera;
let controls;
let model;
let grid;
const colorOptionsContainer = document.querySelector("#viewer-color-options");
const plateOptionsContainer = document.querySelector("#viewer-plate-options");
let currentMaterial;
let resizeObserver;
let loadVersion = 0;
let initialCameraPosition;
let initialTarget;
let allChildren = [];
let currentPlateId;
let currentInspection;

function resizeRenderer() {
  if (!renderer || viewport.clientWidth === 0 || viewport.clientHeight === 0) {
    return;
  }
  renderer.setSize(viewport.clientWidth, viewport.clientHeight, false);
  camera.aspect = viewport.clientWidth / viewport.clientHeight;
  camera.updateProjectionMatrix();
}

function initializeViewer() {
  if (renderer) {
    return;
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfffdf5);
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 10000);
  renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  viewport.prepend(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2 - 0.03;
  controls.minDistance = 1;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x17201a, 2.4));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
  keyLight.position.set(4, 7, 5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x4277ff, 1.8);
  fillLight.position.set(-5, 3, -4);
  scene.add(fillLight);

  resizeObserver = new ResizeObserver(resizeRenderer);
  resizeObserver.observe(viewport);
}

function clearModel(protectedResources = { geometries: new Set(), materials: new Set(), textures: new Set() }) {
  if (model) {
    scene.remove(model);
    disposeObject(model, protectedResources);
    model = undefined;
  }
  if (grid) {
    scene.remove(grid);
    grid.geometry.dispose();
    grid.material.dispose();
    grid = undefined;
  }
}

function collectResourcesFromChildren(children) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  for (const child of children) {
    child.traverse((node) => {
      if (node.geometry) geometries.add(node.geometry);
      const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
      nodeMaterials.filter(Boolean).forEach((material) => materials.add(material));
    });
  }
  materials.forEach((material) => {
    Object.values(material).forEach((value) => { if (value?.isTexture) textures.add(value); });
  });
  return { geometries, materials, textures };
}

function disposeResources(resources) {
  resources.geometries.forEach((geometry) => geometry.dispose());
  resources.materials.forEach((material) => material.dispose());
  resources.textures.forEach((texture) => texture.dispose());
}

function clearLoadedModel() {
  const resources = collectResourcesFromChildren(allChildren);
  if (model) {
    scene.remove(model);
    model = undefined;
  }
  if (grid) {
    scene.remove(grid);
    grid.geometry.dispose();
    grid.material.dispose();
    grid = undefined;
  }
  disposeResources(resources);
  allChildren = [];
}

function disposeObject(object, protectedResources = { geometries: new Set(), materials: new Set(), textures: new Set() }) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  object.traverse((child) => {
    if (child.geometry) geometries.add(child.geometry);
    const childMaterials = Array.isArray(child.material) ? child.material : [child.material];
    childMaterials.filter(Boolean).forEach((material) => materials.add(material));
  });
  materials.forEach((material) => {
    Object.values(material).forEach((value) => { if (value?.isTexture) textures.add(value); });
  });
  geometries.forEach((geometry) => { if (!protectedResources.geometries.has(geometry)) geometry.dispose(); });
  materials.forEach((material) => { if (!protectedResources.materials.has(material)) material.dispose(); });
  textures.forEach((texture) => { if (!protectedResources.textures.has(texture)) texture.dispose(); });
}

function placeModel(object, referencePlateVolume = standardBuildVolumeMm) {
  object.rotation.x = -Math.PI / 2;
  object.updateMatrixWorld(true);
  const firstBox = new THREE.Box3().setFromObject(object);
  if (firstBox.isEmpty()) throw new Error("Il modello non contiene geometrie visualizzabili.");
  const center = firstBox.getCenter(new THREE.Vector3());
  object.position.add(new THREE.Vector3(-center.x, -firstBox.min.y, -center.z));
  object.updateMatrixWorld(true);
  const finalBox = new THREE.Box3().setFromObject(object);
  const size = finalBox.getSize(new THREE.Vector3());
  const largestDimension = Math.max(size.x, size.y, size.z, 1);
  model = object;
  scene.add(model);

  const gridSize = Math.max(referencePlateVolume[0], referencePlateVolume[1]);
  grid = new THREE.GridHelper(gridSize, 20, 0x17201a, 0x8c938e);
  grid.material.transparent = true;
  grid.material.opacity = 0.45;
  scene.add(grid);

  initialTarget = new THREE.Vector3(0, size.y * 0.35, 0);
  const mobileCameraDistance = window.matchMedia("(max-width: 540px)").matches ? 1.35 : 1;
  initialCameraPosition = new THREE.Vector3(
    largestDimension * 1.35 * mobileCameraDistance,
    largestDimension * 1.05 * mobileCameraDistance,
    largestDimension * 1.55 * mobileCameraDistance,
  );
  camera.near = Math.max(largestDimension / 100, 0.01);
  camera.far = largestDimension * 100;
  controls.minDistance = largestDimension * 0.35;
  controls.maxDistance = largestDimension * 8;
  resetView();
}

function resetView() {
  if (!initialCameraPosition || !initialTarget) {
    return;
  }
  camera.position.copy(initialCameraPosition);
  controls.target.copy(initialTarget);
  camera.updateProjectionMatrix();
  controls.update();
}

function startRendering() {
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
}

function createPlateOption(plate, selected) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "plate-option";
  if (selected) button.classList.add("plate-option--active");
  button.textContent = `Piatto ${plate.id}`;
  button.dataset.plateId = String(plate.id);
  button.addEventListener("click", () => showPlate(plate.id));
  return button;
}

function updatePlateOptionButtons() {
  plateOptionsContainer.querySelectorAll(".plate-option").forEach((button) => {
    button.classList.toggle("plate-option--active", Number(button.dataset.plateId) === currentPlateId);
  });
}

function showPlate(plateId) {
  if (!allChildren.length) return;
  const plates = currentInspection?.plates?.length
    ? currentInspection.plates
    : [{ id: 1, buildItemIndexes: allChildren.map((_child, index) => index) }];
  const plate = plates.find((item) => item.id === plateId) ?? plates[0];
  currentPlateId = plate.id;
  const indexes = new Set(plate.buildItemIndexes);

  const newGroup = new THREE.Group();
  allChildren.forEach((child, index) => {
    if (indexes.has(index)) newGroup.add(child);
  });

  const unitFactor = unitFactors[currentInspection?.unit ?? "millimeter"];
  if (!unitFactor) throw new Error("Unita 3MF non supportata.");
  newGroup.scale.setScalar(unitFactor);

  const protectedResources = collectResourcesFromChildren(allChildren);
  clearModel(protectedResources);
  placeModel(newGroup, currentInspection?.referencePlate?.volumeMm);
  updatePlateOptionButtons();
}

export async function openModelViewer(product, colorHex = "#ffffff", availableColors = []) {
  initializeViewer();
  const currentLoad = ++loadVersion;
  clearLoadedModel();
  currentMaterial = undefined;
  currentPlateId = undefined;
  currentInspection = product.inspection ?? null;
  plateOptionsContainer.replaceChildren();
  title.textContent = product.name;
  viewport.setAttribute("aria-label", `Visualizzatore 3D di ${product.name}`);
  viewport.classList.add("viewer-viewport--loading");
  status.hidden = false;
  status.textContent = "Caricamento modello...";
  resetButton.disabled = true;

  colorOptionsContainer.replaceChildren();
  const normalizedHex = colorHex.toLowerCase();
  let selectedIndex = availableColors.findIndex((color) => color.hexValue.toLowerCase() === normalizedHex);
  if (selectedIndex === -1) selectedIndex = 0;
  availableColors.forEach((color, index) => {
    colorOptionsContainer.append(
      createColorOption(color, "viewer-color", index === selectedIndex, {
        required: false,
        onChange: (selectedColor) => {
          if (currentMaterial) {
            currentMaterial.color.setHex(Number.parseInt(selectedColor.hexValue.replace("#", ""), 16));
          }
        },
      }),
    );
  });

  if (!dialog.open) {
    dialog.showModal();
  }
  requestAnimationFrame(() => {
    resizeRenderer();
    startRendering();
  });

  let loadedObject;
  try {
    if (!product.modelUrl) {
      throw new Error("Il prodotto non ha un file modello associato.");
    }
    if (!product.modelUrl.toLowerCase().endsWith(".3mf")) {
      throw new Error("Il viewer supporta solo file 3MF.");
    }
    loadedObject = await threeMfLoader.loadAsync(product.modelUrl);
    if (currentLoad !== loadVersion) {
      disposeObject(loadedObject);
      return;
    }

    allChildren = [...loadedObject.children];
    const modelColor = Number.parseInt((availableColors[selectedIndex]?.hexValue ?? colorHex).replace("#", ""), 16);
    currentMaterial = new THREE.MeshStandardMaterial({ color: modelColor, roughness: 0.72, metalness: 0.02, flatShading: true });
    allChildren.forEach((child) => {
      child.traverse((node) => {
        if (node.isMesh) node.material = currentMaterial;
      });
    });

    const plates = currentInspection?.plates ?? [];
    if (plates.length > 1) {
      plates.forEach((plate, index) => {
        plateOptionsContainer.append(createPlateOption(plate, index === 0));
      });
    }

    showPlate(currentInspection?.previewPlate ?? plates[0]?.id ?? 1);
    viewport.classList.remove("viewer-viewport--loading");
    status.hidden = true;
    resetButton.disabled = false;
  } catch (error) {
    if (loadedObject && loadedObject !== model) disposeObject(loadedObject);
    console.error(error);
    viewport.classList.remove("viewer-viewport--loading");
    viewport.classList.add("viewer-viewport--error");
    status.textContent = error.message || "Impossibile caricare il modello 3D.";
  }
}

resetButton.addEventListener("click", resetView);
dialog.addEventListener("close", () => {
  loadVersion += 1;
  renderer?.setAnimationLoop(null);
  clearLoadedModel();
  viewport.classList.remove("viewer-viewport--error", "viewer-viewport--loading");
});
