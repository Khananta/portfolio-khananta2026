// Helper to render Lucide Icons safely
function renderIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderIcons();
    initCustomCursor();
    initCursorGlow();
    initPreloader(); // Preloader runs first
    initHeaderScroll();
    initMobileMenu();
    initServicesAccordion();
    init3DTilt();
    initToolsPopup();
    initGalleryLightbox();
});

// Fallback to render icons if CDN loads slowly after DOMContentLoaded
window.addEventListener("load", () => {
    renderIcons();
});

/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector(".custom-cursor");
    const follower = document.querySelector(".custom-cursor-follower");
    
    if (!cursor || !follower) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Smooth movement using GSAP ticker or simple LERP
    gsap.to({}, {
        duration: 0.01,
        repeat: -1,
        onRepeat: () => {
            posX += (mouseX - posX) * 0.25;
            posY += (mouseY - posY) * 0.25;

            gsap.set(cursor, { css: { left: mouseX, top: mouseY } });
            gsap.set(follower, { css: { left: posX, top: posY } });
        }
    });

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Handle Hover States for Interactive Elements
    const interactiveElements = document.querySelectorAll("a, button, .btn, .service-item, .bento-bottom-card, .social-card, input, textarea");
    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("hovering-interactive");
        });
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovering-interactive");
        });
    });
}

/* ==========================================================================
   HEADER SCROLL STYLE
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector(".header");
    if (!header) return;

    let lastScroll = 0;
    let isHidden = false;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        // 1. Add scrolled visual style class
        if (currentScroll > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // 2. Hide on scroll down, show on scroll up using CSS transitions
        if (currentScroll > 180) {
            if (currentScroll > lastScroll) {
                if (!isHidden) {
                    isHidden = true;
                    header.classList.add("header-hidden");
                }
            } else {
                if (isHidden) {
                    isHidden = false;
                    header.classList.remove("header-hidden");
                }
            }
        } else {
            if (isHidden || currentScroll <= 30) {
                isHidden = false;
                header.classList.remove("header-hidden");
            }
        }

        lastScroll = currentScroll;
    });
}

/* ==========================================================================
   MOBILE MENU (Sidebar with Backdrop)
   ========================================================================== */
function initMobileMenu() {
    const toggle = document.querySelector(".mobile-nav-toggle");
    const nav = document.querySelector(".nav");
    const headerContainer = document.querySelector(".header-container");
    const contactBtn = document.querySelector(".contact-btn");
    
    if (!toggle || !nav) return;

    // Create backdrop element dynamically
    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);

    // Dynamically move nav in and out of the body depending on screen size
    const handleViewportChange = (e) => {
        if (e.matches) {
            // Mobile/Tablet sidebar: move nav to body so fixed position viewport alignment works
            document.body.appendChild(nav);
        } else {
            // Desktop: restore nav to its original place inside header capsule
            if (headerContainer) {
                if (contactBtn) {
                    headerContainer.insertBefore(nav, contactBtn);
                } else {
                    headerContainer.appendChild(nav);
                }
            }
            // Clean up mobile states
            nav.classList.remove("active");
            toggle.classList.remove("active");
            backdrop.classList.remove("active");
            document.body.classList.remove("menu-open");
        }
    };

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    handleViewportChange(mediaQuery);
    mediaQuery.addEventListener("change", handleViewportChange);

    const toggleMenu = () => {
        const isOpen = nav.classList.contains("active");
        if (isOpen) {
            nav.classList.remove("active");
            toggle.classList.remove("active");
            backdrop.classList.remove("active");
            document.body.classList.remove("menu-open");
        } else {
            nav.classList.add("active");
            toggle.classList.add("active");
            backdrop.classList.add("active");
            document.body.classList.add("menu-open");
        }
    };

    toggle.addEventListener("click", toggleMenu);
    backdrop.addEventListener("click", toggleMenu);

    // Event delegation on nav to handle navlink clicks safely
    nav.addEventListener("click", (e) => {
        const link = e.target.closest(".nav-link");
        if (link) {
            nav.classList.remove("active");
            toggle.classList.remove("active");
            backdrop.classList.remove("active");
            document.body.classList.remove("menu-open");
        }
    });
}

/* ==========================================================================
   GSAP & SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initGSAPAnimations() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 0. Header/Navbar Entrance Animation
    gsap.from(".header", {
        y: -40,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.1,
        clearProps: "transform"
    });

    // 1. Hero Content Entrance Animation (played once on load)
    const heroTimeline = gsap.timeline();

    heroTimeline
    .from(".hero-title", {
        y: 45,
        opacity: 0,
        scale: 0.98,
        duration: 1,
        ease: "power3.out"
    })
    .from(".hero-subtitle-sub", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out"
    }, "-=0.7")
    .from(".hero-cta-btn", {
        y: 15,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out"
    }, "-=0.7")
    .to(".highlighter", {
        "--highlighter-width": "100%",
        duration: 0.8,
        ease: "power2.inOut"
    }, "-=0.4")
    .to(".highlighter", {
        scale: 1.08,
        rotation: -1,
        duration: 0.25,
        ease: "back.out(2)"
    }, "-=0.25")
    .to(".highlighter", {
        scale: 1.04,
        rotation: -0.5,
        duration: 0.2,
        ease: "power2.out"
    });

    // 3. Floating Parallax Animation on Hero Mockup Cards (DESKTOP ONLY)
    const isDesktop = window.innerWidth > 1024;
    
    if (isDesktop) {
        gsap.to(".card-left-1", {
            y: -60,
            rotation: -15,
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
        gsap.to(".card-left-2", {
            y: -30,
            rotation: 10,
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
        gsap.to(".card-right-1", {
            y: -70,
            rotation: 12,
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
        gsap.to(".card-right-2", {
            y: -40,
            rotation: -10,
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });

        // Infinite subtle floating animation on page load (DESKTOP ONLY)
        gsap.to(".card-left-1, .card-right-2", {
            yPercent: 4,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        gsap.to(".card-left-2, .card-right-1", {
            yPercent: -4,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5
        });
    }

    // 4. About Text Scroll Highlight Effect (Bug fix: preserves word spacing correctly)
    const aboutText = document.querySelector(".about-text");
    if (aboutText) {
        const text = aboutText.textContent.trim().replace(/\s+/g, ' ');
        const words = text.split(" ");
        aboutText.innerHTML = "";
        
        words.forEach(word => {
            if (!word) return;
            const span = document.createElement("span");
            span.innerHTML = word;
            span.style.opacity = "0.2";
            span.style.display = "inline-block";
            span.style.transition = "opacity 0.4s ease";
            
            // Gradient purple for "Khananta"
            if (word.includes("Khananta")) {
                span.classList.add("about-gradient-name");
                span.style.fontWeight = "700";
                span.style.color = ""; // clear so gradient shows
            }
            // Re-bold full name Khanif Yunan Pratama
            if (word.includes("Khanif") || word.includes("Yunan") || word.includes("Pratama")) {
                span.style.fontWeight = "700";
                span.style.color = "var(--text-color)";
            }
            
            aboutText.appendChild(span);
            aboutText.appendChild(document.createTextNode(" ")); // Physical text node space to prevent squishing
        });

        gsap.to(aboutText.children, {
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
                trigger: ".about-section",
                start: "top 65%",
                end: "center 20%", /* Complete animation well before user scrolls past the section */
                scrub: 0.5,
            }
        });
    }

    // 5. Social Cards Reveal on Scroll (Triggered by the about-section with bouncy entrance)
    gsap.from(".social-card", {
        opacity: 0,
        scale: 0.85,
        y: 40,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 72%",
            toggleActions: "play none none reverse"
        }
    });

    // 5.5. Tools Title & Cards Staggered Reveal on Scroll
    gsap.from(".tools-title, .tools-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".tools-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".tool-card", {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 1,
        stagger: 0.12,
        ease: "back.out(1.8)",
        clearProps: "transform,scale,rotation",
        scrollTrigger: {
            trigger: ".tools-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    // 6. Project Cards Reveal on Scroll (Play/reverse on scroll down/up)
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
        const mockup = card.querySelector(".project-mockup-wrapper");
        const details = card.querySelector(".project-details");

        gsap.from(mockup, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        gsap.from(details, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power3.out",
            delay: 0.2,
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // 6.5. Selected Graphic Designs Entrance Animation (3D Fanning Spread)
    gsap.from(".gallery-section .section-title-wrapper", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".gallery-section",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    const galleryItems = document.querySelectorAll(".gallery-item");
    if (galleryItems.length === 3) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".gallery-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        tl.from(galleryItems[1], {
            opacity: 0,
            y: 90,
            scale: 0.85,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "transform,opacity"
        })
        .from(galleryItems[0], {
            opacity: 0,
            x: -120,
            y: 60,
            rotation: -18,
            scale: 0.8,
            duration: 0.85,
            ease: "power4.out",
            clearProps: "transform,opacity"
        }, "-=0.5")
        .from(galleryItems[2], {
            opacity: 0,
            x: 120,
            y: 60,
            rotation: 18,
            scale: 0.8,
            duration: 0.85,
            ease: "power4.out",
            clearProps: "transform,opacity"
        }, "-=0.85");
    }

    // 7. Services Section Book Mockup & Title Entrance (Play/reverse on scroll down/up)
    gsap.from(".book-mockup", {
        opacity: 0,
        x: -50,
        rotationY: -30,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".services-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".service-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".services-list",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // 8. Bento Grid Bottom Cards Entrance (Play/reverse on scroll down/up)
    gsap.from(".bento-bottom-card", {
        opacity: 0,
        y: 60,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".bento-bottom-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
}

/* ==========================================================================
   SERVICES ACCORDION
   ========================================================================== */
function initServicesAccordion() {
    const items = document.querySelectorAll(".service-item");
    if (items.length === 0) return;

    // Set first item active by default
    items[0].classList.add("active");

    items.forEach((item) => {
        item.addEventListener("click", () => {
            // If clicked item is already active, we close it
            if (item.classList.contains("active")) {
                item.classList.remove("active");
                return;
            }

            // Close all items
            items.forEach((el) => el.classList.remove("active"));
            
            // Open clicked item
            item.classList.add("active");
        });
    });
}

/* ==========================================================================
   3D TILT INTERACTION (Dieter Rams Book & Vinyl Cover)
   ========================================================================== */
function init3DTilt() {
    const cards = [
        {
            cardEl: document.querySelector(".philosophy-card"),
            innerEl: document.querySelector(".book-3d"),
            maxTilt: 20
        },
        {
            cardEl: document.querySelector(".playlist-card"),
            innerEl: document.querySelector(".vinyl-mockup-wrapper"),
            maxTilt: 15
        }
    ];

    cards.forEach(({ cardEl, innerEl, maxTilt }) => {
        if (!cardEl || !innerEl) return;

        cardEl.addEventListener("mousemove", (e) => {
            const rect = cardEl.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse position inside card
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt percentages (-1 to 1)
            const tiltX = (centerY - y) / centerY;
            const tiltY = (x - centerX) / centerX;
            
            // Apply rotations
            gsap.to(innerEl, {
                duration: 0.3,
                rotationX: tiltX * maxTilt,
                rotationY: tiltY * maxTilt,
                ease: "power2.out"
            });
        });

        cardEl.addEventListener("mouseleave", () => {
            // Smoothly reset on leave
            gsap.to(innerEl, {
                duration: 0.6,
                rotationX: (cardEl.classList.contains("philosophy-card")) ? 20 : 0, // Book defaults to X:20
                rotationY: (cardEl.classList.contains("philosophy-card")) ? -20 : 0, // Book defaults to Y:-20
                rotationZ: (cardEl.classList.contains("philosophy-card")) ? 5 : 0,
                x: 0,
                y: 0,
                ease: "power3.out"
            });
        });
    });
}


/* ==========================================================================
   INTERACTIVE CURSOR GLOW BACKGROUND & TYPEWRITER HELPERS
   ========================================================================== */
function initCursorGlow() {
    const glowBg = document.createElement("div");
    glowBg.className = "cursor-glow-bg";
    document.body.appendChild(glowBg);

    window.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        glowBg.style.setProperty("--mouse-x", `${x}px`);
        glowBg.style.setProperty("--mouse-y", `${y}px`);
    });
}

/* ==========================================================================
   PRELOADER LOGIC & TIMER COUNTER
   ========================================================================== */
function initPreloader() {
    const preloader = document.querySelector(".preloader");
    const counter = document.querySelector(".preloader-counter");
    const progressBar = document.querySelector(".preloader-progress-bar");
    const brand = document.querySelector(".preloader-brand");
    
    if (!preloader || !counter || !progressBar) {
        initGSAPAnimations();
        return;
    }

    // Brand Name Fade & Slide In
    gsap.to(brand, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });

    // Smooth progress counter using GSAP tween
    const progressObj = { value: 0 };
    gsap.to(progressObj, {
        value: 100,
        duration: 1.8,
        ease: "power1.inOut",
        onUpdate: () => {
            const roundedVal = Math.floor(progressObj.value);
            counter.innerText = roundedVal < 10 ? `0${roundedVal}` : roundedVal;
            progressBar.style.width = `${roundedVal}%`;
        },
        onComplete: () => {
            gsap.to(".preloader-content", {
                opacity: 0,
                y: -50,
                duration: 0.6,
                ease: "power2.in"
            });
            
            preloader.classList.add("fade-out");

            setTimeout(() => {
                initGSAPAnimations();
            }, 300);

            setTimeout(() => {
                preloader.remove();
            }, 1300);
        }
    });
}

/* ==========================================================================
   TOOLS EXPLANATION POPUP
   ========================================================================== */
function initToolsPopup() {
    const tools = document.querySelectorAll(".tool-card");
    if (!tools.length) return;

    // Create Modal HTML elements programmatically
    const modal = document.createElement("div");
    modal.className = "tools-popup-modal";
    modal.innerHTML = `
        <div class="tools-popup-content">
            <button class="tools-popup-close">&times;</button>
            <div class="tools-popup-header">
                <div class="tools-popup-icon-wrapper">
                    <!-- Dynamic Icon -->
                </div>
                <h3 class="tools-popup-title">Tool Name</h3>
            </div>
            <p class="tools-popup-desc">Tool description...</p>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".tools-popup-close");
    const iconWrapper = modal.querySelector(".tools-popup-icon-wrapper");
    const titleElem = modal.querySelector(".tools-popup-title");
    const descElem = modal.querySelector(".tools-popup-desc");

    const toolData = {
        figma: {
            name: "Figma",
            desc: "Figma is my primary design sandbox. I use it for wireframing, high-fidelity UI/UX design, design systems, vector illustrations, and interactive prototyping."
        },
        vscode: {
            name: "VS Code",
            desc: "My primary code editor. This is where I write clean, optimized code (HTML, CSS, JavaScript) and construct responsive, high-performance web applications."
        },
        capcut: {
            name: "CapCut",
            desc: "My video editing studio. I use it to edit premium showcase videos, case-study animations, motion graphics, and engaging product demonstrations."
        },
        github: {
            name: "GitHub",
            desc: "The home for all my repositories. I use it for git version control, collaboration, CI/CD pipeline setups, and hosting open-source digital projects."
        }
    };

    tools.forEach(card => {
        card.addEventListener("click", () => {
            // Find which tool this is
            let toolKey = "";
            if (card.classList.contains("tool-figma")) toolKey = "figma";
            else if (card.classList.contains("tool-vscode")) toolKey = "vscode";
            else if (card.classList.contains("tool-capcut")) toolKey = "capcut";
            else if (card.classList.contains("tool-github")) toolKey = "github";

            if (!toolKey || !toolData[toolKey]) return;

            const data = toolData[toolKey];

            // Copy the icon from the clicked card
            const originalIcon = card.querySelector(".tool-icon-svg");
            if (originalIcon) {
                iconWrapper.innerHTML = originalIcon.outerHTML;
            } else {
                iconWrapper.innerHTML = "";
            }

            titleElem.innerText = data.name;
            descElem.innerText = data.desc;

            // Show Modal with Animation
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scroll
        });
    });

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable background scroll
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
}

/* ==========================================================================
   GALLERY LIGHTBOX MODAL
   ========================================================================== */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("gallery-lightbox");
    if (!lightbox) return;
    
    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    if (!lightboxImg || !closeBtn) return;

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const img = item.querySelector(".gallery-img");
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add("active");
                document.body.classList.add("lightbox-open");
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.classList.remove("lightbox-open");
        setTimeout(() => {
            if (!lightbox.classList.contains("active")) {
                lightboxImg.src = "";
            }
        }, 400);
    };

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });
}


