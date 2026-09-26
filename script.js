(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // ============ PRELOADER ============
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1500);
    });

    // ============ CUSTOM CURSOR ============
    if (!isTouchDevice && !prefersReducedMotion) {
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (dot) {
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
            }
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            if (ring) {
                ring.style.left = ringX + 'px';
                ring.style.top = ringY + 'px';
            }
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
    }

    // ============ SCROLL PROGRESS ============
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    }

    // ============ NAVBAR + ACTIVE NAV ============
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
        updateScrollProgress();
    });

    function updateActiveNav() {
        const sections = ['hero', 'services', 'work', 'process', 'closer'];
        const navLinks = document.querySelectorAll('#navLinks a');
        let currentSection = 'hero';
        sections.forEach(function (id) {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 200) {
                currentSection = id;
            }
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
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
                    const delay = index * 200;
                    setTimeout(function () {
                        animateCounter(el, target, suffix, 2200, isDecimal);
                    }, delay);
                });
            }
        });
    }, { threshold: 0.5 });
    if (statNumbers.length) statsObserver.observe(document.querySelector('.stats-bar'));

    function animateCounter(el, target, suffix, duration, isDecimal) {
        const startTime = performance.now();
        const startVal = 0;
        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            let current = startVal + (target - startVal) * eased;
            if (progress > 0.9 && current < target) {
                const overshoot = target + (target - startVal) * 0.03 * Math.sin((progress - 0.9) / 0.1 * Math.PI);
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
    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

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
                if (i < words.length - 1) {
                    el.appendChild(document.createTextNode(' '));
                }
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

        splitEls.forEach(function (el) {
            splitObserver.observe(el);
        });
    }
    if (!prefersReducedMotion) {
        splitAndReveal();
    }

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
                        const baseDelay = 28;
                        const variation = Math.random() * 30;
                        setTimeout(typeChar, baseDelay + variation);
                    } else {
                        if (typingCursor) typingCursor.style.display = 'none';
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
            particle.style.background = Math.random() > 0.5 ?
                'rgba(255,255,255,0.04)' : 'rgba(0,49,30,0.05)';
            particle.style.animationDuration = (Math.random() * 30 + 16) + 's';
            particle.style.animationDelay = (Math.random() * 14) + 's';
            closerParticles.appendChild(particle);
        }
    }

    // ============ HERO FLOATING PARTICLES ============
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
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
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

    // ============ VELOCITY-RESPONSIVE MARQUEE ============
    const marquee = document.getElementById('marquee');
    if (marquee && !prefersReducedMotion) {
        let marqueeX = 0;
        let scrollVelocity = 0;
        let lastScrollY = window.scrollY;
        let baseSpeed = 0.55;

        // Duplicate content for seamless loop
        marquee.innerHTML += marquee.innerHTML;
        const totalWidth = marquee.scrollWidth / 2;

        window.addEventListener('scroll', function () {
            const y = window.scrollY;
            scrollVelocity = Math.abs(y - lastScrollY);
            lastScrollY = y;
        });

        let velocityDecay = 0;
        function tick() {
            const extra = Math.min(scrollVelocity * 0.4, 8);
            marqueeX -= baseSpeed + extra;
            velocityDecay *= 0.94;
            scrollVelocity *= 0.9;
            if (marqueeX <= -totalWidth) {
                marqueeX += totalWidth;
            }
            marquee.style.transform = 'translateX(' + marqueeX + 'px)';
            requestAnimationFrame(tick);
        }
        tick();
    }

    console.log('Ledger & Leaf — Precision meets growth. Animations live.');
})();
