document.addEventListener('DOMContentLoaded', () => {

    /* ==================== LÓGICA DEL PRELOADER ==================== */
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const heroTitleSpans = document.querySelectorAll('.hero-title span:not(.line)');

    window.addEventListener('load', () => {
        preloader.classList.add('loaded');
        mainContent.classList.add('loaded');
        
        heroTitleSpans.forEach((span, idx) => {
            setTimeout(() => {
                span.style.transform = 'translateY(0)';
            }, (idx * 100) + 500);
        });
    });

    /* ==================== MENÚ MÓVIL (CORREGIDO Y MEJORADO) ==================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    // Función para abrir el menú
    if (navToggle) {
        navToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el clic se propague al documento
            navMenu.classList.add('show-menu');
        });
    }

    // Función para cerrar el menú con el botón 'X'
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Función para cerrar el menú haciendo clic en los enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    // Función para cerrar el menú haciendo clic FUERA de él
    document.addEventListener('click', (event) => {
        // Si el menú está abierto y el clic NO fue dentro del menú
        if (navMenu.classList.contains('show-menu') && !navMenu.contains(event.target)) {
            navMenu.classList.remove('show-menu');
        }
    });

    // Evita que hacer clic dentro del menú lo cierre
    navMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });


    /* ==================== CAMBIAR FONDO DEL HEADER CON SCROLL ==================== */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY >= 50);
    });

    /* ==================== ANIMACIONES GENERALES AL HACER SCROLL ==================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    /* ==================== LÓGICA DEL CAROUSEL INFINITO (PORTFOLIO Y TESTIMONIALS) ==================== */
    document.querySelectorAll(".scroller").forEach(scroller => {
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

});