document.addEventListener('DOMContentLoaded', () => {
    // Hero Elements
    const heroOledActiveKey = document.getElementById('oled-active-key');
    const heroOledEncoderVal = document.getElementById('oled-encoder-val');
    const physicalEncoder = document.getElementById('physical-encoder');
    const keyBtns = document.querySelectorAll('.key-btn');

    // Simulator Elements
    const simOledMain = document.querySelector('.sim-oled-main');
    const simOledFooter = document.querySelector('.sim-oled-footer');
    const simKnob = document.getElementById('sim-knob');
    const knobLeftBtn = document.getElementById('knob-left');
    const knobRightBtn = document.getElementById('knob-right');
    const simKeys = document.querySelectorAll('.sim-key');
    const logTerminal = document.getElementById('log-terminal');
    const clearLogBtn = document.getElementById('clear-log');

    // Values & States
    let heroVolume = 50;
    let heroAngle = 0;
    let simVolume = 50;
    let simAngle = 0;

    // Helper to log terminal messages
    function appendLog(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        line.textContent = `[${time}] > ${message}`;
        logTerminal.appendChild(line);
        logTerminal.scrollTop = logTerminal.scrollHeight;
    }

    // Hero interaction: Key switches
    keyBtns.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            const keyText = btn.getAttribute('data-key');
            const action = btn.getAttribute('data-action');
            heroOledActiveKey.textContent = `KEY: ${keyText}`;
            heroOledActiveKey.style.color = '#00f0ff';

            // Temporary active state styling
            btn.querySelector('.key-inner').style.borderColor = 'var(--secondary)';
        });

        btn.addEventListener('mouseup', () => {
            setTimeout(() => {
                heroOledActiveKey.textContent = 'READY';
                heroOledActiveKey.style.color = '#22c55e';
                btn.querySelector('.key-inner').style.borderColor = 'transparent';
            }, 300);
        });
    });

    // Hero interaction: Encoder (Rotating Knob)
    if (physicalEncoder) {
        physicalEncoder.addEventListener('click', () => {
            heroAngle += 30;
            physicalEncoder.style.transform = `rotate(${heroAngle}deg)`;
            heroVolume = (heroVolume + 5) > 100 ? 0 : (heroVolume + 5);
            heroOledEncoderVal.textContent = `VOL: ${heroVolume}%`;
        });
    }

    // Simulator Interaction: Keys
    simKeys.forEach(key => {
        key.addEventListener('mousedown', () => {
            key.classList.add('active');
            const cmd = key.getAttribute('data-cmd');
            const desc = key.getAttribute('data-desc');

            // Update OLED
            simOledMain.textContent = cmd;
            simOledFooter.textContent = `KEY: ${cmd} | VOL: ${simVolume}`;

            // Add to terminal log
            appendLog(`Executed Macro: ${cmd} (${desc})`, 'success');
        });

        key.addEventListener('mouseup', () => {
            setTimeout(() => {
                key.classList.remove('active');
            }, 150);
        });
    });

    // Simulator Interaction: Knob (using arrows and rotation)
    function rotateKnob(direction) {
        if (direction === 'right') {
            simAngle += 15;
            simVolume = Math.min(100, simVolume + 2);
            appendLog(`Volume Up: ${simVolume}%`, 'info');
        } else {
            simAngle -= 15;
            simVolume = Math.max(0, simVolume - 2);
            appendLog(`Volume Down: ${simVolume}%`, 'info');
        }
        simKnob.style.transform = `rotate(${simAngle}deg)`;

        // Update OLED
        simOledMain.textContent = `VOLUME: ${simVolume}%`;
        simOledFooter.textContent = `KEY: NONE | VOL: ${simVolume}`;
    }

    knobLeftBtn.addEventListener('click', () => rotateKnob('left'));
    knobRightBtn.addEventListener('click', () => rotateKnob('right'));

    // Drag-to-rotate support on the simulator knob
    let isDragging = false;
    let startAngle = 0;

    simKnob.addEventListener('mousedown', (e) => {
        isDragging = true;
        simKnob.style.cursor = 'grabbing';
        const rect = simKnob.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = simKnob.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const diff = currentAngle - startAngle;

        // Accumulate rotation
        const deg = diff * (180 / Math.PI);
        simAngle += deg * 0.1; // damping
        simKnob.style.transform = `rotate(${simAngle}deg)`;

        // Map angle changes to volume values
        if (deg > 0) {
            simVolume = Math.min(100, simVolume + 1);
        } else {
            simVolume = Math.max(0, simVolume - 1);
        }
        simOledMain.textContent = `VOLUME: ${simVolume}%`;
        simOledFooter.textContent = `KEY: ROTATING | VOL: ${simVolume}`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            simKnob.style.cursor = 'grab';
            appendLog(`Rotary Encoder set to: ${simVolume}%`, 'info');
        }
    });

    // Clear Terminal Log
    clearLogBtn.addEventListener('click', () => {
        logTerminal.innerHTML = `<div class="log-line text-mute">&gt; Log cleared. Waiting for input...</div>`;
    });
});

// Lightbox functions (global scope for onclick)
function openLightbox(src) {
    const overlay = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = src;
    overlay.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});