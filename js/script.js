document.addEventListener('DOMContentLoaded', () => {

    // ==================== VARIABLES GLOBALES ====================
    const header = document.getElementById('header');
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

// ==================== LÓGICA DEL PRELOADER Y CARGA OPTIMIZADA ====================

// El preloader gira mientras este script detecta cuándo la imagen más importante (la del hero) ha cargado.
// Una vez cargada, se lanza la animación de salida y se muestra el contenido.

// Ruta a la imagen de fondo del Hero, que es nuestro contenido crítico.
const heroImageSrc = './img/fondoalgo4.webp'; 

// Creamos un objeto de imagen en memoria para poder detectar cuándo ha cargado.
const criticalImage = new Image();

// Asignamos la función que se ejecutará cuando la imagen crítica haya terminado de cargar.
criticalImage.onload = () => {
    // 1. La imagen del hero ya está lista. Ahora podemos empezar la animación de salida del preloader.
    //    Añadimos la clase 'loaded' que, según tu CSS, dispara la animación de expansión del logo.
    preloader.classList.add('loaded');

    // 2. La animación del preloader dura 2.5 segundos (2500ms), según tu CSS.
    //    Sincronizamos la aparición del contenido con esa animación para una transición suave.
    const ANIMATION_DURATION = 500;

    // 3. Hacemos que el contenido principal aparezca un poco antes de que la animación termine.
    setTimeout(() => {
        mainContent.classList.add('loaded');
        // Disparamos un evento de scroll para activar animaciones que ya sean visibles.
        window.dispatchEvent(new Event('scroll'));
    }, ANIMATION_DURATION - 500); // Aparece 0.5s antes de que el logo termine de expandirse.

    // 4. Una vez concluida la animación, eliminamos el preloader del DOM para que no interfiera.
    setTimeout(() => {
        preloader.style.display = 'none';
    }, ANIMATION_DURATION);
};

// 5. Le decimos al objeto que empiece a cargar la imagen del Hero.
//    El navegador hará esto en segundo plano mientras el logo del preloader ya está girando.
criticalImage.src = heroImageSrc;

    // ==================== CURSOR INTERACTIVO ====================
    // No ejecutar en dispositivos táctiles
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

  

    // ==================== EFECTO TILT 3D EN TARJETAS ====================
    const tiltElements = document.querySelectorAll('.service-card, .advantage-card');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) / (width / 2);
            const y = (e.clientY - top - height / 2) / (height / 2);
            el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.05, 1.05, 1.05)`;
            el.style.transition = 'transform 0.1s';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
            el.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        });
    });
    
    // ==================== MENÚ MÓVIL ====================
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