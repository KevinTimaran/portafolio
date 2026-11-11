import type { Testimonial } from '@/types/portfolio';

/**
 * Mínimo 3 testimonios (requisito de la entrega).
 * Reemplaza estos marcadores con opiniones reales de profesores, compañeros o clientes.
 */
export const testimonials: Testimonial[] = [
  {
    name: 'Nombre del profesor/a',
    role: 'Profesor/a de Diseño de Interfaces',
    text: 'Aquí va lo que tu profesor/a opina de tu trabajo: tu proceso, tu atención al detalle o un proyecto que destacó.',
  },
  {
    name: 'Nombre del compañero/a',
    role: 'Compañero/a de proyecto',
    text: 'Aquí va cómo fue trabajar contigo en equipo: comunicación, responsabilidad y lo que aportaste al proyecto.',
  },
  {
    name: 'Nombre del cliente o jefe',
    role: 'Cliente / jefe',
    text: 'Aquí va una opinión de alguien para quien hayas hecho un trabajo: el resultado y por qué te recomendaría.',
  },
];
