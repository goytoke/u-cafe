 // set year
document.getElementById('year').textContent = new Date().getFullYear();

// Header is completely transparent like index11.html - no scroll effect
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

// Image Carousel Functionality
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicatorsContainer = document.querySelector('.carousel-indicators');
let currentSlide = 0;
let slideInterval;

// Create indicators/dots
carouselSlides.forEach((_, index) => {
  const indicator = document.createElement('button');
  indicator.className = 'carousel-indicator';
  indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
  if (index === 0) indicator.classList.add('active');
  
  indicator.addEventListener('click', () => {
    goToSlide(index);
    resetInterval();
  });
  
  indicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.carousel-indicator');

// Function to show a specific slide
function showSlide(index) {
  // Hide all slides
  carouselSlides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  // Remove active class from all indicators
  indicators.forEach(indicator => {
    indicator.classList.remove('active');
  });
  
  // Show the current slide and indicator
  carouselSlides[index].classList.add('active');
  indicators[index].classList.add('active');
  currentSlide = index;
}

// Function to go to next slide
function nextSlide() {
  let nextIndex = currentSlide + 1;
  if (nextIndex >= carouselSlides.length) {
    nextIndex = 0;
  }
  showSlide(nextIndex);
}

// Function to go to previous slide
function prevSlide() {
  let prevIndex = currentSlide - 1;
  if (prevIndex < 0) {
    prevIndex = carouselSlides.length - 1;
  }
  showSlide(prevIndex);
}

// Function to go to specific slide
function goToSlide(index) {
  if (index >= 0 && index < carouselSlides.length) {
    showSlide(index);
  }
}

// Function to start automatic slide change
function startCarousel() {
  slideInterval = setInterval(nextSlide, 1500); // Change slide every 1.5 seconds
}

// Function to reset interval (when user interacts with carousel)
function resetInterval() {
  clearInterval(slideInterval);
  startCarousel();
}

// Event listeners for buttons
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });
}

// Pause carousel on hover
const carousel = document.querySelector('.food-carousel');
if (carousel) {
  carousel.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  carousel.addEventListener('mouseleave', () => {
    startCarousel();
  });
}

// Initialize carousel
showSlide(0);
startCarousel();

// Preload carousel images
const carouselImages = [
  'Caramel Macchiato1.png',
  'Butter Croissant.png',
  'ጮርናቄ አሰራርፖስቲ አሰራር Pasti 1.PNG',
  'Moya1.PNG',
  'Fresh Orange Juice1.PNG',
  'Chicken Tibs1.PNG',
  'Chai Latte1.PNG',
  'Vegetarian Combo1.PNG',
  'Doro Wat1.PNG',
  'Buna with Popcorn1.PNG'
];
carouselImages.forEach(img => {
  const image = new Image();
  image.src = img;
});

// mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('navList');
menuBtn && menuBtn.addEventListener('click', () => {
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