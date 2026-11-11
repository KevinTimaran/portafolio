import type { Project } from '@/types/portfolio';

/**
 * Para agregar un proyecto basta con añadir un objeto a este arreglo.
 * `github` y `demo` son obligatorios para la entrega: si quedan vacíos, la tarjeta lo marca como pendiente.
 */
export const projects: Project[] = [
  {
    title: 'SpecAtlas',
    category: 'Backend · IA',
    year: '2026',
    description:
      'Plataforma de ingeniería de requisitos asistida por IA: modela, valida y traza requisitos y genera diagramas UML. Arquitectura hexagonal con grafo de requisitos en Neo4j y búsqueda semántica con pgvector.',
    image: '',
    tags: ['Spring Boot', 'PostgreSQL', 'pgvector', 'Neo4j', 'Gemini', 'Docker', 'JWT'],
    github: 'https://github.com/KevinTimaran/specatlas-backend',
    demo: '', // por completar
  },
  {
    title: 'Nexo',
    category: 'Escritorio y web · IA',
    year: '2026',
    description:
      'Espacio de trabajo donde las ideas toman forma: describes una idea y la IA la convierte en conceptos, riesgos y evidencia sobre un tablero 2D y una vista neuronal 3D. Exporta el resultado a Word.',
    image: '',
    tags: ['React', 'TypeScript', 'Tauri', 'Spring Boot', 'Supabase', 'Three.js', 'OpenAI'],
    github: 'https://github.com/KevinTimaran/Nexo_Frontend',
    demo: '', // por completar
  },
  {
    title: 'Vitra · FitGlass',
    category: 'App móvil · IA y 3D',
    year: '2026',
    description:
      'Armario digital con probador virtual: analiza tus prendas, calcula tu colorimetría estacional y genera un avatar 3D para probarte la ropa.',
    image: '',
    tags: ['React Native', 'Expo', 'FastAPI', 'Gemini', 'OpenAI', 'Tripo3D'],
    github: 'https://github.com/KevinTimaran/Vitra',
    demo: 'https://github.com/KevinTimaran/Vitra/releases/latest/download/vitra-prueba.apk',
    demoLabel: 'Descargar APK',
  },
  {
    title: 'LoanApp',
    category: 'App móvil · Cliente real',
    year: '2025',
    description:
      'Sistema de gestión de préstamos y cobranzas, offline-first, con simulador financiero, tablas de amortización y rutas de cobro diarias, semanales y mensuales. Desarrollado para un cliente.',
    image: '',
    tags: ['Flutter', 'Dart', 'Hive', 'Clean Architecture'],
    github: 'https://github.com/KevinTimaran/Project_loan_app',
    demo: '', // por completar
  },
  {
    title: 'FocusPulse',
    category: 'Wearable · IA',
    year: '2026',
    description:
      'App para la Xiaomi Smart Band 7: sesiones Pomodoro con lectura de pulso en tiempo real, sincronización con Firebase y consejos generados por IA en una app Android.',
    image: '',
    tags: ['Zepp OS', 'JavaScript', 'Firebase', 'OpenAI', 'Bluetooth'],
    github: 'https://github.com/KevinTimaran/focuspulse-band7',
    demo: '', // por completar
  },
  {
    title: 'Codex Operum',
    category: 'Experiencia interactiva · WebGL',
    year: '2026',
    description:
      'Este mismo portafolio: un bosque nocturno con una fogata, un libro de cuero articulado, una radio y un móvil con los que puedes interactuar en tiempo real.',
    image: '/images/codex-operum.jpg',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'GSAP', 'Blender'],
    github: 'https://github.com/KevinTimaran/portafolio',
    demo: '', // por completar: la URL de Vercel, p. ej. 'https://tu-portafolio.vercel.app'
  },
  {
    title: 'Reproductor de música',
    category: 'Web · Frontend',
    year: '2026',
    description: 'Reproductor de música web con interfaz propia, construido con Next.js y Tailwind CSS.',
    image: '',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/KevinTimaran/Reproductor-musica',
    demo: '', // por completar
  },
];
