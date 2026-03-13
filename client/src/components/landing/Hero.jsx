import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight, Sparkles, CheckCircle2, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mountEl = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mountEl.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    scene.add(new THREE.HemisphereLight(0x0f172a, 0x064e3b, 1));

    const dirLight1 = new THREE.DirectionalLight(0x34d399, 1);
    dirLight1.position.set(10, 10, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xfbbf24, 0.5);
    dirLight2.position.set(-10, -10, -5);
    scene.add(dirLight2);

    // Object Construction
    const mainGroup = new THREE.Group();
    const floatGroup = new THREE.Group();
    mainGroup.add(floatGroup);
    scene.add(mainGroup);

    const orbGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x022c22,
      emissiveIntensity: 2,
      roughness: 0.2,
      metalness: 0.8
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    floatGroup.add(orb);

    const shellGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.5
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    floatGroup.add(shell);

    const ringGeo1 = new THREE.TorusGeometry(2.2, 0.01, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x34d399,
      emissiveIntensity: 1.5
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    const ring1Group = new THREE.Group();
    ring1Group.add(ring1);
    ring1Group.rotation.x = Math.PI / 2;
    floatGroup.add(ring1Group);

    const ringGeo2 = new THREE.TorusGeometry(2.6, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      emissive: 0x2dd4bf,
      emissiveIntensity: 1
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    const ring2Group = new THREE.Group();
    ring2Group.add(ring2);
    ring2Group.rotation.x = Math.PI / 4;
    floatGroup.add(ring2Group);

    const ringGeo3 = new THREE.TorusGeometry(3, 0.008, 16, 100);
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xfbbf24,
      emissiveIntensity: 2
    });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    const ring3Group = new THREE.Group();
    ring3Group.add(ring3);
    ring3Group.rotation.set(-Math.PI / 4, 0, Math.PI / 4);
    floatGroup.add(ring3Group);

    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x34d399,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    floatGroup.add(particles);

    // Parallax
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = mouseY * Math.PI / 8;
      targetY = mouseX * Math.PI / 8;
    };
    window.addEventListener('mousemove', onMouseMove);

    const resize = () => {
      const w = mountEl.clientWidth;
      const h = mountEl.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mountEl);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.05;
      mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.05;

      floatGroup.position.y = Math.sin(time * 1.5) * 0.15;

      ring1Group.rotation.x = Math.sin(time * 0.2) * 0.5 + Math.PI / 2;
      ring1Group.rotation.y = time * 0.3;

      ring2Group.rotation.y = Math.cos(time * 0.2) * 0.5;
      ring2Group.rotation.z = time * 0.2;

      ring3Group.rotation.x = time * 0.15 - Math.PI / 4;
      ring3Group.rotation.z = Math.sin(time * 0.3) * 0.5 + Math.PI / 4;

      particles.rotation.y = time * 0.05;
      particles.rotation.x = time * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }

      renderer.dispose();
      orbGeo.dispose();
      orbMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

const Hero = () => {
  return (
    <section id="home" className="relative w-full min-h-screen flex items-center bg-[var(--bg-secondary)] overflow-hidden pt-20 lg:pt-0">
      
      {/* Background Gradients/Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        
        {/* GRID LAYOUT: 1 Col Mobile (Text Top), 2 Cols Desktop (Left Text, Right Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Content */}
          <div className="flex flex-col space-y-8 text-left order-1 lg:order-1">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 mt-25 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm text-emerald-700 text-sm font-semibold w-fit">
              <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span>AI-Powered Ancient Wisdom</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold text-[var(--text-main)] leading-[1.1] tracking-tight">
              Ancient Ayurvedic Wisdom <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Powered by Modern AI.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-lg leading-relaxed">
              Unlock the secrets of nature with AI. Get instant herbal remedies, 
              personalized health tracking, and explore our vast library of 
              Ayurveda knowledge.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/auth/login"
                className="group relative px-8 py-4 bg-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Start using PrakritiAI</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <a 
                href="#symptoms"
                className="group px-8 py-4 bg-[var(--bg-card)] text-[var(--text-main)] font-bold text-lg rounded-2xl border border-[var(--border-color)] shadow-md hover:bg-[var(--bg-secondary)] hover:border-emerald-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Ask AI</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: 3D Model */}
          <div className="relative w-full order-2 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-[560px] h-[340px] sm:h-[440px] lg:h-[520px] max-h-[calc(100vh-180px)]">
              {/* Ambient glows (theme-safe) */}
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" aria-hidden="true" />
              <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" aria-hidden="true" />

              {/* Transparent canvas (no card/border so it blends into hero) */}
              <div className="absolute inset-0">
                <ThreeScene />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;