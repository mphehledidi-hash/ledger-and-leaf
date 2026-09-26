(function () {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1500);
    });

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    });

    function updateActiveNav() {
        const sections = ['hero', 'services', 'process', 'closer'];
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

    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const allEls = Array.from(revealElements);
                const index = allEls.indexOf(entry.target);
                const delay = index * 140;
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

    const closerParticles = document.getElementById('closerParticles');
    if (closerParticles) {
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

    console.log('Ledger & Leaf — Precision meets growth.');
})();