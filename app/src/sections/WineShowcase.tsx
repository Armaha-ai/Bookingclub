import { useState, useEffect, useRef } from 'react';
import { BookOpen, Sparkles, Thermometer, Clock, ArrowRight, Plus, X, Search } from 'lucide-react';
import { wineShowcaseConfig } from '../config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Sparkles, Thermometer, Clock,
};

interface Book {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  image: string;
  filter: string;
  glowColor: string;
  description: string;
  tastingNotes: string;
  alcohol: string;
  temperature: string;
  aging: string;
  language: string;
  audience: string;
  userAdded?: boolean;
}

const LANGUAGES = ['Все', 'Казахский', 'Русский', 'Английский'];
const AUDIENCES = ['Все', 'Взрослые', 'Подростки', 'Дети'];
const STORAGE_KEY = 'bookclub_user_books';

// Функция для генерации уникального плейсхолдера с инициалами
function generatePlaceholder(name: string, subtitle: string): string {
  const colors = [
    { bg: '#C17A5A', text: '#FAF3E0' },
    { bg: '#A8C5A0', text: '#FAF3E0' },
    { bg: '#8B7355', text: '#FAF3E0' },
    { bg: '#B89968', text: '#FAF3E0' },
    { bg: '#6B8E7F', text: '#FAF3E0' },
  ];

  // Генерируем индекс цвета на основе названия
  const hash = name.split('').reduce((h, c) => h + c.charCodeAt(0), 0);
  const color = colors[hash % colors.length];

  // Берём инициалы автора (subtitle)
  const initials = subtitle
    .split(' ')
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');

  // Создаём SVG плейсхолдер
  const svg = `
    <svg width="280" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="${color.bg}"/>
          <circle cx="20" cy="20" r="1" fill="${color.text}" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="280" height="420" fill="${color.bg}"/>
      <rect width="280" height="420" fill="url(#pattern)"/>
      <rect x="20" y="20" width="240" height="380" fill="none" stroke="${color.text}" stroke-width="2" opacity="0.3"/>
      <text x="140" y="200" font-size="48" font-weight="bold" fill="${color.text}" text-anchor="middle" dominant-baseline="middle" font-family="serif">
        ${initials || '📖'}
      </text>
      <text x="140" y="280" font-size="14" fill="${color.text}" text-anchor="middle" opacity="0.6" font-family="sans-serif">
        ${name.substring(0, 20)}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function loadUserBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserBooks(books: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function WineShowcase() {
  if (!wineShowcaseConfig.mainTitle || wineShowcaseConfig.wines.length === 0) return null;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeWine, setActiveWine] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [langFilter, setLangFilter] = useState('Все');
  const [audienceFilter, setAudienceFilter] = useState('Все');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [userBooks, setUserBooks] = useState<Book[]>(loadUserBooks);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [form, setForm] = useState({
    name: '', subtitle: '', description: '',
    language: 'Русский', audience: 'Взрослые',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const baseWines: Book[] = wineShowcaseConfig.wines.map(w => ({
    ...w,
    language: (w as any).language || 'Русский',
    audience: (w as any).audience || 'Взрослые',
    userAdded: false,
  }));

  const allBooks: Book[] = [...baseWines, ...userBooks];

  const filtered = allBooks.filter(b => {
    const matchLang = langFilter === 'Все' || b.language === langFilter;
    const matchAud = audienceFilter === 'Все' || b.audience === audienceFilter;
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchLang && matchAud && matchSearch;
  });

  const wines = wineShowcaseConfig.wines;
  const features = wineShowcaseConfig.features;
  const quote = wineShowcaseConfig.quote;
  const wine = wines[activeWine];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.subtitle) {
      alert('Пожалуйста, заполните название и автора');
      return;
    }

    // Если нет фото - генерируем плейсхолдер
    const finalImage = imagePreview || generatePlaceholder(form.name, form.subtitle);

    const newBook: Book = {
      id: `user-${Date.now()}`,
      name: form.name,
      subtitle: form.subtitle,
      year: '',
      image: finalImage,
      filter: '',
      glowColor: 'bg-amber-200/20',
      description: form.description,
      tastingNotes: '',
      alcohol: '',
      temperature: '',
      aging: '',
      language: form.language,
      audience: form.audience,
      userAdded: true,
    };
    const updated = [...userBooks, newBook];
    setUserBooks(updated);
    saveUserBooks(updated);
    setShowAddModal(false);
    setImagePreview('');
    setForm({ name: '', subtitle: '', description: '', language: 'Русский', audience: 'Взрослые' });
    setShowLibrary(true);
  };

  return (
    <section id="books" ref={sectionRef} className="section-padding relative overflow-hidden bg-[#FAF3E0]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #C17A5A 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-custom relative">
        {/* Section Title */}
        <div className="fade-up text-center mb-10">
          <span className="font-script text-3xl text-[#C17A5A] block mb-2">{wineShowcaseConfig.scriptText}</span>
          <span className="text-[#C17A5A] text-xs uppercase tracking-[0.2em] mb-4 block">{wineShowcaseConfig.subtitle}</span>
          <h2 className="font-serif text-h1 text-[#3D2B1F]">{wineShowcaseConfig.mainTitle}</h2>
        </div>

        {/* Toggle buttons */}
        <div className="fade-up flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setShowLibrary(false)}
            className={`px-6 py-3 rounded-xl text-sm transition-all duration-300 ${!showLibrary ? 'bg-[#C17A5A] text-white shadow-lg' : 'bg-white text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'}`}
          >
            Книга месяца
          </button>
          <button
            onClick={() => setShowLibrary(true)}
            className={`px-6 py-3 rounded-xl text-sm transition-all duration-300 ${showLibrary ? 'bg-[#C17A5A] text-white shadow-lg' : 'bg-white text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'}`}
          >
            Библиотека ({allBooks.length})
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-xl text-sm bg-[#A8C5A0] text-white hover:bg-[#8aab82] transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Предложить книгу
          </button>
        </div>

        {/* ── КНИГА МЕСЯЦА ── */}
        {!showLibrary && (
          <div>
            <div className="fade-up flex justify-center gap-2 mb-12 flex-wrap">
              {wines.map((w, i) => (
                <button
                  key={w.id}
                  onClick={() => setActiveWine(i)}
                  className={`px-6 py-3 rounded-xl text-sm transition-all duration-300 ${i === activeWine ? 'bg-[#C17A5A] text-white shadow-lg' : 'bg-white text-[#3D2B1F]/70 hover:bg-[#E8C4B8]/30 border border-[#E8C4B8]/30'}`}
                >
                  {w.name}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Left */}
              <div className="slide-in-left lg:col-span-2 order-2 lg:order-1">
                <div className="mb-8">
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="font-serif text-6xl lg:text-7xl text-[#C17A5A]/30 leading-none">{wine.year}</span>
                    <div>
                      <h2 className="font-serif text-h3 text-[#3D2B1F] leading-tight">{wine.name}</h2>
                      <span className="font-script text-xl text-[#C17A5A]">{wine.subtitle}</span>
                    </div>
                  </div>
                  <div className="w-16 h-px bg-[#C17A5A] mt-4" />
                </div>
                <p className="text-[#3D2B1F]/85 leading-relaxed mb-4 min-h-[4rem]">{wine.description}</p>
                <p className="text-[#3D2B1F]/65 leading-relaxed text-sm mb-8">{wine.tastingNotes}</p>
                <div className="flex gap-6 mb-8">
                  <div>
                    <div className="font-serif text-2xl text-[#C17A5A]">{wine.alcohol}</div>
                    <div className="text-[11px] text-[#3D2B1F]/50 uppercase tracking-wider mt-1">Страниц</div>
                  </div>
                  <div className="w-px bg-[#E8C4B8]/50" />
                  <div>
                    <div className="font-serif text-2xl text-[#C17A5A]">{wine.temperature}</div>
                    <div className="text-[11px] text-[#3D2B1F]/50 uppercase tracking-wider mt-1">Жанр</div>
                  </div>
                  <div className="w-px bg-[#E8C4B8]/50" />
                  <div>
                    <div className="font-serif text-2xl text-[#C17A5A]">{wine.aging}</div>
                    <div className="text-[11px] text-[#3D2B1F]/50 uppercase tracking-wider mt-1">Тип</div>
                  </div>
                </div>
                <button
                  onClick={() => { const el = document.querySelector('#contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary flex items-center gap-2 group"
                >
                  Начать читать вместе
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Center */}
              <div className="lg:col-span-1 order-1 lg:order-2 flex justify-center">
                <div className="relative" style={{ width: '280px', height: '420px' }}>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-48 h-48 ${wine.glowColor} rounded-full blur-3xl transition-colors duration-700`} />
                  </div>
                  {wines.map((w, i) => (
                    <img
                      key={w.id}
                      src={w.image}
                      alt={`${w.name} - ${w.subtitle} ${w.year}`}
                      loading={i === 0 ? undefined : 'lazy'}
                      style={w.filter ? { filter: w.filter } : undefined}
                      className={`absolute inset-0 w-full h-full object-contain z-10 drop-shadow-2xl transition-all duration-700 ${i === activeWine ? 'opacity-100 scale-100 translate-y-0' : i < activeWine ? 'opacity-0 scale-90 -translate-y-6 pointer-events-none' : 'opacity-0 scale-90 translate-y-6 pointer-events-none'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right */}
              <div className="slide-in-right lg:col-span-2 order-3">
                <div className="space-y-6">
                  {features.map((feature) => {
                    const IconComponent = iconMap[feature.icon] || BookOpen;
                    return (
                      <div key={feature.title} className="flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-[#A8C5A0]/20 border border-[#A8C5A0]/30 flex items-center justify-center flex-shrink-0 group-hover:border-[#C17A5A]/50 transition-colors">
                          <IconComponent className="w-5 h-5 text-[#C17A5A]" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-[#3D2B1F] mb-1">{feature.title}</h3>
                          <p className="text-sm text-[#3D2B1F]/65 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {quote.text && (
                  <div className="mt-10 p-6 bg-white rounded-xl border-l-4 border-[#C17A5A] shadow-lg">
                    {quote.prefix && <p className="font-script text-2xl text-[#C17A5A] mb-2">{quote.prefix}</p>}
                    <p className="text-[#3D2B1F]/70 text-sm italic leading-relaxed">"{quote.text}"</p>
                    {quote.attribution && <p className="text-[#C17A5A] text-xs mt-3">— {quote.attribution}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── БИБЛИОТЕКА ── */}
        {showLibrary && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8 items-center">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C17A5A]" />
                <input
                  type="text"
                  placeholder="Поиск книги..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {LANGUAGES.map(l => (
                  <button key={l} onClick={() => setLangFilter(l)}
                    className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 ${langFilter === l ? 'bg-[#C17A5A] text-white' : 'bg-white text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'}`}
                  >{l}</button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {AUDIENCES.map(a => (
                  <button key={a} onClick={() => setAudienceFilter(a)}
                    className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 ${audienceFilter === a ? 'bg-[#A8C5A0] text-white' : 'bg-white text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'}`}
                  >{a}</button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-[#3D2B1F]/50">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Книги не найдены</p>
                <p className="text-sm mt-2">Попробуйте изменить фильтры или предложите книгу</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className="bg-white rounded-xl border border-[#E8C4B8]/30 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
                  >
                    <div className="relative h-52 bg-[#FAF3E0] flex items-center justify-center overflow-hidden">
                      <img
                        src={book.image}
                        alt={book.name}
                        className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      {book.userAdded && (
                        <span className="absolute top-2 right-2 bg-[#A8C5A0] text-white text-[10px] px-2 py-1 rounded-full">
                          от участника
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-[#3D2B1F] text-base leading-tight mb-1 group-hover:text-[#C17A5A] transition-colors">{book.name}</h3>
                      <p className="font-script text-[#C17A5A] text-sm mb-3">{book.subtitle}</p>
                      <div className="flex gap-2 flex-wrap mb-3">
                        {book.language && (
                          <span className="text-[10px] bg-[#E8C4B8]/40 text-[#C17A5A] px-2 py-0.5 rounded-full">{book.language}</span>
                        )}
                        {book.audience && (
                          <span className="text-[10px] bg-[#A8C5A0]/20 text-[#3D2B1F]/60 px-2 py-0.5 rounded-full">{book.audience}</span>
                        )}
                        {book.temperature && (
                          <span className="text-[10px] bg-[#FAF3E0] text-[#3D2B1F]/50 px-2 py-0.5 rounded-full border border-[#E8C4B8]/30">{book.temperature}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#3D2B1F]/60 leading-relaxed line-clamp-2">{book.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── МОДАЛКА: Детали книги ── */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedBook(null)}>
          <div className="bg-[#FAF3E0] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="grid sm:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative bg-[#F0E6D0] rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none flex items-center justify-center p-8 min-h-[280px]">
                <img
                  src={selectedBook.image}
                  alt={selectedBook.name}
                  className="max-h-64 object-contain drop-shadow-2xl"
                />
                {selectedBook.userAdded && (
                  <span className="absolute top-4 left-4 bg-[#A8C5A0] text-white text-[10px] px-2 py-1 rounded-full">от участника</span>
                )}
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="self-end w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors mb-4"
                >
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>

                {selectedBook.year && (
                  <span className="font-serif text-5xl text-[#C17A5A]/20 leading-none mb-2">{selectedBook.year}</span>
                )}
                <h2 className="font-serif text-2xl text-[#3D2B1F] leading-tight mb-1">{selectedBook.name}</h2>
                <p className="font-script text-lg text-[#C17A5A] mb-4">{selectedBook.subtitle}</p>

                <div className="flex gap-2 flex-wrap mb-4">
                  {selectedBook.language && (
                    <span className="text-xs bg-[#E8C4B8]/40 text-[#C17A5A] px-3 py-1 rounded-full">{selectedBook.language}</span>
                  )}
                  {selectedBook.audience && (
                    <span className="text-xs bg-[#A8C5A0]/20 text-[#3D2B1F]/60 px-3 py-1 rounded-full">{selectedBook.audience}</span>
                  )}
                  {selectedBook.temperature && (
                    <span className="text-xs bg-white text-[#3D2B1F]/50 px-3 py-1 rounded-full border border-[#E8C4B8]/30">{selectedBook.temperature}</span>
                  )}
                </div>

                <div className="w-12 h-px bg-[#C17A5A] mb-4" />

                {selectedBook.description && (
                  <p className="text-[#3D2B1F]/75 text-sm leading-relaxed mb-3 min-h-[4rem]">{selectedBook.description}</p>
                )}
                {selectedBook.tastingNotes && (
                  <p className="text-[#3D2B1F]/55 text-xs leading-relaxed mb-4 italic">{selectedBook.tastingNotes}</p>
                )}

                {(selectedBook.alcohol || selectedBook.aging) && (
                  <div className="flex gap-4 mt-auto pt-4 border-t border-[#E8C4B8]/30">
                    {selectedBook.alcohol && (
                      <div>
                        <div className="font-serif text-lg text-[#C17A5A]">{selectedBook.alcohol}</div>
                        <div className="text-[10px] text-[#3D2B1F]/50 uppercase tracking-wider">Страниц</div>
                      </div>
                    )}
                    {selectedBook.aging && (
                      <div>
                        <div className="font-serif text-lg text-[#C17A5A]">{selectedBook.aging}</div>
                        <div className="text-[10px] text-[#3D2B1F]/50 uppercase tracking-wider">Тип</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── МОДАЛКА: Предложить книгу ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FAF3E0] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-[#3D2B1F]">Предложить книгу</h3>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors">
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-2">Обложка книги (опционально)</label>
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative w-full h-40 bg-[#F0E6D0] rounded-xl overflow-hidden flex items-center justify-center">
                        <img src={imagePreview} alt="preview" className="h-full object-contain" />
                        <button
                          onClick={() => setImagePreview('')}
                          className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                        >
                          <X className="w-3 h-3 text-[#3D2B1F]" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E8C4B8] rounded-xl cursor-pointer hover:border-[#C17A5A] transition-colors bg-white/50">
                        <BookOpen className="w-8 h-8 text-[#C17A5A]/50 mb-2" />
                        <span className="text-sm text-[#3D2B1F]/50">Нажмите чтобы загрузить</span>
                        <span className="text-xs text-[#3D2B1F]/40 mt-1">или автоматически создадим обложку</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Название книги *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Например: Война и мир"
                    className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Автор *</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                    placeholder="Например: Лев Толстой"
                    className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Описание</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3}
                    placeholder="Краткое описание книги и почему вы её рекомендуете..."
                    className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#3D2B1F]/80 mb-1">Язык</label>
                    <select value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]">
                      {LANGUAGES.filter(l => l !== 'Все').map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#3D2B1F]/80 mb-1">Аудитория</label>
                    <select value={form.audience} onChange={e => setForm(p => ({ ...p, audience: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]">
                      {AUDIENCES.filter(a => a !== 'Все').map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.subtitle}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Добавить в библиотеку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}