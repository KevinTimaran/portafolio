import type { Text } from '@/lib/i18n';

/**
 * Los campos de tipo `Text` aceptan un string (igual en ambos idiomas, p. ej. nombres de
 * tecnologías) o un objeto `{ es: '…', en: '…' }` cuando el texto cambia según el idioma.
 */

export interface Profile {
  name: string;
  surname: string;
  fullName: string;
  initials: string;
  role: Text;
  tagline: Text;
  /** Ruta del CV dentro de /public. */
  cvUrl: string;
  /** Ruta de la foto en /public. Si está vacía se muestra una tarjeta reservada para la foto. */
  portrait: string;
  /** Etiquetas cortas de enfoque que aparecen en la bienvenida. */
  focus: Text[];
  about: Text[];
  /** Párrafo «Fuera del código». */
  beyondCode: Text;
  hobbies: Text[];
  books: { title: Text; author: string }[];
  facts: { label: Text; value: Text }[];
  skills: string[];
  /** Stack agrupado por área. */
  stack: { group: Text; items: Text[] }[];
  email: string;
  phone?: string;
  /** ID de Formspree (https://formspree.io). Si está vacío, el formulario abre el correo del visitante. */
  formspreeId: string;
}

export interface SocialLink {
  label: 'GitHub' | 'LinkedIn' | 'Correo' | 'WhatsApp';
  url: string;
}

export interface Project {
  title: Text;
  category: Text;
  year: string;
  description: Text;
  image: string;
  tags: string[];
  github: string;
  demo: string;
  /** Texto del botón de demo (p. ej. «Descargar APK»). Por defecto «Demo en vivo». */
  demoLabel?: Text;
}

export interface Testimonial {
  name: string;
  role: Text;
  text: Text;
  /** Ruta a la foto en /public/images. Si está vacía se muestran las iniciales. */
  avatar?: string;
}

export interface ExperienceItem {
  title: Text;
  place: Text;
  start: Text;
  end: Text;
  description: Text;
  /** Borrador: no se publica hasta completar sus datos y quitar esta marca. */
  draft?: boolean;
}

export interface Skill {
  name: Text;
  level: number;
}

export interface Interest {
  numeral: string;
  title: Text;
  label: Text;
  description: Text;
}
