import type { ExperienceItem } from '@/types/portfolio';

/** Ordena cada lista de lo más reciente a lo más antiguo. */
export const academic: ExperienceItem[] = [
  {
    title: 'Pregrado (nombre de la carrera por completar)',
    place: 'Universidad por completar',
    start: '2024',
    end: 'Actualidad',
    description: 'Cursando 5.º semestre. Asignaturas destacadas: Diseño de Interfaces, …',
  },
  {
    title: 'Curso o certificación por completar',
    place: 'Plataforma o institución',
    start: '2025',
    end: '2025',
    description: 'Qué aprendiste y en qué lo aplicaste.',
  },
];

export const work: ExperienceItem[] = [
  {
    title: 'Desarrollador frontend · proyectos personales',
    place: 'Independiente',
    start: '2026',
    end: 'Actualidad',
    description: 'Diseño y desarrollo de Codex Operum, un portafolio 3D con Three.js, GSAP y modelos hechos en Blender.',
  },
  {
    title: 'Empleo, práctica o freelance por completar',
    place: 'Empresa o cliente',
    start: 'Año',
    end: 'Año',
    description: 'Tu cargo, tus responsabilidades y un logro concreto.',
  },
];
