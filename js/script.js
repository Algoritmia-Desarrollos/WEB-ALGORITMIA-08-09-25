document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Lógica para el header dinámico (más delgado al hacer scroll)
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // 2. Lógica para el carrusel de testimonios
    const testimonialsSwiper = new Swiper('.testimonials-slider', {
        // Opciones de configuración
        loop: true, // Bucle infinito
        autoplay: {
            delay: 4000, // Pasa cada 4 segundos
            disableOnInteraction: false,
        },
        slidesPerView: 1, // Muestra 1 testimonio a la vez en móvil
        spaceBetween: 30, // Espacio entre slides
        
        // Paginación (los puntos de abajo)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // Responsive: Muestra más testimonios en pantallas grandes
        breakpoints: {
            // Cuando la ventana es >= 768px
            768: {
              slidesPerView: 2,
              spaceBetween: 30
            },
            // Cuando la ventana es >= 1024px
            1024: {
              slidesPerView: 3,
              spaceBetween: 30
            }
        }
    });
});