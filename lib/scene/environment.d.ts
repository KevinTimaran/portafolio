import type { Group, Light, Object3D, Vector3, WebGLRenderer } from 'three';

export interface Props {
  group: Group;
  radio: Object3D;
  phone: Object3D;
  setRadioOn(on: boolean): void;
  radioPoint(): Vector3;
  phonePoint(): Vector3;
}

export interface Environment {
  group: Group;
  fireLight: Light;
  props: Props;
  ready: Promise<unknown>;
  update(time: number, delta: number): void;
  dispose(): void;
}

export function createEnvironment(options: { renderer: WebGLRenderer; quality?: 'low' | 'high'; mapUrl?: string }): Environment;
