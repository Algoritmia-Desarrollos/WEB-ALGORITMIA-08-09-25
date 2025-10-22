document.addEventListener('DOMContentLoaded', () => {

    // ==================== VARIABLES GLOBALES ====================
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // ==================== PRELOADER ====================
    if (preloader) {
        preloader.classList.add('loaded');
        const ANIMATION_DURATION = 1000;
        setTimeout(() => {
            if (mainContent) mainContent.classList.add('loaded');
            window.dispatchEvent(new Event('scroll'));
        }, ANIMATION_DURATION / 2);
        setTimeout(() => {
            preloader.style.display = 'none';
        }, ANIMATION_DURATION);
    } else {
         if (mainContent) mainContent.classList.add('loaded');
        window.dispatchEvent(new Event('scroll'));
    }

    // ==================== MENÚ MÓVIL ====================
    const toggleMenu = () => {
        if (!navMenu || !navToggle) return;
        const isMenuOpen = navMenu.classList.toggle('show-menu');
        document.body.classList.toggle('menu-open', isMenuOpen);

        // Ocultamos/mostramos el botón hamburguesa (navToggle)
        if (isMenuOpen) {
            navToggle.style.display = 'none';
        } else {
            navToggle.style.display = 'block';
        }
    };
    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
        const navClose = document.getElementById('nav-close');
        if (navClose) navClose.addEventListener('click', toggleMenu);
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('show-menu')) {
                toggleMenu();
            }
        });
    });

    // ==================== HEADER SCROLL ====================
    const handleScrollHeader = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY >= 50);
    };
    window.addEventListener('scroll', debounce(handleScrollHeader, 15, true));
    handleScrollHeader();

    // ==================== ANIMACIONES ON SCROLL (GENERALES) ====================
    const generalObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // === MODIFICADO === Excluimos también las tarjetas de #proceso
            if (entry.isIntersecting &&
                !entry.target.classList.contains('service-card-path') && // Excluye servicios y ventajas
                !entry.target.classList.contains('service-path-item')
                ) {
                entry.target.classList.add('animated');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => generalObserver.observe(el));


    // ==================== FUNCIÓN PARA INICIALIZAR SCROLLERS ====================
    const initializeScroller = (scrollerElement) => {
        if (!scrollerElement || scrollerElement.getAttribute('data-animated') === 'true') return;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            scrollerElement.setAttribute('data-animated', true);
            const scrollerInner = scrollerElement.querySelector(".scroller__inner");
            if (scrollerInner) {
                 const originalItemCount = scrollerInner.querySelectorAll('img, .testimonial-card').length;
                 const currentItemCount = scrollerInner.children.length;
                 if (originalItemCount > 0 && currentItemCount <= originalItemCount) {
                     const scrollerContent = Array.from(scrollerInner.children);
                     scrollerContent.forEach(item => {
                         const duplicatedItem = item.cloneNode(true);
                         duplicatedItem.setAttribute("aria-hidden", true);
                         scrollerInner.appendChild(duplicatedItem);
                     });
                 }
            }
        }
    }
    const testimonialScrollers = document.querySelectorAll('#testimonios .scroller');
    if (testimonialScrollers.length > 0) {
        testimonialScrollers.forEach(scroller => initializeScroller(scroller));
    }


    // ==================== FUNCIÓN DEBOUNCE =====================
    function debounce(func, wait = 15, immediate = false) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    // =========================================================================
    // === INICIO DE LA MEJORA DE FLUIDEZ (ANIMACIÓN SVG CON LERP) ===
    // =========================================================================

    const SMOOTHING_FACTOR = 0.1;

    // =========================================================================
    // === LÓGICA "SERVICIOS" (CON SWAP DE PATH Y HIGHLIGHT EN SCROLL) ===
    // =========================================================================
    const serviceCards = document.querySelectorAll('#servicios .service-card-path');
    const servicesPathDesktop = document.getElementById('servicesPathDesktop');
    const servicesPathMobile = document.getElementById('servicesPathMobile');
    const pathIndicator = document.getElementById('path-indicator-capsule');
    const servicesSection = document.getElementById('servicios');
    const servicesContainer = document.querySelector('#servicios .services-path-container');

    let servicesPath;
    let servicesPathLength = 0;
    let servicesIndicator_currentPos = { x: 0, y: 0 };
    let servicesIndicator_targetPos = { x: 0, y: 0 };
    let servicesAnimationId = null;

    function updateAndInitializeServicesPath() {
        if (!servicesPathDesktop || !servicesPathMobile || !pathIndicator) return;

        if (window.getComputedStyle(servicesPathMobile).display !== 'none') {
            servicesPath = servicesPathMobile;
        } else {
            servicesPath = servicesPathDesktop;
        }

        try {
            servicesPathLength = servicesPath.getTotalLength();
            const startPoint = servicesPath.getPointAtLength(0);

            if (!servicesAnimationId) {
                servicesIndicator_currentPos = { x: startPoint.x, y: startPoint.y };
                pathIndicator.setAttribute('cx', startPoint.x);
                pathIndicator.setAttribute('cy', startPoint.y);
            }
            servicesIndicator_targetPos = { x: startPoint.x, y: startPoint.y };

        } catch(e) {
            console.error("Error getting services path length:", e);
            servicesPathLength = 0;
        }
    }

    if (servicesContainer) {
        setTimeout(() => {
            updateAndInitializeServicesPath();

            if (servicesPathLength > 0) {
                startServicesAnimationLoop();
                handleServiceHighlightOnScroll();
            }
        }, 100);

        window.addEventListener('resize', debounce(updateAndInitializeServicesPath, 200));
    }

    function startServicesAnimationLoop() {
        if (servicesAnimationId) cancelAnimationFrame(servicesAnimationId);
        function loop() {
            const dx = servicesIndicator_targetPos.x - servicesIndicator_currentPos.x;
            const dy = servicesIndicator_targetPos.y - servicesIndicator_currentPos.y;

            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                servicesIndicator_currentPos.x += dx * SMOOTHING_FACTOR;
                servicesIndicator_currentPos.y += dy * SMOOTHING_FACTOR;
                pathIndicator.setAttribute('cx', servicesIndicator_currentPos.x);
                pathIndicator.setAttribute('cy', servicesIndicator_currentPos.y);
            }
            servicesAnimationId = requestAnimationFrame(loop);
        }
        loop();
    }

    const handleServiceHighlightOnScroll = () => {
        if (serviceCards.length === 0 || !pathIndicator || !servicesSection || servicesPathLength === 0 || !servicesContainer) return;

        const viewportCenterY = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;

        serviceCards.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            // === MODIFICADO === Agregamos un margen para activar el highlight un poco antes/después
            const activationMargin = cardRect.height * 0.3; // 30% de la altura
            if (cardRect.bottom < (viewportCenterY - activationMargin) || cardRect.top > (viewportCenterY + activationMargin)) {
                 card.classList.remove('highlighted');
            } else {
                 const cardCenterY = cardRect.top + cardRect.height / 2;
                 const distance = Math.abs(viewportCenterY - cardCenterY);
                 if (distance < minDistance) {
                     minDistance = distance;
                     closestCard = card;
                 }
            }
        });
        serviceCards.forEach(card => {
            card.classList.toggle('highlighted', card === closestCard);
        });

        let scrollProgress = 0;
        const containerRect = servicesContainer.getBoundingClientRect();
        const scrollStartPoint = containerRect.top + window.scrollY - (window.innerHeight / 2);
        const scrollEndPoint = (containerRect.top + containerRect.height) + window.scrollY - (window.innerHeight / 2);
        const totalScrollDistance = scrollEndPoint - scrollStartPoint;
        scrollProgress = (window.scrollY - scrollStartPoint) / totalScrollDistance;
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        if (!isNaN(scrollProgress) && servicesPath) {
            try {
                const point = servicesPath.getPointAtLength(scrollProgress * servicesPathLength);
                servicesIndicator_targetPos = { x: point.x, y: point.y };
            } catch(e) {
                // Previene error si servicesPathLength es 0
            }
        }
    };
    window.addEventListener('scroll', handleServiceHighlightOnScroll);

    // =========================================================================
    // === FIN LÓGICA "SERVICIOS" ===
    // =========================================================================


    // =========================================================================
    // === AÑADIDO: LÓGICA HIGHLIGHT EN SCROLL PARA VENTAJAS (RESPONSIVE) ===
    // =========================================================================
    const advantageCards = document.querySelectorAll('#proceso .service-card-path');
    const RESPONSIVE_BREAKPOINT = 992; // El mismo breakpoint que usas en CSS

    const handleAdvantageHighlightResponsive = () => {
        // Solo ejecutar en pantallas menores o iguales al breakpoint
        if (window.innerWidth > RESPONSIVE_BREAKPOINT) {
            // Si estamos en escritorio, quitamos la clase de todas las tarjetas (el hover CSS se encargará)
            advantageCards.forEach(card => card.classList.remove('highlighted'));
            return;
        }

        const viewportCenterY = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;

        advantageCards.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            // Usamos el mismo margen de activación que en servicios
            const activationMargin = cardRect.height * 0.3;
            if (cardRect.bottom < (viewportCenterY - activationMargin) || cardRect.top > (viewportCenterY + activationMargin)) {
                card.classList.remove('highlighted');
            } else {
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const distance = Math.abs(viewportCenterY - cardCenterY);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            }
        });

        // Aplicar la clase solo a la tarjeta más cercana
        advantageCards.forEach(card => {
            card.classList.toggle('highlighted', card === closestCard);
        });
    };

    // Llamar la función al cargar y en cada scroll
    window.addEventListener('scroll', handleAdvantageHighlightResponsive);
    // Llamar también al redimensionar, por si se cambia de tamaño de ventana
    window.addEventListener('resize', debounce(handleAdvantageHighlightResponsive, 100));
    // Ejecutar una vez al inicio
    handleAdvantageHighlightResponsive();

    // =========================================================================
    // === FIN LÓGICA VENTAJAS RESPONSIVE ===
    // =========================================================================


    // ==================== TABS PORTFOLIO ===============================
    const portfolioTabs = document.querySelectorAll('.portfolio-tab');
    const portfolioPanels = document.querySelectorAll('.portfolio-content-panel');

    if (portfolioTabs.length > 0 && portfolioPanels.length > 0) {
        portfolioTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = tab.getAttribute('data-tab');
                portfolioTabs.forEach(t => t.classList.remove('active'));
                portfolioPanels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const activePanel = document.getElementById(tabId);
                if (activePanel) {
                    activePanel.classList.add('active');
                    if (tabId === 'panel-web') {
                        const webScrollers = activePanel.querySelectorAll('.scroller');
                        webScrollers.forEach(scroller => initializeScroller(scroller));
                    }
                }
            });
        });
        const initialActiveTab = document.querySelector('.portfolio-tab.active');
        if (initialActiveTab && initialActiveTab.getAttribute('data-tab') === 'panel-web') {
             const initialWebScrollers = document.querySelectorAll('#panel-web .scroller');
             initialWebScrollers.forEach(scroller => initializeScroller(scroller));
        }
    }

}); // Fin DOMContentLoaded