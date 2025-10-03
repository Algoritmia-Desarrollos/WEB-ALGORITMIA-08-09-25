document.addEventListener('DOMContentLoaded', function () {
    
    // LÓGICA DE ANIMACIÓN GSAP PARA TODA LA PÁGINA
    if (document.querySelector('.gallery')) {
        // Asegurarnos de que las librerías de GSAP estén cargadas
        const gsapLoaded = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
        if (!gsapLoaded) {
            console.error("GSAP o ScrollTrigger no están cargados. Asegúrate de incluir las librerías en tu HTML.");
            return;
        }

        let mediaAnimation = gsap.matchMedia();
        ScrollTrigger.defaults({ markers: false });

        // Paleta de colores para las transiciones de fondo.
        // El orden DEBE COINCIDIR con el orden de las secciones en el HTML.
        const colors = [
            "#21103A", // 1. Bienvenida (color base)
            "#05625C", // 2. Servicios (un verde azulado profesional)
            "#2E4D71", // 3. Apps (un azul corporativo)
            "#5A483E", // 4. Portafolio (un marrón elegante)
            "#856546", // 5. Marketing (un tono tierra cálido)
            "#21103A", // 6. Testimonios (volvemos al base para contraste)
            "#955ce9"  // 7. Contacto (tu color secundario para un CTA potente)
        ];

        // --- ANIMACIÓN PARA ESCRITORIO (a partir de 900px) ---
        mediaAnimation.add("(min-width: 900px)", () => {
            const sections = gsap.utils.toArray(".desktopContentSection");
            const photos = gsap.utils.toArray(".desktopPhoto");
            
            // Estado inicial de todas las fotos (menos la primera): ocultas
            gsap.set(photos.slice(1), { 'clip-path': 'inset(100% 0% 0% 0%)', autoAlpha: 1 });

            // 1. Animación de opacidad para el texto
            sections.forEach(section => {
                ScrollTrigger.create({
                    trigger: section,
                    start: "center 65%", // Se activa cuando el centro de la sección pasa el 65% de la pantalla
                    end: "center 35%",   // Termina cuando pasa el 35%
                    toggleClass: "active-section", // Añade/quita la clase para la opacidad
                });
            });

            // 2. Animación de cambio de color y revelado de imagen para CADA sección
            sections.forEach((section, i) => {
                if (i < photos.length - 1) { // Asegurarnos de no ir más allá del número de fotos
                    let nextPhoto = photos[i + 1];
                    let currentPhoto = photos[i];
                    let nextColor = colors[i + 1] || colors[0];

                    // Cambia el color del fondo
                    ScrollTrigger.create({
                        trigger: section,
                        start: "bottom center", // El cambio de color empieza cuando el final de la sección llega al centro
                        onEnter: () => gsap.to("body", { backgroundColor: nextColor, duration: 0.5, ease: "power1.inOut" }),
                        onLeaveBack: () => gsap.to("body", { backgroundColor: colors[i], duration: 0.5, ease: "power1.inOut" })
                    });
                    
                    // Anima la imagen para que se revele
                    let animation = gsap.timeline()
                        .to(nextPhoto, { 'clip-path': 'inset(0% 0% 0% 0%)', duration: 1, ease: "power2.inOut" })
                        .set(currentPhoto, { 'clip-path': 'inset(0% 0% 100% 0%)' }); // Oculta la foto anterior

                    ScrollTrigger.create({
                        trigger: section,
                        start: "bottom 80%", // La animación de la imagen empieza antes
                        end: "bottom center",
                        animation: animation,
                        scrub: true,
                    });
                }
            });
        });

         // --- ANIMACIÓN PARA MÓVIL (solo cambia el color de fondo) ---
        mediaAnimation.add("(max-width: 899px)", () => {
            const sections = gsap.utils.toArray(".desktopContentSection");

            sections.forEach((section, i) => {
                let bgColor = colors[i] || colors[0];
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 60%",
                    end: "bottom 60%",
                    onToggle: self => {
                        if (self.isActive) {
                            gsap.to("body", { backgroundColor: bgColor, duration: 0.4, ease: "power1.inOut" });
                        }
                    }
                });
            });
        });
    }
});