// Navigation
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// API Endpoint - Aggiorna con il tuo dominio Vercel/Netlify
const API_BASE_URL = window.location.origin; // Usa il dominio corrente (funziona con Vercel/Netlify)

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
    submitButton.disabled = true;

    try {
        // Send email using Mailgun via serverless API
        const response = await fetch(`${API_BASE_URL}/api/send-contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Errore nell\'invio');
        }

        // Success message
        formMessage.textContent = 'Messaggio inviato con successo! Ti risponderò al più presto.';
        formMessage.className = 'form-message success';
        contactForm.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);

    } catch (error) {
        console.error('Error sending email:', error);
        formMessage.textContent = 'Errore nell\'invio del messaggio. Riprova più tardi o contattami direttamente su LinkedIn.';
        formMessage.className = 'form-message error';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

// Newsletter Form Handler
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');

newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('newsletterEmail').value;
    const name = document.getElementById('newsletterName').value || 'Subscriber';

    // Show loading state
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iscrizione...';
    submitButton.disabled = true;

    try {
        // Subscribe to newsletter using Mailgun via serverless API
        const response = await fetch(`${API_BASE_URL}/api/subscribe-newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Errore nell\'iscrizione');
        }

        // Success message
        newsletterMessage.textContent = 'Iscrizione completata! Grazie per esserti iscritto.';
        newsletterMessage.className = 'form-message success';
        newsletterForm.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            newsletterMessage.style.display = 'none';
        }, 5000);

    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        newsletterMessage.textContent = 'Errore nell\'iscrizione. Riprova più tardi.';
        newsletterMessage.className = 'form-message error';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            newsletterMessage.style.display = 'none';
        }, 5000);
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .stat-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add active class to current section in navigation
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
});

// Cookie Consent Banner
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');
const rejectCookies = document.getElementById('rejectCookies');

// Check if user has already made a choice
function getCookieConsent() {
    return localStorage.getItem('cookieConsent');
}

function setCookieConsent(value) {
    localStorage.setItem('cookieConsent', value);
    // Set cookie expiry to 1 year
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookieConsent=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

// Show banner if no consent has been given
if (!getCookieConsent()) {
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1000); // Show after 1 second
}

// Accept cookies
acceptCookies.addEventListener('click', () => {
    setCookieConsent('accepted');
    cookieBanner.classList.remove('show');
    
    // Enable Google Analytics if consent given
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }
});

// Reject cookies
rejectCookies.addEventListener('click', () => {
    setCookieConsent('rejected');
    cookieBanner.classList.remove('show');
    
    // Disable Google Analytics if consent rejected
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
    }
});
