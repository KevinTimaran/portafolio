import type { ExperienceItem } from '@/types/portfolio';

/** Ordena cada lista de lo más reciente a lo más antiguo. */
export const academic: ExperienceItem[] = [
  {
    title: 'Ingeniería de Software',
    place: 'Universidad Cooperativa de Colombia · Pasto',
    start: '2024', // por confirmar: año de ingreso
    end: 'Actualidad',
    description:
      'Cursando 5.º semestre. Proyectos en arquitectura de software, desarrollo backend, integración de inteligencia artificial y diseño de interfaces.',
  },
  {
    title: 'Programa de internacionalización',
    place: 'Universidad Cooperativa de Colombia',
    start: 'Fecha', // por completar
    end: 'por confirmar',
    description: 'Participación en las actividades de internacionalización de la universidad. (Detalle por completar.)',
  },
];

export const work: ExperienceItem[] = [
  {
    title: 'Desarrollador Full Stack · Nexo',
    place: 'Proyecto académico',
    start: 'Octubre 2026',
    end: 'Noviembre 2026',
    description:
      'Desarrollo del frontend en React y TypeScript, empaquetado como app de escritorio con Tauri, conectado a un backend en Spring Boot, Supabase y la API de OpenAI.',
  },
  {
    title: 'Desarrollador Backend · SpecAtlas',
    place: 'Proyecto académico',
    start: 'Marzo 2026',
    end: 'Mayo 2026',
    description:
      'Diseñé el backend con arquitectura hexagonal en Spring Boot, con PostgreSQL + pgvector, un grafo de requisitos en Neo4j, autenticación JWT e integración con Gemini.',
  },
  {
    title: 'Desarrollador Full Stack (Freelance) · LoanApp',
    place: 'Cliente: Luis Córdoba',
    start: '2025',
    end: '2026',
    description:
      'Diseñé y desarrollé de principio a fin una app en Flutter para llevar la contabilidad de préstamos: clientes, abonos, cobros por ruta y simulador financiero, funcionando sin conexión.',
  },
  {
    title: 'Mesero',
    place: 'Restaurante', // por completar: nombre del negocio
    start: 'Por confirmar',
    end: 'Actualidad',
    description: 'Atención a clientes en horas de alta demanda, trabajo en equipo con cocina y manejo de pedidos bajo presión.',
  },
  {
    title: 'Mesero',
    place: 'Bar y billar', // por completar: nombre del negocio
    start: 'Por confirmar',
    end: 'Por confirmar',
    description: 'Atención al público, manejo de cuentas y caja, y resolución rápida de situaciones con clientes.',
  },
  {
    title: 'Atención al cliente',
    place: 'Ferretería', // por completar: nombre del negocio
    start: 'Por confirmar',
    end: 'Por confirmar',
    description: 'Asesoría a clientes en la elección de productos, manejo de inventario y ventas en mostrador.',
  },
];
