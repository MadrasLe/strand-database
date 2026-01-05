document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(10, 10, 18, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 18, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle (simple implementation)
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navUl = document.querySelector('nav ul');

    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', () => {
            const isDisplaying = navUl.style.display === 'flex';
            if (isDisplaying) {
                navUl.style.display = 'none';
            } else {
                navUl.style.display = 'flex';
                navUl.style.flexDirection = 'column';
                navUl.style.position = 'absolute';
                navUl.style.top = '70px';
                navUl.style.left = '0';
                navUl.style.width = '100%';
                navUl.style.backgroundColor = 'var(--dark-bg)';
                navUl.style.padding = '20px';
                navUl.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    // Form submission simulation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Obrigado! Recebemos sua mensagem e entraremos em contato em breve.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }
});
