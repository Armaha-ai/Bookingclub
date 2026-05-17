import { useState, useEffect, useRef } from 'react';
import { BookMarked, Plus, X, Share2, Copy, Star, Trash2 } from 'lucide-react';

interface BookInCollection {
  id: string;
  title: string;
  author: string;
  rating: number; // 1-5
}

interface Collection {
  id: string;
  name: string;
  description: string;
  author: string;
  books: BookInCollection[];
  tags: string[];
  createdDate: string;
  rating: number; // среднее значение рейтинга книг
  isPublic: boolean;
  recommendations: string;
  userAdded?: boolean;
}

const STORAGE_KEY = 'bookclub_collections';

// Default collections (примеры)
const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: 'coll-must-read',
    name: 'Обязательно к прочтению',
    description: 'Классические произведения, которые должен прочитать каждый',
    author: 'Администратор',
    books: [
      { id: '1', title: 'Мастер и Маргарита', author: 'Михаил Булгаков', rating: 5 },
      { id: '2', title: 'Война и мир', author: 'Лев Толстой', rating: 5 },
      { id: '3', title: 'Преступление и наказание', author: 'Федор Достоевский', rating: 5 },
      { id: '4', title: 'Евгений Онегин', author: 'Александр Пушкин', rating: 4 },
    ],
    tags: ['классика', 'российская литература', 'обязательное чтение'],
    createdDate: '2024-01-01',
    rating: 4.75,
    isPublic: true,
    recommendations: 'Эти книги формируют понимание русской культуры и литературы. Идеальны для глубокого погружения в мир классических произведений.',
  },
  {
    id: 'coll-contemporary',
    name: 'Современная литература',
    description: 'Интересные современные авторы и актуальные темы',
    author: 'Администратор',
    books: [
      { id: '5', title: 'Когда дует ветер с востока', author: 'Тоня Мовсесян', rating: 4 },
      { id: '6', title: 'Людей много, одна я', author: 'Инга Кошкина', rating: 4 },
    ],
    tags: ['современность', 'молодежная литература'],
    createdDate: '2024-01-15',
    rating: 4,
    isPublic: true,
    recommendations: 'Книги, которые отражают современные проблемы и помогают лучше понять себя и других.',
  },
];

function loadCollections(): Collection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      return [...DEFAULT_COLLECTIONS, ...loaded];
    }
  } catch {
    // Игнорируем ошибки
  }
  return DEFAULT_COLLECTIONS;
}

function saveCollections(collections: Collection[]) {
  // Сохраняем только добавленные пользователем
  const userCollections = collections.filter((c) => c.userAdded);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userCollections));
}

function getRating(books: BookInCollection[]): number {
  if (books.length === 0) return 0;
  const sum = books.reduce((acc, b) => acc + b.rating, 0);
  return Math.round((sum / books.length) * 10) / 10;
}

export function Collections() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [collections, setCollections] = useState<Collection[]>(loadCollections);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    tags: '',
    recommendations: '',
    isPublic: true,
  });

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    rating: 5,
  });

  // Intersection Observer
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

  const handleCreateCollection = () => {
    if (!form.name || !form.description) {
      alert('Пожалуйста, заполните название и описание подборки');
      return;
    }

    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name: form.name,
      description: form.description,
      author: 'Я',
      books: [],
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
      createdDate: new Date().toISOString().split('T')[0],
      rating: 0,
      isPublic: form.isPublic,
      recommendations: form.recommendations,
      userAdded: true,
    };

    const updated = [...collections, newCollection];
    setCollections(updated);
    saveCollections(updated);
    setShowAddModal(false);
    setForm({
      name: '',
      description: '',
      tags: '',
      recommendations: '',
      isPublic: true,
    });
    setSelectedCollection(newCollection);
  };

  const handleAddBook = () => {
    if (!selectedCollection || !bookForm.title || !bookForm.author) {
      alert('Пожалуйста, заполните название и автора');
      return;
    }

    const newBook: BookInCollection = {
      id: `book-${Date.now()}`,
      title: bookForm.title,
      author: bookForm.author,
      rating: bookForm.rating,
    };

    const updated = collections.map((c) => {
      if (c.id === selectedCollection.id) {
        const updatedCollection = {
          ...c,
          books: [...c.books, newBook],
        };
        updatedCollection.rating = getRating(updatedCollection.books);
        setSelectedCollection(updatedCollection);
        return updatedCollection;
      }
      return c;
    });

    setCollections(updated);
    saveCollections(updated);
    setShowAddBookModal(false);
    setBookForm({ title: '', author: '', rating: 5 });
  };

  const handleRemoveBook = (bookId: string) => {
    if (!selectedCollection) return;

    const updated = collections.map((c) => {
      if (c.id === selectedCollection.id) {
        const updatedCollection = {
          ...c,
          books: c.books.filter((b) => b.id !== bookId),
        };
        updatedCollection.rating = getRating(updatedCollection.books);
        setSelectedCollection(updatedCollection);
        return updatedCollection;
      }
      return c;
    });

    setCollections(updated);
    saveCollections(updated);
  };

  const handleDeleteCollection = (id: string) => {
    const updated = collections.filter((c) => c.id !== id);
    setCollections(updated);
    saveCollections(updated);
    setSelectedCollection(null);
  };

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}?collection=${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const publicCollections = collections.filter((c) => c.isPublic);

  return (
    <section id="collections" ref={sectionRef} className="section-padding relative overflow-hidden bg-[#FAF3E0]">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #A8C5A0 1px, transparent 0)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container-custom relative">
        {/* Section Title */}
        <div className="fade-up text-center mb-12">
          <span className="font-script text-3xl text-[#A8C5A0] block mb-2">Мои подборки</span>
          <span className="text-[#A8C5A0] text-xs uppercase tracking-[0.2em] mb-4 block">Коллекции книг</span>
          <h2 className="font-serif text-h1 text-[#3D2B1F]">Подборки литературы</h2>
        </div>

        {/* Add Button */}
        <div className="fade-up flex justify-center mb-10">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3 rounded-xl text-sm bg-[#A8C5A0] text-white hover:bg-[#8aab82] transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать подборку
          </button>
        </div>

        {/* Collections Grid */}
        {publicCollections.length === 0 ? (
          <div className="text-center py-20 text-[#3D2B1F]/50">
            <BookMarked className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Подборок еще нет</p>
            <p className="text-sm mt-2">Создайте первую подборку книг</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicCollections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => setSelectedCollection(collection)}
                className="bg-white rounded-xl border border-[#E8C4B8]/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
              >
                {/* Header with color */}
                <div className="h-24 bg-gradient-to-r from-[#C17A5A]/20 to-[#A8C5A0]/20 border-b border-[#E8C4B8]/30 p-4 flex flex-col justify-end">
                  <h3 className="font-serif text-lg text-[#3D2B1F] group-hover:text-[#C17A5A] transition-colors line-clamp-2">
                    {collection.name}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[#3D2B1F]/60 mb-3 line-clamp-2">{collection.description}</p>

                  {/* Stats */}
                  <div className="flex gap-3 mb-3 text-xs text-[#3D2B1F]/60">
                    <span className="flex items-center gap-1">
                      <BookMarked className="w-3 h-3 text-[#C17A5A]" />
                      {collection.books.length} книг
                    </span>
                    {collection.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#C17A5A]" />
                        {collection.rating}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {collection.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-3">
                      {collection.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] bg-[#E8C4B8]/30 text-[#C17A5A] px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {collection.tags.length > 2 && (
                        <span className="text-[9px] bg-[#E8C4B8]/30 text-[#C17A5A] px-2 py-0.5 rounded-full">
                          +{collection.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Author */}
                  <p className="text-[10px] text-[#3D2B1F]/40 mb-3">Подборка от {collection.author}</p>

                  {/* Button */}
                  <button className="text-[#C17A5A] hover:text-[#8B5A3C] transition-colors text-xs font-serif">
                    Открыть подборку →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── МОДАЛКА: Детали подборки ── */}
      {selectedCollection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedCollection(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="font-serif text-3xl text-[#3D2B1F] mb-2">{selectedCollection.name}</h2>
                  <p className="text-[#3D2B1F]/65 text-sm">Подборка от {selectedCollection.author}</p>
                </div>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-6 p-4 bg-[#FAF3E0] rounded-xl border border-[#E8C4B8]/30">
                <p className="text-[#3D2B1F]/75 leading-relaxed">{selectedCollection.description}</p>
              </div>

              {/* Recommendations */}
              {selectedCollection.recommendations && (
                <div className="mb-6">
                  <h3 className="font-serif text-lg text-[#3D2B1F] mb-2">Почему эта подборка?</h3>
                  <p className="text-sm text-[#3D2B1F]/75 leading-relaxed">{selectedCollection.recommendations}</p>
                </div>
              )}

              {/* Tags */}
              {selectedCollection.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif text-sm text-[#3D2B1F]/70 mb-2">Теги</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedCollection.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-[#E8C4B8]/40 text-[#C17A5A] px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Books */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-[#3D2B1F]">Книги в подборке</h3>
                  <div className="text-sm text-[#3D2B1F]/60">
                    {selectedCollection.books.length} книг
                    {selectedCollection.rating > 0 && (
                      <>
                        {' '}
                        • <Star className="w-3 h-3 inline text-[#C17A5A]" /> {selectedCollection.rating}
                      </>
                    )}
                  </div>
                </div>

                {selectedCollection.books.length === 0 ? (
                  <p className="text-center py-8 text-[#3D2B1F]/40">В подборке пока нет книг</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCollection.books.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-start justify-between p-3 bg-[#FAF3E0] rounded-lg border border-[#E8C4B8]/30 group hover:border-[#C17A5A]/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-serif text-[#3D2B1F] text-sm">{book.title}</p>
                          <p className="text-xs text-[#3D2B1F]/60">{book.author}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < book.rating ? 'text-[#C17A5A]' : 'text-[#E8C4B8]'
                                }`}
                                fill={i < book.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                          {selectedCollection.userAdded && (
                            <button
                              onClick={() => handleRemoveBook(book.id)}
                              className="opacity-0 group-hover:opacity-100 text-[#C17A5A] hover:text-[#8B5A3C] transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCollection.userAdded && (
                  <button
                    onClick={() => setShowAddBookModal(true)}
                    className="mt-3 w-full px-4 py-2 text-sm text-[#A8C5A0] border border-[#A8C5A0]/50 rounded-lg hover:bg-[#A8C5A0]/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Добавить книгу
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-[#E8C4B8]/30">
                {selectedCollection.isPublic && (
                  <button
                    onClick={() => handleCopyLink(selectedCollection.id)}
                    className="px-4 py-2 text-sm text-[#3D2B1F]/70 hover:bg-[#E8C4B8]/20 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedId === selectedCollection.id ? 'Скопировано!' : 'Копировать ссылку'}
                  </button>
                )}

                {selectedCollection.userAdded && (
                  <button
                    onClick={() => handleDeleteCollection(selectedCollection.id)}
                    className="px-4 py-2 text-sm text-[#C17A5A] hover:bg-[#C17A5A]/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Удалить подборку
                  </button>
                )}

                <button
                  onClick={() => setSelectedCollection(null)}
                  className="ml-auto px-6 py-2 bg-[#A8C5A0] text-white rounded-lg hover:bg-[#8aab82] transition-colors font-serif text-sm"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── МОДАЛКА: Создать подборку ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-[#3D2B1F]">Создать подборку</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors"
                >
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Название подборки *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Например: Лучшие детективы"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Описание *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    rows={2}
                    placeholder="О чем эта подборка?"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A] resize-none"
                  />
                </div>

                {/* Recommendations */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Почему эта подборка? (опционально)</label>
                  <textarea
                    value={form.recommendations}
                    onChange={(e) => setForm((p) => ({ ...p, recommendations: e.target.value }))}
                    rows={2}
                    placeholder="Объясните читателям, почему она интересна..."
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A] resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Теги (через запятую)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="детектив, приключение, мистика"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                {/* Public toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="public-toggle"
                    checked={form.isPublic}
                    onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
                    className="w-4 h-4 rounded border-[#E8C4B8] accent-[#A8C5A0]"
                  />
                  <label htmlFor="public-toggle" className="text-sm text-[#3D2B1F]/80">
                    Сделать подборку общедоступной
                  </label>
                </div>

                {/* Submit */}
                <button
                  onClick={handleCreateCollection}
                  disabled={!form.name || !form.description}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  <Plus className="w-4 h-4" />
                  Создать подборку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── МОДАЛКА: Добавить книгу ── */}
      {showAddBookModal && selectedCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-[#3D2B1F]">Добавить книгу</h3>
                <button
                  onClick={() => setShowAddBookModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors"
                >
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Название книги *</label>
                  <input
                    type="text"
                    value={bookForm.title}
                    onChange={(e) => setBookForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Например: Война и мир"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Автор *</label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) => setBookForm((p) => ({ ...p, author: e.target.value }))}
                    placeholder="Например: Лев Толстой"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-2">Оценка</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setBookForm((p) => ({ ...p, rating: star }))}
                        className="transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= bookForm.rating ? 'text-[#C17A5A]' : 'text-[#E8C4B8]'
                          }`}
                          fill={star <= bookForm.rating ? 'currentColor' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleAddBook}
                  disabled={!bookForm.title || !bookForm.author}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  <Plus className="w-4 h-4" />
                  Добавить книгу
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}