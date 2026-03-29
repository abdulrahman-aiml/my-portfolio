// Portfolio Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initSkillTagAnimations();
    initSmoothScrolling();
    initActiveSectionHighlight();
});

// ===== Navigation =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        }
    });
}

// ===== Smooth Scrolling =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Active Section Highlight =====
function initActiveSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.skill-category, .experience-card, .project-card, .cert-card, .education-card, .info-card'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== Skill Tag Animations =====
function initSkillTagAnimations() {
    const skillCategories = document.querySelectorAll('.skill-category');

    skillCategories.forEach(category => {
        const tags = category.querySelectorAll('.skill-tag');
        
        category.addEventListener('mouseenter', () => {
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.05)';
                    tag.style.transition = 'transform 0.2s ease';
                }, index * 30);
            });
        });

        category.addEventListener('mouseleave', () => {
            tags.forEach(tag => {
                tag.style.transform = 'scale(1)';
            });
        });
    });
}

// ===== Typing Effect for Code Window =====
function initTypingEffect() {
    const codeWindow = document.querySelector('.code-window');
    if (!codeWindow) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                codeWindow.style.opacity = '1';
                codeWindow.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    codeWindow.style.opacity = '0';
    codeWindow.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(codeWindow);
}

// ===== Counter Animation for Stats =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value, .metric-value');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const text = counter.textContent;
                
                // Extract number and suffix
                const match = text.match(/^([\d.,]+)(.*)$/);
                if (match) {
                    const targetValue = parseFloat(match[1].replace(/,/g, ''));
                    const suffix = match[2];
                    const isPercentage = suffix.includes('%');
                    const hasX = suffix.includes('x');
                    
                    animateValue(counter, 0, targetValue, 1500, suffix, isPercentage, hasX);
                }
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateValue(element, start, end, duration, suffix, isPercentage, hasX) {
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        
        if (hasX) {
            element.textContent = value + 'x';
        } else if (isPercentage) {
            element.textContent = value + '%';
        } else if (end >= 1000) {
            element.textContent = value.toLocaleString() + '+';
        } else {
            element.textContent = value + suffix;
        }
        
        if (value == end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
}

// ===== Parallax Effect for Hero =====
function initParallax() {
    const hero = document.querySelector('.hero');
    const codeWindow = document.querySelector('.code-window');
    
    if (!hero || !codeWindow) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < window.innerHeight) {
            codeWindow.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg) translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ===== Initialize on Load =====
window.addEventListener('load', () => {
    animateCounters();
    initTypingEffect();
    initParallax();
});

// ===== Performance: Debounce Scroll Events =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});
