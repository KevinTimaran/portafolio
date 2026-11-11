import type { Testimonial } from '@/types/portfolio';

/**
 * Mínimo 3 testimonios (requisito de la entrega).
 * Son borradores: cada persona debe leer y aprobar su texto antes de publicarlo.
 */
export const testimonials: Testimonial[] = [
  {
    name: 'Luis Córdoba',
    role: 'Ingeniero Industrial · Universidad Cooperativa de Colombia · Cliente de LoanApp',
    text: 'Le pedí a Kevin una aplicación para llevar el control de mis préstamos y entendió muy rápido lo que necesitaba, incluso cosas que yo no sabía cómo explicar. Fue cumplido, me mantuvo al tanto de cada avance y hoy tengo los cobros, los abonos y los saldos organizados en un solo lugar. Lo recomiendo sin dudarlo.',
  },
  {
    name: 'María Victoria',
    role: 'Ingeniera de Sistemas · Universidad CESMAG',
    text: 'Compartir proyectos con Kevin me permitió ver a alguien con un pensamiento lógico muy claro y muchas ganas de aprender. Cuando algo no funciona, investiga hasta entenderlo, y le gusta llevar cada solución un paso más allá. Es un compañero responsable y con quien da gusto trabajar en equipo.',
  },
  {
    name: 'Evelyn Benavides',
    role: 'Ingeniera Química · Universidad de Antioquia · Estudiante de Análisis de Datos (UNAL)',
    text: 'Lo que más destaco de Kevin es su curiosidad por los datos y la inteligencia artificial. Siempre está buscando cómo convertir la información en algo útil, y tiene la paciencia de explicar lo técnico de forma sencilla. Su disciplina y constancia le van a abrir muchas puertas.',
  },
];
