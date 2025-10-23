document.addEventListener('DOMContentLoaded', () => {
    // === INICIALIZACIÓN DE EMAILJS ===
    const EMAILJS_PUBLIC_KEY = '3bkxlvg4klx2DB5rd'; // TU PUBLIC KEY
    if (typeof emailjs !== 'undefined') {
         emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.error("EmailJS SDK no cargado!");
        alert("Error al cargar el sistema de envío. Por favor, inténtalo de nuevo más tarde.");
        return; 
    }
    // === FIN EMAILJS INIT ===

    const landingForm = document.getElementById('landingForm'); 
    const submitButton = landingForm.querySelector('.btn-submit-landing'); 

    if (landingForm && submitButton) {
        landingForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            submitButton.disabled = true;
            submitButton.innerHTML = 'Enviando... <i class="bx bx-loader bx-spin"></i>'; 

            // --- MAPEADO DE DATOS: landing-meta.html -> Plantilla Antigua ---
            const templateParams = {
                // Mapeos directos o más lógicos
                nombre: document.getElementById('name')?.value || '', // Campo 'name' -> variable 'nombre'
                email: document.getElementById('email')?.value || '', // Campo 'email' -> variable 'email'
                telefono_full: document.getElementById('phone')?.value || '', // Campo 'phone' -> variable 'telefono_full'
                servicio_principal: document.getElementById('goal')?.value || '', // Campo 'goal' -> variable 'servicio_principal'
                mensaje_final: document.getElementById('details')?.value || '', // Campo 'details' -> variable 'mensaje_final'
                
                // Campos de la plantilla antigua SIN equivalente directo en la nueva landing:
                // Los enviamos vacíos o con un valor por defecto para que no den error.
                web_existente: document.getElementById('website')?.value || 'No aplica (Landing)', // Usamos el campo website si existe, sino indicamos
                web_tipo: 'No aplica (Landing)', 
                diseno_listo: 'No aplica (Landing)',
                app_descripcion: '', // Vacío
                seo_sitio_actual: document.getElementById('website')?.value || '', // Reutilizamos website aquí también si es útil
                presupuesto_publicidad: 'No aplica (Landing)',
                otro_descripcion: '', // Vacío
                fuente: 'Landing Meta Ads' // Podemos hardcodear la fuente aquí
            };
            // --- FIN MAPEADO ---

            // IDs de EmailJS (USA TU TEMPLATE ID EXISTENTE)
            const SERVICE_ID = 'service_ehavv1a'; // Tu Service ID
            const TEMPLATE_ID = 'template_7mgl4yh'; // ¡¡¡TU TEMPLATE ID EXISTENTE!!!

            // --- ENVÍO CON emailjs.send ---
            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(() => {
                    // Envío exitoso -> Redirige a la página de gracias
                    window.location.href = '/gracias'; // Redirige a /gracias
                }, (error) => {
                    // Error en el envío
                    console.error('Error al enviar con EmailJS:', error);
                    alert('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo o contáctanos directamente. Código: ' + (error.status || 'Desconocido'));
                    // Rehabilita el botón
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Solicitar Asesoría Gratuita <i class="bx bx-right-arrow-alt"></i>';
                });
            // --- FIN ENVÍO ---
        });
    } else {
        console.error("No se encontró el formulario 'landingForm' o su botón de envío.");
    }

    // Script simple para manejar el preloader (si aplica)
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    if (preloader && mainContent) {
        window.addEventListener('load', () => {
            preloader.classList.add('loaded');
            mainContent.classList.add('loaded');
        });
    } else if (mainContent) {
            mainContent.classList.add('loaded'); // Si no hay preloader
    }
});