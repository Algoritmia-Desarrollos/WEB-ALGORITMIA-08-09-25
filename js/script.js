document.addEventListener('DOMContentLoaded', () => {

    // ==================== VARIABLES GLOBALES ====================
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

// ==================== LÓGICA DEL PRELOADER Y ANIMACIÓN DEL TÍTULO ====================
window.addEventListener('load', () => {
    // La animación CSS del preloader se ejecuta automáticamente.
    // Esperamos a que termine (dura 2.5s) antes de ocultar el preloader y mostrar el contenido.
    const PRELOADER_ANIMATION_DURATION = 2500; // 2.5 segundos (debe coincidir con la duración en CSS)

    setTimeout(() => {
        // Oculta el elemento preloader
        preloader.classList.add('loaded');
        // Muestra el contenido principal de la web
        mainContent.classList.add('loaded');

        // La animación del título del Hero comienza justo después de que el preloader desaparece
        const heroTitleSpans = document.querySelectorAll('.hero-title span:not(.line)');
        heroTitleSpans.forEach((span, idx) => {
            setTimeout(() => {
                span.style.transform = 'translateY(0)';
            }, idx * 100); // Retraso escalonado para cada línea de texto
        });

    }, PRELOADER_ANIMATION_DURATION);
});
    // ==================== MENÚ MÓVIL (MÁS ROBUSTO) ====================
    const toggleMenu = () => {
        navMenu.classList.toggle('show-menu');
        document.body.classList.toggle('menu-open'); // Bloquea/desbloquea el scroll del body
    };

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', toggleMenu);
    }

    // Cierra el menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
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
                const delay = entry.target.dataset.delay ? parseFloat(entry.target.dataset.delay) * 1000 : 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                obs.unobserve(entry.target); // Deja de observar el elemento una vez animado
            }
        });
    }, { threshold: 0.1 }); // Se activa cuando el 10% del elemento es visible

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