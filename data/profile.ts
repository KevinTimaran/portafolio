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
  role: 'Desarrollador Frontend · Diseño de interfaces y 3D',
  tagline: 'Diseño y programo experiencias web que se sienten como algo que puedes tocar.',
  cvUrl: '/cv.pdf',
  portrait: '/assets/kevin-portrait.jpg',
  about: [
    'Soy estudiante de quinto semestre y me apasiona acercar el mundo digital a las sensaciones del mundo real: la luz sobre una superficie, el peso de un objeto, el silencio entre dos movimientos.',
    'Combino diseño de interfaces, modelado 3D y desarrollo web para construir experiencias claras y con carácter. Cada proyecto es una nueva página de este cuaderno.',
  ],
  facts: [
    { label: 'Ubicación', value: 'Colombia (ciudad por completar)' },
    { label: 'Semestre', value: '5.º semestre' },
    { label: 'Intereses', value: 'Interfaces, 3D, WebGL, tipografía' },
  ],
  skills: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Three.js', 'GSAP', 'Blender', 'Figma', 'Git'],
  email: '', // por completar: tu correo, p. ej. 'kevin@ejemplo.com'
  phone: '',
  formspreeId: '',
};

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/KevinTimaran' },
  { label: 'LinkedIn', url: '' }, // por completar: 'https://www.linkedin.com/in/tu-usuario/'
];

export const skills: Skill[] = [
  { name: 'Diseño de interfaces (Figma)', level: 85 },
  { name: 'HTML, CSS y Tailwind', level: 85 },
  { name: 'JavaScript / TypeScript', level: 75 },
  { name: 'React y Next.js', level: 65 },
  { name: 'Three.js y WebGL', level: 70 },
  { name: 'Blender', level: 60 },
];

export const interests: Interest[] = [
  { numeral: 'I', title: 'La forma', label: 'Diseño de interfaces', description: 'Jerarquía, composición y tipografía al servicio de una experiencia clara y con carácter.' },
  { numeral: 'II', title: 'La materia', label: 'Exploración tridimensional', description: 'Luz, textura y movimiento para dar presencia a los objetos que habitan la pantalla.' },
  { numeral: 'III', title: 'El mecanismo', label: 'Desarrollo web', description: 'Código que convierte una intención visual en una experiencia que puede recorrerse.' },
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
