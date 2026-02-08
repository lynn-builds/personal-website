import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Item = {
  id: string;
  label: string;
  kind: "core" | "skill" | "hobby";
  color: string;
  description: string;
  orbit?: number;
  size: number;
  speed?: number;
};

const items: Item[] = [
  {
    id: "core",
    label: "Core",
    kind: "core",
    color: "#f7f5ff",
    description:
      "I build things that look good, feel intentional, and are a pleasure to work with. My north star is creating software that brings people happiness without adding financial pressure.",
    size: 1.15,
  },
  {
    id: "frontend",
    label: "Frontend Systems",
    kind: "skill",
    color: "#ff9ad5",
    description: "Design systems, component libraries, and interface architecture.",
    orbit: 2.6,
    size: 0.45,
    speed: 0.006,
  },
  {
    id: "backend",
    label: "Backend Collaboration",
    kind: "skill",
    color: "#8fe6ff",
    description: "APIs that are predictable, documented, and nice to integrate.",
    orbit: 3.2,
    size: 0.38,
    speed: 0.0045,
  },
  {
    id: "ml",
    label: "ML Prototypes",
    kind: "skill",
    color: "#ffd36e",
    description: "Turning model outputs into interpretable, human-friendly tools.",
    orbit: 3.9,
    size: 0.34,
    speed: 0.0036,
  },
  {
    id: "dataviz",
    label: "Data Visualization",
    kind: "skill",
    color: "#7aa6ff",
    description: "Storytelling with data that feels editorial, not overwhelming.",
    orbit: 4.5,
    size: 0.4,
    speed: 0.003,
  },
  {
    id: "yoga",
    label: "Yoga",
    kind: "hobby",
    color: "#b28dff",
    description: "A daily reset for clarity and patience.",
    orbit: 5.1,
    size: 0.3,
    speed: 0.0026,
  },
  {
    id: "camping",
    label: "Camping",
    kind: "hobby",
    color: "#63c17e",
    description: "Off-grid quiet time and a love for soft morning light.",
    orbit: 5.7,
    size: 0.28,
    speed: 0.0022,
  },
  {
    id: "photo",
    label: "Photography",
    kind: "hobby",
    color: "#ff7a7a",
    description: "Chasing texture, shadow, and imperfect symmetry.",
    orbit: 6.2,
    size: 0.27,
    speed: 0.0018,
  },
  {
    id: "sound",
    label: "Ambient Music",
    kind: "hobby",
    color: "#7affb1",
    description: "Soundscapes that make deep work feel lighter.",
    orbit: 6.8,
    size: 0.26,
    speed: 0.0016,
  },
];

export default function AboutScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>("core");
  const activeIdRef = useRef(activeId);
  const focusedIdRef = useRef<string | null>(null);
  const focusTargetRef = useRef<THREE.Vector3 | null>(null);
  const focusCameraRef = useRef<THREE.Vector3 | null>(null);
  const focusByIdRef = useRef<
    ((id: string) => void) | null
  >(null);

  const active = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [activeId]
  );

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      40,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 16;
    controls.maxPolarAngle = Math.PI * 0.78;
    controls.target.set(0, 0, 0);
    controls.update();
    const defaultCameraPos = camera.position.clone();
    const defaultTarget = controls.target.clone();

    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    const hemi = new THREE.HemisphereLight(0x9ee6ff, 0x3b2a6f, 0.5);
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(8, 10, 6);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 40;
    const rim = new THREE.DirectionalLight(0x9ee6ff, 0.9);
    rim.position.set(-8, 5, -5);
    const magenta = new THREE.PointLight(0xff66cc, 0.9, 30);
    magenta.position.set(4, 1.5, 4);
    const aqua = new THREE.PointLight(0x20d6c4, 0.8, 30);
    aqua.position.set(-5, 2, 2);
    const violet = new THREE.PointLight(0x7b2ee9, 0.7, 30);
    violet.position.set(-2, 3, -6);
    scene.add(ambient, hemi, key, rim, magenta, aqua, violet);

    const starCount = 500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 30;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      opacity: 0.7,
      transparent: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const particleGroup = new THREE.Group();
    const particleGeometry = new THREE.TetrahedronGeometry(0.04, 0);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      shininess: 60,
    });
    for (let i = 0; i < 220; i += 1) {
      const mesh = new THREE.Mesh(particleGeometry, particleMaterial);
      mesh.userData = { particle: true };
      const radius = 8 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      mesh.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
      const scale = 0.5 + Math.random() * 0.7;
      mesh.scale.set(scale, scale, scale);
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      particleGroup.add(mesh);
    }
    scene.add(particleGroup);

    const grid = new THREE.GridHelper(22, 26, 0xffffff, 0xffffff);
    (grid.material as THREE.Material).opacity = 0.08;
    (grid.material as THREE.Material).transparent = true;
    grid.position.y = -2.1;
    grid.receiveShadow = true;
    scene.add(grid);

    const orbitGroup = new THREE.Group();
    const planetGroup = new THREE.Group();
    scene.add(orbitGroup, planetGroup);

    const sunItem = items[0];
    const sunGeometry = new THREE.IcosahedronGeometry(sunItem.size, 1);
    const sunMaterial = new THREE.MeshPhongMaterial({
      color: sunItem.color,
      emissive: new THREE.Color("#ffd1ff"),
      emissiveIntensity: 0.5,
      shininess: 80,
      flatShading: true,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = { id: sunItem.id };
    sun.castShadow = true;
    sun.receiveShadow = true;
    scene.add(sun);

    const sunWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(sunGeometry),
      new THREE.LineBasicMaterial({ color: "#ffffff", opacity: 0.35, transparent: true })
    );
    sunWire.scale.setScalar(1.15);
    scene.add(sunWire);

    const planets: { id: string; mesh: THREE.Mesh; orbit: number; speed: number; angle: number }[] = [];

    items.slice(1).forEach((item, index) => {
      const orbitRadius = item.orbit ?? 3 + index * 0.6;
      const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 120);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.15,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitMesh.rotation.x = Math.PI / 2;
      orbitGroup.add(orbitMesh);

      const geometry = new THREE.IcosahedronGeometry(item.size, 0);
      const material = new THREE.MeshPhongMaterial({
        color: item.color,
        shininess: 70,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { id: item.id };
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      planetGroup.add(mesh);

      planets.push({
        id: item.id,
        mesh,
        orbit: orbitRadius,
        speed: item.speed ?? 0.003,
        angle: (index / items.length) * Math.PI * 2,
      });
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const focusById = (id: string) => {
      const hit = id === "core"
        ? sun
        : (planetGroup.children.find((child) => child.userData?.id === id) as THREE.Mesh | undefined);
      if (!hit) return;

      setActiveId(id);
      const isSame = focusedIdRef.current === id;
      if (isSame) {
        focusedIdRef.current = null;
        focusTargetRef.current = defaultTarget.clone();
        focusCameraRef.current = defaultCameraPos.clone();
        return;
      }

      focusedIdRef.current = id;
      const target = hit.position.clone();
      const direction = target.clone().normalize();
      const distance = id === "core" ? 5.5 : 4.2;
      const cameraOffset = new THREE.Vector3(0, 1.1, 0);
      focusTargetRef.current = target;
      focusCameraRef.current = target.clone().add(direction.multiplyScalar(distance)).add(cameraOffset);
    };

    focusByIdRef.current = focusById;

    const onPointerDown = (event: PointerEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects([sun, ...planetGroup.children]);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const id = hit.userData.id as string | undefined;
        if (!id) return;
        focusById(id);
      }
    };

    mountRef.current.addEventListener("pointerdown", onPointerDown);

    let frameId = 0;
    const tick = () => {
      sun.rotation.y += 0.004;
      sun.rotation.x += 0.002;
      sunWire.rotation.y -= 0.002;

      const isFocused = focusedIdRef.current !== null;
      planets.forEach((planet) => {
        if (!isFocused) {
          planet.angle += planet.speed;
          planet.mesh.position.set(
            Math.cos(planet.angle) * planet.orbit,
            0,
            Math.sin(planet.angle) * planet.orbit
          );
        }
        const isActive = planet.id === activeIdRef.current;
        const targetScale = isActive ? 1.35 : 1;
        planet.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        if (planet.mesh.material instanceof THREE.MeshPhongMaterial) {
          planet.mesh.material.emissive.set(isActive ? planet.mesh.material.color : new THREE.Color(0, 0, 0));
          planet.mesh.material.emissiveIntensity = isActive ? 0.35 : 0;
        }
      });

      const sunIsActive = activeIdRef.current === "core";
      const sunScale = sunIsActive ? 1.08 : 1;
      sun.scale.lerp(new THREE.Vector3(sunScale, sunScale, sunScale), 0.08);
      sunWire.scale.lerp(new THREE.Vector3(sunScale * 1.15, sunScale * 1.15, sunScale * 1.15), 0.08);
      if (sun.material instanceof THREE.MeshPhongMaterial) {
        sun.material.emissiveIntensity = sunIsActive ? 0.65 : 0.45;
      }

      stars.rotation.y -= 0.0006;
      particleGroup.rotation.y -= 0.0012;
      particleGroup.rotation.x += 0.0005;
      if (!isFocused) orbitGroup.rotation.y += 0.0008;

      if (focusTargetRef.current && focusCameraRef.current) {
        controls.target.lerp(focusTargetRef.current, 0.08);
        camera.position.lerp(focusCameraRef.current, 0.08);
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      mountRef.current?.removeEventListener("pointerdown", onPointerDown);
      controls.dispose();
      renderer.dispose();
      [sun, sunWire, ...planetGroup.children, ...orbitGroup.children, ...particleGroup.children, grid].forEach(
        (obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.userData?.particle) return;
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
        if (obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      }
      );
      starGeometry.dispose();
      starMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="about-scene grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="about-scene__canvas" ref={mountRef} />
      <div className="space-y-4">
        <div className="terminal-panel about-info rounded-2xl p-6">
          <div className="text-xs font-mono uppercase tracking-wide">active node</div>
          <h3 className="mt-3 text-2xl font-semibold">{active.label}</h3>
          <p className="mt-2 text-sm text-black/80">{active.description}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <button
              key={item.id}
              className={`pill border-black text-left ${
                activeId === item.id ? "bg-black text-white" : "bg-white"
              }`}
              onClick={() => focusByIdRef.current?.(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
