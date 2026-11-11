export interface Profile {
  name: string;
  surname: string;
  fullName: string;
  initials: string;
  role: string;
  tagline: string;
  /** Ruta del CV dentro de /public. */
  cvUrl: string;
  /** Ruta de la foto en /public. Si está vacía se muestra una tarjeta reservada para la foto. */
  portrait: string;
  /** Etiquetas cortas de enfoque que aparecen en la bienvenida. */
  focus: string[];
  about: string[];
  /** Párrafo «Fuera del código». */
  beyondCode: string;
  hobbies: string[];
  books: { title: string; author: string }[];
  facts: { label: string; value: string }[];
  skills: string[];
  /** Stack agrupado por área. */
  stack: { group: string; items: string[] }[];
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
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string;
  /** Texto del botón de demo (p. ej. «Descargar APK»). Por defecto «Demo en vivo». */
  demoLabel?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  /** Ruta a la foto en /public/images. Si está vacía se muestran las iniciales. */
  avatar?: string;
}

export interface ExperienceItem {
  title: string;
  place: string;
  start: string;
  end: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Interest {
  numeral: string;
  title: string;
  label: string;
  description: string;
}
