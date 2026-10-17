import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeReviewsCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId;
    let isVisible = true;

    // Dimensions
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    // Group for all rotating objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Globe Sphere Particles (Destination Nodes)
    const globeRadius = 9;
    const particleCount = 180;
    const globePositions = new Float32Array(particleCount * 3);
    const globeColors = new Float32Array(particleCount * 3);

    const tourOrange = new THREE.Color(0xfd5b01);
    const tourGold = new THREE.Color(0xf59e0b);
    const tourWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      // Golden Spiral distribution on sphere surface
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = globeRadius * Math.cos(theta) * Math.sin(phi);
      const y = globeRadius * Math.sin(theta) * Math.sin(phi);
      const z = globeRadius * Math.cos(phi);

      globePositions[i * 3] = x;
      globePositions[i * 3 + 1] = y;
      globePositions[i * 3 + 2] = z;

      // Color variation between orange, gold, and white
      const rand = Math.random();
      const col = rand > 0.6 ? tourOrange : rand > 0.25 ? tourGold : tourWhite;
      globeColors[i * 3] = col.r;
      globeColors[i * 3 + 1] = col.g;
      globeColors[i * 3 + 2] = col.b;
    }

    const globeGeometry = new THREE.BufferGeometry();
    globeGeometry.setAttribute('position', new THREE.BufferAttribute(globePositions, 3));
    globeGeometry.setAttribute('color', new THREE.BufferAttribute(globeColors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.5, 'rgba(253,91,1,0.6)');
    grad.addColorStop(1, 'rgba(253,91,1,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const globeMaterial = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const globePoints = new THREE.Points(globeGeometry, globeMaterial);
    mainGroup.add(globePoints);

    // 2. Latitude Orbit Rings (Flight / Exploration Routes)
    const ringMaterials = [];
    const ringRadii = [9.05, 9.15, 9.25];
    const ringRotations = [
      { x: 0.4, y: 0.2 },
      { x: -0.6, y: 0.5 },
      { x: 0.9, y: -0.3 }
    ];

    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r, r + 0.04, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xfd5b01 : 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
      });
      ringMaterials.push(ringMat);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = ringRotations[idx].x;
      ringMesh.rotation.y = ringRotations[idx].y;
      mainGroup.add(ringMesh);
    });

    // 3. Ambient Floating Stardust in background
    const starCount = 120;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 50;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.4,
      color: 0xfd5b01,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = mount.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetX = ((x / rect.width) * 2 - 1) * 0.4;
      targetY = (-(y / rect.height) * 2 + 1) * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause rendering when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);

    // Animation Loop
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse follow (damping)
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Constant gentle rotation + mouse tilt
      mainGroup.rotation.y = elapsedTime * 0.15 + mouseX;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.15 - mouseY;

      // Starfield subtle shimmer
      starPoints.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }

      // Dispose Three.js resources
      globeGeometry.dispose();
      globeMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      particleTexture.dispose();
      ringMaterials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none opacity-40 md:opacity-55"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
