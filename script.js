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
});
