document.addEventListener('DOMContentLoaded', () => {

    // ==================== VARIABLES GLOBALES ====================
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle'); // Puede ser null
    const navLinks = document.querySelectorAll('.nav-link');

    // --- OPTIMIZACIÓN DE MENÚ ---
    let navToggleIcon; // Lo declaramos aquí sin asignarlo

    // ==================== LÓGICA DEL PRELOADER MEJORADA ====================
    if (preloader) {
        // Ejecutamos la salida del preloader INMEDIATAMENTE después de que el DOM esté listo.
        preloader.classList.add('loaded');

        const ANIMATION_DURATION = 2000; // Sincronizado con la animación CSS simplificada (opcional)

        setTimeout(() => {
            if (mainContent) {
                mainContent.classList.add('loaded');
            }
            // Disparamos un evento de scroll para activar animaciones que ya sean visibles.
            window.dispatchEvent(new Event('scroll'));
        }, ANIMATION_DURATION - 1500); // 500ms antes del final

        setTimeout(() => {
            preloader.style.display = 'none'; // Eliminación final del preloader
        }, ANIMATION_DURATION);
    } else {
        // Si no hay preloader, mostrar contenido directamente
         if (mainContent) {
            mainContent.classList.add('loaded');
        }
        window.dispatchEvent(new Event('scroll'));
    }

    // ==================== EFECTO TILT 3D EN TARJETAS (Eliminado) ====================
    // El código para el efecto tilt ha sido removido.

    // ==================== CURSOR INTERACTIVO (Eliminado) ====================
    // El código para el cursor personalizado ha sido removido.

    // ==================== MENÚ MÓVIL (MODIFICADO Y PROTEGIDO) ====================
    const toggleMenu = () => {
        if (!navMenu || !navToggle) return; // Chequeo de seguridad

        const isMenuOpen = navMenu.classList.toggle('show-menu');
        document.body.classList.toggle('menu-open', isMenuOpen);

        // Cambiar icono del toggle (Hamburguesa <-> X)
        if (navToggleIcon) {
            if (isMenuOpen) {
                navToggleIcon.classList.remove('bx-menu');
                navToggleIcon.classList.add('bx-x');
            } else {
                navToggleIcon.classList.remove('bx-x');
                navToggleIcon.classList.add('bx-menu');
            }
        }
    };

    if (navToggle) {
        navToggleIcon = navToggle.querySelector('i'); // Asignamos el ícono aquí
        navToggle.addEventListener('click', toggleMenu);

        // Añadir listener para el botón de cierre si existe (aunque ahora esté en el toggle)
        const navClose = document.getElementById('nav-close');
        if (navClose) {
            navClose.addEventListener('click', toggleMenu); // El mismo toggle cierra
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('show-menu')) {
                toggleMenu(); // Cerrar menú al hacer clic en un enlace
            }
        });
    });

    // ==================== CAMBIAR FONDO DEL HEADER CON SCROLL ====================
    const handleScrollHeader = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY >= 50);
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Ejecutar una vez al cargar por si la página carga scrolleada

    // ==================== ANIMACIONES GENERALES AL HACER SCROLL ====================
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Umbral más bajo para activar antes

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ==================== LÓGICA DEL CAROUSEL INFINITO (Mantenido) ====================
    const scrollers = document.querySelectorAll(".scroller");
    if (scrollers.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        scrollers.forEach(scroller => {
            scroller.setAttribute('data-animated', true); // Marcar para CSS
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