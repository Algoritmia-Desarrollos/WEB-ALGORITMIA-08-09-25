// script.js

// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', function () {
    
    // Inicializar el carrusel de la sección Hero
    const heroSwiper = new Swiper('.hero .swiper', {
        // Opciones de configuración
        loop: true,
        autoplay: {
            delay: 3000,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Código para el modal del formulario
    const applyButton = document.getElementById('apply-button');
    const modal = document.getElementById('form-modal');
    const closeModalButton = document.getElementById('close-modal-button');

    if (applyButton) {
        applyButton.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

});