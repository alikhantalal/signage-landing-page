// LinkedIn Signage Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize animations
    initializeAnimations();
    
    // Form handling
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    // Form validation
    const formInputs = document.querySelectorAll('#quote-form input[required], #quote-form textarea[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidation);
    });
    
    // Statistics animation on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(handleStatAnimation, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    // Mobile menu handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
    
    // File upload handling
    const fileInput = document.getElementById('designFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // CTA button tracking
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackCTAClick(button.textContent.trim());
        });
    });
});

// Initialize scroll animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in-up');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.classList.add('animate');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'details'];
    const missingFields = requiredFields.filter(field => !formObject[field] || !formObject[field].trim());
    
    if (missingFields.length > 0) {
        showNotification('Please fill in all required fields', 'error');
        highlightMissingFields(missingFields);
        return;
    }
    
    // Validate email format
    if (!isValidEmail(formObject.email)) {
        showNotification('Please enter a valid email address', 'error');
        document.getElementById('email').classList.add('is-invalid');
        return;
    }
    
    // Validate phone format
    if (!isValidPhone(formObject.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        document.getElementById('phone').classList.add('is-invalid');
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending Your Request...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Thank you! Your quote request has been submitted successfully. We\'ll contact you within 24 hours with your free mockup.', 'success');
        e.target.reset();
        clearAllValidation();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Track form submission
        trackFormSubmission(formObject);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Highlight missing fields
function highlightMissingFields(fields) {
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('is-invalid');
            field.focus();
        }
    });
}

// Clear all validation
function clearAllValidation() {
    const allInputs = document.querySelectorAll('.form-control, .form-select');
    allInputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });
}

// Clear validation on input
function clearValidation(e) {
    e.target.classList.remove('is-invalid');
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
}

// Input validation
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Remove existing error styling
    input.classList.remove('is-invalid');
    
    // Check if required field is empty
    if (input.hasAttribute('required') && !value) {
        input.classList.add('is-invalid');
        return;
    }
    
    // Validate email
    if (input.type === 'email' && value && !isValidEmail(value)) {
        input.classList.add('is-invalid');
        return;
    }
    
    // Validate phone
    if (input.type === 'tel' && value && !isValidPhone(value)) {
        input.classList.add('is-invalid');
        return;
    }
    
    // Add success styling
    if (value) {
        input.classList.add('is-valid');
    }
}

// File upload handler
function handleFileUpload(e) {
    const file = e.target.files[0];
    const placeholder = document.querySelector('.file-upload-placeholder');
    
    if (file) {
        placeholder.innerHTML = `
            <i class="bi bi-file-earmark-check"></i>
            <span>File selected: ${file.name}</span>
        `;
        placeholder.style.color = '#28a745';
    } else {
        placeholder.innerHTML = `
            <i class="bi bi-cloud-upload"></i>
            <span>Click to upload or drag and drop</span>
        `;
        placeholder.style.color = '#666';
    }
}

// Smooth scrolling
function handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 100; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Statistics animation
function handleStatAnimation(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElement = entry.target;
            const finalValue = statElement.textContent;
            
            // Only animate if not already animated
            if (!statElement.classList.contains('animated')) {
                animateNumber(statElement, finalValue);
                statElement.classList.add('animated');
            }
        }
    });
}

// Animate numbers
function animateNumber(element, finalValue) {
    const isPercentage = finalValue.includes('%');
    const hasPlus = finalValue.includes('+');
    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    
    let currentValue = 0;
    const increment = numericValue / 60; // 60 steps for smooth animation
    const duration = 2000; // 2 seconds
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(currentValue);
        
        if (isPercentage) {
            displayValue += '%';
        } else if (hasPlus) {
            displayValue = displayValue.toLocaleString() + '+';
        } else {
            displayValue = displayValue.toLocaleString();
        }
        
        element.textContent = displayValue;
    }, stepTime);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        border: none;
    `;
    
    const iconClass = type === 'error' ? 'exclamation-triangle' : 'check-circle';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${iconClass}-fill me-2 fs-5"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 6 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 6000);
    
    // Manual dismiss
    const closeButton = notification.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Track CTA clicks
function trackCTAClick(buttonText) {
    // Google Analytics example
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'event_category': 'User Engagement',
            'event_label': buttonText,
            'value': 1
        });
    }
    
    // Facebook Pixel example
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_category: 'CTA Click',
            content_name: buttonText
        });
    }
    
    console.log('CTA clicked:', buttonText);
}

// Track form submission
function trackFormSubmission(formData) {
    // Google Analytics example
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'Lead Generation',
            'event_label': 'Quote Request Form',
            'value': 1
        });
    }
    
    // Facebook Pixel example
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_category: 'Form Submission',
            content_name: 'Quote Request Form'
        });
    }
    
    // LinkedIn Insight Tag example
    if (typeof _linkedin_partner_id !== 'undefined') {
        window.lintrk('track', { conversion_id: 'CONVERSION_ID' });
    }
    
    console.log('Form submitted:', formData);
}

// Pause marquee on hover
document.addEventListener('DOMContentLoaded', function() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        marqueeContent.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        marqueeContent.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }
});

// Enhanced scroll effects
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-section');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add loading animation to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
});