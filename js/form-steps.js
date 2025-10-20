document.addEventListener('DOMContentLoaded', () => {

    // === SOLUCIÓN AL "SALTO" DEL TECLADO MÓVIL ===
    // Fija la altura del body al 100% de la ventana al cargar.
    // Esto evita que el 'svh' se recalcule y la página "salte"
    // cuando el teclado aparece en móviles.
    function lockViewportHeight() {
        const vh = window.innerHeight;
        document.body.style.height = `${vh}px`;
    }
    // Llama a la función al cargar la página
    lockViewportHeight();
    // Opcional: Vuelve a llamarla si se redimensiona (para desktops)
    // En móviles, el evento "resize" es el teclado, pero como
    // la altura está fija en px, no se re-ejecuta.
    window.addEventListener('resize', lockViewportHeight);
    // === FIN DE LA SOLUCIÓN ===


    // --- Selectores del Formulario ---
    const formContainer = document.querySelector('.form-container');
    const formElement = document.getElementById('contact-form');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicator = document.querySelector('.step-indicator');
    
    // Selectores de Lógica Dinámica
    const servicioSelect = document.getElementById('servicio');
    const serviceQuestionContainers = document.querySelectorAll('.service-specific-questions');
    
    // Selectores de Mensaje Final
    const graciasMensaje = document.getElementById('gracias-mensaje');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');

    let currentStep = 1;
    const totalSteps = steps.length;

    // --- Función para mostrar el paso ---
    function showStep(stepNumber) {
        currentStep = stepNumber;
        steps.forEach(step => step.classList.remove('active'));
        
        const activeStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }
        
        if (stepIndicator) {
            stepIndicator.textContent = `Paso ${stepNumber} de ${totalSteps}`;
        }
    }

    // --- Event Listeners Botones "Siguiente" ---
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    showStep(currentStep + 1);
                }
            }
        });
    });

    // --- Event Listeners Botones "Anterior" ---
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // --- LÓGICA DINÁMICA: PASO 3 ---
    servicioSelect.addEventListener('change', () => {
        const selectedService = servicioSelect.value;
        
        // Oculta todas las preguntas específicas
        serviceQuestionContainers.forEach(container => {
            container.classList.remove('active');
            // Quita 'required' de todos los inputs internos
            container.querySelectorAll('input, textarea, select').forEach(input => {
                input.required = false;
            });
        });

        // Muestra el contenedor de preguntas relevante
        let containerToShow;
        switch (selectedService) {
            case 'diseno-web':
                containerToShow = document.getElementById('web-design-questions');
                break;
            case 'app-web':
                containerToShow = document.getElementById('web-app-questions');
                // Añade 'required' al textarea de descripción de la app
                document.getElementById('app-descripcion').required = true;
                break;
            case 'marketing-seo':
                containerToShow = document.getElementById('seo-questions');
                break;
            case 'otro':
                containerToShow = document.getElementById('other-questions');
                // Añade 'required' al textarea de "otro"
                document.getElementById('otro-descripcion').required = true;
                break;
        }

        if (containerToShow) {
            containerToShow.classList.add('active');
        }
    });


    // --- Función de Validación ---
    function validateStep(stepNumber) {
        let isValid = true;
        const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        
        // Valida solo los inputs requeridos VISIBLES
        // Esto incluye los campos de las preguntas dinámicas
        let inputsToValidate;
        if (stepNumber === 3) {
            // En el paso 3, solo valida el contenedor de servicio activo
            const activeServiceContainer = currentStepElement.querySelector('.service-specific-questions.active');
            if (activeServiceContainer) {
                inputsToValidate = activeServiceContainer.querySelectorAll('[required]');
            } else {
                inputsToValidate = []; // No hay nada que validar si no se seleccionó nada
            }
        } else {
            // Para otros pasos, valida todos los [required]
            inputsToValidate = currentStepElement.querySelectorAll('[required]');
        }

        inputsToValidate.forEach(input => {
            input.classList.remove('form-error'); // Limpia errores previos

            if (!input.value || (input.type === 'email' && !validateEmail(input.value))) {
                isValid = false;
                input.classList.add('form-error');
            }
            
            // Listener para quitar el error al escribir
            // === CORRECCIÓN AQUÍ (Línea 145) ===
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.remove('form-error');
                }
            });
        });

        return isValid;
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // --- Lógica de Envío (Formspree) ---
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            return; // No envía si el último paso no es válido
        }

        const formData = new FormData(formElement);
        fetch(formElement.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                showSuccessMessage();
            } else {
                alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
            }
        // === CORRECCIÓN AQUÍ (Línea 179) ===
        }).catch(() => {
            alert('Hubo un error de red. Por favor, revisa tu conexión.');
        });
    });

    // --- Función para Mensaje de Éxito ---
    function showSuccessMessage() {
        // Oculta el form y la cabecera
        formElement.style.display = 'none';
        stepIndicator.style.display = 'none';
        formTitle.style.display = 'none';
        formSubtitle.style.display = 'none';

        // Muestra el mensaje de gracias
        graciasMensaje.style.display = 'block';
        
        // (Animación Opcional)
        formContainer.classList.add('show-success');
    }

});