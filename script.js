document.addEventListener('DOMContentLoaded', () => {
    // Elegant smooth scroll
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Dynamic Logo Switch on Scroll
    const navbarLogo = document.getElementById('navbar-logo');
    const sections = document.querySelectorAll('header, section');

    // Carrusel de Servicios
    const carousel = document.getElementById('services-carousel');
    const nextBtn = document.getElementById('next-service');
    const prevBtn = document.getElementById('prev-service');

    if (carousel && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const scrollAmount = carousel.offsetWidth * 0.8;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const scrollAmount = carousel.offsetWidth * 0.8;
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // Active nav link on scroll
    const allNavLinks = document.querySelectorAll('.nav-links a');
    const allSections = document.querySelectorAll('header[id], section[id]');

    function updateActiveLink() {
        let current = '';
        allSections.forEach(sec => {
            const sectionTop = sec.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = sec.getAttribute('id');
            }
        });
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // Toggle navbar scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        updateActiveLink();
    });

    updateActiveLink();

    // Form submission interaction
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Envoi en cours...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = 'Message envoyé !';
                btn.style.background = '#28a745';
                btn.style.color = '#fff';
                btn.style.opacity = '1';
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Reusable Coverflow Logic Factory
    const coverflowContainers = document.querySelectorAll('.coverflow-container');

    coverflowContainers.forEach(container => {
        const coverflowItems = container.querySelectorAll('.coverflow-item');
        const paginationContainer = container.querySelector('.coverflow-pagination');
        const track = container.querySelector('.coverflow-track');
        let cfIndex = 0;

        if (coverflowItems.length > 0) {
            // Create pagination dots
            coverflowItems.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('coverflow-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => { updateCoverflow(i); startAutoplay(); });
                if (paginationContainer) paginationContainer.appendChild(dot);
            });

            const dots = container.querySelectorAll('.coverflow-dot');

            function updateCoverflow(newIndex) {
                cfIndex = newIndex;
                
                // Handle negative index / overflow
                if (cfIndex < 0) cfIndex = coverflowItems.length - 1;
                if (cfIndex >= coverflowItems.length) cfIndex = 0;

                coverflowItems.forEach((item, i) => {
                    item.classList.remove('active', 'prev', 'next', 'hidden-left', 'hidden-right');
                    
                    if (i === cfIndex) {
                        item.classList.add('active');
                    } else if (i === cfIndex - 1 || (cfIndex === 0 && i === coverflowItems.length - 1)) {
                        item.classList.add('prev');
                    } else if (i === cfIndex + 1 || (cfIndex === coverflowItems.length - 1 && i === 0)) {
                        item.classList.add('next');
                    } else {
                        // Decide if it should go to hidden-left or hidden-right for continuous rotation
                        if (cfIndex === 0 && i > 1 && i < coverflowItems.length - 1) {
                             item.classList.add('hidden-right'); 
                        } else if (i < cfIndex) {
                             item.classList.add('hidden-left');
                        } else {
                             item.classList.add('hidden-right');
                        }
                    }
                });

                if (dots.length > 0) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[cfIndex].classList.add('active');
                }
            }

            // Swipe & Drag logic - Desktop + Mobile
            let startX = 0;
            let isDragging = false;
            let hasMoved = false;

            const handleDragStart = (e) => {
                isDragging = true;
                hasMoved = false;
                startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                e.preventDefault(); // prevent browser default image drag
            };

            const handleDragMove = (e) => {
                if (!isDragging) return;
                const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                if (Math.abs(currentX - startX) > 10) hasMoved = true;
            };

            const handleDragEnd = (e) => {
                if (!isDragging) return;
                isDragging = false;
                const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (diff > 10) { // Threshold 10px - muy sensible
                    updateCoverflow(cfIndex + 1);
                    pauseAutoplayLong();
                } else if (diff < -10) {
                    updateCoverflow(cfIndex - 1);
                    pauseAutoplayLong();
                }
            };

            let autoplayInterval;
            let pauseTimeout;

            const startAutoplay = () => {
                clearInterval(autoplayInterval);
                clearTimeout(pauseTimeout);
                autoplayInterval = setInterval(() => {
                    updateCoverflow(cfIndex + 1);
                }, 3000); // 3 Segundos rotación pasiva
            };

            const pauseAutoplayLong = () => {
                clearInterval(autoplayInterval);
                clearTimeout(pauseTimeout);
                // Esperar 40 segundos si hay interaccion para dejarles leer
                pauseTimeout = setTimeout(() => {
                    updateCoverflow(cfIndex + 1);
                    startAutoplay();
                }, 40000); 
            };

            if (track) {
                // Desktop mouse events
                track.addEventListener('mousedown', (e) => { handleDragStart(e); });
                track.addEventListener('mousemove', handleDragMove);
                track.addEventListener('mouseup', (e) => { handleDragEnd(e); });
                track.addEventListener('mouseleave', () => { isDragging = false; hasMoved = false; });
                
                // Mobile touch events
                track.addEventListener('touchstart', handleDragStart, {passive: true});
                track.addEventListener('touchmove', handleDragMove, {passive: true});
                track.addEventListener('touchend', handleDragEnd);
            }

            // Click on side items to navigate - only when NOT dragging
            coverflowItems.forEach((item, i) => {
                item.addEventListener('click', (e) => {
                    if (hasMoved) return; // ignore click if it was a drag
                    if (!item.classList.contains('active')) {
                        updateCoverflow(i);
                    }
                    pauseAutoplayLong();
                });
            });

            // Initialize state
            updateCoverflow(0);
            startAutoplay();
        }
    });

});
