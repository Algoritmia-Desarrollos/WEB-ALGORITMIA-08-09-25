document.addEventListener('DOMContentLoaded', function () {
    
    // LÓGICA DE ANIMACIÓN GSAP PARA TODA LA PÁGINA
    if (document.querySelector('.gallery')) {
        // Añadimos las librerías aquí por si no están en el HTML
        const gsapLoaded = typeof gsap !== 'undefined';
        if (!gsapLoaded) {
            console.error("GSAP no está cargado. Asegúrate de incluir las librerías en tu HTML.");
            return;
        }

        let mediaAnimation = gsap.matchMedia();
        ScrollTrigger.defaults({ markers: false });

        // Paleta de colores para las transiciones de fondo
        // Coincide con el orden de las secciones en el HTML
        const colors = [
            "#21103A", // 1. Bienvenida
            "#05625C", // 2. Servicios (un verde azulado)
            "#5A483E", // 3. Portafolio (un marrón elegante)
            "#2E4D71", // 4. Marketing (un azul corporativo)
            "#856546", // 5. Testimonios (un tono cálido)
            "#955ce9"  // 6. Contacto (tu color secundario)
        ];

        // --- ANIMACIÓN PARA ESCRITORIO (cuando hay dos columnas) ---
        mediaAnimation.add("(min-width: 900px)", () => {
            const details = gsap.utils.toArray(".desktopContentSection:not(:first-child)");
            const photos = gsap.utils.toArray(".desktopPhoto:not(:first-child)");
            
            // Estado inicial de las fotos: ocultas con un clip-path
            gsap.set(photos, { clip-path: 'inset(100% 0% 0% 0%)', autoAlpha: 1 });
            const allPhotos = gsap.utils.toArray(".desktopPhoto");

            // Animación de opacidad para el texto
            gsap.utils.toArray(".desktopContentSection").forEach(section => {
                ScrollTrigger.create({
                    trigger: section,
                    start: "center 70%",
                    end: "center 30%",
                    toggleClass: "active-section",
                });
            });

            // Animación de cambio de color y revelado de imagen
            details.forEach((section, i) => {
                let headline = section.querySelector(".reveal");
                let bgColor = colors[i + 1] || colors[0];

                // 1. Cambia el color del fondo de toda la sección
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 50%",
                    end: "bottom 50%",
                    onToggle: self => {
                        if (self.isActive) {
                            gsap.to("body", { backgroundColor: bgColor, duration: 0.5, ease: "power1.inOut" });
                        }
                    }
                });
                
                // 2. Anima la imagen para que se revele (efecto "wipe")
                let animation = gsap.timeline()
                    .to(photos[i], { 'clip-path': 'inset(0% 0% 0% 0%)', autoAlpha: 1, duration: 1 })
                    .set(allPhotos[i], { autoAlpha: 0 }); // Oculta la foto anterior para no apilarlas

                ScrollTrigger.create({
                    trigger: headline,
                    start: "top 80%",
                    end: "top 50%",
                    animation: animation,
                    scrub: true,
                });
            });

            // Vuelve al color inicial si se scrollea hacia arriba del todo
            ScrollTrigger.create({
                trigger: ".desktopContentSection:first-child",
                start: "top top",
                end: "bottom top",
                onLeaveBack: () => gsap.to("body", { backgroundColor: colors[0], duration: 0.5, ease: "power1.inOut" })
            });
        });

         // --- ANIMACIÓN PARA MÓVIL (solo cambia color de fondo) ---
        mediaAnimation.add("(max-width: 899px)", () => {
            const details = gsap.utils.toArray(".desktopContentSection");

            details.forEach((section, i) => {
                let bgColor = colors[i] || colors[0];
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 50%",
                    end: "bottom 50%",
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