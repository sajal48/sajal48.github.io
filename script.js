// Typing animation for hero section
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = this.txt;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', function() {
    const typedTextElement = document.querySelector('.typed-text');
    const words = [
        'whoami',
        'cat skills.txt',
        'ls projects/',
        'git log --oneline',
        'docker ps',
        'kubectl get pods'
    ];
    
    if (typedTextElement) {
        new TypeWriter(typedTextElement, words, 2000);
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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate stats counters
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-item')) {
                animateSkillBar(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.stat-number, .skill-item, .project-card').forEach(el => {
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
        
        if (target >= 1000000) {
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

// Skill bar animation
function animateSkillBar(element) {
    const skillLevel = element.querySelector('.skill-level').textContent;
    const percentage = parseInt(skillLevel);
    element.style.setProperty('--skill-width', percentage + '%');
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
