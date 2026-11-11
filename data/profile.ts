import type { Interest, Profile, Skill, SocialLink } from '@/types/portfolio';

/**
 * Datos personales del portafolio, en español (`es`) e inglés (`en`).
 * Todo lo que diga «por completar» debe reemplazarse con tu información real.
 */
export const profile: Profile = {
  name: 'Kevin Stiven',
  surname: 'Buesaquillo Timarán',
  fullName: 'Kevin Stiven Buesaquillo Timarán',
  initials: 'KB',
  role: {
    es: 'Desarrollador Full Stack · Backend, IA y experiencias web',
    en: 'Full Stack Developer · Backend, AI and web experiences',
  },
  tagline: {
    es: 'Si lo puedes imaginar, lo puedes crear.',
    en: 'If you can imagine it, you can create it.',
  },
  cvUrl: '/cv.pdf',
  portrait: '/assets/kevin-portrait.jpg', // Vacío = tarjeta «foto próximamente».
  focus: [
    'Backend',
    { es: 'Inteligencia artificial', en: 'Artificial intelligence' },
    { es: 'Análisis de datos', en: 'Data analysis' },
    'Frontend',
    'Neo4j',
  ],
  about: [
    {
      es: 'Soy estudiante de quinto semestre de Ingeniería de Software en la Universidad Cooperativa de Colombia, en Pasto, Nariño. Me apasionan el desarrollo backend, la inteligencia artificial y el análisis de datos: diseñar la lógica, las arquitecturas y los datos que hacen que una aplicación funcione de verdad.',
      en: "I'm a fifth-semester Software Engineering student at Universidad Cooperativa de Colombia in Pasto, Nariño. I'm passionate about backend development, artificial intelligence and data analysis: designing the logic, the architecture and the data that make an application truly work.",
    },
    {
      es: 'Convierto ideas en productos completos, desde la interfaz que ves hasta la API, la base de datos y la IA que la mueven por dentro. He construido aplicaciones web, móviles, de escritorio e incluso para una pulsera inteligente, integrando modelos como Gemini y OpenAI, bases de datos relacionales y de grafos, y arquitecturas limpias y hexagonales.',
      en: "I turn ideas into complete products, from the interface you see to the API, the database and the AI that power it. I've built web, mobile and desktop apps, and even one for a smart band, integrating models like Gemini and OpenAI, relational and graph databases, and clean and hexagonal architectures.",
    },
  ],
  beyondCode: {
    es: 'Fuera del código me encontrarás en el gimnasio, con una guitarra en las manos o con un libro abierto. La disciplina del entrenamiento, la paciencia de la música y las preguntas de la literatura también terminan colándose en la forma en que programo.',
    en: "Away from the code you'll find me at the gym, with a guitar in my hands or with a book open. The discipline of training, the patience of music and the questions of literature all end up finding their way into how I write code.",
  },
  hobbies: [
    { es: 'Gimnasio', en: 'Gym' },
    { es: 'Guitarra', en: 'Guitar' },
    { es: 'Lectura', en: 'Reading' },
  ],
  books: [
    { title: { es: 'El extranjero', en: 'The Stranger' }, author: 'Albert Camus' },
    { title: { es: 'Memorias del subsuelo', en: 'Notes from Underground' }, author: 'Fiódor Dostoievski' },
    { title: 'Satanás', author: 'Mario Mendoza' },
  ],
  facts: [
    { label: { es: 'Ubicación', en: 'Location' }, value: 'Pasto, Nariño' },
    { label: { es: 'Semestre', en: 'Semester' }, value: { es: '5.º · Ing. de Software', en: '5th · Software Eng.' } },
    { label: { es: 'Intereses', en: 'Interests' }, value: { es: 'IA, backend y datos', en: 'AI, backend and data' } },
  ],
  skills: ['Spring Boot', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'Flutter', 'PostgreSQL', 'Neo4j', 'Docker', 'Gemini / OpenAI'],
  stack: [
    { group: 'Backend', items: ['Spring Boot', 'FastAPI', { es: 'API REST', en: 'REST APIs' }, 'Spring Security · JWT'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js'] },
    { group: { es: 'Móvil y escritorio', en: 'Mobile and desktop' }, items: ['Flutter', 'React Native · Expo', 'Tauri'] },
    { group: { es: 'Bases de datos', en: 'Databases' }, items: ['PostgreSQL · pgvector', 'MongoDB', 'Supabase', 'Neo4j', 'Firebase'] },
    { group: { es: 'IA y datos', en: 'AI and data' }, items: ['Gemini API', 'OpenAI API', 'Tripo3D'] },
    { group: { es: 'Herramientas', en: 'Tools' }, items: ['Docker', 'Git', 'GitHub Actions', 'Figma', 'Blender'] },
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
  { name: { es: 'Backend con Spring Boot y FastAPI', en: 'Backend with Spring Boot and FastAPI' }, level: 80 },
  { name: { es: 'Bases de datos (PostgreSQL, MongoDB, Neo4j)', en: 'Databases (PostgreSQL, MongoDB, Neo4j)' }, level: 75 },
  { name: { es: 'Integración de IA (Gemini, OpenAI)', en: 'AI integration (Gemini, OpenAI)' }, level: 75 },
  { name: { es: 'React, Next.js y TypeScript', en: 'React, Next.js and TypeScript' }, level: 70 },
  { name: { es: 'Apps móviles (Flutter, React Native)', en: 'Mobile apps (Flutter, React Native)' }, level: 65 },
  { name: { es: 'Docker y despliegue', en: 'Docker and deployment' }, level: 60 },
];

export const interests: Interest[] = [
  {
    numeral: 'I',
    title: { es: 'La lógica', en: 'The logic' },
    label: { es: 'Desarrollo backend', en: 'Backend development' },
    description: {
      es: 'APIs, arquitecturas limpias y bases de datos que sostienen todo lo que el usuario no ve.',
      en: 'APIs, clean architectures and databases that hold up everything the user never sees.',
    },
  },
  {
    numeral: 'II',
    title: { es: 'La inteligencia', en: 'The intelligence' },
    label: { es: 'IA y análisis de datos', en: 'AI and data analysis' },
    description: {
      es: 'Modelos y datos al servicio de decisiones: que la aplicación entienda, recomiende y anticipe.',
      en: 'Models and data in service of decisions: apps that understand, recommend and anticipate.',
    },
  },
  {
    numeral: 'III',
    title: { es: 'La forma', en: 'The form' },
    label: { es: 'Desarrollo frontend', en: 'Frontend development' },
    description: {
      es: 'Interfaces claras que convierten toda esa lógica en una experiencia que se puede recorrer.',
      en: 'Clear interfaces that turn all that logic into an experience you can walk through.',
    },
  },
];

export const navLinks = [
  { id: 'inicio', label: { es: 'Inicio', en: 'Home' } },
  { id: 'servicios', label: { es: 'Qué hago', en: 'What I do' } },
  { id: 'sobre-mi', label: { es: 'Sobre mí', en: 'About' } },
  { id: 'stack', label: { es: 'Stack', en: 'Stack' } },
  { id: 'experiencia', label: { es: 'Experiencia', en: 'Experience' } },
  { id: 'proyectos', label: { es: 'Proyectos', en: 'Projects' } },
  { id: 'testimonios', label: { es: 'Testimonios', en: 'Testimonials' } },
  { id: 'contacto', label: { es: 'Contacto', en: 'Contact' } },
] as const;
