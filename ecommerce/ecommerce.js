document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CARRUSEL INFINITO (DUAL ROW)
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

    // 2. LIGHTBOX (ZOOM IMAGENES DASHBOARD)
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-modal");
    const imageWrappers = document.querySelectorAll('.dash-img-wrapper');

    if (modal && imageWrappers.length > 0) {
        const closeModal = () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        };

        imageWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    modal.style.display = "block";
                    modalImg.src = img.src;
                    captionText.innerHTML = img.alt;
                    document.body.style.overflow = "hidden";
                }
            });
        });

        if (closeBtn) closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modal.style.display === "block") closeModal();
        });
    }

    // 3. CONFIGURACIÓN EMAILJS
    const EMAILJS_PUBLIC_KEY = 'veUMyXHA-8TBOkGAL'; 
    if (typeof emailjs !== 'undefined') {
         emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.warn("EmailJS no cargado. El formulario no funcionará.");
    }

    // 4. CONFIGURACIÓN TELÉFONO
    const phoneInputField = document.querySelector("#phone");
    const errorMsg = document.querySelector("#error-msg");
    const validMsg = document.querySelector("#valid-msg");
    let iti;
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

        phoneInputField.addEventListener('input', function(e) {
            if (e.inputType !== 'deleteContentBackward') {
                const currentVal = phoneInputField.value;
                const cleanVal = currentVal.replace(/\D/g, '');
                if (cleanVal.length > 0 && typeof intlTelInputUtils !== 'undefined') {
                    iti.setNumber(cleanVal); 
                }
            }
            resetInput(); 
        });
    }

    // 5. ENVÍO DEL FORMULARIO
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

            if (!validateEmail(emailInput.value)) {
                alert("El email ingresado no es válido.");
                emailInput.classList.add('input-error');
                hasError = true;
            }

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

            if (hasError) return;

            const originalBtnText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Enviando... <i class="bx bx-loader bx-spin"></i>'; 

            const fullPhoneNumber = iti ? iti.getNumber() : phoneInputField.value;

            const templateParams = {
                nombre: document.getElementById('name').value, 
                email: emailInput.value, 
                telefono_full: fullPhoneNumber, 
                servicio_principal: document.getElementById('goal').value, 
                mensaje_final: document.getElementById('details').value,
                web_existente: 'No aplica', 
                web_tipo: 'E-commerce', 
                fuente: 'Landing Page Ventas'
            };
            
            const SERVICE_ID = 'service_jm0kq2j'; 
            const TEMPLATE_ID = 'template_xxpx1qq'; 

            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(() => {
                    // Ruta de gracias corregida (subir dos niveles)
                    window.location.href = '../../gracias.html'; 
                }, (error) => {
                    console.error('Error:', error);
                    alert('Hubo un error al enviar. Por favor contactanos por WhatsApp.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalBtnText;
                });
        });
    }
});