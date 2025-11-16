🔥 LE DOSSIER N'EXISTE PAS ! ON VA CRÉER UNE PAGE HTML REACT !
bashcd ~/Desktop/hybrid-master-63

# Créer le dossier components
mkdir -p components

# Créer le composant
cat > components/TrapBarThreeJS.jsx << 'EOFJSX'
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function TrapBarThreeJS() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xFFD700,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.003;
        positions[i] += Math.cos(time + i) * 0.002;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    setMounted(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return React.createElement('div', { style: { position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' } },
    React.createElement('div', { ref: containerRef, style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } }),
    mounted && React.createElement('div', { 
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        padding: '20px',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflowY: 'auto'
      }
    }, 'CONTENT HERE')
  );
}
