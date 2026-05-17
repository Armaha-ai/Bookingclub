import { useState, useEffect, useRef } from 'react';
import { History, Award, BookOpen } from 'lucide-react';
import { museumConfig } from '../config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  History, Award, BookOpen,
};

export function Museum() {
  if (!museumConfig.mainTitle) return null;

  const [activeTab, setActiveTab] = useState(museumConfig.tabs[0]?.id || '');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const activeTabData = museumConfig.tabs.find(tab => tab.id === activeTab);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-[#FAF3E0]"
    >
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#E8C4B8]/20 to-transparent" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <div>
            <div className="slide-in-left mb-10">
              <span className="font-script text-3xl text-[#C17A5A] block mb-2">{museumConfig.scriptText}</span>
              <span className="text-[#C17A5A] text-xs uppercase tracking-[0.2em] mb-4 block">
                {museumConfig.subtitle}
              </span>
              <h2 className="font-serif text-h1 text-[#3D2B1F] has-bar">
                {museumConfig.mainTitle}
              </h2>
            </div>

            {museumConfig.introText && (
              <p className="fade-up text-[#3D2B1F]/75 leading-relaxed mb-10" style={{ transitionDelay: '0.1s' }}>
                {museumConfig.introText}
              </p>
            )}

            {museumConfig.tabs.length > 0 && (
              <div className="fade-up flex flex-wrap gap-2 mb-8" style={{ transitionDelay: '0.15s' }}>
                {museumConfig.tabs.map((tab) => {
                  const IconComponent = iconMap[tab.icon];
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      aria-pressed={activeTab === tab.id}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-[#C17A5A] text-white shadow-md'
                          : 'bg-white text-[#3D2B1F]/70 hover:bg-[#E8C4B8]/30 border border-[#E8C4B8]/30'
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="fade-up" style={{ transitionDelay: '0.2s' }}>
              {activeTabData && (
                <div className="p-6 bg-white rounded-xl border border-[#E8C4B8]/30 shadow-lg transition-all duration-300">
                  <h3 className="font-serif text-h5 text-[#3D2B1F] mb-4">
                    {activeTabData.content.title}
                  </h3>
                  <p className="text-[#3D2B1F]/75 leading-relaxed mb-4">
                    {activeTabData.content.description}
                  </p>
                  <div className="flex items-center gap-3 text-[#C17A5A]">
                    <div className="w-8 h-px bg-[#C17A5A]" />
                    <span className="text-sm font-medium">
                      {activeTabData.content.highlight}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {museumConfig.quote.text && (
              <div className="fade-up mt-8 flex items-center gap-6" style={{ transitionDelay: '0.3s' }}>
                {museumConfig.founderPhoto && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#E8C4B8]/50 shadow-lg flex-shrink-0">
                    <img
                      src={museumConfig.founderPhoto}
                      alt={museumConfig.founderPhotoAlt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  {museumConfig.quote.prefix && (
                    <p className="font-script text-2xl text-[#C17A5A] mb-1">
                      &ldquo;{museumConfig.quote.prefix}&rdquo;
                    </p>
                  )}
                  <p className="text-[#3D2B1F]/70 text-sm italic">
                    "{museumConfig.quote.text}"
                  </p>
                  {museumConfig.quote.attribution && (
                    <p className="text-[#C17A5A] text-xs mt-2">
                      — {museumConfig.quote.attribution}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Image */}
          <div className="slide-in-right relative" style={{ transitionDelay: '0.15s' }}>
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              {museumConfig.tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeTab === tab.id
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    src={tab.image}
                    alt={`${tab.name} - ${museumConfig.mainTitle}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </div>
              ))}

              {museumConfig.yearBadge && (
                <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8C4B8]/50 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="font-serif text-2xl text-[#C17A5A]">{museumConfig.yearBadge}</div>
                    <div className="text-[10px] text-[#3D2B1F]/70 uppercase tracking-wider">{museumConfig.yearBadgeLabel}</div>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#3D2B1F]/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    {museumConfig.openingHoursLabel && <p className="text-[#E8C4B8] text-sm">{museumConfig.openingHoursLabel}</p>}
                    {museumConfig.openingHours && <p className="text-white text-lg">{museumConfig.openingHours}</p>}
                  </div>
                  {museumConfig.ctaButtonText && (
                    <button
                      onClick={() => {
                        const element = document.querySelector('#contact');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-primary text-sm px-6"
                      aria-label={museumConfig.ctaButtonText}
                    >
                      {museumConfig.ctaButtonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}