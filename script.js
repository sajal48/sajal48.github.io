// Terminal Noir theme - Main JavaScript for Sajal Halder's portfolio
// Interactive terminal and animation effects

// Terminal Typewriter Effect with Command Output
class TerminalTypewriter {
    constructor(promptElement, outputElement) {
        this.promptElement = promptElement;
        this.outputElement = outputElement;
        this.commands = [
            {
                command: 'whoami',
                output: `<div class="output-line">Sajal Halder</div>
                        <div class="output-line">Software Engineer @ BJIT</div>
                        <div class="output-line">Backend Developer specializing in Java & Microservices</div>`
            },
            {
                command: 'cat skills.md',
                output: `<div class="output-line">## Programming Languages</div>
                        <div class="output-line">- Java, Kotlin</div>
                        <div class="output-line">- SQL</div>
                        <div class="output-line">## Frameworks & Technologies</div>
                        <div class="output-line">- Spring Boot, Microservices</div>
                        <div class="output-line">- JPA/Hibernate, QueryDSL</div>
                        <div class="output-line">- Docker, Kubernetes</div>`
            },
            {
                command: 'ls -la projects/',
                output: `<div class="output-line">total 5</div>
                        <div class="output-line">drwxr-xr-x  rakuten-bff/</div>
                        <div class="output-line">drwxr-xr-x  rakuten-gateway/</div>
                        <div class="output-line">drwxr-xr-x  erp-system/</div>
                        <div class="output-line">drwxr-xr-x  querydsl-api/</div>
                        <div class="output-line">drwxr-xr-x  url-shortener/</div>`
            },
            {
                command: 'git log --oneline',
                output: `<div class="output-line">e7d9f2c Optimized service latency by 28%</div>
                        <div class="output-line">a4b8c3d Improved CI pipeline reliability</div>
                        <div class="output-line">f5c1e7b Built ERP system for 150+ users</div>
                        <div class="output-line">b3d8a1c Handled 1B+ daily API transactions</div>`
            },
            {
                command: 'docker ps',
                output: `<div class="output-line">CONTAINER ID   IMAGE              STATUS</div>
                        <div class="output-line">a89f3cde21     spring-boot-app     Up 3 days</div>
                        <div class="output-line">b45e1cfa38     postgres:14         Up 3 days</div>
                        <div class="output-line">c12d7e93ab     redis:alpine        Up 3 days</div>`
            },
        ];
        this.currentCommand = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.isWaitingAfterType = false;
        this.typingSpeed = 70;
        this.deletingSpeed = 30;
        this.pauseAfterType = 2000;
        this.pauseAfterDelete = 500;
        
        // Start the animation
        this.type();
    }
    
    type() {
        // Get current command data
        const command = this.commands[this.currentCommand].command;
        const output = this.commands[this.currentCommand].output;
        
        // Set typing speed
        let typeSpeed = this.typingSpeed;
        
        // If waiting after typing a complete command
        if (this.isWaitingAfterType) {
            this.isWaitingAfterType = false;
            this.isDeleting = true;
            typeSpeed = this.pauseAfterType;
                  // Show command output
            this.outputElement.innerHTML = output;
            this.outputElement.style.display = 'block';
            // Make output visible with animation
            setTimeout(() => {
                this.outputElement.style.opacity = '1';
            }, 100);
        } 
        // If deleting
        else if (this.isDeleting) {
            if (this.currentText.length > 0) {
                // Remove one character
                this.currentText = command.substring(0, this.currentText.length - 1);
                typeSpeed = this.deletingSpeed;
            } else {
                // Finished deleting
                this.isDeleting = false;
                this.currentCommand = (this.currentCommand + 1) % this.commands.length;
                typeSpeed = this.pauseAfterDelete;
                  // Clear output
                this.outputElement.style.opacity = '0';
                setTimeout(() => {
                    this.outputElement.style.display = 'none';
                }, 300);
            }
        } 
        // If typing
        else {
            // Add one character
            this.currentText = command.substring(0, this.currentText.length + 1);
            
            // If finished typing complete command
            if (this.currentText === command) {
                this.isWaitingAfterType = true;
            }
        }
        
        // Update text in prompt
        this.promptElement.innerHTML = this.currentText;
        
        // Call this function again after typeSpeed
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Intersection Observer for animation on scroll
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Handle counters
                if (entry.target.classList.contains('stat-value')) {
                    animateCounter(entry.target);
                }
                
                // Handle skill tags
                if (entry.target.classList.contains('skill-category')) {
                    const skillTags = entry.target.querySelectorAll('.skill-tag');
                    skillTags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.style.opacity = '1';
                            tag.style.transform = 'translateY(0)';
                        }, 100 * index);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
      // Observe elements
    document.querySelectorAll('.section-title, .about-code, .skill-category, .timeline-item, .project-card, .contact-link').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
    
    // Observe stat cards separately to ensure counter animation works
    document.querySelectorAll('.stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
    
    // Observe stat values directly
    document.querySelectorAll('.stat-value').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // ms
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;
    const suffix = element.getAttribute('data-suffix') || '';
    
    // Start animation immediately with first value
    if (target >= 1000000000) {
        element.textContent = '0.1B' + suffix;
    } else {
        element.textContent = '1' + suffix;
    }
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        
        // Format numbers based on size
        if (target >= 1000000000) {
            element.textContent = (current / 1000000000).toFixed(1) + 'B' + suffix;
        } else if (target >= 1000000) {
            element.textContent = (current / 1000000).toFixed(1) + 'M' + suffix;
        } else if (target >= 1000) {
            element.textContent = Math.round(current / 1000) + 'K' + suffix;
        } else {
            element.textContent = Math.round(current) + suffix;
        }
    }, stepTime);
}

// Terminal screen flicker effect
function addScreenEffects() {
    // Create flicker overlay
    const flickerOverlay = document.createElement('div');
    flickerOverlay.className = 'flicker-overlay';
    document.body.appendChild(flickerOverlay);
    
    // Random screen flickers
    function randomFlicker() {
        if (Math.random() < 0.02) { // 2% chance of flicker
            flickerOverlay.style.opacity = (Math.random() * 0.05) + 0.02;
            
            setTimeout(() => {
                flickerOverlay.style.opacity = '0';
            }, 50 + Math.random() * 50);
        }
        
        // Occasional stronger flicker
        if (Math.random() < 0.002) { // 0.2% chance of stronger glitch
            flickerOverlay.style.opacity = (Math.random() * 0.15) + 0.05;
            
            // Brief distortion
            document.body.classList.add('distort');
            
            setTimeout(() => {
                flickerOverlay.style.opacity = '0';
                document.body.classList.remove('distort');
            }, 100 + Math.random() * 150);
        }
        
        requestAnimationFrame(randomFlicker);
    }
    
    randomFlicker();
}

// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-switch');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.checked = true;
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.checked = false;
    }
    
    // Handle theme switch
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.removeAttribute('data-theme');
                themeToggle.checked = false;
            } else {
                document.body.setAttribute('data-theme', 'light');
                themeToggle.checked = true;
            }
        }
    });
}

// Initialize on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize terminal
    const commandElement = document.querySelector('.command-input');
    const outputElement = document.querySelector('.terminal-output');
    
    if (commandElement && outputElement) {
        new TerminalTypewriter(commandElement, outputElement);
    }
      // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Setup scroll animations
    setupIntersectionObserver();
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Update active link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle scrolling to update active nav link
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) translateZ(0)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) translateZ(0)';
        });
    });
      // Copy code functionality
    const codeBlock = document.querySelector('.code-block');
    const copyButton = document.querySelector('.code-action.copy');
    
    if (codeBlock && copyButton) {
        copyButton.addEventListener('click', () => {
            const codeText = codeBlock.textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                copyButton.classList.add('copied');
                
                // Show tooltip or indication that code was copied
                copyButton.setAttribute('title', 'Copied!');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                    copyButton.setAttribute('title', 'Copy code');
                }, 2000);
            });
        });
    }
    
    // Easter egg - Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                        'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                document.body.classList.add('matrix-mode');
                
                setTimeout(() => {
                    document.body.classList.remove('matrix-mode');
                }, 5000);
                
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // Console message for curious developers
    console.log(`
╔════════════════════════════════════════╗
║  Welcome !                             ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║                                        ║
║  Sajal Halder's Backend Portfolio      ║
║  Built with vanilla JS, CSS and HTML   ║
║                                        ║
║  Want to connect?                      ║
║  → github.com/sajal48                  ║
║  → linkedin.com/in/sajal-halder48      ║
║                                        ║
╚════════════════════════════════════════╝
`);
    
    addScreenEffects();
    setupThemeToggle();
});
