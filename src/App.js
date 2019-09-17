import React, { useState, useEffect, useRef } from 'react';
import THREE from "three";
import './App.css';

function App() {
  const mount = useRef(null);
  const [isAnimating, setAnimating] = useState(true)
  const controls = useRef(null)

  useEffect(()=> {
    let frameId;
    const width = mount.current.clientWidth;
    const height = mount.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    camera.position.z = 5;

    scene.add(cube);
    renderer.setClearColor('#000000')
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      const width = mount.current.clientWidth;
      const height = mount.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      renderScene();
    }

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderScene();
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    mount.current.appendChild(renderer.domElement);
    window.addEventListener('resize', handleResize);
    start();
    controls.current = { start, stop };

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      mount.current.removeChild(renderer.domElement);
      scene.remove(cube);
      geometry.dispose();
      material.dispose();
      window.cancelAnimationFrame(this.requestID);
    }
  }, []);

  useEffect(() => {
    if (isAnimating) {
      controls.current.start()
    } else {
      controls.current.stop()
    }
  }, [isAnimating])

  return (
    <div className="App" ref={mount} onClick={() => setAnimating(!isAnimating)}>
    </div>
  );
}

export default App;
