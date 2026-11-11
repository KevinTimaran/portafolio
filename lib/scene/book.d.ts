import type { Group, Object3D, WebGLRenderer } from 'three';

export interface Book {
  group: Group;
  coverPivot: Object3D;
  pageTarget: Object3D;
  update(time: number, delta: number): void;
  setOpen(amount: number): void;
  dispose(): void;
}

export function createBook(options: { renderer: WebGLRenderer }): Promise<Book>;
