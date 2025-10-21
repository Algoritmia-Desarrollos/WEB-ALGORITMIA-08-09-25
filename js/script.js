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
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); 

    // ==================== ANIMACIONES ON SCROLL (GENERALES) ====================
    const generalObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // No aplicar a los items de servicio ni ventajas (tienen su propia lógica)
            if (entry.isIntersecting && 
                !entry.target.classList.contains('service-card-path') && 
                !entry.target.classList.contains('service-path-item') &&
                !entry.target.classList.contains('advantage-card-list-item') && // Excluir tarjetas de ventajas
                !entry.target.classList.contains('advantages-list-container') && // Excluir contenedor lista ventajas
                !entry.target.classList.contains('advantages-progress-indicator') // Excluir indicador ventajas
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
                 const originalItemCount = scrollerInner.querySelectorAll('img').length;
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
    const testimonialScroller = document.querySelector('#testimonios .scroller');
    if(testimonialScroller) initializeScroller(testimonialScroller);

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

    // ==================== HIGHLIGHT SCROLL SERVICIOS Y TREN SVG =====================
    const serviceCards = document.querySelectorAll('.service-card-path');
    const servicesPath = document.getElementById('servicesPath');
    const pathIndicator = document.getElementById('path-indicator-capsule'); 
    const servicesSection = document.getElementById('servicios'); 
    const servicesContainer = document.querySelector('.services-path-container'); 

    let servicesPathLength = 0; 
    if (servicesPath && servicesContainer) { 
        setTimeout(() => { 
            try {
                servicesPathLength = servicesPath.getTotalLength(); 
                handleServiceHighlightOnScroll(); 
            } catch(e) { console.error("Error getting services path length:", e); }
        }, 100); 
    }

    const handleServiceHighlightOnScroll = () => { 
        if (serviceCards.length === 0 || !servicesPath || !pathIndicator || !servicesSection || servicesPathLength === 0 || !servicesContainer) return; 

        const viewportCenterY = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;
        let activeIndex = -1; // Guardar índice
        
        serviceCards.forEach((card, index) => { // Añadir índice
            const cardRect = card.getBoundingClientRect();
            // Solo considerar tarjetas parcialmente visibles para highlight
            if (cardRect.bottom < (viewportCenterY - cardRect.height * 0.5) || cardRect.top > (viewportCenterY + cardRect.height * 0.5)) { // Ajustar umbral basado en altura tarjeta
                 card.classList.remove('highlighted'); 
            } else {
                 const cardCenterY = cardRect.top + cardRect.height / 2;
                 const distance = Math.abs(viewportCenterY - cardCenterY);
                 if (distance < minDistance) {
                     minDistance = distance;
                     closestCard = card;
                     activeIndex = index; // Guardar el índice
                 }
            }
        });
        serviceCards.forEach(card => {
            card.classList.toggle('highlighted', card === closestCard);
        });

        // --- Posición del Indicador (tren) ---
        let scrollProgress = 0;
        const numServiceCards = serviceCards.length;
        if(activeIndex !== -1) {
            // Mapear el índice activo (0 a N-1) a un progreso (0 a 1)
            scrollProgress = activeIndex / (numServiceCards - 1);
        } else {
             // Si ninguna tarjeta está activa (muy arriba o muy abajo), calcular basado en la visibilidad general
             const sectionRect = servicesSection.getBoundingClientRect();
             const scrollStartPoint = sectionRect.top + window.scrollY - window.innerHeight * 0.8; 
             const scrollEndPoint = sectionRect.bottom + window.scrollY - window.innerHeight * 0.2; 
             const totalScrollDistance = scrollEndPoint - scrollStartPoint;
             scrollProgress = (window.scrollY - scrollStartPoint) / totalScrollDistance;
             scrollProgress = Math.max(0, Math.min(1, scrollProgress)); 
        }

        if (!isNaN(scrollProgress)) {
            const point = servicesPath.getPointAtLength(scrollProgress * servicesPathLength);
            pathIndicator.setAttribute('cx', point.x);
            pathIndicator.setAttribute('cy', point.y);
        }
    };

    window.addEventListener('scroll', debounce(handleServiceHighlightOnScroll, 10)); 
    // handleServiceHighlightOnScroll se llama ahora después de calcular pathLength

     // ==================== HIGHLIGHT SCROLL VENTAJAS Y BARRA PROGRESO =====================
    const advantageCards = document.querySelectorAll('.advantage-card-list-item');
    const advantagesProgressBar = document.querySelector('#ventajas .progress-bar'); 
    const advantagesList = document.querySelector('.advantages-list-container'); 
    
    const handleAdvantageHighlightOnScroll = () => {
        // Asegurarse que solo afecte las tarjetas dentro de .advantages-list-container
        const cardsInList = advantagesList ? advantagesList.querySelectorAll('.advantage-card-list-item') : [];
        if (cardsInList.length === 0 || !advantagesProgressBar || !advantagesList) return; 

        const viewportCenterY = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;
        let activeIndex = -1; 

        cardsInList.forEach((card, index) => { 
            const cardRect = card.getBoundingClientRect();
             if (cardRect.bottom < 0 || cardRect.top > window.innerHeight) {
                 card.classList.remove('highlighted');
                 return;
             }
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const distance = Math.abs(viewportCenterY - cardCenterY);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
                activeIndex = index; 
            }
        });

        cardsInList.forEach(card => { 
            card.classList.toggle('highlighted', card === closestCard);
        });

        let progress = 0;
        const totalCardsInList = cardsInList.length; 
        if (activeIndex !== -1 && totalCardsInList > 0) {
            progress = (activeIndex + 1) / totalCardsInList; 
        }
        
        advantagesProgressBar.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', debounce(handleAdvantageHighlightOnScroll, 50)); 
    handleAdvantageHighlightOnScroll(); 

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