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

    /* ==================== MENÚ MÓVIL ==================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
    if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('show-menu'));
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
    
    /* ==================== LÓGICA PARA EL EFECTO DE TARJETAS APILADAS (FINAL) ==================== */
    const advantagesSection = document.querySelector('.advantages-section');
    const advantageCards = document.querySelectorAll('.advantage-card');

    if (window.innerWidth > 992 && advantagesSection && advantageCards.length > 0) {
        window.addEventListener('scroll', () => {
            const sectionRect = advantagesSection.getBoundingClientRect();
            
            // Solo ejecutar la lógica cuando la sección está en la vista
            if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
                // Altura total de scroll para la animación (sección - altura de la pantalla)
                const scrollableHeight = advantagesSection.offsetHeight - window.innerHeight;
                // Progreso del scroll dentro de la sección (de 0 a 1), asegurándose que no sea negativo
                const progress = Math.max(0, -sectionRect.top / scrollableHeight);
                
                // Determinar qué tarjeta debe estar activa
                // Se usa `progress * (longitud + 1)` para dar espacio al final y al principio
                let activeIndex = Math.floor(progress * (advantageCards.length + 1)) - 1;
                activeIndex = Math.max(-1, Math.min(activeIndex, advantageCards.length - 1));


                advantageCards.forEach((card, index) => {
                    if (index < activeIndex) {
                        // Tarjetas que ya pasaron y se apilan
                        card.classList.add('is-passed');
                        card.classList.remove('is-active');
                        card.style.setProperty('--stack-order', activeIndex - index);
                    } else if (index === activeIndex) {
                        // La tarjeta activa
                        card.classList.add('is-active');
                        card.classList.remove('is-passed');
                    } else {
                        // Tarjetas que aún no han aparecido o que se han "des-scrolleado"
                        card.classList.remove('is-active');
                        card.classList.remove('is-passed');
                    }
                });
            }
        });
    }

});