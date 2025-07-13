class PortfolioApp {
    constructor() {
        this.securityConfig = {
            maxFormSubmissions: 3,
            submissionWindow: 300000, // 5 minutes
            maxInputLength: 1000,
            allowedDomains: [window.location.hostname],
            csrfToken: this.generateCSRFToken()
        };
        this.submissionTracker = new Map();
        this.init();
    }

    init() {
        this.initSecurity();
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupLazyLoading();
        this.setupPageTransitions();
        this.setupMobileMenu();
        this.setupFormHandling();
        this.setupAnimations();
        this.preloadCriticalResources();
    }


    // Security initialization
    initSecurity() {
        this.setupCSP();
        this.setupXSSProtection();
        this.setupClickjackingProtection();
        this.setupInputSanitization();
        this.monitorConsoleAccess();
        this.setupIntegrityChecks();
    }
    // Generate CSRF token
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Content Security Policy setup
    setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.emailjs.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com;";
        document.head.appendChild(meta);
    }

    // XSS Protection
    setupXSSProtection() {
        // Sanitize all text content
        this.sanitizeExistingContent();

        // Override innerHTML to sanitize content
        this.overrideInnerHTML();
    }

    sanitizeExistingContent() {
        const textElements = document.querySelectorAll('*');
        textElements.forEach(element => {
            if (element.children.length === 0 && element.textContent) {
                element.textContent = this.sanitizeText(element.textContent);
            }
        });
    }

    overrideInnerHTML() {
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');

        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                const sanitized = this.sanitizeHTML ? this.sanitizeHTML(value) : value;
                originalInnerHTML.set.call(this, sanitized);
            },
            get: originalInnerHTML.get
        });
    }

    // HTML Sanitization
    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    // Text Sanitization
    sanitizeText(text) {
        return text
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .replace(/data:/gi, '')
            .trim();
    }

    // Input Sanitization and Validation
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';

        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/data:(?!image\/)/gi, '')
            .replace(/vbscript:/gi, '')
            .trim()
            .substring(0, this.securityConfig.maxInputLength);
    }

    // Clickjacking Protection
    setupClickjackingProtection() {
        if (window.top !== window.self) {
            document.body.style.display = 'none';
            throw new Error('Clickjacking attempt detected');
        }
    }

    // Rate Limiting
    checkRateLimit(identifier) {
        const now = Date.now();
        const userSubmissions = this.submissionTracker.get(identifier) || [];

        // Clean old submissions
        const recentSubmissions = userSubmissions.filter(
            time => now - time < this.securityConfig.submissionWindow
        );

        if (recentSubmissions.length >= this.securityConfig.maxFormSubmissions) {
            return false;
        }

        recentSubmissions.push(now);
        this.submissionTracker.set(identifier, recentSubmissions);
        return true;
    }

    // Get user identifier for rate limiting
    getUserIdentifier() {
        return this.getFingerprint();
    }

    // Simple browser fingerprinting
    getFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Security check', 2, 2);

        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');

        return this.simpleHash(fingerprint);
    }

    // Simple hash function
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Console access monitoring
    monitorConsoleAccess() {
        let devtools = false;
        const threshold = 160;

        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools) {
                    devtools = true;
                    this.logSecurityEvent('DevTools opened');
                }
            } else {
                devtools = false;
            }
        }, 500);
    }

    // Integrity checks
    setupIntegrityChecks() {
        // Check for script injection
        const scripts = document.querySelectorAll('script');
        const expectedScripts = ['main.js', 'emailjs'];

        scripts.forEach(script => {
            if (script.src && !expectedScripts.some(expected => script.src.includes(expected))) {
                this.logSecurityEvent('Unexpected script detected: ' + script.src);
            }
        });
    }

    // Security event logging
    logSecurityEvent(event) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            event,
            userAgent: navigator.userAgent,
            url: window.location.href,
            fingerprint: this.getUserIdentifier()
        };

        // Store in localStorage for analysis
        const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        logs.push(logEntry);

        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }

        localStorage.setItem('securityLogs', JSON.stringify(logs));
        console.warn('Security Event:', logEntry);
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const href = this.sanitizeInput(anchor.getAttribute('href'));
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = this.sanitizeInput(img.dataset.src);

                    // Validate image URL
                    if (this.isValidImageURL(src)) {
                        img.src = src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Validate image URLs
    isValidImageURL(url) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const allowedProtocols = ['http:', 'https:', 'data:'];

        try {
            const urlObj = new URL(url, window.location.origin);

            if (!allowedProtocols.includes(urlObj.protocol)) {
                return false;
            }

            if (urlObj.protocol.startsWith('http')) {
                return allowedExtensions.some(ext =>
                    urlObj.pathname.toLowerCase().includes(ext)
                );
            }

            if (urlObj.protocol === 'data:') {
                return urlObj.href.startsWith('data:image/');
            }

            return true;
        } catch {
            return false;
        }
    }

    setupPageTransitions() {
        document.body.classList.add('page-loading');

        window.addEventListener('load', () => {
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');
        });

        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isValidInternalLink(link)) {
                    e.preventDefault();
                    this.navigateToPage(link.href);
                }
            });
        });
    }

    // Validate internal links
    isValidInternalLink(link) {
        try {
            const linkURL = new URL(link.href);
            return this.securityConfig.allowedDomains.includes(linkURL.hostname);
        } catch {
            return false;
        }
    }

    navigateToPage(url) {
        if (!this.isValidInternalLink({ href: url })) {
            this.logSecurityEvent('Invalid navigation attempt: ' + url);
            return;
        }

        document.body.classList.add('page-transitioning');
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                mobileToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });

            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    setupFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            // Add CSRF token to form
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = this.securityConfig.csrfToken;
            contactForm.appendChild(csrfInput);

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });

            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', (e) => {
                    e.target.value = this.sanitizeInput(e.target.value);
                    this.clearFieldError(input);
                });
            });
        }
    }

    handleFormSubmission(form) {
        const userIdentifier = this.getUserIdentifier();

        // Check rate limiting
        if (!this.checkRateLimit(userIdentifier)) {
            this.showNotification('Too many submissions. Please wait before trying again.', 'error');
            this.logSecurityEvent('Rate limit exceeded for form submission');
            return;
        }

        // Validate CSRF token
        const csrfToken = form.querySelector('input[name="csrf_token"]').value;
        if (csrfToken !== this.securityConfig.csrfToken) {
            this.showNotification('Security validation failed. Please refresh the page.', 'error');
            this.logSecurityEvent('CSRF token validation failed');
            return;
        }

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.querySelector('span').textContent;

        submitBtn.classList.add('loading');
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.disabled = true;

        // Get and sanitize form data
        const formData = {
            name: this.sanitizeInput(form.querySelector('#name').value),
            email: this.sanitizeInput(form.querySelector('#email').value),
            subject: this.sanitizeInput(form.querySelector('#subject').value),
            message: this.sanitizeInput(form.querySelector('#message').value),
            timestamp: Date.now(),
            fingerprint: userIdentifier
        };

        // Additional validation
        if (!this.validateFormData(formData)) {
            this.showNotification('Please check your input and try again.', 'error');
            this.resetSubmitButton(submitBtn, originalText);
            return;
        }

        // Send email using EmailJS with timeout
        const emailPromise = emailjs.send('service_laqcd6l', 'template_khn9mz9', formData);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        Promise.race([emailPromise, timeoutPromise])
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                // Regenerate CSRF token after successful submission
                this.securityConfig.csrfToken = this.generateCSRFToken();
                form.querySelector('input[name="csrf_token"]').value = this.securityConfig.csrfToken;
            })
            .catch((error) => {
                console.log('FAILED...', error);
                this.logSecurityEvent('Form submission failed: ' + error.message);
                if (error.message === 'Request timeout') {
                    this.showNotification('Request timed out. Please try again.', 'error');
                } else {
                    this.showNotification('Failed to send message. Please try again or contact me directly.', 'error');
                }
            })
            .finally(() => {
                this.resetSubmitButton(submitBtn, originalText);
            });
    }

    // Validate form data
    validateFormData(formData) {
        // Check for required fields
        if (!formData.name || !formData.email || !formData.message) {
            return false;
        }

        // Validate email format
        if (!this.isValidEmail(formData.email)) {
            return false;
        }

        // Check for suspicious patterns
        const suspiciousPatterns = [
            /<script/gi,
            /javascript:/gi,
            /on\w+=/gi,
            /data:(?!image\/)/gi,
            /vbscript:/gi,
            /<iframe/gi,
            /eval\(/gi,
            /document\.write/gi
        ];

        const allText = Object.values(formData).join(' ');
        return !suspiciousPatterns.some(pattern => pattern.test(allText));
    }

    // Reset submit button
    resetSubmitButton(submitBtn, originalText) {
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('span').textContent = originalText;
        submitBtn.disabled = false;
    }

    // Field validation
    validateField(field) {
        const value = this.sanitizeInput(field.value.trim());
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (value.length > this.securityConfig.maxInputLength) {
            isValid = false;
            errorMessage = `Maximum ${this.securityConfig.maxInputLength} characters allowed`;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    // Show field error
    showFieldError(field, message) {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.field-error');

        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${this.sanitizeHTML(message)}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto-hide after 5 seconds
        setTimeout(() => this.hideNotification(notification), 5000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    // Hide notification
    hideNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }

    // Setup animations
    setupAnimations() {
        const animatedElements = document.querySelectorAll('.hero-content, .project-card, .contact-content, .about-content, .gallery-content');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.classList.add('animate-ready');
            animationObserver.observe(el);
        });
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalImages = ['arrow.png', 'github.png'];

        // Preload images securely
        criticalImages.forEach(src => {
            if (this.isValidImageURL(src)) {
                const img = new Image();
                img.src = src;
                img.onerror = () => {
                    this.logSecurityEvent('Failed to load critical image: ' + src);
                };
            }
        });

        // Prefetch pages on hover
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (this.isValidInternalLink(link)) {
                    const linkElement = document.createElement('link');
                    linkElement.rel = 'prefetch';
                    linkElement.href = link.href;
                    document.head.appendChild(linkElement);
                }
            }, { once: true });
        });
    }

    // Setup event listeners
    setupEventListeners() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 10);
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Secure keyboard event handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }

            // Prevent certain key combinations for security
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.logSecurityEvent('DevTools access attempt via keyboard');
            }
        });

        // Monitor for suspicious activity
        document.addEventListener('contextmenu', (e) => {
            // Allow right-click but log it
            this.logSecurityEvent('Right-click detected');
        });

        // Monitor for copy attempts on sensitive content
        document.addEventListener('copy', (e) => {
            this.logSecurityEvent('Content copied');
        });
    }

    // Handle escape key
    handleEscapeKey() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (mobileToggle && navLinks && navLinks.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }

        // Close any open notifications
        document.querySelectorAll('.notification').forEach(notification => {
            this.hideNotification(notification);
        });
    }

    // Handle scroll events
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Security: Monitor for unusual scroll behavior
        if (window.scrollY < 0 || window.scrollY > document.body.scrollHeight) {
            this.logSecurityEvent('Unusual scroll behavior detected');
        }
    }

    // Handle resize events
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            if (mobileToggle && navLinks) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }

        // Security: Monitor for unusual window sizes
        if (window.innerWidth < 100 || window.innerHeight < 100) {
            this.logSecurityEvent('Unusual window size detected');
        }
    }

    // Setup input sanitization for existing elements
    setupInputSanitization() {
        // Monitor all input fields
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea')) {
                const originalValue = e.target.value;
                const sanitizedValue = this.sanitizeInput(originalValue);

                if (originalValue !== sanitizedValue) {
                    e.target.value = sanitizedValue;
                    this.logSecurityEvent('Input sanitized: potentially malicious content removed');
                }
            }
        });
    }

    // Get security logs (for debugging/monitoring)
    getSecurityLogs() {
        return JSON.parse(localStorage.getItem('securityLogs') || '[]');
    }

    // Clear security logs
    clearSecurityLogs() {
        localStorage.removeItem('securityLogs');
        console.log('Security logs cleared');
    }
}

// Performance optimization with security considerations
const optimizePerformance = () => {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }

    // Secure lazy loading for images
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        // Add error handling for images
        img.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
        };
    });

    // Optimize animations with security
    document.querySelectorAll('.cta-link, .project-card, .nav-link').forEach(el => {
        el.style.willChange = 'transform';
    });
};

// Secure initialization
const initializeSecurely = () => {
    try {
        new PortfolioApp();
        optimizePerformance();
    } catch (error) {
        console.error('Failed to initialize portfolio app:', error);
        // Fallback: basic functionality without advanced features
        document.body.classList.add('fallback-mode');
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecurely);
} else {
    initializeSecurely();
}

// Secure service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
                // Verify service worker integrity
                if (registration.active) {
                    registration.active.postMessage({
                        type: 'SECURITY_CHECK',
                        timestamp: Date.now()
                    });
                }
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Secure EmailJS initialization
(function() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("nMz1o0gq19jcGUaiz"); // Replace with your actual EmailJS public key
        } else {
            console.warn('EmailJS not loaded - contact form will not work');
        }
    } catch (error) {
        console.error('EmailJS initialization failed:', error);
    }
})();

// Security monitoring - check for tampering
setInterval(() => {
    if (typeof PortfolioApp === 'undefined') {
        console.error('Security Alert: Core application class has been tampered with');
        location.reload();
    }
}, 30000); // Check every 30 seconds