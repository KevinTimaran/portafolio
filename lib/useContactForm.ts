'use client';

import { useState, type FormEvent } from 'react';
import { profile } from '@/data/profile';

export type ContactState = { kind: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

/**
 * Lógica del formulario de contacto, compartida por el libro y por la app del móvil.
 * Envía con Formspree si hay ID; si no, abre el correo del visitante con el mensaje listo.
 */
export function useContactForm() {
  const [state, setState] = useState<ContactState>({ kind: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('nombre') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('mensaje') ?? '').trim();
    if (!name || !email || !message) {
      setState({ kind: 'error', message: 'Completa tu nombre, tu correo y el mensaje.' });
      return;
    }

    if (profile.formspreeId) {
      setState({ kind: 'sending' });
      try {
        const response = await fetch(`https://formspree.io/f/${profile.formspreeId}`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });
        if (!response.ok) throw new Error(String(response.status));
        form.reset();
        setState({ kind: 'sent', message: `¡Gracias, ${name}! Tu mensaje llegó. Te responderé pronto.` });
      } catch {
        setState({ kind: 'error', message: 'No se pudo enviar el mensaje. Inténtalo de nuevo en un momento.' });
      }
      return;
    }

    if (profile.email) {
      const subject = encodeURIComponent(`Mensaje desde el portafolio · ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      form.reset();
      setState({ kind: 'sent', message: `¡Gracias, ${name}! Se abrió tu aplicación de correo con el mensaje listo para enviar.` });
      return;
    }

    setState({ kind: 'error', message: 'El formulario todavía no está conectado (falta el correo o el ID de Formspree en data/profile.ts).' });
  }

  return { state, handleSubmit };
}
