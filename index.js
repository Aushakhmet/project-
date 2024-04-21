document.querySelectorAll('a.scroll[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      const target = document.querySelector(this.getAttribute('href'));
  
      if (target) {
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });

