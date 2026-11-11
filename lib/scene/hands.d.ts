import type { Group } from 'three';

export interface Hands {
  group: Group;
  setReach(amount: number): void;
  setOpen(amount: number): void;
  update(time: number): void;
  dispose(): void;
}

export function createHands(): Hands;
