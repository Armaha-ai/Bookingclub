import { useState, useEffect, useRef } from 'react';
import { Zap, Target, Users, ArrowRight, Plus, X, Heart } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: 'курс' | 'проект' | 'инициатива' | 'партнерство';
  image?: string;
  status: 'активный' | 'планируется' | 'завершен';
  startDate?: string;
  endDate?: string;
  participants: number;
  tags: string[];
  goals: string[];
  userAdded?: boolean;
  featured?: boolean;
}

const STORAGE_KEY = 'bookclub_projects';
const CATEGORIES = ['курс', 'проект', 'инициатива', 'партнерство'];
const STATUSES = ['активный', 'планируется', 'завершен'];

// Default projects (примеры)
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'project-akperil',
    title: 'Проект «Ақперіл»',
    description: 'Инновационная инициатива поддержки молодежи через литературу и культуру',
    fullDescription: 'Проект направлен на развитие культурной грамотности и создание платформы для обмена идеями между молодежью. Включает организацию встреч, лекций и творческих мастер-классов.',
    category: 'проект',
    status: 'активный',
    startDate: '2024-01-15',
    participants: 45,
    tags: ['молодежь', 'культура', 'казахская литература'],
    goals: ['Повысить интерес к литературе', 'Создать сообщество', 'Развивать критическое мышление'],
    featured: true,
  },
  {
    id: 'project-business',
    title: 'Курс: Основы бизнеса для девушек',
    description: 'Развитие навыков предпринимательства, этикета и лидерства',
    fullDescription: 'Комплексный курс, охватывающий основы бизнес-планирования, правила делового этикета, навыки публичных выступлений и личностного развития. Идеально для девушек, мечтающих создать свой бизнес.',
    category: 'курс',
    status: 'активный',
    startDate: '2024-02-01',
    participants: 28,
    tags: ['бизнес', 'этикет', 'лидерство', 'девушки'],
    goals: ['Обучить основам предпринимательства', 'Развить лидерские качества', 'Создать сеть партнеров'],
    featured: true,
  },
  {
    id: 'project-model',
    title: 'Модельный бизнес и имидж',
    description: 'Школа имиджа, стиля и основ модельного бизнеса',
    fullDescription: 'Включает обучение правилам имиджа, выбору гардероба, основам позирования и подготовке портфолио. Для тех, кто интересуется модой и карьерой в индустрии красоты.',
    category: 'курс',
    status: 'активный',
    startDate: '2024-02-15',
    participants: 32,
    tags: ['имидж', 'мода', 'модельный бизнес'],
    goals: ['Развить навыки имиджа', 'Подготовить портфолио', 'Контакты в индустрии'],
    featured: false,
  },
];

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      // Объединяем дефолтные и загруженные
      return [...DEFAULT_PROJECTS, ...loaded];
    }
  } catch {
    // Игнорируем ошибки
  }
  return DEFAULT_PROJECTS;
}

function saveProjects(projects: Project[]) {
  // Сохраняем только добавленные пользователем
  const userProjects = projects.filter((p) => p.userAdded);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userProjects));
}

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('все');
  const [filterStatus, setFilterStatus] = useState<string>('все');
  const [showAddModal, setShowAddModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    title: '',
    description: '',
    fullDescription: '',
    category: 'проект' as const,
    status: 'активный' as const,
    startDate: '',
    endDate: '',
    participants: 0,
    tags: '',
    goals: '',
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

  // Фильтрование проектов
  const filtered = projects.filter((p) => {
    const categoryMatch = filterCategory === 'все' || p.category === filterCategory;
    const statusMatch = filterStatus === 'все' || p.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  // Сортировка: избранные и активные вверху
  const sorted = [...filtered].sort((a, b) => {
    const aFav = favorites.has(a.id) ? 0 : 1;
    const bFav = favorites.has(b.id) ? 0 : 1;
    if (aFav !== bFav) return aFav - bFav;

    const aActive = a.status === 'активный' ? 0 : 1;
    const bActive = b.status === 'активный' ? 0 : 1;
    return aActive - bActive;
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
    if (!form.title || !form.description) {
      alert('Пожалуйста, заполните название и описание');
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: form.title,
      description: form.description,
      fullDescription: form.fullDescription,
      category: form.category,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      participants: form.participants,
      image: imagePreview,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
      goals: form.goals
        .split('\n')
        .map((g) => g.trim())
        .filter((g) => g),
      userAdded: true,
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    saveProjects(updated);
    setShowAddModal(false);
    setImagePreview('');
    setForm({
      title: '',
      description: '',
      fullDescription: '',
      category: 'проект',
      status: 'активный',
      startDate: '',
      endDate: '',
      participants: 0,
      tags: '',
      goals: '',
    });
  };

  const handleToggleFavorite = (id: string) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) {
      newFavs.delete(id);
    } else {
      newFavs.add(id);
    }
    setFavorites(newFavs);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveProjects(updated);
    setSelectedProject(null);
  };

  return (
    <section id="projects" ref={sectionRef} className="section-padding relative overflow-hidden bg-gradient-to-b from-[#FAF3E0] to-white">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C17A5A 1px, transparent 0)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container-custom relative">
        {/* Section Title */}
        <div className="fade-up text-center mb-12">
          <span className="font-script text-3xl text-[#C17A5A] block mb-2">Развиваемся</span>
          <span className="text-[#C17A5A] text-xs uppercase tracking-[0.2em] mb-4 block">Новые направления</span>
          <h2 className="font-serif text-h1 text-[#3D2B1F]">Проекты и курсы</h2>
        </div>

        {/* Filter Buttons */}
        <div className="fade-up flex flex-wrap justify-center gap-2 mb-8 items-center">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory('все')}
              className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 ${
                filterCategory === 'все'
                  ? 'bg-[#C17A5A] text-white'
                  : 'bg-[#FAF3E0] text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'
              }`}
            >
              Все
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 capitalize ${
                  filterCategory === cat
                    ? 'bg-[#C17A5A] text-white'
                    : 'bg-[#FAF3E0] text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-[#E8C4B8]/50 mx-2" />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('все')}
              className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 ${
                filterStatus === 'все'
                  ? 'bg-[#A8C5A0] text-white'
                  : 'bg-[#FAF3E0] text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'
              }`}
            >
              Все статусы
            </button>
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs transition-all duration-300 capitalize ${
                  filterStatus === status
                    ? 'bg-[#A8C5A0] text-white'
                    : 'bg-[#FAF3E0] text-[#3D2B1F]/70 border border-[#E8C4B8]/30 hover:bg-[#E8C4B8]/30'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="ml-auto px-6 py-2 rounded-xl text-sm bg-[#C17A5A] text-white hover:bg-[#a86549] transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить проект
          </button>
        </div>

        {/* Projects Grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-20 text-[#3D2B1F]/50">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Проектов не найдено</p>
            <p className="text-sm mt-2">Попробуйте изменить фильтры или добавьте новый проект</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-xl border border-[#E8C4B8]/30 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Image */}
                {project.image && (
                  <div className="h-40 bg-gradient-to-b from-[#E8C4B8]/20 to-[#FAF3E0] flex items-center justify-center overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Status & Category */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span
                      className={`inline-block text-[10px] px-2 py-1 rounded-full font-medium capitalize ${
                        project.status === 'активный'
                          ? 'bg-[#A8C5A0]/20 text-[#6B8E7F]'
                          : project.status === 'планируется'
                            ? 'bg-[#E8C4B8]/20 text-[#8B5A3C]'
                            : 'bg-[#3D2B1F]/10 text-[#3D2B1F]/60'
                      }`}
                    >
                      {project.status === 'активный' && '✓ Активный'}
                      {project.status === 'планируется' && '⏳ Планируется'}
                      {project.status === 'завершен' && '✓ Завершен'}
                    </span>
                    <span className="inline-block text-[10px] bg-[#FAF3E0] text-[#3D2B1F]/70 px-2 py-1 rounded-full capitalize border border-[#E8C4B8]/30">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-[#3D2B1F] text-lg mb-2 group-hover:text-[#C17A5A] transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-[#3D2B1F]/60 leading-relaxed line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-3">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] bg-[#E8C4B8]/30 text-[#C17A5A] px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="text-[9px] bg-[#E8C4B8]/30 text-[#C17A5A] px-2 py-0.5 rounded-full">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E8C4B8]/30">
                    {project.participants > 0 && (
                      <div className="flex items-center gap-1 text-xs text-[#3D2B1F]/50">
                        <Users className="w-3 h-3" />
                        {project.participants}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(project.id);
                        }}
                        className={`transition-colors ${
                          favorites.has(project.id) ? 'text-[#C17A5A]' : 'text-[#3D2B1F]/30 hover:text-[#C17A5A]'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={favorites.has(project.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button className="text-[#C17A5A] hover:text-[#8B5A3C] transition-colors text-xs font-serif flex items-center gap-1">
                        Подробнее
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {project.featured && (
                  <div className="absolute top-4 left-4 bg-[#C17A5A] text-white text-[10px] px-2 py-1 rounded-full font-medium">
                    ⭐ Популярное
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── МОДАЛКА: Детали проекта ── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span
                      className={`inline-block text-xs px-3 py-1 rounded-full font-medium capitalize ${
                        selectedProject.status === 'активный'
                          ? 'bg-[#A8C5A0]/20 text-[#6B8E7F]'
                          : selectedProject.status === 'планируется'
                            ? 'bg-[#E8C4B8]/20 text-[#8B5A3C]'
                            : 'bg-[#3D2B1F]/10 text-[#3D2B1F]/60'
                      }`}
                    >
                      {selectedProject.status === 'активный' && '✓ Активный'}
                      {selectedProject.status === 'планируется' && '⏳ Планируется'}
                      {selectedProject.status === 'завершен' && '✓ Завершен'}
                    </span>
                    <span className="inline-block text-xs bg-[#FAF3E0] text-[#3D2B1F]/70 px-3 py-1 rounded-full capitalize border border-[#E8C4B8]/30">
                      {selectedProject.category}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl text-[#3D2B1F]">{selectedProject.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>
              </div>

              {/* Image */}
              {selectedProject.image && (
                <div className="mb-6 rounded-xl overflow-hidden max-h-80 bg-[#F0E6D0] flex items-center justify-center">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-serif text-lg text-[#3D2B1F] mb-2">О проекте</h3>
                <p className="text-[#3D2B1F]/75 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Full Description */}
              {selectedProject.fullDescription && (
                <div className="mb-6 p-4 bg-[#FAF3E0] rounded-xl border border-[#E8C4B8]/30">
                  <p className="text-[#3D2B1F]/75 leading-relaxed text-sm">{selectedProject.fullDescription}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6 p-4 bg-[#FAF3E0] rounded-xl">
                {selectedProject.startDate && (
                  <div>
                    <div className="text-[#C17A5A] font-serif text-sm mb-1">Начало</div>
                    <p className="text-[#3D2B1F]">
                      {new Date(selectedProject.startDate).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {selectedProject.endDate && (
                  <div>
                    <div className="text-[#C17A5A] font-serif text-sm mb-1">Окончание</div>
                    <p className="text-[#3D2B1F]">
                      {new Date(selectedProject.endDate).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {selectedProject.participants > 0 && (
                  <div>
                    <div className="text-[#C17A5A] font-serif text-sm mb-1 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Участников
                    </div>
                    <p className="text-[#3D2B1F]">{selectedProject.participants}</p>
                  </div>
                )}
              </div>

              {/* Goals */}
              {selectedProject.goals.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif text-lg text-[#3D2B1F] mb-3">Цели проекта</h3>
                  <ul className="space-y-2">
                    {selectedProject.goals.map((goal, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-[#3D2B1F]/75">
                        <span className="text-[#C17A5A] font-serif flex-shrink-0">✓</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {selectedProject.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif text-sm text-[#3D2B1F]/70 mb-2">Теги</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-[#E8C4B8]/40 text-[#C17A5A] px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-[#E8C4B8]/30">
                <button
                  onClick={() => handleToggleFavorite(selectedProject.id)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    favorites.has(selectedProject.id)
                      ? 'bg-[#C17A5A]/10 text-[#C17A5A]'
                      : 'hover:bg-[#E8C4B8]/20 text-[#3D2B1F]/70'
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={favorites.has(selectedProject.id) ? 'currentColor' : 'none'}
                  />
                  {favorites.has(selectedProject.id) ? 'В избранном' : 'В избранное'}
                </button>

                {selectedProject.userAdded && (
                  <button
                    onClick={() => handleDeleteProject(selectedProject.id)}
                    className="px-4 py-2 text-sm text-[#C17A5A] hover:bg-[#C17A5A]/10 rounded-lg transition-colors"
                  >
                    Удалить проект
                  </button>
                )}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="ml-auto px-6 py-2 bg-[#A8C5A0] text-white rounded-lg hover:bg-[#8aab82] transition-colors font-serif text-sm"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── МОДАЛКА: Добавить проект ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-[#3D2B1F]">Добавить проект</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8C4B8]/50 transition-colors"
                >
                  <X className="w-4 h-4 text-[#3D2B1F]" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-2">Фото (опционально)</label>
                  {imagePreview ? (
                    <div className="relative w-full h-32 bg-[#F0E6D0] rounded-xl overflow-hidden flex items-center justify-center">
                      <img src={imagePreview} alt="preview" className="h-full object-cover w-full" />
                      <button
                        onClick={() => setImagePreview('')}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <X className="w-3 h-3 text-[#3D2B1F]" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E8C4B8] rounded-xl cursor-pointer hover:border-[#C17A5A] transition-colors bg-[#FAF3E0]/50">
                      <Zap className="w-6 h-6 text-[#C17A5A]/50 mb-1" />
                      <span className="text-xs text-[#3D2B1F]/50">Нажмите для загрузки</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Название *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Например: Школа имиджа"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Краткое описание *</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Что это?"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Полное описание</label>
                  <textarea
                    value={form.fullDescription}
                    onChange={(e) => setForm((p) => ({ ...p, fullDescription: e.target.value }))}
                    rows={2}
                    placeholder="Детальное описание проекта..."
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A] resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Категория</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        category: e.target.value as any,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Статус</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        status: e.target.value as any,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[#3D2B1F]/80 mb-1">Начало</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#3D2B1F]/80 mb-1">Окончание</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]"
                    />
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Участников</label>
                  <input
                    type="number"
                    min="0"
                    value={form.participants}
                    onChange={(e) => setForm((p) => ({ ...p, participants: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Теги (через запятую)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="бизнес, имидж, обучение"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A]"
                  />
                </div>

                {/* Goals */}
                <div>
                  <label className="block text-sm text-[#3D2B1F]/80 mb-1">Цели (по строкам)</label>
                  <textarea
                    value={form.goals}
                    onChange={(e) => setForm((p) => ({ ...p, goals: e.target.value }))}
                    rows={2}
                    placeholder="Цель 1&#10;Цель 2&#10;Цель 3"
                    className="w-full px-4 py-2.5 bg-[#FAF3E0] border border-[#E8C4B8]/50 rounded-xl text-sm text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:border-[#C17A5A] resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!form.title || !form.description}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  <Plus className="w-4 h-4" />
                  Добавить проект
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}