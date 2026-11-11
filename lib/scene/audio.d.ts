export interface Ambience {
  toggle(): Promise<boolean>;
  toggleJazz(): Promise<boolean>;
  isJazz(): boolean;
  isEnabled(): boolean;
  setReading(value: boolean): void;
  grab(): void;
  open(): void;
  page(): void;
  putDown(): void;
  dispose(): void;
}

export function createAmbience(): Ambience;
