/**
 * Textos fijos de la interfaz (botones, títulos, etiquetas) en español e inglés.
 * El contenido personal (proyectos, experiencia, etc.) está en los demás archivos de /data.
 */

/** Título con una parte destacada: `before <em>em</em>`. */
type Title = { before: string; em: string };

const es = {
  languageToggle: { label: 'Cambiar idioma', es: 'Español', en: 'English' },
  nav: {
    label: 'Navegación principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    downloadCv: 'CV',
    follow: 'Sígueme',
    writeMe: 'Escríbeme',
  },
  hero: {
    availableFor: 'Disponible para proyectos',
    greeting: 'Hola, soy',
    basedIn: (place: string) => `Con base en ${place}`,
    downloadCv: 'Descargar CV',
    seeProjects: 'Ver proyectos',
    scroll: 'Desliza',
    stats: { semester: 'Semestre', projects: 'Proyectos', stack: 'Tecnologías' },
  },
  services: {
    eyebrow: 'Qué hago',
    title: { before: 'En lo que', em: 'me enfoco.' } as Title,
    description: 'Tres maneras de acercarme a una idea y convertirla en algo real.',
  },
  about: {
    eyebrow: 'Sobre mí',
    title: { before: 'Un poco', em: 'más sobre mí.' } as Title,
    beyondCode: 'Fuera del código',
    books: 'Libros de cabecera',
  },
  stack: {
    eyebrow: 'Herramientas',
    title: { before: 'Con lo que', em: 'construyo.' } as Title,
    description: 'El stack que uso para llevar una idea de principio a fin.',
  },
  experience: {
    eyebrow: 'Trayectoria',
    title: { before: 'El camino', em: 'recorrido.' } as Title,
    description: 'Formación académica y experiencia laboral, de lo más reciente a lo más antiguo.',
    academic: 'Académica',
    work: 'Laboral',
  },
  projects: {
    eyebrow: 'Mis proyectos',
    title: { before: 'De la idea', em: 'a la materia.' } as Title,
    description: 'Una colección de exploraciones, decisiones y pequeños descubrimientos.',
    pending: 'pendiente',
    pendingHint: 'Enlace por completar en data/projects.ts',
    demo: 'Demo en vivo',
    screenshot: (title: string) => `Captura de ${title}`,
  },
  testimonials: {
    eyebrow: 'Testimonios',
    title: { before: 'Lo que dicen', em: 'quienes me conocen.' } as Title,
    description: 'Opiniones de personas con las que he trabajado.',
    photo: (name: string) => `Foto de ${name}`,
  },
  contact: {
    eyebrow: 'Contacto',
    title: { before: 'Hablemos de', em: 'tu próxima idea.' } as Title,
    description: 'Si tienes un proyecto en mente, quieres un socio a largo plazo o solo quieres saludar, escríbeme.',
    email: 'Correo',
    phone: 'WhatsApp',
    location: 'Ubicación',
    pending: 'Por completar en data/profile.ts',
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailPlaceholder: 'tu@correo.com',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntame tu idea…',
    sending: 'Enviando…',
    send: 'Enviar mensaje',
  },
  form: {
    missing: 'Completa tu nombre, tu correo y el mensaje.',
    sent: (name: string) => `¡Gracias, ${name}! Tu mensaje llegó. Te responderé pronto.`,
    failed: 'No se pudo enviar el mensaje. Inténtalo de nuevo en un momento.',
    mailOpened: (name: string) => `¡Gracias, ${name}! Se abrió tu aplicación de correo con el mensaje listo para enviar.`,
    notConnected: 'El formulario todavía no está conectado (falta el correo o el ID de Formspree en data/profile.ts).',
    subject: (name: string) => `Mensaje desde el portafolio · ${name}`,
  },
  footer: {
    quickLinks: 'Índice',
    rights: 'Todos los derechos reservados.',
    madeWith: 'Hecho con Next.js, TypeScript y Tailwind CSS.',
    backToTop: 'Volver arriba',
    ctaTitle: { before: 'Construyamos', em: 'algo juntos.' } as Title,
  },
};

export type UiStrings = typeof es;

const en: UiStrings = {
  languageToggle: { label: 'Change language', es: 'Español', en: 'English' },
  nav: {
    label: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    downloadCv: 'CV',
    follow: 'Follow me',
    writeMe: 'Write to me',
  },
  hero: {
    availableFor: 'Available for projects',
    greeting: "Hi, I'm",
    basedIn: (place: string) => `Based in ${place}`,
    downloadCv: 'Download CV',
    seeProjects: 'See projects',
    scroll: 'Scroll',
    stats: { semester: 'Semester', projects: 'Projects', stack: 'Technologies' },
  },
  services: {
    eyebrow: 'What I do',
    title: { before: 'What I', em: 'focus on.' },
    description: 'Three ways I approach an idea and turn it into something real.',
  },
  about: {
    eyebrow: 'About me',
    title: { before: 'A bit', em: 'more about me.' },
    beyondCode: 'Beyond the code',
    books: 'Favourite books',
  },
  stack: {
    eyebrow: 'Tools',
    title: { before: 'What I', em: 'build with.' },
    description: 'The stack I use to take an idea from start to finish.',
  },
  experience: {
    eyebrow: 'Journey',
    title: { before: 'The road', em: 'so far.' },
    description: 'Education and work experience, from most recent to oldest.',
    academic: 'Education',
    work: 'Work',
  },
  projects: {
    eyebrow: 'My projects',
    title: { before: 'From the idea', em: 'to the making.' },
    description: 'A collection of explorations, decisions and small discoveries.',
    pending: 'coming soon',
    pendingHint: 'Link to be added in data/projects.ts',
    demo: 'Live demo',
    screenshot: (title: string) => `Screenshot of ${title}`,
  },
  testimonials: {
    eyebrow: 'Testimonials',
    title: { before: 'What people', em: 'who know me say.' },
    description: "What people I've worked with have to say.",
    photo: (name: string) => `Photo of ${name}`,
  },
  contact: {
    eyebrow: 'Contact',
    title: { before: "Let's talk about", em: 'your next idea.' },
    description: "If you have a project in mind, want a long-term partner, or just want to say hi, write to me.",
    email: 'Email',
    phone: 'WhatsApp',
    location: 'Location',
    pending: 'To be added in data/profile.ts',
    name: 'Name',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@email.com',
    message: 'Message',
    messagePlaceholder: 'Tell me about your idea…',
    sending: 'Sending…',
    send: 'Send message',
  },
  form: {
    missing: 'Please fill in your name, your email and the message.',
    sent: (name: string) => `Thank you, ${name}! Your message arrived. I will get back to you soon.`,
    failed: 'The message could not be sent. Please try again in a moment.',
    mailOpened: (name: string) => `Thank you, ${name}! Your email app opened with the message ready to send.`,
    notConnected: 'The form is not connected yet (the email or the Formspree ID is missing in data/profile.ts).',
    subject: (name: string) => `Message from the portfolio · ${name}`,
  },
  footer: {
    quickLinks: 'Contents',
    rights: 'All rights reserved.',
    madeWith: 'Made with Next.js, TypeScript and Tailwind CSS.',
    backToTop: 'Back to top',
    ctaTitle: { before: "Let's build", em: 'something together.' },
  },
};

export const ui = { es, en };
