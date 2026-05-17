import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Plus, X, ChevronRight, Users } from 'lucide-react';

interface Event {
  id: string;
  number: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  format: 'онлайн' | 'офлайн' | 'гибридный';
  topic: string;
  attendees: number;
  status: 'предстоящая' | 'прошедшая';
  image?: string;
  notes?: string;
  userAdded?: boolean;
}

const STORAGE_KEY = 'bookclub_events';
const FORMATS = ['онлайн', 'офлайн', 'гибридный'];

function loadEvents(): Event[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: Event[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function getEventStatus(date: string): 'предстоящая' | 'прошедшая' {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today ? 'предстоящая' : 'прошедшая';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('ru-RU', options);
}

export function Events() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<Event[]>(loadEvents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterStatus, setFilterStatus] = useState<'все' | 'предстоящая' | 'прошедшая'>('все');
  const [imagePreview, setImagePreview] = useState<string>('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    format: 'онлайн' as const,
    topic: '',
    attendees: 0,
    notes: '',
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

  const filtered = events
    .filter(e => {
      if (filterStatus === 'все') return true;
      return e.status === filterStatus;
    })
    .sort((a, b) => {
      if (filterStatus === 'предстоящая') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

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
    if (!form.title || !form.date) {
      alert('Пожалуйста, заполните название встречи и дату');
      return;
    }

    const status = getEventStatus(form.date);
    const maxNumber = Math.max(...events.map(e => e.number), 0);

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      number: maxNumber + 1,
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      format: form.format,
      topic: form.topic,
      attendees: form.attendees,
      status: status,
      image: imagePreview,
      notes: form.notes,
      userAdded: true,
    };

    const updated = [...events, newEvent];
    setEvents(updated);
    saveEvents(updated);
    setShowAddModal(false);
    setImagePreview('');
    setForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      format: 'онлайн',
      topic: '',
      attendees: 0,
      notes: '',
    });
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveEvents(updated);
    setSelectedEvent(null);
  };

  return (
    <section id="events" ref={sectionRef} className="section-padding relative overflow-hidden bg-[#FAF3E0]">
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-[#E8C4B8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-48 h-48 bg-[#A8C5A0]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative">
        {/* Section Title */}
        <div className="fade-up text-center mb-12">
          <span className="font-script text-3xl text-[#A8C5A0] block mb-2">Наши встречи</span>
          <span className="text-[#A8C5A0] text-xs uppercase tracking-[0.2em] mb-4 block">История мероприятий</span>
          <h2 className="font-serif text-h1 text-[#3D2B1F]">Встречи и события</h2>
        </div>

        {/* Filter Buttons */}
        <div className="fade-up flex flex-wrap justify-center gap-3 mb-10">
          {['все', 'предстоящая', 'прошедшая'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-6 py-3 rounded-xl text-sm transition-all duration-300 ${
                filterStatus === status
                  ? 'bg-[#A8C5A0] text-white shadow-lg'
                  : 'bg-white text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'
              }`}
            >
              {status === 'все' && '📅 Все встречи'}
              {status === 'предстоящая' && '⏰ Предстоящие'}
              {status === 'прошедшая' && '📜 Архив'}
            </button>
          ))}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-xl text-sm bg-[#C17A5A] text-white hover:bg-[#a86549] transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить встречу
          </button>
        </div>

        {/* Events Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#3D2B1F]/50">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Встреч не найдено</p>
            <p className="text-sm mt-2">Попробуйте изменить фильтр или добавьте новую встречу</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="bg-white rounded-xl border border-[#E8C4B8]/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1 relative"
              >
                <div className="absolute top-4 right-4 z-10 bg-[#C17A5A] text-white text-sm font-serif px-3 py-1 rounded-full">
                  Встреча №{event.number}
                </div>

                {event.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-serif text-[#3D2B1F] text-lg mb-2 group-hover:text-[#C17A5A] transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  {event.topic && (
                    <p className="font-script text-[#A8C5A0] text-sm mb-3">{event.topic}</p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-[#3D2B1F]/65 mb-2">
                    <Calendar className="w-4 h-4 text-[#C17A5A]" />
                    {formatDate(event.date)}
                    {event.time && <span>• {event.time}</span>}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#3D2B1F]/65 mb-3">
                    <MapPin className="w-4 h-4 text-[#C17A5A]" />
                    <span className="capitalize">{event.format}</span>
                    {event.location && <span>• {event.location}</span>}
                  </div>

                  <div className="mb-3">
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                      event.status === 'предстоящая'
                        ? 'bg-[#A8C5A0]/20 text-[#6B8E7F]'
                        : 'bg-[#C17A5A]/20 text-[#8B5A3C]'
                    }`}>
                      {event.status === 'предстоящая' ? '📍 Предстоящая' : '✓ Прошедшая'}
                    </span>
                  </div>

                  <p className="text-xs text-[#3D2B1F]/60 leading-relaxed line-clamp-2 mb-3">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E8C4B8]/30">
                    {event.attendees > 0 && (
                      <div className="flex items-center gap-1 text-xs text-[#3D2B1F]/50">
                        <Users className="w-3 h-3" />
                        {event.attendees}
                      </div>
                    )}
                    <button className="text-[#C17A5A] hover:text-[#8B5A3C] transition-colors text-xs font-serif flex items-center gap-1 ml-auto">
                      Подробнее
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {event.userAdded && (
                  <div className="absolute top-4 left-4 bg-[#A8C5A0] text-white text-[10px] px-2 py-1 rounded-full">
                    от пользователя
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* МОДАЛКА: Детали встречи */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-[#FAF3E0] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[#C17A5A] text-sm font-serif uppercase tracking-wider">
                    Встреча №{selectedEvent.number}
                  </span>
                  <h2 className="font-serif text-3xl text-[#3D2B1F] mt-2">{selectedEvent.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>
              </div>

              {selectedEvent.image && (
                <div className="mb-6 rounded-xl overflow-hidden max-h-64">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex gap-3 mb-6 flex-wrap">
                <span className={`inline-block text-sm px-4 py-2 rounded-full font-medium ${
                  selectedEvent.status === 'предстоящая'
                    ? 'bg-[#A8C5A0]/20 text-[#6B8E7F]'
                    : 'bg-[#C17A5A]/20 text-[#8B5A3C]'
                }`}>
                  {selectedEvent.status === 'предстоящая' ? '📍 Предстоящая' : '✓ Прошедшая'}
                </span>
                {selectedEvent.topic && (
                  <span className="inline-block text-sm px-4 py-2 rounded-full bg-[#E8C4B8]/30 text-[#3D2B1F]/70">
                    {selectedEvent.topic}
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6 p-4 bg-white/50 rounded-xl">
                <div>
                  <div className="flex items-center gap-2 text-[#C17A5A] font-serif mb-1">
                    <Calendar className="w-4 h-4" /> Дата
                  </div>
                  <p className="text-[#3D2B1F]">{formatDate(selectedEvent.date)}</p>
                </div>
                {selectedEvent.time && (
                  <div>
                    <div className="flex items-center gap-2 text-[#C17A5A] font-serif mb-1">
                      <Clock className="w-4 h-4" /> Время
                    </div>
                    <p className="text-[#3D2B1F]">{selectedEvent.time}</p>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 text-[#C17A5A] font-serif mb-1">
                    <MapPin className="w-4 h-4" /> Формат
                  </div>
                  <p className="text-[#3D2B1F] capitalize">{selectedEvent.format}</p>
                </div>
                {selectedEvent.location && (
                  <div>
                    <div className="text-[#C17A5A] font-serif mb-1">Место</div>
                    <p className="text-[#3D2B1F]">{selectedEvent.location}</p>
                  </div>
                )}
                {selectedEvent.attendees > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-[#C17A5A] font-serif mb-1">
                      <Users className="w-4 h-4" /> Участники
                    </div>
                    <p className="text-[#3D2B1F]">{selectedEvent.attendees} человек</p>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div className="mb-6">
                  <h3 className="font-serif text-[#3D2B1F] mb-2">Описание</h3>
                  <p className="text-[#3D2B1F]/75 leading-relaxed">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.notes && (
                <div className="mb-6 p-4 bg-[#E8C4B8]/10 rounded-xl border border-[#E8C4B8]/30">
                  <h3 className="font-serif text-[#3D2B1F] mb-2">Заметки</h3>
                  <p className="text-[#3D2B1F]/65 text-sm leading-relaxed">{selectedEvent.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-6 border-t border-[#E8C4B8]/30">
                {selectedEvent.userAdded && (
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="px-4 py-2 text-sm text-[#C17A5A] hover:bg-[#C17A5A]/10 rounded-lg transition-colors"
                  >
                    Удалить встречу
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="ml-auto px-6 py-2 bg-[#A8C5A0] text-white rounded-lg hover:bg-[#8aab82] transition-colors font-serif"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА: Добавить встречу */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FAF3E0] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-[#3D2B1F]">Добавить встречу</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors"
                >
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-2">Фото встречи (опционально)</label>
                  {imagePreview ? (
                    <div className="relative w-full h-32 bg-[#F0E6D0] rounded-xl overflow-hidden">
                      <img src={imagePreview} alt="preview" className="h-full object-cover w-full" />
                      <button
                        onClick={() => setImagePreview('')}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <X className="w-3 h-3 text-[#3D2B1F]" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E8C4B8] rounded-xl cursor-pointer hover:border-[#C17A5A] transition-colors bg-white/50">
                      <Calendar className="w-6 h-6 text-[#C17A5A]/50 mb-1" />
                      <span className="text-xs text-[#3D2B1F]/50">Нажмите для загрузки</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Название встречи *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Например: Обсуждение Мастера и Маргариты" className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]" />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Описание</label>
                  <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Краткое описание встречи..." className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A] resize-none" />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Дата *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]" />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Время</label>
                  <input type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]" />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Формат</label>
                  <select value={form.format} onChange={(e) => setForm((p) => ({ ...p, format: e.target.value as 'онлайн' | 'офлайн' | 'гибридный' }))} className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]">
                    {FORMATS.map((f) => (
                      <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Место / Ссылка</label>
                  <input type="text" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Например: Zoom / Каспий Парк" className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]" />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Тема / Книга</label>
                  <input type="text" value={form.topic} onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))} placeholder="Например: Мастер и Маргарита" className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]" />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Количество участников</label>
                  <input type="number" min="0" value={form.attendees} onChange={(e) => setForm((p) => ({ ...p, attendees: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]" />
                </div>

                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Заметки</label>
                  <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Дополнительная информация..." className="w-full px-4 py-2.5 bg-white border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A] resize-none" />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!form.title || !form.date}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  <Plus className="w-4 h-4" />
                  Добавить встречу
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}