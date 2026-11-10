/**
 * Contenido editable del portafolio.
 * Sustituye las descripciones y los proyectos pendientes con tu información.
 * Añade un correo y enlaces reales para activar la correspondencia.
 * Los textos son texto plano: no es necesario escribir HTML.
 */
export const portfolio = {
  name: 'Kevin Stiven',
  surname: 'Buesaquillo Timarán',
  fullName: 'Kevin Stiven Buesaquillo Timarán',
  discipline: 'Diseño, código y experiencias',
  introduction: 'Hay ideas que merecen algo más que una pantalla. Merecen un lugar, una atmósfera y un instante para ser descubiertas.',
  welcome: 'Bienvenido a mi cuaderno de obras. Un espacio para reunir lo que imagino, lo que construyo y todo aquello que todavía está por venir.',
  about: [
    'Este cuaderno comienza con una búsqueda: acercar el mundo digital a las sensaciones del mundo real. La luz sobre una superficie, el peso de un objeto, el silencio entre dos movimientos.',
    'Aquí irán mi historia, mi formación y los caminos que me han traído hasta este oficio. Cada proyecto será una nueva página; cada aprendizaje, una nota al margen.',
  ],
  quote: 'Las mejores historias se descubren una página a la vez.',
  projects: [
    {
      number: '01',
      title: 'Codex Operum',
      category: 'Experiencia interactiva · WebGL',
      year: '2026',
      description: 'Un portafolio que comienza junto al fuego. Un libro antiguo se convierte en el umbral entre un entorno tridimensional y la intimidad de una página.',
      detail: 'La experiencia combina un entorno nocturno, materiales de cuero y papel, una cubierta articulada y una cámara en primera persona. El recorrido culmina en este lector de un solo folio.',
      tools: 'Three.js · GSAP · JavaScript',
      status: 'Obra presente',
      url: '',
    },
    {
      number: '02',
      title: 'Una historia por construir',
      category: 'Próximo proyecto',
      year: '—',
      description: 'Un espacio reservado para la siguiente obra. Pronto tendrá nombre, imágenes y una historia propia.',
      detail: 'Añade aquí el propósito del proyecto, tu participación y aquello que aprendiste al construirlo.',
      tools: '',
      status: 'Por añadir',
      url: '',
    },
    {
      number: '03',
      title: 'El siguiente capítulo',
      category: 'Próximo proyecto',
      year: '—',
      description: 'El cuaderno sigue abierto. Esta página espera una nueva idea que merezca ser compartida.',
      detail: 'Este espacio está preparado para presentar otro proyecto, sus decisiones y su resultado.',
      tools: '',
      status: 'Por añadir',
      url: '',
    },
  ],
  interests: [
    { numeral: 'I', title: 'La forma', label: 'Diseño de interfaces', description: 'Jerarquía, composición y tipografía al servicio de una experiencia clara y con carácter.' },
    { numeral: 'II', title: 'La materia', label: 'Exploración tridimensional', description: 'Luz, textura y movimiento para dar presencia a los objetos que habitan la pantalla.' },
    { numeral: 'III', title: 'El mecanismo', label: 'Desarrollo web', description: 'Código que convierte una intención visual en una experiencia que puede recorrerse.' },
  ],
  email: '',
  links: [
    // { label: 'GitHub', url: 'https://github.com/tu-usuario' },
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tu-usuario/' },
  ],
};
