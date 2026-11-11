import { createAmbience, type Ambience } from './audio.js';

let instance: Ambience | null = null;

/** Un único mezclador de audio compartido por la escena y el botón de sonido del menú. */
export function getAmbience(): Ambience {
  instance ??= createAmbience();
  return instance;
}
