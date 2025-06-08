// Typing animation for hero section with output responses
class TypeWriter {
    constructor(element, commands, outputElement, wait = 3000) {
        this.element = element;
        this.commands = commands;
        this.outputElement = outputElement;
        this.wait = parseInt(wait, 10);
        this.commandIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.showingOutput = false;
        this.type();
    }

    type() {
        const current = this.commandIndex % this.commands.length;
        const command = this.commands[current].command;
        const output = this.commands[current].output;
        
        // If we're showing output, handle that differently
        if (this.showingOutput) {
            // Display output for some time, then start deleting the command
            setTimeout(() => {
                this.showingOutput = false;
                this.isDeleting = true;
                this.type();
            }, this.wait);
            return;
        }

        if (this.isDeleting) {
            this.txt = command.substring(0, this.txt.length - 1);
        } else {
            this.txt = command.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = this.txt;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // When finished typing the command
        if (!this.isDeleting && this.txt === command) {
            // Show the related output
            this.outputElement.innerHTML = output;
            this.showingOutput = true;
            return this.type(); // Continue the flow but in output mode
        } 
        // When finished deleting the command
        else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.commandIndex++;
            typeSpeed = 500;
            
            // Clear the output
            this.outputElement.innerHTML = '';
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing animation with commands and outputs
document.addEventListener('DOMContentLoaded', function() {
    const typedTextElement = document.querySelector('.typed-text');
    const outputElement = document.querySelector('.terminal-output');
    
    // Commands and their corresponding outputs
    const commandsWithOutputs = [
        {
            command: 'whoami',
            output: `<div class="output-line">Sajal Halder</div>
                    <div class="output-line">Software Engineer @ BJIT</div>
                    <div class="output-line">Backend Developer</div>`
        },
        {
            command: 'cat skills.txt',
            output: `<div class="output-line">• Java, Kotlin, Spring Boot</div>
                    <div class="output-line">• Microservices Architecture</div>
                    <div class="output-line">• PostgreSQL, Redis, Cassandra</div>
                    <div class="output-line">• Docker, Kubernetes, CI/CD</div>`
        },
        {
            command: 'ls projects/',
            output: `<div class="output-line">rakuten-bff/</div>
                    <div class="output-line">rakuten-gateway/</div>
                    <div class="output-line">erp-system/</div>
                    <div class="output-line">microservices-platform/</div>`
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
        {
            command: 'kubectl get pods',
            output: `<div class="output-line">NAME                           READY   STATUS</div>
                    <div class="output-line">api-gateway-694d87b989-zsd45    1/1     Running</div>
                    <div class="output-line">auth-service-5bc7cbd5d6-x2wvp   1/1     Running</div>
                    <div class="output-line">user-service-84b87c6d55-lp24f   1/1     Running</div>`
        }
    ];
    
    if (typedTextElement && outputElement) {
        new TypeWriter(typedTextElement, commandsWithOutputs, outputElement, 2000);
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Modify the observer to handle the new skills design
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate stats counters
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
            
            // Animate skill items within skill categories
            if (entry.target.classList.contains('skill-category')) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.stat-number, .skill-category, .project-card').forEach(el => {
    observer.observe(el);
});

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000000000) {
            element.textContent = (current / 1000000000).toFixed(1) + 'B';
        } else if (target >= 1000000) {
            element.textContent = (current / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(0) + 'K';
        } else if (target === 99.9) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Parallax effect for grain overlay
let ticking = false;

function updateGrain() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const grain = document.querySelector('.grain-overlay');
    
    if (grain) {
        grain.style.transform = `translateY(${rate}px)`;
    }
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateGrain);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Add active class to navigation links
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) rotateX(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0)';
    });
});

// Terminal cursor blink control
setInterval(() => {
    const cursors = document.querySelectorAll('.cursor');
    cursors.forEach(cursor => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    });
}, 500);

// Add some easter eggs
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Easter egg activated
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 3000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Console message for curious developers
console.log(`
╭─────────────────────────────────────╮
│  Welcome, fellow developer! 👨‍💻      │
│                                     │
│  Thanks for checking out the code.  │
│  This portfolio was built with:     │
│  • Vanilla JavaScript              │
│  • CSS Grid & Flexbox              │
│  • Intersection Observer API       │
│  • CSS Custom Properties           │
│                                     │
│  Want to connect? Let's chat!       │
╰─────────────────────────────────────╯
`);
