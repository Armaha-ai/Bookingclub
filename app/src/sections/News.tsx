import { useEffect, useRef } from 'react';
import { ArrowRight, Calendar, Star, Quote } from 'lucide-react';
import { newsConfig } from '../config';

export function News() {
  if (!newsConfig.mainTitle) return null;

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

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right, .scale-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="events"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-[#FAF3E0]"
    >
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-[#E8C4B8]/20 rounded-full blur-3xl" />
      <div className="absolute right-0 bottom-1/4 w-48 h-48 bg-[#A8C5A0]/20 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="fade-up flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-3xl text-[#C17A5A] block mb-2">{newsConfig.scriptText}</span>
            <span className="text-[#C17A5A] text-xs uppercase tracking-[0.2em] mb-4 block">
              {newsConfig.subtitle}
            </span>
            <h2 className="font-serif text-h1 text-[#3D2B1F] has-bar">
              {newsConfig.mainTitle}
            </h2>
          </div>
          {newsConfig.viewAllText && (
            <button className="btn-secondary flex items-center gap-2 group w-fit" aria-label={newsConfig.viewAllText}>
              {newsConfig.viewAllText}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {newsConfig.articles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {newsConfig.articles.map((item, index) => (
              <article
                key={item.id}
                className="fade-up group cursor-pointer"
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 shadow-md">
                  <img
                    src={item.image}
                    alt={`${item.title} - ${item.category}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#C17A5A]/90 text-white text-xs rounded-lg">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[#3D2B1F]/60 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-serif text-h5 text-[#3D2B1F] mb-3 group-hover:text-[#C17A5A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-[#3D2B1F]/70 text-sm leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {newsConfig.testimonials.length > 0 && (
          <div className="mt-24">
            <div className="fade-up text-center mb-12">
              <span className="font-script text-3xl text-[#C17A5A] block mb-2">{newsConfig.testimonialsScriptText}</span>
              <span className="text-[#C17A5A] text-xs uppercase tracking-[0.2em] mb-4 block">
                {newsConfig.testimonialsSubtitle}
              </span>
              <h2 className="font-serif text-h2 text-[#3D2B1F]">
                {newsConfig.testimonialsMainTitle}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {newsConfig.testimonials.map((t, index) => (
                <div
                  key={t.name}
                  className="scale-in p-8 bg-white rounded-xl border border-[#E8C4B8]/30 shadow-lg relative"
                  style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                >
                  <Quote className="w-8 h-8 text-[#C17A5A]/20 absolute top-6 right-6" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#C17A5A] fill-[#C17A5A]" />
                    ))}
                  </div>
                  <p className="text-[#3D2B1F]/80 leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="text-[#3D2B1F] font-medium text-sm">{t.name}</p>
                    <p className="text-[#3D2B1F]/50 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {newsConfig.storyTitle && (
          <div id="story" className="fade-up mt-24 pt-20 border-t border-[#E8C4B8]/30" style={{ transitionDelay: '0.1s' }}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="slide-in-left">
                <span className="font-script text-3xl text-[#C17A5A] block mb-2">{newsConfig.storyScriptText}</span>
                <span className="text-[#C17A5A] text-xs uppercase tracking-[0.2em] mb-4 block">
                  {newsConfig.storySubtitle}
                </span>
                <h2 className="font-serif text-h2 text-[#3D2B1F] mb-6">
                  {newsConfig.storyTitle}
                </h2>
                <div className="space-y-4 text-[#3D2B1F]/75 leading-relaxed">
                  {newsConfig.storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {newsConfig.storyTimeline.length > 0 && (
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {newsConfig.storyTimeline.map((item, index) => (
                      <div key={index} className="text-center p-4 bg-white rounded-xl border border-[#E8C4B8]/30 shadow-md">
                        <div className="font-serif text-2xl text-[#C17A5A] mb-1">{item.value}</div>
                        <div className="text-xs text-[#3D2B1F]/60">{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="slide-in-right relative">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
                  {newsConfig.storyImage && (
                    <>
                      <img
                        src={newsConfig.storyImage}
                        alt={newsConfig.storyImageCaption}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/40 to-transparent" />
                    </>
                  )}
                </div>

                {newsConfig.storyQuote.text && (
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                    {newsConfig.storyQuote.prefix && (
                      <p className="font-script text-2xl text-[#C17A5A] mb-1">{newsConfig.storyQuote.prefix}</p>
                    )}
                    <p className="text-[#3D2B1F] italic text-sm leading-relaxed mb-2">
                      "{newsConfig.storyQuote.text}"
                    </p>
                    {newsConfig.storyQuote.attribution && (
                      <p className="text-[#C17A5A] text-xs">— {newsConfig.storyQuote.attribution}</p>
                    )}
                  </div>
                )}

                <div className="absolute -top-4 -right-4 w-full h-full border border-[#E8C4B8]/40 rounded-xl -z-10" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}