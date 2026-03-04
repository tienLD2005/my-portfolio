/* ============================
   1. NAVBAR SCROLL
   ============================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================
   2. CURSOR GLOW (desktop only)
   ============================ */
const cursorGlow = document.getElementById('cursor-glow');
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }, { passive: true });
}

/* ============================
   3. PARTICLE CANVAS
   ============================ */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let W, H, particles;

    function resize() {
        W = canvas.width = canvas.offsetWidth || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    function Particle() {
        this.reset();
    }

    Particle.prototype.reset = function () {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.4 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.5 ? '79,142,247' : '123,92,245';
    };

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.hue},${this.alpha})`;
        ctx.fill();
    };

    function init() {
        resize();
        const count = Math.floor((W * H) / 14000);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        for (const p of particles) {
            p.update();
            p.draw();
        }
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    init();
    loop();
})();

/* ============================
   4. TYPING EFFECT (hero role)
   ============================ */
(function typeWriter() {
    const el = document.querySelector('.hero-role');
    const text = 'Backend Developer';
    let i = 0;

    el.textContent = '';

    function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i) + (i < text.length ? '|' : '');
            i++;
            setTimeout(type, i === text.length ? 0 : 60 + Math.random() * 40);
        }
    }

    // start after hero fade-in
    setTimeout(type, 900);
})();

/* ============================
   5. SCROLL REVEAL  (with stagger)
   ============================ */
const revealSets = [
    // each entry: [selector, stagger?]
    ['.section-title', false],
    ['.about-text p', true],
    ['.info-card', false],
    ['.skill-group', true],
    ['.project-card', true],
    ['.timeline-item', true],
    ['.contact-intro', false],
    ['.contact-item', true],
];

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealSets.forEach(([selector, stagger]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        if (stagger) el.dataset.delay = Math.min(i * 100, 400);
        revealObserver.observe(el);
    });
});

/* ============================
   6. TIMELINE LINE REVEAL
   ============================ */
const timelineEl = document.querySelector('.timeline');
if (timelineEl) {
    const tlObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            timelineEl.classList.add('visible');
            tlObs.disconnect();
        }
    }, { threshold: 0.15 });
    tlObs.observe(timelineEl);
}

/* ============================
   7. ACTIVE NAV LINK
   ============================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                const active = link.getAttribute('href') === '#' + entry.target.id;
                link.style.color = active ? 'var(--text)' : '';
            });
        }
    });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================
   8. CARD TILT (subtle 3D)
   ============================ */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
        card.style.transition = 'transform 0.05s, border-color 0.3s, box-shadow 0.3s';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s ease, border-color 0.3s, box-shadow 0.3s';
    });
});
