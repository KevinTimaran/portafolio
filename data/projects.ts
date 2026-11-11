import type { Project } from '@/types/portfolio';

/**
 * Para agregar un proyecto basta con añadir un objeto a este arreglo.
 * `github` y `demo` son obligatorios para la entrega: si quedan vacíos, la tarjeta lo marca como pendiente.
 */
export const projects: Project[] = [
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
    title: 'Proyecto por completar',
    category: 'Categoría · Tecnología',
    year: '2026',
    description: 'Describe en dos líneas qué problema resuelve, cuál fue tu papel y qué aprendiste al construirlo.',
    image: '',
    tags: ['React', 'Tailwind CSS'],
    github: '',
    demo: '',
  },
  {
    title: 'Proyecto por completar',
    category: 'Categoría · Tecnología',
    year: '2025',
    description: 'Otro trabajo de la universidad o personal. Agrega una captura en /public/images y los enlaces a GitHub y Vercel.',
    image: '',
    tags: ['JavaScript', 'Figma'],
    github: '',
    demo: '',
  },
];
