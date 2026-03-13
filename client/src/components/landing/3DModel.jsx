import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Leaf, Sparkles as SparkleIcon, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

// ==========================================
// PURE THREE.JS 3D SCENE COMPONENT
// ==========================================
// We bypass @react-three/fiber entirely to fix the reconciler sandbox error.

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting Setup
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    scene.add(new THREE.HemisphereLight(0x0f172a, 0x064e3b, 1));
    
    const dirLight1 = new THREE.DirectionalLight(0x34d399, 1);
    dirLight1.position.set(10, 10, 5);
    scene.add(dirLight1);
    
    const dirLight2 = new THREE.DirectionalLight(0xfbbf24, 0.5);
    dirLight2.position.set(-10, -10, -5);
    scene.add(dirLight2);

    // 3. Object Construction
    const mainGroup = new THREE.Group();
    const floatGroup = new THREE.Group();
    mainGroup.add(floatGroup);
    scene.add(mainGroup);

    // Core AI Energy Orb
    const orbGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const orbMat = new THREE.MeshStandardMaterial({ 
      color: 0x059669, emissive: 0x022c22, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    floatGroup.add(orb);

    // Sacred Geometry Inner Shell
    const shellGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const shellMat = new THREE.MeshStandardMaterial({ 
      color: 0xfbbf24, wireframe: true, transparent: true, opacity: 0.15, emissive: 0xfbbf24, emissiveIntensity: 0.5 
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    floatGroup.add(shell);

    // Neural Pathways (Rings)
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x34d399, emissiveIntensity: 1.5 });
    const ringGeo1 = new THREE.TorusGeometry(2.2, 0.01, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    const ring1Group = new THREE.Group();
    ring1Group.add(ring1);
    ring1Group.rotation.x = Math.PI / 2;
    floatGroup.add(ring1Group);

    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0x2dd4bf, emissive: 0x2dd4bf, emissiveIntensity: 1 });
    const ringGeo2 = new THREE.TorusGeometry(2.6, 0.015, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    const ring2Group = new THREE.Group();
    ring2Group.add(ring2);
    ring2Group.rotation.x = Math.PI / 4;
    floatGroup.add(ring2Group);

    const ringMat3 = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xfbbf24, emissiveIntensity: 2 });
    const ringGeo3 = new THREE.TorusGeometry(3, 0.008, 16, 100);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    const ring3Group = new THREE.Group();
    ring3Group.add(ring3);
    ring3Group.rotation.set(-Math.PI / 4, 0, Math.PI / 4);
    floatGroup.add(ring3Group);

    // Healing Energy Particles
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
      size: 0.05, color: 0x34d399, transparent: true, opacity: 0.6, sizeAttenuation: true 
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    floatGroup.add(particles);

    // 4. Mouse Parallax Setup
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = mouseY * Math.PI / 8;
      targetY = mouseX * Math.PI / 8;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 5. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth Parallax
      mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.05;
      mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.05;

      // Manual Floating Animation
      floatGroup.position.y = Math.sin(time * 1.5) * 0.15;

      // Subtle continuous rotation for neural rings
      ring1Group.rotation.x = Math.sin(time * 0.2) * 0.5 + Math.PI / 2;
      ring1Group.rotation.y = time * 0.3;
      
      ring2Group.rotation.y = Math.cos(time * 0.2) * 0.5;
      ring2Group.rotation.z = time * 0.2;

      ring3Group.rotation.x = time * 0.15 - Math.PI / 4;
      ring3Group.rotation.z = Math.sin(time * 0.3) * 0.5 + Math.PI / 4;

      // Slowly rotate particles
      particles.rotation.y = time * 0.05;
      particles.rotation.x = time * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    // 7. Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose Geometries and Materials to prevent memory leaks
      renderer.dispose();
      orbGeo.dispose(); orbMat.dispose();
      shellGeo.dispose(); shellMat.dispose();
      ringGeo1.dispose(); ringMat1.dispose();
      ringGeo2.dispose(); ringMat2.dispose();
      ringGeo3.dispose(); ringMat3.dispose();
      particleGeo.dispose(); particleMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

// ==========================================
// MAIN UI COMPONENT
// ==========================================

export default function App() {
  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-amber-900/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Mock Navigation */}
      <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Leaf className="w-6 h-6 text-emerald-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
            PrakritiAI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-emerald-300 transition-colors">Dosha Analysis</a>
          <a href="#" className="hover:text-emerald-300 transition-colors">Knowledge Base</a>
          <a href="#" className="hover:text-emerald-300 transition-colors">Community</a>
        </div>
        <button className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-md hover:bg-white/10 transition-all">
          Sign In
        </button>
      </nav>

      {/* Main Hero Container */}
      <main className="relative z-10 container mx-auto px-6 md:px-12 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 w-full items-center">
          
          {/* LEFT: Content & Typography */}
          <motion.div 
            className="flex flex-col items-start text-left max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <SparkleIcon className="w-4 h-4" />
              <span>Next-Gen Ayurvedic Intelligence</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Ancient Wisdom <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200">
                meets Modern AI.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
              Discover your unique Prakriti. Enter your symptoms and let our advanced AI formulate personalized herbal remedies, therapies, and lifestyle guidance rooted in 5,000 years of Ayurvedic science.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full transition-all duration-300 shadow-[0_0_30px_-5px_#10b981]">
                <span>Analyze Symptoms</span>
                <Activity className="w-5 h-5 group-hover:animate-pulse" />
              </button>
              
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-full backdrop-blur-md transition-all duration-300">
                <span>Explore Remedies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="mt-12 flex items-center gap-6 pt-8 border-t border-white/10 w-full">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden`}>
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover opacity-80" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-sm">
                <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                  ★★★★★
                </div>
                <span className="text-slate-400">
                  <strong className="text-white">10,000+</strong> healing journeys
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: 3D Canvas */}
          <motion.div 
            className="w-full h-[500px] lg:h-[700px] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          >
            {/* Glassmorphism backing plate for the 3D object */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-amber-500/5 rounded-[40px] border border-white/5 backdrop-blur-3xl transform -rotate-3 scale-95 opacity-50 pointer-events-none" />
            
            {/* Native Three.js Scene inside a div ref */}
            <div className="absolute inset-0 z-10 w-full h-full">
              <ThreeScene />
            </div>

            {/* Floating informational badges */}
            <div className="absolute bottom-10 -left-6 lg:left-0 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center gap-3 animate-bounce z-20" style={{ animationDuration: '3s' }}>
              <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">100% Natural</p>
                <p className="text-slate-400 text-xs">Vedic Formulations</p>
              </div>
            </div>

            <div className="absolute top-20 -right-6 lg:right-4 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center gap-3 animate-bounce z-20" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="bg-amber-500/20 p-2 rounded-full text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">AI Verified</p>
                <p className="text-slate-400 text-xs">High Accuracy</p>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}