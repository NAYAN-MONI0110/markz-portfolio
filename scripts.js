// Matrix Background and Full Site Interaction

document.addEventListener('DOMContentLoaded', function () {
    // Enhanced Matrix Background
    const canvas = document.getElementById('matrix');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const chars = "01 本当の痛みを知らない者に、真の平和は理解できない。";
        const fontSize = 18;
        let columns = 0;
        let rainDrops = [];
        let animationId;
        let lastTime = 0;
        const frameDelay = 50;

        function initMatrix() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            rainDrops = Array(columns).fill(0);

            if (animationId) cancelAnimationFrame(animationId);
            lastTime = 0;
            animationId = requestAnimationFrame(animateMatrix);
        }

        function animateMatrix(currentTime) {
            if (currentTime - lastTime > frameDelay) {
                drawMatrix();
                lastTime = currentTime;
            }
            animationId = requestAnimationFrame(animateMatrix);
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `bold ${fontSize}px monospace`;

            for (let i = 0; i < rainDrops.length; i++) {
                const text = Math.random() > 0.3
                    ? chars.charAt(Math.floor(Math.random() * chars.length))
                    : String.fromCharCode(0x30A0 + Math.random() * 96);

                const x = i * fontSize;
                const y = rainDrops[i] * fontSize;

                ctx.fillStyle = '#0F0';
                ctx.shadowColor = '#0F0';
                ctx.shadowBlur = 8;
                ctx.fillText(text, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                } else {
                    rainDrops[i]++;
                }
            }
        }

        initMatrix();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(initMatrix, 300);
        });

        window.addEventListener('beforeunload', () => {
            if (animationId) cancelAnimationFrame(animationId);
        });
    }

    // Navigation
    const enterBtn = document.querySelector('.enter-btn');
    const nav = document.querySelector('.main-nav');
    const sections = document.querySelectorAll('.section');

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            const hero = document.getElementById('hero');
            if (hero) hero.style.display = 'none';
            if (nav) nav.classList.remove('hidden');
            sections.forEach(section => section.classList.remove('hidden'));
            scrollToSection('#about');
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                scrollToSection(targetId);
            }
        });
    });

    function scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Contact Form
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            const existingMessages = document.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());

            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            const subject = `Contact from ${name}`;
            const body = `${message}\n\nFrom: ${name}\nEmail: ${email}`;
            const mailtoLink = `mailto:monin2771@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Opening Email Client...';
            submitBtn.disabled = true;

            const emailWindow = window.open(mailtoLink, '_blank');

            if (emailWindow) {
                setTimeout(() => {
                    showFormMessage('Your email client should now be open. Please send your message from there.', 'success');
                    contactForm.reset();
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
            } else {
                showFormMessage('Failed to open email client. Please copy your message and send it manually to monin2771@gmail.com.', 'error');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    function showFormMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = text;

        const contactForm = document.getElementById("contact-form");
        contactForm.insertBefore(messageElement, contactForm.firstChild);

        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => messageElement.remove(), 500);
        }, 5000);
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
});

