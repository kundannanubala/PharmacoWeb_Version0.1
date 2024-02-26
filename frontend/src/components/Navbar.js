import React, { useState, useEffect } from 'react';
import '../Navbar.css';

const Navbar = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const handleToggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleResize = () => {
    if (window.innerWidth > 800) {
      setIsNavVisible(false);
    }
  };

  const handleScroll = () => {
    const sections = ['home', 'about', 'work', 'contact'];
    let currentSection = '';
    
    sections.forEach((section) => {
      const item = document.getElementById(section);
      if (item) { // Check if the item actually exists
        const scrollPosition = window.scrollY;
        
        if (item.offsetTop <= scrollPosition && item.offsetTop + item.offsetHeight > scrollPosition) {
          currentSection = section;
        }
      }
    });
  
    setActiveSection(currentSection);
  };
  

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header id="nav-wrapper">
      <nav id="nav">
      <div className="nav left flex items-center"> {/* Ensure alignment and distribution */}
        <button onClick={() => { window.location.reload(); }} className="flex items-center"> {/* Flex container for logo */}
          <img src='/images/rectangular_logo.png' alt='Logo' style={{ maxHeight: "200px", maxWidth: "35%" }} />
        </button>
        <button id="menu" className="btn-nav ml-auto" onClick={handleToggleNav}> {/* Auto margin to push menu to the right */}
          <span className="fas fa-bars"></span>
        </button>
      </div>

        <div className={`nav right ${isNavVisible ? 'nav-visible' : ''}`}>
          <a href="/" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>
            <span className="nav-link-span">
              <span className="u-nav">Home</span>
            </span>
          </a>
          <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>
            <span className="nav-link-span">
              <span className="u-nav">About</span>
            </span>
          </a>
          <a href="#work" className={`nav-link ${activeSection === 'work' ? 'active' : ''}`}>
            <span className="nav-link-span">
              <span className="u-nav">Work</span>
            </span>
          </a>
          <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>
            <span className="nav-link-span">
              <span className="u-nav">Contact</span>
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
