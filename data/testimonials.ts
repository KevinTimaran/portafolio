import type { Testimonial } from '@/types/portfolio';

/**
 * Mínimo 3 testimonios (requisito de la entrega), en español (`es`) e inglés (`en`).
 * Son borradores: cada persona debe leer y aprobar su texto antes de publicarlo.
 */
export const testimonials: Testimonial[] = [
  {
    name: 'Luis Córdoba',
    role: {
      es: 'Ingeniero Industrial · Universidad Cooperativa de Colombia · Cliente de LoanApp',
      en: 'Industrial Engineer · Universidad Cooperativa de Colombia · LoanApp client',
    },
    text: {
      es: 'Le pedí a Kevin una aplicación para llevar el control de mis préstamos y entendió muy rápido lo que necesitaba, incluso cosas que yo no sabía cómo explicar. Fue cumplido, me mantuvo al tanto de cada avance y hoy tengo los cobros, los abonos y los saldos organizados en un solo lugar. Lo recomiendo sin dudarlo.',
      en: "I asked Kevin for an app to keep track of my loans and he quickly understood what I needed, even things I didn't know how to explain. He was reliable, kept me updated on every step, and today I have my collections, payments and balances organised in one place. I recommend him without hesitation.",
    },
  },
  {
    name: 'María Victoria',
    role: {
      es: 'Ingeniera de Sistemas · Universidad CESMAG',
      en: 'Systems Engineer · Universidad CESMAG',
    },
    text: {
      es: 'Compartir proyectos con Kevin me permitió ver a alguien con un pensamiento lógico muy claro y muchas ganas de aprender. Cuando algo no funciona, investiga hasta entenderlo, y le gusta llevar cada solución un paso más allá. Es un compañero responsable y con quien da gusto trabajar en equipo.',
      en: "Working on projects with Kevin showed me someone with very clear logical thinking and a real eagerness to learn. When something doesn't work, he digs in until he understands it, and he likes to take every solution one step further. He's a responsible teammate and a pleasure to work with.",
    },
  },
  {
    name: 'Evelyn Benavides',
    role: {
      es: 'Ingeniera Química · Universidad de Antioquia · Estudiante de Análisis de Datos (UNAL)',
      en: 'Chemical Engineer · Universidad de Antioquia · Data Analysis student (UNAL)',
    },
    text: {
      es: 'Lo que más destaco de Kevin es su curiosidad por los datos y la inteligencia artificial. Siempre está buscando cómo convertir la información en algo útil, y tiene la paciencia de explicar lo técnico de forma sencilla. Su disciplina y constancia le van a abrir muchas puertas.',
      en: "What stands out most about Kevin is his curiosity about data and artificial intelligence. He's always looking for ways to turn information into something useful, and he has the patience to explain technical things simply. His discipline and persistence will open many doors for him.",
    },
  },
];
