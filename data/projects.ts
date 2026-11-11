import type { Project } from '@/types/portfolio';

/**
 * Para agregar un proyecto basta con añadir un objeto a este arreglo.
 * Los textos llevan versión en español (`es`) e inglés (`en`).
 * `github` y `demo` son obligatorios para la entrega: si quedan vacíos, la tarjeta lo marca como pendiente.
 */
export const projects: Project[] = [
  {
    title: 'SpecAtlas',
    category: { es: 'Backend · IA', en: 'Backend · AI' },
    year: '2026',
    description: {
      es: 'Plataforma de ingeniería de requisitos asistida por IA: modela, valida y traza requisitos y genera diagramas UML. Arquitectura hexagonal con grafo de requisitos en Neo4j y búsqueda semántica con pgvector.',
      en: 'AI-assisted requirements engineering platform: it models, validates and traces requirements and generates UML diagrams. Hexagonal architecture with a requirements graph in Neo4j and semantic search with pgvector.',
    },
    image: '',
    tags: ['Spring Boot', 'PostgreSQL', 'pgvector', 'Neo4j', 'Gemini', 'Docker', 'JWT'],
    github: 'https://github.com/KevinTimaran/specatlas-backend',
    demo: '', // por completar
  },
  {
    title: 'Nexo',
    category: { es: 'Escritorio y web · IA', en: 'Desktop and web · AI' },
    year: '2026',
    description: {
      es: 'Espacio de trabajo donde las ideas toman forma: describes una idea y la IA la convierte en conceptos, riesgos y evidencia sobre un tablero 2D y una vista neuronal 3D. Exporta el resultado a Word.',
      en: 'A workspace where ideas take shape: you describe an idea and the AI turns it into concepts, risks and evidence on a 2D board and a 3D neural view. Exports the result to Word.',
    },
    image: '',
    tags: ['React', 'TypeScript', 'Tauri', 'Spring Boot', 'Supabase', 'Three.js', 'OpenAI'],
    github: 'https://github.com/KevinTimaran/Nexo_Frontend',
    demo: 'https://nexofront-three.vercel.app',
  },
  {
    title: 'Vitra · FitGlass',
    category: { es: 'App móvil · IA y 3D', en: 'Mobile app · AI and 3D' },
    year: '2026',
    description: {
      es: 'Armario digital con probador virtual: analiza tus prendas, calcula tu colorimetría estacional y genera un avatar 3D para probarte la ropa.',
      en: 'Digital wardrobe with a virtual fitting room: it analyses your clothes, works out your seasonal colour palette and generates a 3D avatar to try the clothes on.',
    },
    image: '',
    tags: ['React Native', 'Expo', 'FastAPI', 'Gemini', 'OpenAI', 'Tripo3D'],
    github: 'https://github.com/KevinTimaran/Vitra',
    demo: 'https://github.com/KevinTimaran/Vitra/releases/latest/download/vitra-prueba.apk',
    demoLabel: { es: 'Descargar APK', en: 'Download APK' },
  },
  {
    title: 'LoanApp',
    category: { es: 'App móvil · Cliente real', en: 'Mobile app · Real client' },
    year: '2025',
    description: {
      es: 'Sistema de gestión de préstamos y cobranzas, offline-first, con simulador financiero, tablas de amortización y rutas de cobro diarias, semanales y mensuales. Desarrollado para un cliente.',
      en: 'Offline-first loan and collections management system with a financial simulator, amortisation tables and daily, weekly and monthly collection routes. Built for a client.',
    },
    image: '',
    tags: ['Flutter', 'Dart', 'Hive', 'Clean Architecture'],
    github: 'https://github.com/KevinTimaran/Project_loan_app',
    demo: '', // por completar
  },
  {
    title: 'FocusPulse',
    category: { es: 'Wearable · IA', en: 'Wearable · AI' },
    year: '2026',
    description: {
      es: 'App para la Xiaomi Smart Band 7: sesiones Pomodoro con lectura de pulso en tiempo real, sincronización con Firebase y consejos generados por IA en una app Android.',
      en: 'App for the Xiaomi Smart Band 7: Pomodoro sessions with real-time heart-rate reading, Firebase sync and AI-generated tips in an Android app.',
    },
    image: '',
    tags: ['Zepp OS', 'JavaScript', 'Firebase', 'OpenAI', 'Bluetooth'],
    github: 'https://github.com/KevinTimaran/focuspulse-band7',
    demo: '', // por completar
  },
  {
    title: 'Codex Operum',
    category: { es: 'Experiencia interactiva · WebGL', en: 'Interactive experience · WebGL' },
    year: '2026',
    description: {
      es: 'Este mismo portafolio: un bosque nocturno con una fogata, un libro de cuero articulado, una radio y un móvil con los que puedes interactuar en tiempo real.',
      en: 'This very portfolio: a forest at night with a campfire, an articulated leather book, a radio and a phone you can interact with in real time.',
    },
    image: '/images/codex-operum.jpg',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'GSAP', 'Blender'],
    github: 'https://github.com/KevinTimaran/portafolio',
    demo: 'https://kevin-timaran-portafolio.vercel.app',
  },
  {
    title: { es: 'Reproductor de música', en: 'Music player' },
    category: 'Web · Frontend',
    year: '2026',
    description: {
      es: 'Reproductor de música web con interfaz propia, construido con Next.js y Tailwind CSS.',
      en: 'Web music player with a custom interface, built with Next.js and Tailwind CSS.',
    },
    image: '',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/KevinTimaran/Reproductor-musica',
    demo: '', // por completar
  },
];
