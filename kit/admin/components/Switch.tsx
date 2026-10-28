// Interruptor con su texto al lado (un checkbox con role="switch").
import type { ReactNode } from 'react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
  label?: string; // para lectores de pantalla, si el texto visible no alcanza
};

export function Switch({ checked, onChange, children, disabled, label }: Props) {
  return (
    <label className={`switch${disabled ? ' is-disabled' : ''}`}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track" aria-hidden="true" />
      {children}
    </label>
  );
}
