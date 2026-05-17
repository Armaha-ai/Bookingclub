import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, BookOpen as BookIcon, Home, BookOpen, Newspaper, Users, Mail, Grape } from 'lucide-react';
import { navigationConfig } from '../config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, BookOpen, Newspaper, Users, Mail, Grape, BookIcon, Menu, X, ChevronDown,
};

export function Navigation() {
  if (!navigationConfig.brandName) return null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = navigationConfig.navLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FAF3E0]/95 backdrop-blur-md py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('#hero')}
          className="flex items-center gap-3 group"
          aria-label={navigationConfig.brandName}
        >
          <BookIcon className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${isScrolled ? 'text-[#C17A5A]' : 'text-[#E8C4B8]'}`} aria-hidden="true" />
          <div className="flex flex-col">
            <span className={`font-serif text-xl tracking-wide ${isScrolled ? 'text-[#3D2B1F]' : 'text-white'}`}>{navigationConfig.brandName}</span>
            <span className={`text-[10px] tracking-widest uppercase ${isScrolled ? 'text-[#C17A5A]' : 'text-[#E8C4B8]'}`}>{navigationConfig.tagline}</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8" role="menubar">
          {navLinks.map((link) => {
            return (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
                role="none"
              >
                <button
                  onClick={() => !link.dropdown && scrollToSection(link.href)}
                  className={`flex items-center gap-1 text-sm transition-colors duration-300 py-2 ${isScrolled ? 'text-[#3D2B1F]/80 hover:text-[#C17A5A]' : 'text-white/80 hover:text-[#E8C4B8]'}`}
                  role="menuitem"
                  aria-haspopup={link.dropdown ? 'true' : undefined}
                  aria-expanded={link.dropdown ? activeDropdown === link.name : undefined}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === link.name ? 'rotate-180' : ''
                    }`} aria-hidden="true" />
                  )}
                </button>

                {link.dropdown && (
                  <div
                    className={`absolute top-full left-0 pt-2 transition-all duration-300 ${
                      activeDropdown === link.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                    role="menu"
                  >
                    <div className="bg-[#FAF3E0]/98 backdrop-blur-md rounded-md overflow-hidden min-w-[180px] border border-[#E8C4B8]/30 shadow-lg">
                      {link.dropdown.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => scrollToSection(item.href)}
                          className="block w-full text-left px-4 py-3 text-sm text-[#3D2B1F]/80 hover:bg-[#E8C4B8]/20 hover:text-[#C17A5A] transition-colors"
                          role="menuitem"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden p-2 ${isScrolled ? 'text-[#3D2B1F]' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-[#3D2B1F]" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] bg-[#FAF3E0]/98 backdrop-blur-lg transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        role="menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container-custom py-8 flex flex-col gap-2">
          {navLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon];
            return (
              <div
                key={link.name}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      className="flex items-center justify-between w-full py-4 text-lg text-[#3D2B1F] border-b border-[#E8C4B8]/30"
                      aria-expanded={activeDropdown === link.name}
                      role="menuitem"
                    >
                      <span className="flex items-center gap-3">
                        {IconComponent && <IconComponent className="w-5 h-5 text-[#C17A5A]" />}
                        {link.name}
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`} aria-hidden="true" />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        activeDropdown === link.name ? 'max-h-40' : 'max-h-0'
                      }`}
                      role="menu"
                    >
                      {link.dropdown.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => scrollToSection(item.href)}
                          className="block w-full text-left pl-12 py-3 text-[#3D2B1F]/70 hover:text-[#C17A5A]"
                          role="menuitem"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="flex items-center gap-3 w-full py-4 text-lg text-[#3D2B1F] border-b border-[#E8C4B8]/30 hover:text-[#C17A5A] transition-colors"
                    role="menuitem"
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 text-[#C17A5A]" />}
                    {link.name}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}