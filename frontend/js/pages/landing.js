/**
 * Landing Page Module
 */
export const landingPage = {
  init() {
    this.initMobileMenu();
    this.initStickyNavbar();
    this.initScrollReveal();
    this.initSmoothScroll();
  },

  /**
   * Toggle the mobile hamburger navigation menu overlay.
   */
  initMobileMenu() {
    const trigger = document.getElementById('mobile-menu-trigger');
    const menu = document.getElementById('mobile-nav-overlay');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = menu.classList.contains('open');
      if (isOpen) {
        menu.classList.remove('open');
        trigger.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      } else {
        menu.classList.add('open');
        trigger.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></svg>`;
      }
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = menu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        trigger.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  },

  /**
   * Adjust sticky navbar styling on scroll.
   */
  initStickyNavbar() {
    const navbar = document.getElementById('sticky-navbar');
    if (!navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = 'var(--shadow-md)';
        navbar.style.borderBottomColor = 'var(--color-border)';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottomColor = 'transparent';
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run immediately in case page loaded scrolled
  },

  /**
   * Reveal elements (like timeline steps) on scroll.
   */
  initScrollReveal() {
    const steps = document.querySelectorAll('.timeline-step');
    if (!steps.length) return;

    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          self.unobserve(entry.target);
        }
      });
    }, observerOptions);

    steps.forEach((step, idx) => {
      // Set initial styles for animation
      step.style.opacity = '0';
      step.style.transform = 'translateY(20px)';
      step.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s`;
      observer.observe(step);
    });
  },

  /**
   * Implements smooth scrolling behavior for internal anchor links.
   */
  initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navbarHeight = 72; // height of sticky navbar
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};
