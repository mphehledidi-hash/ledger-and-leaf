(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // ============ PRELOADER ============
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 2450);
    });

    // ============ CUSTOM CURSOR ============
    (function initCursor() {
        if (isTouchDevice) return;
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        if (!dot || !ring) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX, ringY = mouseY;

        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });
        document.addEventListener('mouseleave', function () {
            dot.style.opacity = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
            dot.style.opacity = '1';
            ring.style.opacity = '0.55';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .work-tile, .service-card');
        hoverTargets.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', function () {
                document.body.classList.remove('cursor-hover');
            });
        });
    })();

    // ============ SCROLL PROGRESS ============
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    }

    // ============ NAVBAR ============
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        updateActiveNav();
        updateScrollProgress();
    });

    function updateActiveNav() {
        const sections = ['hero', 'services', 'work', 'process', 'closer'];
        const navLinks = document.querySelectorAll('#navLinks a');
        let currentSection = 'hero';
        sections.forEach(function (id) {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 200) currentSection = id;
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) link.classList.add('active');
        });
    }

    // ============ MOBILE MENU ============
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navCloseLinks = document.querySelectorAll('[data-nav-close]');
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    navCloseLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============ COUNTERS ============
    const heroStatCounter = document.getElementById('statCounterHero');
    let heroStatCounted = false;
    const heroStatObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !heroStatCounted) {
                heroStatCounted = true;
                animateCounter(heroStatCounter, 98, '%', 2000);
            }
        });
    }, { threshold: 0.6 });
    if (heroStatCounter) heroStatObserver.observe(heroStatCounter);

    const statNumbers = document.querySelectorAll('.stats-bar .stat-number[data-count]');
    let statsCounted = false;
    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                statNumbers.forEach(function (el, index) {
                    const target = parseFloat(el.getAttribute('data-count'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    const isDecimal = el.getAttribute('data-decimal') === 'true';
                    setTimeout(function () {
                        animateCounter(el, target, suffix, 2200, isDecimal);
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.5 });
    if (statNumbers.length) statsObserver.observe(document.querySelector('.stats-bar'));

    function animateCounter(el, target, suffix, duration, isDecimal) {
        const startTime = performance.now();
        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            let current = target * eased;
            if (progress > 0.9 && current < target) {
                const overshoot = target + target * 0.03 * Math.sin((progress - 0.9) / 0.1 * Math.PI);
                current = progress < 1 ? overshoot : target;
            }
            if (progress >= 1) {
                el.textContent = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
                return;
            }
            el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ============ REVEAL ON SCROLL ============
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const allEls = Array.from(revealElements);
                const index = allEls.indexOf(entry.target);
                const delay = (index % 3) * 140;
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(function (el) { revealObserver.observe(el); });

    // ============ SPLIT TEXT REVEAL ============
    function splitAndReveal() {
        const splitEls = document.querySelectorAll('[data-split-text]');
        splitEls.forEach(function (el) {
            const text = el.textContent.trim();
            const words = text.split(/\s+/);
            el.innerHTML = '';
            words.forEach(function (word, i) {
                const outer = document.createElement('span');
                outer.className = 'split-word';
                const inner = document.createElement('span');
                inner.className = 'split-word-inner';
                inner.textContent = word;
                inner.style.transitionDelay = (i * 60) + 'ms';
                outer.appendChild(inner);
                el.appendChild(outer);
                if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
            });
        });
        const splitObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('split-visible');
                    splitObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3, rootMargin: '0px 0px -60px 0px' });
        splitEls.forEach(function (el) { splitObserver.observe(el); });
    }
    if (!prefersReducedMotion) splitAndReveal();

    // ============ TYPING ANIMATION ============
    const typingText = document.getElementById('typingText');
    const typingCursor = document.getElementById('typingCursor');
    const metaNote = document.getElementById('metaNote');
    const fullText = "You're experiencing our web design capability right now. This site is our case study. Every scroll, every detail — deliberately crafted.";
    let typingDone = false;
    const typingObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !typingDone && typingText) {
                typingDone = true;
                let charIndex = 0;
                typingText.textContent = '';
                function typeChar() {
                    if (charIndex < fullText.length) {
                        typingText.textContent += fullText.charAt(charIndex);
                        charIndex++;
                        setTimeout(typeChar, 28 + Math.random() * 30);
                    } else if (typingCursor) {
                        typingCursor.style.display = 'none';
                    }
                }
                setTimeout(typeChar, 700);
            }
        });
    }, { threshold: 0.5 });
    if (metaNote) typingObserver.observe(metaNote);

    // ============ CLOSER PARTICLES ============
    const closerParticles = document.getElementById('closerParticles');
    if (closerParticles && !prefersReducedMotion) {
        for (let i = 0; i < 36; i++) {
            const particle = document.createElement('div');
            particle.classList.add('closer-particle');
            const size = Math.random() * 44 + 8;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + 40 + '%';
            particle.style.background = Math.random() > 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,49,30,0.05)';
            particle.style.animationDuration = (Math.random() * 30 + 16) + 's';
            particle.style.animationDelay = (Math.random() * 14) + 's';
            closerParticles.appendChild(particle);
        }
    }

    // ============ HERO PARTICLES ============
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles && !prefersReducedMotion) {
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.classList.add('hero-particle');
            const size = Math.random() * 4 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = '-20px';
            p.style.animationDuration = (Math.random() * 18 + 14) + 's';
            p.style.animationDelay = (Math.random() * 12) + 's';
            heroParticles.appendChild(p);
        }
    }

    // ============ HERO CARD 3D TILT ============
    const heroVisual = document.getElementById('heroVisual');
    const heroCard = document.getElementById('heroCard');
    if (heroVisual && heroCard && !isTouchDevice && !prefersReducedMotion) {
        heroVisual.addEventListener('mousemove', function (e) {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
            heroCard.classList.add('tilting');
            heroCard.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        });
        heroVisual.addEventListener('mouseleave', function () {
            heroCard.classList.remove('tilting');
            heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // ============ HERO BLOB PARALLAX ============
    const parallaxBlobs = document.querySelectorAll('[data-parallax-blob]');
    if (parallaxBlobs.length && !isTouchDevice && !prefersReducedMotion) {
        const heroSection = document.getElementById('hero');
        heroSection.addEventListener('mousemove', function (e) {
            const rect = heroSection.getBoundingClientRect();
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const offsetX = (e.clientX - rect.left - cx) / cx;
            const offsetY = (e.clientY - rect.top - cy) / cy;
            parallaxBlobs.forEach(function (blob, i) {
                const depth = i === 0 ? 30 : 50;
                blob.style.transform = 'translate(calc(-50% + ' + (offsetX * depth) + 'px), calc(-50% + ' + (offsetY * depth) + 'px))';
            });
        });
    }

    // ============ MAGNETIC BUTTONS ============
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    if (!isTouchDevice && !prefersReducedMotion) {
        magneticButtons.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.35) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });
    }

    // ============ LIVING LEDGER GRID ============
    (function initLedgerGrid() {
        if (prefersReducedMotion) return;
        const canvas = document.getElementById('ledgerGrid');
        const heroSection = document.getElementById('hero');
        const bgPattern = document.getElementById('heroBgPattern');
        if (!canvas || !heroSection) return;

        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let width = 0, height = 0;
        let dots = [];
        let mouse = { x: -9999, y: -9999, active: false };
        let morphTarget = 0; // 0 = grid, 1 = leaf
        let morphProgress = 0;
        let leafTimer = 0;
        let rafId = null;

        const SPACING = 34;
        const MOUSE_RADIUS = 130;
        const LINE_RADIUS = 130;
        const FOREST = '0, 49, 30';
        const OCHRE = '184, 151, 58';

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function resize() {
            const rect = heroSection.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildGrid();
            if (bgPattern) bgPattern.classList.add('canvas-active');
        }

        function buildGrid() {
            dots = [];
            const cols = Math.ceil(width / SPACING) + 1;
            const rows = Math.ceil(height / SPACING) + 1;
            const cx = width / 2;
            const cy = height / 2;
            const scale = Math.min(width, height) * 0.42;
            const offsetX = (width - (cols - 1) * SPACING) / 2;
            const offsetY = (height - (rows - 1) * SPACING) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const gx = offsetX + i * SPACING;
                    const gy = offsetY + j * SPACING;
                    // Normalized -1..1
                    const nx = (gx - cx) / scale;
                    const ny = (gy - cy) / scale;
                    // Leaf mapping — squeeze horizontally based on vertical position
                    const v = ny;
                    const h = Math.sin(Math.PI * (v + 1) / 2) * 0.62;
                    const lx = cx + nx * h * scale;
                    const ly = cy + v * scale;
                    dots.push({
                        gx: gx, gy: gy,
                        lx: lx, ly: ly,
                        rx: gx, ry: gy,
                        influence: 0,
                        isOchre: Math.random() < 0.04
                    });
                }
            }
        }

        function handleMouseMove(e) {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        }
        function handleMouseLeave() {
            mouse.active = false;
            mouse.x = -9999;
            mouse.y = -9999;
        }

        if (!isTouchDevice) {
            heroSection.addEventListener('mousemove', handleMouseMove);
            heroSection.addEventListener('mouseleave', handleMouseLeave);
        }

        let lastTime = performance.now();

        function render(now) {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            // Leaf timer — every 9 seconds, morph to leaf and back
            leafTimer += dt;
            if (leafTimer > 9 && morphTarget === 0) {
                morphTarget = 1;
                setTimeout(function () { morphTarget = 0; }, 3500);
                leafTimer = 0;
            }

            // Smooth morph
            const morphSpeed = 0.5;
            if (morphProgress < morphTarget) {
                morphProgress = Math.min(morphProgress + dt * morphSpeed, morphTarget);
            } else if (morphProgress > morphTarget) {
                morphProgress = Math.max(morphProgress - dt * morphSpeed, morphTarget);
            }
            const morphEase = easeInOutCubic(morphProgress);

            ctx.clearRect(0, 0, width, height);

            // Compute positions
            const activeDots = [];
            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                // Base position (lerp between grid and leaf)
                let x = d.gx * (1 - morphEase) + d.lx * morphEase;
                let y = d.gy * (1 - morphEase) + d.ly * morphEase;

                // Mouse influence
                const dx = x - mouse.x;
                const dy = y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                let influence = 0;
                if (mouse.active && dist < MOUSE_RADIUS) {
                    influence = 1 - dist / MOUSE_RADIUS;
                    // Push dots away from mouse
                    const push = influence * influence * 10;
                    if (dist > 0.5) {
                        x += (dx / dist) * push;
                        y += (dy / dist) * push;
                    }
                }
                d.rx = x;
                d.ry = y;
                d.influence = influence;
                if (influence > 0.05) activeDots.push({ i: i, x: x, y: y, inf: influence });
            }

            // Draw connective lines near mouse
            if (activeDots.length > 1 && activeDots.length < 60) {
                for (let a = 0; a < activeDots.length; a++) {
                    for (let b = a + 1; b < activeDots.length; b++) {
                        const A = activeDots[a], B = activeDots[b];
                        const dx = A.x - B.x;
                        const dy = A.y - B.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < LINE_RADIUS) {
                            const alpha = (1 - dist / LINE_RADIUS) * 0.28 * Math.min(A.inf, B.inf);
                            ctx.strokeStyle = 'rgba(' + FOREST + ',' + alpha + ')';
                            ctx.lineWidth = 0.9;
                            ctx.beginPath();
                            ctx.moveTo(A.x, A.y);
                            ctx.lineTo(B.x, B.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            // Draw dots
            const baseAlpha = 0.10 + morphEase * 0.12;
            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                const alpha = baseAlpha + d.influence * 0.75;
                const r = 1 + d.influence * 2.6 + morphEase * 0.3;

                if (d.isOchre) {
                    ctx.fillStyle = 'rgba(' + OCHRE + ',' + (alpha * 0.9) + ')';
                } else {
                    ctx.fillStyle = 'rgba(' + FOREST + ',' + alpha + ')';
                }
                ctx.beginPath();
                ctx.arc(d.rx, d.ry, r, 0, Math.PI * 2);
                ctx.fill();
            }

            rafId = requestAnimationFrame(render);
        }

        resize();
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                resize();
            }, 150);
        });

        // Only animate when hero is visible
        const visObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (!rafId) {
                        lastTime = performance.now();
                        rafId = requestAnimationFrame(render);
                    }
                } else {
                    if (rafId) {
                        cancelAnimationFrame(rafId);
                        rafId = null;
                    }
                }
            });
        }, { threshold: 0.05 });
        visObserver.observe(heroSection);

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            } else {
                if (!rafId && !prefersReducedMotion) {
                    lastTime = performance.now();
                    rafId = requestAnimationFrame(render);
                }
            }
        });
    })();

    // ============ PHYSICS MARQUEE ============
    (function initMarquee() {
        const marquee = document.getElementById('marquee');
        if (!marquee) return;

        // Split each word into letters
        const words = Array.from(marquee.children);
        words.forEach(function (word) {
            const text = word.textContent;
            word.textContent = '';
            for (let i = 0; i < text.length; i++) {
                const letter = document.createElement('span');
                letter.className = 'marquee-letter';
                letter.textContent = text.charAt(i);
                word.appendChild(letter);
            }
        });

        // Duplicate content for seamless loop
        marquee.innerHTML += marquee.innerHTML;

        const marqueeWindow = marquee.closest('.marquee-window');
        if (!marqueeWindow) return;

        let marqueeX = 0;
        let baseSpeed = 0.55;
        let scrollVelocity = 0;
        let lastScrollY = window.scrollY;
        let mouseX = -9999;

        window.addEventListener('scroll', function () {
            const y = window.scrollY;
            scrollVelocity = Math.abs(y - lastScrollY);
            lastScrollY = y;
        });

        if (!isTouchDevice && !prefersReducedMotion) {
            marqueeWindow.addEventListener('mousemove', function (e) {
                const rect = marqueeWindow.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
            });
            marqueeWindow.addEventListener('mouseleave', function () {
                mouseX = -9999;
            });
        }

        const allLetters = marquee.querySelectorAll('.marquee-letter');
        const letterData = Array.from(allLetters).map(function (el) {
            return { el: el, offset: el.offsetLeft, currentY: 0, targetY: 0 };
        });

        const totalWidth = marquee.scrollWidth / 2;

        function tick() {
            const extra = Math.min(scrollVelocity * 0.4, 8);
            marqueeX -= baseSpeed + extra;
            scrollVelocity *= 0.9;

            if (marqueeX <= -totalWidth) marqueeX += totalWidth;

            // Physics for letters near cursor
            if (mouseX > -1000 && !isTouchDevice) {
                const influenceRadius = 90;
                for (let i = 0; i < letterData.length; i++) {
                    const ld = letterData[i];
                    // Position of letter in window coords
                    let lx = ld.offset + marqueeX;
                    // Wrap around
                    const modWidth = totalWidth;
                    while (lx < -100) lx += modWidth;
                    while (lx > modWidth - 100) lx -= modWidth;

                    if (lx < -50 || lx > marqueeWindow.offsetWidth + 50) {
                        ld.targetY = 0;
                    } else {
                        const dx = lx - mouseX;
                        const adx = Math.abs(dx);
                        if (adx < influenceRadius) {
                            const strength = 1 - adx / influenceRadius;
                            // Push letters up, away from cursor
                            ld.targetY = -strength * strength * 28;
                        } else {
                            ld.targetY = 0;
                        }
                    }
                    // Spring toward target
                    ld.currentY += (ld.targetY - ld.currentY) * 0.18;
                    if (Math.abs(ld.currentY) > 0.05) {
                        ld.el.style.transform = 'translateY(' + ld.currentY + 'px)';
                    } else if (ld.currentY !== 0) {
                        ld.el.style.transform = '';
                        ld.currentY = 0;
                    }
                }
            }

            marquee.style.transform = 'translateX(' + marqueeX + 'px)';
            requestAnimationFrame(tick);
        }

        if (!prefersReducedMotion) {
            tick();
        } else {
            // Static fallback
            marquee.style.transform = 'translateX(0)';
        }
    })();

    console.log('Ledger & Leaf — Living Ledger Grid · Ink Drop Preloader · Physics Marquee');
})();
