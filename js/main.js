// Main JavaScript file for Özel İstanbul Plakam website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeCounterAnimation();
    initializeBackToTop();
    initializeNavbarScroll();
    initializeLazyLoading();
    initializeFormValidation();
    initializeWhatsAppIntegration();
    initializeSmoothScrolling();
    initializeAnimationsOnScroll();
});

// Counter Animation for Statistics
function initializeCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.getAttribute('data-count'));
                animateCounter(target, finalNumber);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

// Animate counter numbers
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // Animation duration
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 40);
}

// Back to Top Button Functionality
function initializeBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navbar Scroll Effect
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Lazy Loading for Images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                handleFormSubmission(form);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    validateInput(input);
                }
            });
        });
    });
}

// Validate individual input
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let message = '';
    
    // Remove previous validation classes
    input.classList.remove('is-valid', 'is-invalid');
    
    // Check if required field is empty
    if (input.hasAttribute('required') && value === '') {
        isValid = false;
        message = 'Bu alan zorunludur.';
    }
    
    // Email validation
    else if (type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Geçerli bir e-posta adresi girin.';
        }
    }
    
    // Phone validation
    else if (type === 'tel' && value !== '') {
        const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            message = 'Geçerli bir telefon numarası girin.';
        }
    }
    
    // Add validation classes and feedback
    if (isValid) {
        input.classList.add('is-valid');
        removeValidationFeedback(input);
    } else {
        input.classList.add('is-invalid');
        showValidationFeedback(input, message);
    }
    
    return isValid;
}

// Show validation feedback
function showValidationFeedback(input, message) {
    removeValidationFeedback(input);
    
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    
    input.parentNode.appendChild(feedback);
}

// Remove validation feedback
function removeValidationFeedback(input) {
    const existingFeedback = input.parentNode.querySelector('.invalid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

// Handle form submission
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Gönderiliyor...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Show success message
        showNotification('Mesajınız başarıyla gönderildi!', 'success');
        
        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// WhatsApp Integration
function initializeWhatsAppIntegration() {
    const whatsappButton = document.querySelector('.whatsapp-float a');
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            // Track WhatsApp click (for analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'WhatsApp',
                    'event_label': 'Float Button'
                });
            }
        });
    }
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animations on Scroll
function initializeAnimationsOnScroll() {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .stat-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: none;
        border-radius: 8px;
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="me-2">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                  type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                  '<i class="fas fa-info-circle"></i>'}
            </div>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Phone Number Formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('90')) {
        value = value.substring(2);
    }
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        } else if (value.length <= 8) {
            value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
        } else {
            value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 8) + ' ' + value.slice(8, 10);
        }
    }
    
    input.value = value;
}

// Add phone formatting to all phone inputs
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });
});

// Plaka Sorgulama Functionality
function initializePlakaSearch() {
    const searchForm = document.querySelector('#plaka-search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const plakaInput = this.querySelector('#plaka-input');
            const plaka = plakaInput.value.trim().toUpperCase();
            
            if (plaka.length < 2) {
                showNotification('Lütfen geçerli bir plaka kombinasyonu girin.', 'error');
                return;
            }
            
            searchPlaka(plaka);
        });
    }
}

// Plaka search functionality
function searchPlaka(plaka) {
    const resultsContainer = document.querySelector('#search-results');
    
    if (resultsContainer) {
        resultsContainer.innerHTML = '<div class="text-center"><div class="loading"></div> Sorgulanıyor...</div>';
        
        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            const isAvailable = Math.random() > 0.5; // Random availability for demo
            
            if (isAvailable) {
                resultsContainer.innerHTML = `
                    <div class="alert alert-success">
                        <h5><i class="fas fa-check-circle"></i> Plaka Müsait!</h5>
                        <p><strong>${plaka}</strong> plakası şu anda müsaittir.</p>
                        <button class="btn btn-primary" onclick="requestPlaka('${plaka}')">
                            <i class="fas fa-envelope"></i> Talep Et
                        </button>
                    </div>
                `;
            } else {
                resultsContainer.innerHTML = `
                    <div class="alert alert-warning">
                        <h5><i class="fas fa-exclamation-triangle"></i> Plaka Müsait Değil</h5>
                        <p><strong>${plaka}</strong> plakası şu anda müsait değildir.</p>
                        <button class="btn btn-outline-primary" onclick="suggestAlternatives('${plaka}')">
                            <i class="fas fa-lightbulb"></i> Alternatif Öneriler
                        </button>
                    </div>
                `;
            }
        }, 2000);
    }
}

// Request plaka
function requestPlaka(plaka) {
    showNotification(`${plaka} plakası için talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.`, 'success');
    
    // Track request (for analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'plaka_request', {
            'event_category': 'Plaka',
            'event_label': plaka
        });
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Don't show error notifications in production
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        showNotification('Bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
    }
});

// Performance Monitoring
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                // Log performance data (can be sent to analytics)
                console.log('Page Load Time:', loadTime + 'ms');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        'name': 'load',
                        'value': loadTime
                    });
                }
            }, 1000);
        });
    }
}

// Initialize performance monitoring
initializePerformanceMonitoring();

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed');
        });
    });
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Focus management for modal dialogs
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                const closeButton = activeModal.querySelector('[data-bs-dismiss="modal"]');
                if (closeButton) {
                    closeButton.click();
                }
            }
        }
    });
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
            }
        });
    }
}

// Initialize accessibility features
initializeAccessibility(); 