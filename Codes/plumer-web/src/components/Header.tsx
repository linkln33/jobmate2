import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">
            <span className="text-secondary">Plumer</span> Pro
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><a href="#about" className="text-dark hover:text-primary">About</a></li>
            <li><a href="#services" className="text-dark hover:text-primary">Services</a></li>
            <li><a href="#how-it-works" className="text-dark hover:text-primary">How It Works</a></li>
            <li><a href="#testimonials" className="text-dark hover:text-primary">Testimonials</a></li>
            <li><a href="#contact" className="text-dark hover:text-primary">Contact</a></li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="block md:hidden text-dark"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md md:hidden">
            <nav className="container py-4">
              <ul className="flex flex-col space-y-4">
                <li><a href="#about" className="block text-dark hover:text-primary" onClick={toggleMenu}>About</a></li>
                <li><a href="#services" className="block text-dark hover:text-primary" onClick={toggleMenu}>Services</a></li>
                <li><a href="#how-it-works" className="block text-dark hover:text-primary" onClick={toggleMenu}>How It Works</a></li>
                <li><a href="#testimonials" className="block text-dark hover:text-primary" onClick={toggleMenu}>Testimonials</a></li>
                <li><a href="#contact" className="block text-dark hover:text-primary" onClick={toggleMenu}>Contact</a></li>
              </ul>
            </nav>
          </div>
        )}

        <a href="#booking" className="hidden md:block btn btn-primary">Book Now</a>
      </div>
    </header>
  );
};

export default Header;
