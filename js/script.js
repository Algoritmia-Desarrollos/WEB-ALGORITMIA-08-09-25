document.addEventListener('DOMContentLoaded', () => {

    // ==================== VARIABLES GLOBALES ====================
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    // ==================== LÓGICA DEL PRELOADER MEJORADA ====================
    // AHORA ESPERAMOS A QUE *TODA* LA PÁGINA Y SUS RECURSOS HAYAN CARGADO.
    window.addEventListener('load', () => {
        // 1. Todo ha cargado. Ahora podemos empezar la animación de salida del preloader.
        preloader.classList.add('loaded');

        // 2. La animación CSS del preloader dura 2.5s. Sincronizamos todo con ella.
        const ANIMATION_DURATION = 2500; 

        // 3. Hacemos que el contenido principal aparezca con una transición suave.
        //    Aparecerá justo cuando la animación del preloader esté en su fase final.
        setTimeout(() => {
            mainContent.classList.add('loaded');
            // Disparamos un evento de scroll para activar animaciones que ya sean visibles.
            window.dispatchEvent(new Event('scroll'));
        }, ANIMATION_DURATION - 2000); // Aparece 2s después de que inicia la expansión (ajustable).

        // 4. Una vez concluida la animación, eliminamos el preloader del DOM.
        setTimeout(() => {
            preloader.style.display = 'none';
        }, ANIMATION_DURATION);
    });


    // ==================== CURSOR INTERACTIVO ====================
    // (Sin cambios, tu código aquí es correcto)
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

        const interactiveElements = 'a, button, .btn, .nav-toggle, .nav-close, .service-card, .advantage-card, .scroller img, .logo';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.parentElement.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.parentElement.classList.remove('hover'));
        });
    }

    // ==================== EFECTO TILT 3D EN TARJETAS (OPTIMIZADO) ====================
    const tiltElements = document.querySelectorAll('.service-card, .advantage-card');
    tiltElements.forEach(el => {
        let isTicking = false; // Flag para controlar la ejecución

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
    
    // ==================== MENÚ MÓVIL ====================
    // (Sin cambios, tu código aquí es correcto)
    const toggleMenu = () => {
        navMenu.classList.toggle('show-menu');
        document.body.classList.toggle('menu-open');
    };

    if (navToggle) navToggle.addEventListener('click', toggleMenu);
    if (navClose) navClose.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('show-menu')) {
                toggleMenu();
            }
        });
    });
    
    // ==================== CAMBIAR FONDO DEL HEADER CON SCROLL ====================
    // (Sin cambios, tu código aquí es correcto)
    const handleScrollHeader = () => {
        header.classList.toggle('scrolled', window.scrollY >= 50);
    };
    window.addEventListener('scroll', handleScrollHeader);

    // ==================== ANIMACIONES GENERALES AL HACER SCROLL ====================
    // (Sin cambios, tu código aquí es correcto)
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
    // (Sin cambios, tu código aquí es correcto)
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