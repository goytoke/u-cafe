// Set current year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Header scroll effect
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
      header.style.background = 'transparent';
      header.style.backdropFilter = window.scrollY > 50 ? 'blur(5px)' : 'blur(5px)';
    });

    // Subscribe button functionality
    const subscribeBtn = document.getElementById('subscribeBtn');
    const newsletterEmail = document.getElementById('newsletterEmail');

    subscribeBtn.addEventListener('click', () => {
      if (newsletterEmail.value && newsletterEmail.value.includes('@')) {
        alert('Thank you for subscribing to our newsletter!');
        newsletterEmail.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });

    // Testimonials slider functionality
    const slider = document.getElementById('slider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = 4; // Number of testimonial groups

    function updateSlider() {
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    // Next button
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    });

    // Previous button
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    });

    // Dot navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.getAttribute('data-index'));
        updateSlider();
      });
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    }, 5000);

    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const navList = document.getElementById('navList');
    
    menuBtn && menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if(!navList) return;
      if (navList.style.display === 'flex') {
        navList.style.display = '';
      } else {
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.position = 'absolute';
        navList.style.right = '18px';
        navList.style.top = '72px';
        navList.style.background = 'rgba(255, 255, 255, 0.95)';
        navList.style.backdropFilter = 'blur(10px)';
        navList.style.padding = '16px';
        navList.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
        navList.style.borderRadius = '16px';
        navList.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        navList.style.zIndex = '100';
        navList.style.gap = '15px';
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navList && navList.style.display === 'flex' && 
          !e.target.closest('#navList') && 
          !e.target.closest('#menuBtn')) {
        navList.style.display = '';
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Skip for # (home) links
        if (targetId === '#' || targetId.startsWith('http')) return;
        
        if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navList && navList.style.display === 'flex') {
              navList.style.display = '';
            }
          }
        }
      });
    });