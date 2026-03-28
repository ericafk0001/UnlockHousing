"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(-5, -3, 30);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.filter = "blur(128px)";
    renderer.domElement.style.opacity = "0.8";

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.65);
    keyLight.position.set(2, 3, 6);
    scene.add(ambientLight, keyLight);

    const orbCluster = new THREE.Group();
    scene.add(orbCluster);

    const orbSpecs = [
      { color: 0xff6b6b, radius: 5.1, orbit: 6.85, speed: 0.4, phase: 0 },
      {
        color: 0x2563eb,
        radius: 5.1,
        orbit: 6.15,
        speed: 0.4,
        phase: Math.PI * 0.66,
      },
      {
        color: 0x10b981,
        radius: 5.1,
        orbit: 6.98,
        speed: 0.4,
        phase: Math.PI * 1.24,
      },
    ] as const;
    const spheres: THREE.Mesh[] = [];

    orbSpecs.forEach((spec) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(spec.radius, 56, 56),
        new THREE.MeshStandardMaterial({
          color: spec.color,
          roughness: 0.4,
          metalness: 0.12,
          emissive: spec.color,
          emissiveIntensity: 0.03,
        }),
      );

      sphere.position.z = 0;
      orbCluster.add(sphere);
      spheres.push(sphere);
    });

    const setRendererSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) {
        return;
      }
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Keep the orbs visually anchored near the right side of the viewport.
      orbCluster.position.x = Math.max(2.2, camera.aspect * 2.55);
      orbCluster.position.y = 0;
      orbCluster.position.z = 0;
    };

    setRendererSize();

    const resizeObserver = new ResizeObserver(() => {
      setRendererSize();
    });
    resizeObserver.observe(container);

    const startTime = performance.now();
    let animationFrame = 0;

    const tick = () => {
      const t = (performance.now() - startTime) / 1000;
      spheres.forEach((sphere, index) => {
        const spec = orbSpecs[index];
        const theta = t * spec.speed + spec.phase;
        sphere.position.x = Math.cos(theta) * spec.orbit;
        sphere.position.y = Math.sin(theta) * spec.orbit * 0.6;
        sphere.scale.setScalar(1 + Math.sin(theta * 1.7) * 0.02);
      });

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      spheres.forEach((sphere) => {
        sphere.geometry.dispose();
        const material = sphere.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material.dispose();
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 bottom-0 left-0 right-0 -z-10 hidden md:block"
    />
  );
}
