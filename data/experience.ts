import type { ExperienceItem } from '@/types/portfolio';

/**
 * Las entradas con `draft: true` no se muestran en el sitio.
 * Los textos llevan versión en español (`es`) e inglés (`en`).
 * Ordena cada lista de lo más reciente a lo más antiguo.
 */
const academicAll: ExperienceItem[] = [
  {
    title: { es: 'Ingeniería de Software', en: 'Software Engineering' },
    place: 'Universidad Cooperativa de Colombia · Pasto',
    start: '2024', // por confirmar: año de ingreso
    end: { es: 'Actualidad', en: 'Present' },
    description: {
      es: 'Cursando 5.º semestre. Proyectos en arquitectura de software, desarrollo backend, integración de inteligencia artificial y diseño de interfaces.',
      en: 'Currently in my 5th semester. Projects in software architecture, backend development, artificial intelligence integration and interface design.',
    },
  },
  {
    title: { es: 'Programa de internacionalización', en: 'Internationalisation programme' },
    place: 'Universidad Cooperativa de Colombia',
    start: { es: 'Fecha', en: 'Date' }, // por completar
    end: { es: 'por confirmar', en: 'to be confirmed' },
    description: {
      es: 'Participación en las actividades de internacionalización de la universidad. (Detalle por completar.)',
      en: "Took part in the university's internationalisation activities. (Details to be added.)",
    },
    draft: true, // quita esta línea cuando completes fechas y detalle
  },
];

const workAll: ExperienceItem[] = [
  {
    title: { es: 'Desarrollador Full Stack · Nexo', en: 'Full Stack Developer · Nexo' },
    place: { es: 'Proyecto académico', en: 'Academic project' },
    start: { es: 'Octubre 2026', en: 'October 2026' },
    end: { es: 'Noviembre 2026', en: 'November 2026' },
    description: {
      es: 'Desarrollo del frontend en React y TypeScript, empaquetado como app de escritorio con Tauri, conectado a un backend en Spring Boot, Supabase y la API de OpenAI.',
      en: 'Built the frontend in React and TypeScript, packaged as a desktop app with Tauri and connected to a Spring Boot backend, Supabase and the OpenAI API.',
    },
  },
  {
    title: { es: 'Desarrollador Backend · SpecAtlas', en: 'Backend Developer · SpecAtlas' },
    place: { es: 'Proyecto académico', en: 'Academic project' },
    start: { es: 'Marzo 2026', en: 'March 2026' },
    end: { es: 'Mayo 2026', en: 'May 2026' },
    description: {
      es: 'Diseñé el backend con arquitectura hexagonal en Spring Boot, con PostgreSQL + pgvector, un grafo de requisitos en Neo4j, autenticación JWT e integración con Gemini.',
      en: 'Designed the backend with a hexagonal architecture in Spring Boot, with PostgreSQL + pgvector, a requirements graph in Neo4j, JWT authentication and Gemini integration.',
    },
  },
  {
    title: { es: 'Desarrollador Full Stack (Freelance) · LoanApp', en: 'Full Stack Developer (Freelance) · LoanApp' },
    place: { es: 'Cliente: Luis Córdoba', en: 'Client: Luis Córdoba' },
    start: '2025',
    end: '2026',
    description: {
      es: 'Diseñé y desarrollé de principio a fin una app en Flutter para llevar la contabilidad de préstamos: clientes, abonos, cobros por ruta y simulador financiero, funcionando sin conexión.',
      en: 'Designed and built end to end a Flutter app to keep track of loans: clients, payments, collection routes and a financial simulator, all working offline.',
    },
  },
  {
    title: { es: 'Mesero', en: 'Waiter' },
    place: { es: 'Restaurante', en: 'Restaurant' }, // por completar: nombre del negocio
    start: { es: 'Por confirmar', en: 'To be confirmed' },
    end: { es: 'Actualidad', en: 'Present' },
    description: {
      es: 'Atención a clientes en horas de alta demanda, trabajo en equipo con cocina y manejo de pedidos bajo presión.',
      en: 'Served customers during peak hours, worked as a team with the kitchen and handled orders under pressure.',
    },
    draft: true, // quita esta línea cuando completes lugar y fechas
  },
  {
    title: { es: 'Mesero', en: 'Waiter' },
    place: { es: 'Bar y billar', en: 'Bar and pool hall' }, // por completar: nombre del negocio
    start: { es: 'Por confirmar', en: 'To be confirmed' },
    end: { es: 'Por confirmar', en: 'To be confirmed' },
    description: {
      es: 'Atención al público, manejo de cuentas y caja, y resolución rápida de situaciones con clientes.',
      en: 'Customer service, handling bills and the till, and resolving situations with customers quickly.',
    },
    draft: true, // quita esta línea cuando completes lugar y fechas
  },
  {
    title: { es: 'Atención al cliente', en: 'Customer service' },
    place: { es: 'Ferretería', en: 'Hardware store' }, // por completar: nombre del negocio
    start: { es: 'Por confirmar', en: 'To be confirmed' },
    end: { es: 'Por confirmar', en: 'To be confirmed' },
    description: {
      es: 'Asesoría a clientes en la elección de productos, manejo de inventario y ventas en mostrador.',
      en: 'Advised customers on choosing products, managed inventory and handled counter sales.',
    },
    draft: true, // quita esta línea cuando completes lugar y fechas
  },
];

const published = (items: ExperienceItem[]) => items.filter(item => !item.draft);

export const academic = published(academicAll);
export const work = published(workAll);
