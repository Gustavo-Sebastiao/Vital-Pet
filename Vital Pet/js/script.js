document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- 2. FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Close all currently active accordions
            document.querySelectorAll('.accordion-item').forEach(accItem => {
                accItem.classList.remove('active');
            });

            // If it wasn't active previously, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- 3. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1, // trigger at 10% visibility
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits viewport 
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('reveal-continuous')) {
                entry.target.classList.remove('active');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Wait slightly to trigger reveals already on screen without scroll
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // --- 4. Steps Image Switcher ---
    const stepCards = document.querySelectorAll('.step-card');
    const stepImage = document.getElementById('step-image');

    if (stepCards.length > 0 && stepImage) {
        const stepImages = {
            '1': 'assets/images/step_1_plan.png',
            '2': 'assets/images/como_funciona_app.png',
            '3': 'assets/images/step_3_zero_cost.png'
        };

        stepCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove class from all
                stepCards.forEach(c => c.classList.remove('active'));
                
                // Add class to selected
                card.classList.add('active');

                // Animate image out
                stepImage.style.opacity = 0;
                
                setTimeout(() => {
                    const stepId = card.getAttribute('data-step');
                    stepImage.src = stepImages[stepId];
                    // Animate image in
                    stepImage.style.opacity = 1;
                }, 300); // 300ms matches the CSS transition time
            });
        });
    }

    // --- 5. Nav Pill Animation ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const navPill = document.querySelector('.nav-pill');

    function movePill(link) {
        if (!link || !navPill) return;
        const linkRect = link.getBoundingClientRect();
        const navRect = link.closest('.nav-links').getBoundingClientRect();
        
        navPill.style.width = `${linkRect.width}px`;
        navPill.style.left = `${linkRect.left - navRect.left}px`;
        navPill.style.opacity = 1;
    }

    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '') currentPath = 'index.html';

    let activeLink = null;
    navLinks.forEach(link => {
        link.classList.remove('active'); // remove hardcoded active
        const linkHref = link.getAttribute('href');
        if (linkHref) {
            const linkBase = linkHref.split('#')[0];
            if (linkBase === currentPath || (linkBase === '' && currentPath === 'index.html')) {
                activeLink = link;
            }
        }
    });

    if (!activeLink && navLinks.length > 0) {
        activeLink = navLinks[0];
    }
    
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Ensure fonts and layout are loaded before positioning
    window.addEventListener('load', () => {
        if (activeLink) movePill(activeLink);
    });

    // Also try positioning after a small timeout just in case
    setTimeout(() => {
        if (activeLink) movePill(activeLink);
    }, 150);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            movePill(link);
        });
    });

    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-links a.active');
        if (currentActive) {
            navPill.style.transition = 'none'; 
            movePill(currentActive);
            setTimeout(() => {
                navPill.style.transition = ''; 
            }, 50);
        }
    });

});
