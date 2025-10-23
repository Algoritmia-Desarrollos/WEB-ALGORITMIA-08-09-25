document.addEventListener('DOMContentLoaded', () => {

    // === SOLUCIÓN AL "SALTO" DEL TECLADO MÓVIL ===
    function lockViewportHeight() {
        const vh = window.innerHeight;
        document.body.style.height = `${vh}px`;
    }
    lockViewportHeight();
    window.addEventListener('resize', lockViewportHeight);
    // === FIN DE LA SOLUCIÓN ===

    // --- Selectores ---
    const formContainer = document.querySelector('.form-container');
    const formElement = document.getElementById('contact-form');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicator = document.querySelector('.step-indicator');
    const servicioSelect = document.getElementById('servicio');
    const serviceQuestionContainers = document.querySelectorAll('.service-specific-questions');
    const graciasMensaje = document.getElementById('gracias-mensaje');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const submitButton = formElement.querySelector('.btn-submit'); 
    const phoneInput = document.querySelector("#telefono"); // Mover aquí para acceso global
    const fullNumberInput = document.querySelector("input[name='telefono_full']"); 
    let iti; // Declarar iti aquí para acceso global

    let currentStep = 1;
    const totalSteps = steps.length;

    // === INICIALIZACIÓN DE BANDERITAS ===
    if (phoneInput) { // Asegurarse que el input exista
        iti = window.intlTelInput(phoneInput, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
            initialCountry: "ar", 
            preferredCountries: ['ar', 'es', 'us', 'mx', 'uy', 'cl', 'co'], 
            separateDialCode: true, 
            nationalMode: false, 
            autoPlaceholder: "aggressive",
        });
    }
    // === FIN BANDERITAS ===

    // === INICIALIZACIÓN DE EMAILJS ===
    const EMAILJS_PUBLIC_KEY = '3bkxlvg4klx2DB5rd'; 
    if (typeof emailjs !== 'undefined') { // Verificar que la librería cargó
         emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.error("EmailJS SDK no cargado!");
    }
    // === FIN EMAILJS INIT ===

    // --- Función showStep ---
    function showStep(stepNumber) {
        currentStep = stepNumber;
        steps.forEach(step => step.classList.remove('active'));
        const activeStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (activeStep) activeStep.classList.add('active');
        if (stepIndicator) stepIndicator.textContent = `Paso ${stepNumber} de ${totalSteps}`;
    }

    // --- Event Listeners Botones ---
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) showStep(currentStep + 1);
            }
        });
    });
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) showStep(currentStep - 1);
        });
    });

    // --- LÓGICA DINÁMICA: PASO 3 ---
    servicioSelect.addEventListener('change', () => {
        const selectedService = servicioSelect.value;
        serviceQuestionContainers.forEach(container => {
            container.classList.remove('active');
            container.querySelectorAll('input, textarea, select').forEach(input => input.required = false);
        });
        let containerToShow;
        switch (selectedService) {
            case 'diseno-web': containerToShow = document.getElementById('web-design-questions'); break;
            case 'app-web': containerToShow = document.getElementById('web-app-questions'); document.getElementById('app-descripcion').required = true; break;
            case 'marketing-seo': containerToShow = document.getElementById('seo-questions'); document.getElementById('presupuesto_publicidad').required = true; break;
            case 'otro': containerToShow = document.getElementById('other-questions'); document.getElementById('otro-descripcion').required = true; break;
        }
        if (containerToShow) containerToShow.classList.add('active');
    });

    // --- Función de Validación ---
    function validateStep(stepNumber) {
        let isValid = true;
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        let inputsToValidate;
        if (stepNumber === 3) {
            const activeServiceContainer = currentStepElement.querySelector('.service-specific-questions.active');
            inputsToValidate = activeServiceContainer ? activeServiceContainer.querySelectorAll('[required]') : [];
        } else {
            inputsToValidate = currentStepElement.querySelectorAll('[required]');
        }
        inputsToValidate.forEach(input => {
            input.classList.remove('form-error');
            const parentGroup = input.closest('.form-group'); // Para banderita
            if(input.id === 'telefono' && parentGroup && parentGroup.querySelector('.iti')) {
                 parentGroup.querySelector('.iti').classList.remove('form-error');
            }

            let value = input.value;
            
            if (input.id === 'telefono') {
                if (iti && !iti.isValidNumber()) { // Verificar que iti exista
                    isValid = false;
                    input.classList.add('form-error');
                    if (parentGroup && parentGroup.querySelector('.iti')) {
                         parentGroup.querySelector('.iti').classList.add('form-error');
                    }
                }
            } else if (!value || (input.type === 'email' && !validateEmail(value))) {
                isValid = false;
                input.classList.add('form-error');
            }
            
            // Listener de input (mejorado)
             const removeError = () => {
                 if (input.value) {
                     input.classList.remove('form-error');
                     if(input.id === 'telefono' && parentGroup && parentGroup.querySelector('.iti')) {
                          parentGroup.querySelector('.iti').classList.remove('form-error');
                     }
                 }
             };
             // Quitar listener previo si existe para evitar duplicados
             input.removeEventListener('input', removeError); 
             input.addEventListener('input', removeError);

        });
        return isValid;
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // =======================================================
    // === Lógica de Envío (CORREGIDA PARA ENVÍO MANUAL) ===
    // =======================================================
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            return; 
        }

        // Actualiza el número completo en el campo oculto
        if (iti) { // Asegurarse que iti existe
           fullNumberInput.value = iti.getNumber(); 
        } else {
           fullNumberInput.value = phoneInput.value; // Fallback por si falla la librería
        }

        // --- 1. RECOLECCIÓN MANUAL DE DATOS ---
        const templateParams = {
            // Paso 1
            nombre: document.getElementById('nombre')?.value || '',
            email: document.getElementById('email')?.value || '',
            telefono_full: fullNumberInput.value || '', // Usamos el campo oculto actualizado
            
            // Paso 2
            servicio_principal: document.getElementById('servicio')?.value || '',
            
            // Paso 3 - Diseño Web (Obtener valor de radios chequeados)
            web_existente: formElement.querySelector('input[name="web_existente"]:checked')?.value || '',
            web_tipo: document.getElementById('web_tipo')?.value || '',
            diseno_listo: formElement.querySelector('input[name="diseno_listo"]:checked')?.value || '',

            // Paso 3 - App Web
            app_descripcion: document.getElementById('app-descripcion')?.value || '',

            // Paso 3 - Marketing/SEO
            seo_sitio_actual: document.getElementById('seo-website')?.value || '',
            presupuesto_publicidad: document.getElementById('presupuesto_publicidad')?.value || '',

            // Paso 3 - Otro
            otro_descripcion: document.getElementById('otro-descripcion')?.value || '',

            // Paso 4
            fuente: document.getElementById('como-nos-encontro')?.value || '',
            mensaje_final: document.getElementById('mensaje-final')?.value || ''
        };
        // --- FIN RECOLECCIÓN ---

        // IDs de EmailJS
        const SERVICE_ID = 'service_ehavv1a'; 
        const TEMPLATE_ID = 'template_7mgl4yh'; 

        // Deshabilita botón y muestra "Enviando..."
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // --- 2. ENVÍO CON emailjs.send ---
        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
            .then(() => {
                showSuccessMessage();
            }, (error) => {
                console.error('Error al enviar con EmailJS:', error);
                alert('Hubo un error al enviar el formulario. Código: ' + (error.status || 'Desconocido'));
                 submitButton.disabled = false;
                 submitButton.textContent = 'Enviar Solicitud';
            });
        // --- FIN ENVÍO ---
    });

   // --- Función showSuccessMessage (MODIFICADA PARA REDIRIGIR) ---
    function showSuccessMessage() {
        // Redirige a la página de agradecimiento
        window.location.href = '/gracias.html'; 
    }

});