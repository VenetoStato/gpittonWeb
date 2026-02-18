// EmailJS Configuration Example
// Copy this file to emailjs-config.js and fill in your actual values

const EMAILJS_CONFIG = {
    // Get your Public Key from EmailJS Dashboard > Account > General
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
    
    // Contact Form Configuration
    CONTACT: {
        // Get Service ID from EmailJS Dashboard > Email Services
        SERVICE_ID: 'YOUR_SERVICE_ID',
        // Get Template ID from EmailJS Dashboard > Email Templates
        TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
        // Your email address where you want to receive contact form submissions
        TO_EMAIL: 'your-email@example.com'
    },
    
    // Newsletter Configuration
    NEWSLETTER: {
        // Service ID for newsletter (can be same as contact or different)
        SERVICE_ID: 'YOUR_NEWSLETTER_SERVICE_ID',
        // Template ID for newsletter subscriptions
        TEMPLATE_ID: 'YOUR_NEWSLETTER_TEMPLATE_ID',
        // Your email address where you want to receive newsletter subscriptions
        TO_EMAIL: 'your-email@example.com'
    }
};

// EmailJS Template Variables for Contact Form:
// - from_name: {{from_name}}
// - from_email: {{from_email}}
// - company: {{company}}
// - subject: {{subject}}
// - message: {{message}}
// - to_email: {{to_email}}

// EmailJS Template Variables for Newsletter:
// - email: {{email}}
// - name: {{name}}
// - to_email: {{to_email}}
