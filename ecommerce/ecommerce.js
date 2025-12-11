document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. CARRUSEL INFINITO (Testimonios)
    // =========================================
    const tracks = document.querySelectorAll('.testimonials-track');
    if (tracks.length > 0) {
        tracks.forEach(track => {
            const items = Array.from(track.children);
            items.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', true);
                track.appendChild(clone);
            });
        });
    }

    // =========================================
    // 2. LIGHTBOX (Zoom Imágenes Dashboard)
    // =========================================
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-modal");
    const imageWrappers = document.querySelectorAll('.dash-img-wrapper');

    if (modal && imageWrappers.length > 0) {
        const closeModal = () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // Reactivar scroll
        };

        const openModal = (imgSrc, imgAlt) => {
            modal.style.display = "flex"; 
            modalImg.src = imgSrc;
            if(captionText) captionText.innerHTML = imgAlt || '';
            document.body.style.overflow = "hidden"; // Bloquear scroll
        };

        imageWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    openModal(img.src, img.alt);
                }
            });
        });

        if (closeBtn) closeBtn.onclick = closeModal;
        
        // Cerrar al hacer clic fuera de la imagen
        modal.onclick = (e) => {
            if (e.target === modal || e.target.classList.contains('modal-content-wrapper')) {
                closeModal();
            }
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modal.style.display === "flex") closeModal();
        });
    }

    // =========================================
    // 3. CONFIGURACIÓN EMAILJS
    // =========================================
    const EMAILJS_PUBLIC_KEY = 'veUMyXHA-8TBOkGAL'; // Tu Public Key
    
    if (typeof emailjs !== 'undefined') {
         emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.error("EmailJS no ha cargado correctamente.");
    }

    // =========================================
    // 4. CONFIGURACIÓN INPUT TELÉFONO
    // =========================================
    const phoneInputField = document.querySelector("#phone");
    const errorMsg = document.querySelector("#error-msg");
    const validMsg = document.querySelector("#valid-msg");
    let iti;
    
    // Mensajes de error personalizados
    const errorMap = ["Número inválido", "Código de país inválido", "Muy corto", "Muy largo", "Número inválido"];

    const resetInput = () => {
        phoneInputField.classList.remove("input-error");
        if(errorMsg) {
            errorMsg.innerHTML = "";
            errorMsg.classList.add("hide");
        }
        if(validMsg) validMsg.classList.add("hide");
    };

    if (phoneInputField) {
        iti = window.intlTelInput(phoneInputField, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
            initialCountry: "ar",
            preferredCountries: ['ar', 'mx', 'cl', 'co', 'es', 'us'], 
            separateDialCode: true, 
            nationalMode: false, 
            autoPlaceholder: "aggressive", 
        });

        // Validación en tiempo real al escribir
        phoneInputField.addEventListener('input', function(e) {
            if (e.inputType !== 'deleteContentBackward') {
                const currentVal = phoneInputField.value;
                const cleanVal = currentVal.replace(/\D/g, ''); // Solo deja números
                // Esto ayuda a la librería a formatear mejor si el usuario pega números
                // pero lo dejamos comentado si causa conflictos de UX
                // if (cleanVal.length > 0 && typeof intlTelInputUtils !== 'undefined') { iti.setNumber(cleanVal); }
            }
            resetInput(); 
        });
    }

    // =========================================
    // 5. ENVÍO DEL FORMULARIO
    // =========================================
    const landingForm = document.getElementById('landingForm'); 
    const submitButton = landingForm ? landingForm.querySelector('.btn-submit-landing') : null; 
    const emailInput = document.getElementById('email');

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    if (landingForm && submitButton) {
        landingForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            resetInput();
            let hasError = false;

            // Validación Email
            if (!validateEmail(emailInput.value)) {
                alert("Por favor, ingresa un email válido.");
                emailInput.classList.add('input-error');
                hasError = true;
            }

            // Validación Teléfono
            if (iti) {
                if (!iti.isValidNumber()) {
                    const errorCode = iti.getValidationError();
                    const msg = errorMap[errorCode] || "Número inválido";
                    if(errorMsg) {
                        errorMsg.innerHTML = msg;
                        errorMsg.classList.remove("hide");
                    }
                    phoneInputField.classList.add('input-error');
                    hasError = true;
                } else {
                    if(validMsg) validMsg.classList.remove("hide");
                }
            }

            if (hasError) return; // Si hay error, no envía

            // Estado de carga del botón
            const originalBtnText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Enviando... <i class="bx bx-loader bx-spin"></i>'; 

            // Obtener número completo con código de país
            const fullPhoneNumber = iti ? iti.getNumber() : phoneInputField.value;

            // Obtener valor del Radio Button seleccionado
            const situacionSeleccionada = document.querySelector('input[name="situacion_web"]:checked')?.value || 'No especificado';

            // Parámetros para EmailJS (Deben coincidir con tu plantilla)
            const templateParams = {
                nombre: document.getElementById('name').value, 
                email: emailInput.value, 
                telefono_full: fullPhoneNumber, 
                
                // Datos específicos de esta landing
                situacion_web: situacionSeleccionada,
                origen: 'Landing E-commerce (Sin Comisiones)', // Para que sepas de dónde viene
                
                // Campos opcionales que podrías necesitar si usas una plantilla genérica
                servicio_principal: 'E-commerce', 
                mensaje_final: 'Interesado en tienda sin comisiones.' 
            };
            
            // IDs de tu servicio (Estos son los que vi en tus archivos anteriores)
            const SERVICE_ID = 'service_jm0kq2j'; 
            const TEMPLATE_ID = 'template_xxpx1qq'; 

            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(() => {
                    // Éxito: Redirigir a página de gracias
                    // Asegurate que la ruta sea correcta según dónde esté tu archivo gracias.html
                    window.location.href = '/gracias.html'; 
                }, (error) => {
                    console.error('Error:', error);
                    alert('Hubo un error al enviar la solicitud. Por favor contactanos directamente por WhatsApp.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalBtnText;
                });
        });
    }
});