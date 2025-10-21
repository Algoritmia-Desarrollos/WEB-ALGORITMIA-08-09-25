document.addEventListener('DOMContentLoaded', () => {

    // ==================== VARIABLES GLOBALES ====================
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle'); 
    const navLinks = document.querySelectorAll('.nav-link');

    let navToggleIcon; 

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
        if (navToggleIcon) {
            navToggleIcon.classList.toggle('bx-menu', !isMenuOpen);
            navToggleIcon.classList.toggle('bx-x', isMenuOpen);
        }
    };
    if (navToggle) {
        navToggleIcon = navToggle.querySelector('i'); 
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
            if (entry.isIntersecting && 
                !entry.target.classList.contains('service-card-path') && 
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


    // ==================== FUNCIÓN DEBOUNCE (Usada solo por el Header ahora) =====================
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

    // --- Constante de suavizado (0.1 = suave y fluido) ---
    const SMOOTHING_FACTOR = 0.1;

    // --- Lógica para "Servicios" (Cápsula) ---
    const serviceCards = document.querySelectorAll('#servicios .service-card-path');
    const servicesPath = document.getElementById('servicesPath');
    const pathIndicator = document.getElementById('path-indicator-capsule'); 
    const servicesSection = document.getElementById('servicios'); 
    const servicesContainer = document.querySelector('#servicios .services-path-container'); 
    let servicesPathLength = 0; 
    let servicesIndicator_currentPos = { x: 0, y: 0 };
    let servicesIndicator_targetPos = { x: 0, y: 0 };
    let servicesAnimationId = null;

    if (servicesPath && servicesContainer) { 
        setTimeout(() => { 
            try {
                servicesPathLength = servicesPath.getTotalLength(); 
                const startPoint = servicesPath.getPointAtLength(0);
                servicesIndicator_currentPos = { x: startPoint.x, y: startPoint.y };
                servicesIndicator_targetPos = { x: startPoint.x, y: startPoint.y };
                pathIndicator.setAttribute('cx', startPoint.x);
                pathIndicator.setAttribute('cy', startPoint.y);
                
                startServicesAnimationLoop(); // Iniciar bucle de animación
                handleServiceHighlightOnScroll(); // Ejecutar una vez
            } catch(e) { console.error("Error getting services path length:", e); }
        }, 100); 
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
        if (serviceCards.length === 0 || !servicesPath || !pathIndicator || !servicesSection || servicesPathLength === 0 || !servicesContainer) return; 

        const viewportCenterY = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;
        
        serviceCards.forEach((card) => { 
            const cardRect = card.getBoundingClientRect();
            if (cardRect.bottom < (viewportCenterY - cardRect.height * 0.5) || cardRect.top > (viewportCenterY + cardRect.height * 0.5)) {
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

        if (!isNaN(scrollProgress)) {
            const point = servicesPath.getPointAtLength(scrollProgress * servicesPathLength);
            servicesIndicator_targetPos = { x: point.x, y: point.y };
        }
    };
    window.addEventListener('scroll', handleServiceHighlightOnScroll); 


    // =========================================================================
    // === CÓDIGO DUPLICADO PARA "PROCESO" (CORREGIDO) ===
    // =========================================================================

    const procesoCards = document.querySelectorAll('#proceso .service-card-path');
    const procesoPath = document.getElementById('procesoPath');
    const procesoIndicator = document.getElementById('proceso-indicator-capsule'); 
    const procesoSection = document.getElementById('proceso'); 
    // CORRECCIÓN: Apunta al selector de CSS correcto
    const procesoContainer = document.querySelector('#proceso .services-path-container'); 
    let procesoPathLength = 0; 
    let procesoIndicator_currentPos = { x: 0, y: 0 };
    let procesoIndicator_targetPos = { x: 0, y: 0 };
    let procesoAnimationId = null;

    if (procesoPath && procesoContainer) { 
        setTimeout(() => { 
            try {
                procesoPathLength = procesoPath.getTotalLength(); 
                const startPoint = procesoPath.getPointAtLength(0);
                procesoIndicator_currentPos = { x: startPoint.x, y: startPoint.y };
                procesoIndicator_targetPos = { x: startPoint.x, y: startPoint.y };
                procesoIndicator.setAttribute('cx', startPoint.x);
                procesoIndicator.setAttribute('cy', startPoint.y);
                
                startProcesoAnimationLoop(); // Iniciar bucle de animación
                handleProcesoHighlightOnScroll(); // Ejecutar una vez
            } catch(e) { console.error("Error getting proceso path length:", e); }
        }, 100); 
    }

    function startProcesoAnimationLoop() {
        if (procesoAnimationId) cancelAnimationFrame(procesoAnimationId);
        function loop() {
            const dx = procesoIndicator_targetPos.x - procesoIndicator_currentPos.x;
            const dy = procesoIndicator_targetPos.y - procesoIndicator_currentPos.y;

            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                procesoIndicator_currentPos.x += dx * SMOOTHING_FACTOR;
                procesoIndicator_currentPos.y += dy * SMOOTHING_FACTOR;
                procesoIndicator.setAttribute('cx', procesoIndicator_currentPos.x);
                procesoIndicator.setAttribute('cy', procesoIndicator_currentPos.y);
            }
            procesoAnimationId = requestAnimationFrame(loop);
        }
        loop();
    }

    const handleProcesoHighlightOnScroll = () => { 
        if (procesoCards.length === 0 || !procesoPath || !procesoIndicator || !procesoSection || procesoPathLength === 0 || !procesoContainer) return; 

        const viewportCenterY = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;
        
        procesoCards.forEach((card) => { 
            const cardRect = card.getBoundingClientRect();
            if (cardRect.bottom < (viewportCenterY - cardRect.height * 0.5) || cardRect.top > (viewportCenterY + cardRect.height * 0.5)) {
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
        procesoCards.forEach(card => {
            card.classList.toggle('highlighted', card === closestCard);
        });

        let scrollProgress = 0;
        const containerRect = procesoContainer.getBoundingClientRect();
        const scrollStartPoint = containerRect.top + window.scrollY - (window.innerHeight / 2);
        const scrollEndPoint = (containerRect.top + containerRect.height) + window.scrollY - (window.innerHeight / 2);
        const totalScrollDistance = scrollEndPoint - scrollStartPoint;
        scrollProgress = (window.scrollY - scrollStartPoint) / totalScrollDistance;
        scrollProgress = Math.max(0, Math.min(1, scrollProgress)); 

        if (!isNaN(scrollProgress)) {
            const point = procesoPath.getPointAtLength(scrollProgress * procesoPathLength);
            procesoIndicator_targetPos = { x: point.x, y: point.y };
        }
    };
    window.addEventListener('scroll', handleProcesoHighlightOnScroll); 

    // =========================================================================
    // === FIN CÓDIGO DUPLICADO PARA "PROCESO" ===
    // =========================================================================


    
    // --- Lógica para "Ventajas" (La "Bola") ---
    const advantageCards = document.querySelectorAll('#ventajas .service-card-path');
    const advantagesPath = document.getElementById('advantagesPath');
    const advantagesIndicator = document.getElementById('advantages-indicator');
    const advantagesSection = document.getElementById('ventajas');
    const advantagesContainer = document.querySelector('#ventajas .advantages-card-list');
    let advantagesPathLength = 0;
    let advantagesIndicator_currentPos = { x: 0, y: 0 };
    let advantagesIndicator_targetPos = { x: 0, y: 0 };
    let advantagesAnimationId = null;

    if (advantagesPath && advantagesContainer) {
        setTimeout(() => { 
            try {
                advantagesPathLength = advantagesPath.getTotalLength(); 
                const startPoint = advantagesPath.getPointAtLength(0);
                advantagesIndicator_currentPos = { x: startPoint.x, y: startPoint.y };
                advantagesIndicator_targetPos = { x: startPoint.x, y: startPoint.y };
                advantagesIndicator.setAttribute('cx', startPoint.x);
                advantagesIndicator.setAttribute('cy', startPoint.y);
                
                startAdvantagesAnimationLoop(); // Iniciar bucle de animación
                handleAdvantageHighlightOnScroll(); // Ejecutar una vez
            } catch(e) { console.error("Error getting advantages path length:", e); }
        }, 100); 
    }
    
    function startAdvantagesAnimationLoop() {
        if (advantagesAnimationId) cancelAnimationFrame(advantagesAnimationId);
        function loop() {
            const dy = advantagesIndicator_targetPos.y - advantagesIndicator_currentPos.y;
            if (Math.abs(dy) > 0.1) {
                advantagesIndicator_currentPos.y += dy * SMOOTHING_FACTOR;
                advantagesIndicator.setAttribute('cy', advantagesIndicator_currentPos.y);
            }
            advantagesAnimationId = requestAnimationFrame(loop);
        }
        loop();
    }

    const handleAdvantageHighlightOnScroll = () => {
        if (advantageCards.length === 0 || !advantagesPath || !advantagesIndicator || !advantagesSection || advantagesPathLength === 0 || !advantagesContainer) return; 

        const viewportCenterY = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;

        advantageCards.forEach((card) => { 
            const cardRect = card.getBoundingClientRect();
             if (cardRect.bottom < (viewportCenterY - cardRect.height * 0.5) || cardRect.top > (viewportCenterY + cardRect.height * 0.5)) {
                 card.classList.remove('highlighted');
                 return;
             }
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const distance = Math.abs(viewportCenterY - cardCenterY);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        advantageCards.forEach(card => { 
            card.classList.toggle('highlighted', card === closestCard);
        });

        let scrollProgress = 0;
        const containerRect = advantagesContainer.getBoundingClientRect();
        const scrollStartPoint = containerRect.top + window.scrollY - (window.innerHeight / 2);
        const scrollEndPoint = (containerRect.top + containerRect.height) + window.scrollY - (window.innerHeight / 2);
        const totalScrollDistance = scrollEndPoint - scrollStartPoint;
        scrollProgress = (window.scrollY - scrollStartPoint) / totalScrollDistance;
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));
        
        if (!isNaN(scrollProgress)) {
            const point = advantagesPath.getPointAtLength(scrollProgress * advantagesPathLength);
            advantagesIndicator_targetPos = { x: point.x, y: point.y };
        }
    };
    window.addEventListener('scroll', handleAdvantageHighlightOnScroll);

    
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