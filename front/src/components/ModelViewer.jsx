import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

function FitCameraToObject({ object }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!object) return;

    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

    camera.position.set(center.x, center.y, cameraZ * 0.6);
    camera.lookAt(center);
    if (controls) {
      controls.target.copy(center);
      controls.update();
    }
  }, [object, camera, controls]);

  return null;
}

function Model({ url }) {
  const [object, setObject] = useState(null);

  useEffect(() => {
    if (!url) return;

    const ext = url.split(".").pop().toLowerCase();
    const group = new THREE.Group();

    if (ext === "stl") {
      const loader = new STLLoader();
      loader.load(
        url,
        (geometry) => {
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({
            color: "#3e5fff",
            metalness: 0.1,
            roughness: 0.4,
          });
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
          setObject(group);
        },
        undefined,
        (err) => console.error("STL load error:", err)
      );
    } else if (ext === "obj") {
      const loader = new OBJLoader();
      loader.load(
        url,
        (obj) => {
          obj.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: "#3e5fff",
                metalness: 0.1,
                roughness: 0.4,
              });
            }
          });
          group.add(obj);
          setObject(group);
        },
        undefined,
        (err) => console.error("OBJ load error:", err)
      );
    } else {
      console.warn("Unsupported model type:", ext);
    }

    return () => group.clear();
  }, [url]);

  return (
    <>
      {object && <primitive object={object} />}
      {object && <FitCameraToObject object={object} />}
    </>
  );
}

export default function ModelViewer({ url }) {
  if (!url)
    return (
      <div className="hero-3d-placeholder">
        <span>3D Scene Placeholder</span>
      </div>
    );

  return (
    <div
      className="hero-3d-placeholder"
      style={{ border: "none", width: "100%", height: "340px" }}
    >
      <Canvas camera={{ position: [1, 1, 3], fov: 90 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model url={url} />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}
