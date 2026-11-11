'use client';

import { createContext, useContext } from 'react';

export interface ReaderControls {
  /** Cierra el libro y vuelve al paisaje 3D. */
  close(): void;
}

export const ReaderContext = createContext<ReaderControls>({ close: () => {} });

export const useReader = () => useContext(ReaderContext);
