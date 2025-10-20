document.addEventListener('DOMContentLoaded', () => {

    // ==================== VARIABLES GLOBALES ====================
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // --- OPTIMIZACIÓN DE MENÚ ---
    // Capturamos el ícono dentro del botón toggle
    const navToggleIcon = navToggle.querySelector('i');
    // No necesitamos 'navClose' porque el mismo toggle hará de "X"

    // ==================== LÓGICA DEL PRELOADER MEJORADA ====================
    window.addEventListener('load', () => {
        preloader.classList.add('loaded');
        const ANIMATION_DURATION = 2500; 
        setTimeout(() => {
            mainContent.classList.add('loaded');
            window.dispatchEvent(new Event('scroll'));
        }, ANIMATION_DURATION - 2000);
        setTimeout(() => {
            preloader.style.display = 'none';
        }, ANIMATION_DURATION);
    });


    // ==================== CURSOR INTERACTIVO ====================
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor cursor-dot';
        document.body.appendChild(cursorDot);

        const cursorOutline = document.createElement('div');
        cursorOutline.className = 'custom-cursor cursor-outline';
        document.body.appendChild(cursorOutline);

        window.addEventListener('mousemove', e => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 100, fill: "forwards" });
        });

        const interactiveElements = 'a, button, .btn, .nav-toggle, .service-card, .advantage-card, .scroller img, .logo';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.parentElement.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.parentElement.classList.remove('hover'));
        });
    }

    // ==================== EFECTO TILT 3D EN TARJETAS (OPTIMIZADO) ====================
    const tiltElements = document.querySelectorAll('.service-card, .advantage-card');
    tiltElements.forEach(el => {
        let isTicking = false; 
        el.addEventListener('mousemove', e => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const { left, top, width, height } = el.getBoundingClientRect();
                    const x = (e.clientX - left - width / 2) / (width / 2);
                    const y = (e.clientY - top - height / 2) / (height / 2);
                    el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.05, 1.05, 1.05)`;
                    el.style.transition = 'transform 0.1s';
                    isTicking = false;
                });
                isTicking = true;
            }
        });

        el.addEventListener('mouseleave', () => {
            window.requestAnimationFrame(() => {
                el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
                el.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            });
        });
    });
    
    // ==================== MENÚ MÓVIL (MODIFICADO Y OPTIMIZADO) ====================
    
    // Función de toggle unificada
    const toggleMenu = () => {
        // Alterna la clase 'show-menu' en el menú
        const isMenuOpen = navMenu.classList.toggle('show-menu');
        
        // Alterna la clase 'menu-open' en el body para bloquear/desbloquear scroll
        document.body.classList.toggle('menu-open', isMenuOpen);

        // Cambia el ícono del botón toggle
        if (isMenuOpen) {
            navToggleIcon.classList.remove('bx-menu');
            navToggleIcon.classList.add('bx-x');
        } else {
            navToggleIcon.classList.remove('bx-x');
            navToggleIcon.classList.add('bx-menu');
        }
    };

    // Listener en el botón toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    // Listener en los links del menú para cerrarlo al hacer clic
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Solo cierra el menú si está abierto
            if (navMenu.classList.contains('show-menu')) {
                toggleMenu();
            }
        });
    });
    
    // ==================== CAMBIAR FONDO DEL HEADER CON SCROLL ====================
    const handleScrollHeader = () => {
        header.classList.toggle('scrolled', window.scrollY >= 50);
    };
    window.addEventListener('scroll', handleScrollHeader);

    // ==================== ANIMACIONES GENERALES AL HACER SCROLL ====================
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ==================== LÓGICA DEL CAROUSEL INFINITO ====================
    const scrollers = document.querySelectorAll(".scroller");
    if (scrollers.length > 0) {
        scrollers.forEach(scroller => {
            const scrollerInner = scroller.querySelector(".scroller__inner");
            if (scrollerInner) {
                const scrollerContent = Array.from(scrollerInner.children);
                scrollerContent.forEach(item => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute("aria-hidden", true);
                    scrollerInner.appendChild(duplicatedItem);
                });
            }
        });
    }

});