'use client';

import { useState, type FormEvent } from 'react';
import { profile } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';

export type ContactState = { kind: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

/**
 * Lógica del formulario de contacto, compartida por el libro y por la app del móvil.
 * Envía con Formspree si hay ID; si no, abre el correo del visitante con el mensaje listo.
 */
export function useContactForm() {
  const [state, setState] = useState<ContactState>({ kind: 'idle' });
  const { ui } = useLanguage();
  const f = ui.form;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('nombre') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('mensaje') ?? '').trim();
    if (!name || !email || !message) {
      setState({ kind: 'error', message: f.missing });
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
        setState({ kind: 'sent', message: f.sent(name) });
      } catch {
        setState({ kind: 'error', message: f.failed });
      }
      return;
    }

    if (profile.email) {
      const subject = encodeURIComponent(f.subject(name));
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      form.reset();
      setState({ kind: 'sent', message: f.mailOpened(name) });
      return;
    }

    setState({ kind: 'error', message: f.notConnected });
  }

  return { state, handleSubmit };
}
