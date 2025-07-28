// 全局变量
let scene, camera, renderer, cube;
let energyLevel = 0;
let skillIndex = 0;
const skills = [
    { icon: '🏸', name: '羽毛球', level: 'Lv.2', progress: 50 },
    { icon: '💻', name: '编程', level: 'Lv.3', progress: 75 },
    { icon: '📷', name: '摄影', level: 'Lv.1', progress: 25 },
    { icon: '🎨', name: '设计', level: 'Lv.2', progress: 40 },
    { icon: '📚', name: '阅读', level: 'Lv.4', progress: 80 },
    { icon: '🏃', name: '跑步', level: 'Lv.3', progress: 60 }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEnergySystem();
    initSkillCube();
    initParticleEffects();
    initMicroInteractions();
    initFormHandling();
    initScrollEffects();
    initEasterEggs();
});

// 能量管理系统
function initEnergySystem() {
    const progressFill = document.querySelector('.progress-fill');
    const energyPercentage = document.querySelector('.energy-percentage');
    
    // 模拟能量充能
    let energy = 0;
    const energyInterval = setInterval(() => {
        energy += Math.random() * 2;
        if (energy >= 100) {
            energy = 100;
            clearInterval(energyInterval);
            triggerEnergyFull();
        }
        
        progressFill.style.width = energy + '%';
        energyPercentage.textContent = Math.round(energy) + '%';
    }, 100);

    // 能量充满时的特效
    function triggerEnergyFull() {
        // 创建频谱波纹效果
        const waveContainer = document.createElement('div');
        waveContainer.className = 'energy-wave';
        waveContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            border: 2px solid #8B5CF6;
            border-radius: 50%;
            animation: energyWave 2s ease-out;
            z-index: 10;
        `;
        
        document.querySelector('.energy-capacitor').appendChild(waveContainer);
        
        setTimeout(() => {
            waveContainer.remove();
        }, 2000);
    }
}

// 技能立方体
function initSkillCube() {
    const container = document.getElementById('skill-cube');
    
    // 创建Three.js场景
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 创建立方体几何体
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [];
    
    // 为每个面创建不同颜色的材质
    const colors = [0x8B5CF6, 0xA855F7, 0xC084FC, 0xD8B4FE, 0xEDE9FE, 0xF3F4F6];
    colors.forEach(color => {
        materials.push(new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.8,
            wireframe: false
        }));
    });

    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    camera.position.z = 5;

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        // 立方体旋转
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        
        // 每3分钟切换技能
        if (Math.floor(Date.now() / 1000) % 180 === 0) {
            updateSkillInfo();
        }
        
        renderer.render(scene, camera);
    }
    animate();

    // 窗口大小调整
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // 鼠标交互
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 更新鼠标控制的立方体旋转
    function updateCubeRotation() {
        cube.rotation.x += mouseY * 0.01;
        cube.rotation.y += mouseX * 0.01;
    }
    setInterval(updateCubeRotation, 16);
}

// 更新技能信息
function updateSkillInfo() {
    const skill = skills[skillIndex];
    const badgeIcon = document.querySelector('.badge-icon');
    const skillLevel = document.querySelector('.skill-level');
    const progressRing = document.querySelector('.progress-ring svg circle:last-child');
    
    // 动画过渡
    anime({
        targets: [badgeIcon, skillLevel],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
            badgeIcon.textContent = skill.icon;
            skillLevel.textContent = `${skill.name} ${skill.level}`;
            
            // 更新进度环
            const circumference = 2 * Math.PI * 25;
            const offset = circumference - (skill.progress / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
            
            anime({
                targets: [badgeIcon, skillLevel],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeInOutQuad'
            });
        }
    });
    
    skillIndex = (skillIndex + 1) % skills.length;
}

// 粒子效果
function initParticleEffects() {
    // 墨水粒子
    createInkParticles();
    
    // 汗水粒子
    createSweatParticles();
    
    // 灵魂光芒粒子
    createSoulParticles();
}

function createInkParticles() {
    const inkContainer = document.querySelector('.ink-particles');
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #8B5CF6;
            border-radius: 50%;
            left: ${Math.random() * 100}px;
            top: 0;
            animation: inkFlow 2s linear forwards;
        `;
        inkContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }, 500);
}

function createSweatParticles() {
    const sweatContainer = document.querySelector('.sweat-particles');
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.textContent = '💧';
        particle.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            left: ${Math.random() * 100}px;
            top: 0;
            animation: sweatDrop 1.5s ease-in-out forwards;
        `;
        sweatContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }, 800);
}

function createSoulParticles() {
    const particleField = document.querySelector('.particle-field');
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: #F59E0B;
            border-radius: 50%;
            left: ${Math.random() * 300}px;
            top: ${Math.random() * 200}px;
            animation: soulFloat 3s ease-in-out forwards;
        `;
        particleField.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }, 200);
}

// 微交互
function initMicroInteractions() {
    // 书页翻动音效
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            const audio = document.getElementById('page-flip');
            audio.currentTime = 0;
            audio.play().catch(() => {}); // 忽略自动播放限制
        });
    });

    // 汗水滴落动画
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            createSweatDrop();
        }
        lastScrollY = currentScrollY;
    });

    // 肉体滑块交互
    const bodySlider = document.getElementById('body-slider');
    const soulLight = document.querySelector('.soul-light');
    
    bodySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        const intensity = value / 100;
        
        soulLight.style.opacity = 0.3 + (intensity * 0.7);
        soulLight.style.transform = `scale(${0.8 + intensity * 0.4})`;
        
        // 增强粒子效果
        if (intensity > 0.7) {
            createSoulParticles();
        }
    });

    // 课本翻页彩蛋
    let doubleClickTimer;
    document.querySelector('.dune-scene').addEventListener('click', () => {
        clearTimeout(doubleClickTimer);
        doubleClickTimer = setTimeout(() => {
            // 单次点击
        }, 300);
    });

    document.querySelector('.dune-scene').addEventListener('dblclick', () => {
        clearTimeout(doubleClickTimer);
        showTextbookEasterEgg();
    });
}

function createSweatDrop() {
    const sweatDrop = document.createElement('div');
    sweatDrop.textContent = '💧';
    sweatDrop.style.cssText = `
        position: fixed;
        font-size: 1.5rem;
        left: ${Math.random() * window.innerWidth}px;
        top: -50px;
        z-index: 1000;
        animation: sweatDropScroll 2s ease-in-out forwards;
    `;
    document.body.appendChild(sweatDrop);
    
    setTimeout(() => sweatDrop.remove(), 2000);
}

function showTextbookEasterEgg() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    `;
    
    const textbook = document.createElement('div');
    textbook.style.cssText = `
        background: #F59E0B;
        color: #1F2937;
        padding: 2rem;
        border-radius: 10px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        font-family: 'Noto Sans SC', serif;
        line-height: 1.8;
    `;
    textbook.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 1rem;">初中政治课本</h2>
        <p><strong>相信自己：</strong>每个人都有自己的价值和潜力，要相信自己的能力。</p>
        <p><strong>勇敢尝试：</strong>不要害怕失败，每一次尝试都是成长的机会。</p>
        <p><strong>持续进步：</strong>学习是一个持续的过程，要不断努力提升自己。</p>
        <p style="text-align: center; margin-top: 2rem; font-style: italic;">—— 探索者精神 × 能量平衡哲学</p>
    `;
    
    overlay.appendChild(textbook);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', () => {
        overlay.remove();
    });
}

// 表单处理
function initFormHandling() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 触发"互相点亮"粒子烟花效果
        createFireworkEffect();
        
        // 显示提交成功消息
        showSuccessMessage();
        
        // 重置表单
        form.reset();
    });
}

function createFireworkEffect() {
    const fireworkContainer = document.createElement('div');
    fireworkContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
    `;
    document.body.appendChild(fireworkContainer);
    
    // 创建多个烟花
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createSingleFirework(fireworkContainer);
        }, i * 200);
    }
    
    setTimeout(() => {
        fireworkContainer.remove();
    }, 3000);
}

function createSingleFirework(container) {
    const firework = document.createElement('div');
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    firework.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: #A855F7;
        border-radius: 50%;
        animation: firework 1s ease-out forwards;
    `;
    
    container.appendChild(firework);
    
    // 创建粒子扩散效果
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        const angle = (i / 12) * 2 * Math.PI;
        const distance = 50 + Math.random() * 50;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 2px;
            height: 2px;
            background: #C084FC;
            border-radius: 50%;
            animation: fireworkParticle 1s ease-out forwards;
        `;
        
        container.appendChild(particle);
        
        // 设置粒子运动
        setTimeout(() => {
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        }, 50);
    }
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #A855F7, #C084FC);
        color: white;
        padding: 2rem;
        border-radius: 10px;
        z-index: 1001;
        animation: messageFade 3s ease-in-out forwards;
    `;
    message.textContent = '对接成功！期待与您的合作！';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// 滚动效果
function initScrollEffects() {
    // 视差滚动效果
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.section');
        
        parallax.forEach((section, index) => {
            const speed = 0.5;
            const yPos = -(scrolled * speed * (index + 1));
            section.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// 彩蛋
function initEasterEggs() {
    // 天鹅彩蛋定时触发
    setInterval(() => {
        const swan = document.querySelector('.swan');
        if (swan) {
            swan.style.animation = 'none';
            swan.offsetHeight; // 触发重排
            swan.style.animation = 'swanFly 10s linear infinite';
        }
    }, 15000); // 每15秒触发一次
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + E 触发能量充满
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            triggerEnergyFull();
        }
        
        // Ctrl + Shift + S 显示技能信息
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            updateSkillInfo();
        }
    });
}

// CSS动画定义
const style = document.createElement('style');
style.textContent = `
    @keyframes energyWave {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
    
    @keyframes sweatDropScroll {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(${window.innerHeight}px); opacity: 0; }
    }
    
    @keyframes soulFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0); opacity: 0; }
    }
    
    @keyframes firework {
        0% { transform: scale(0); opacity: 1; }
        50% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0); opacity: 0; }
    }
    
    @keyframes fireworkParticle {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0); opacity: 0; }
    }
    
    @keyframes messageFade {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style); 