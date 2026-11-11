import type { Interest, Profile, Skill, SocialLink } from '@/types/portfolio';

/**
 * Datos personales del portafolio.
 * Todo lo que diga «por completar» debe reemplazarse con tu información real.
 */
export const profile: Profile = {
  name: 'Kevin Stiven',
  surname: 'Buesaquillo Timarán',
  fullName: 'Kevin Stiven Buesaquillo Timarán',
  initials: 'KB',
  role: 'Desarrollador Full Stack · Backend, IA y experiencias web',
  tagline: 'Si lo puedes imaginar, lo puedes crear.',
  cvUrl: '/cv.pdf',
  portrait: '', // por completar: p. ej. '/assets/kevin-portrait.jpg'. Vacío = tarjeta «foto próximamente».
  focus: ['Backend', 'Inteligencia artificial', 'Análisis de datos', 'Frontend', 'Neo4j'],
  about: [
    'Soy estudiante de quinto semestre de Ingeniería de Software en la Universidad Cooperativa de Colombia, en Pasto, Nariño. Me apasionan el desarrollo backend, la inteligencia artificial y el análisis de datos: diseñar la lógica, las arquitecturas y los datos que hacen que una aplicación funcione de verdad.',
    'Convierto ideas en productos completos, desde la interfaz que ves hasta la API, la base de datos y la IA que la mueven por dentro. He construido aplicaciones web, móviles, de escritorio e incluso para una pulsera inteligente, integrando modelos como Gemini y OpenAI, bases de datos relacionales y de grafos, y arquitecturas limpias y hexagonales.',
  ],
  beyondCode:
    'Fuera del código me encontrarás en el gimnasio, con una guitarra en las manos o con un libro abierto. La disciplina del entrenamiento, la paciencia de la música y las preguntas de la literatura también terminan colándose en la forma en que programo.',
  hobbies: ['Gimnasio', 'Guitarra', 'Lectura'],
  books: [
    { title: 'El extranjero', author: 'Albert Camus' },
    { title: 'Memorias del subsuelo', author: 'Fiódor Dostoievski' },
    { title: 'Satanás', author: 'Mario Mendoza' },
  ],
  facts: [
    { label: 'Ubicación', value: 'Pasto, Nariño' },
    { label: 'Semestre', value: '5.º · Ing. de Software' },
    { label: 'Intereses', value: 'IA, backend y datos' },
  ],
  skills: ['Spring Boot', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'Flutter', 'PostgreSQL', 'Neo4j', 'Docker', 'Gemini / OpenAI'],
  stack: [
    { group: 'Backend', items: ['Spring Boot', 'FastAPI', 'API REST', 'Spring Security · JWT'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js'] },
    { group: 'Móvil y escritorio', items: ['Flutter', 'React Native · Expo', 'Tauri'] },
    { group: 'Bases de datos', items: ['PostgreSQL · pgvector', 'MongoDB', 'Supabase', 'Neo4j', 'Firebase'] },
    { group: 'IA y datos', items: ['Gemini API', 'OpenAI API', 'Tripo3D'] },
    { group: 'Herramientas', items: ['Docker', 'Git', 'GitHub Actions', 'Figma', 'Blender'] },
  ],
  email: '', // por completar: tu correo, p. ej. 'kevin@ejemplo.com'
  phone: '',
  formspreeId: '',
};

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/KevinTimaran' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/kevin-stiven-buesaquillo-timaran-138a76312/' },
];

export const skills: Skill[] = [
  { name: 'Backend con Spring Boot y FastAPI', level: 80 },
  { name: 'Bases de datos (PostgreSQL, MongoDB, Neo4j)', level: 75 },
  { name: 'Integración de IA (Gemini, OpenAI)', level: 75 },
  { name: 'React, Next.js y TypeScript', level: 70 },
  { name: 'Apps móviles (Flutter, React Native)', level: 65 },
  { name: 'Docker y despliegue', level: 60 },
];

export const interests: Interest[] = [
  { numeral: 'I', title: 'La lógica', label: 'Desarrollo backend', description: 'APIs, arquitecturas limpias y bases de datos que sostienen todo lo que el usuario no ve.' },
  { numeral: 'II', title: 'La inteligencia', label: 'IA y análisis de datos', description: 'Modelos y datos al servicio de decisiones: que la aplicación entienda, recomiende y anticipe.' },
  { numeral: 'III', title: 'La forma', label: 'Desarrollo frontend', description: 'Interfaces claras que convierten toda esa lógica en una experiencia que se puede recorrer.' },
];

export const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'contacto', label: 'Contacto' },
  { id: 'habilidades', label: 'Oficio' },
] as const;
