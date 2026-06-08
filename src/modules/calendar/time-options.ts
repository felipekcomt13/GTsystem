// Utilidades de horas para el formulario de reuniones (estilo Google Calendar).

export const DAY_MINUTES = 24 * 60;

const pad = (n: number) => n.toString().padStart(2, "0");

export function minutesToHHMM(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${pad(h)}:${pad(m)}`;
}

export function hhmmToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

// Opciones de hora de inicio: cada 30 min, de 00:00 a 23:30.
export const START_TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) =>
  minutesToHHMM(i * 30),
);

// Asegura que un valor concreto aparezca entre las opciones de inicio
// (p. ej. al editar un evento con una hora fuera de la grilla de 30 min).
export function startOptionsWith(value?: string): string[] {
  if (!value || START_TIME_OPTIONS.includes(value)) return START_TIME_OPTIONS;
  return [...START_TIME_OPTIONS, value].sort((a, b) => hhmmToMinutes(a) - hhmmToMinutes(b));
}

export function durationLabel(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  return `${m} min`;
}

export interface EndTimeOption {
  value: string; // "HH:mm"
  minutes: number; // minutos desde medianoche
  duration: number; // duración respecto al inicio, en minutos
  label: string; // "HH:mm (1 h)"
}

/**
 * Opciones de hora de fin a partir de la hora de inicio.
 * Reglas pedidas (como Google Calendar):
 *   1ª opción → inicio + 30 min
 *   2ª opción → inicio + 45 min
 *   resto     → inicio + 60, 90, 120 … (de 30 en 30)
 */
export function buildEndTimeOptions(startHHMM: string): EndTimeOption[] {
  if (!startHHMM) return [];
  const start = hhmmToMinutes(startHHMM);
  const durations = [30, 45];
  for (let d = 60; start + d < DAY_MINUTES; d += 30) durations.push(d);
  return durations
    .filter((d) => start + d < DAY_MINUTES)
    .map((d) => {
      const minutes = start + d;
      const value = minutesToHHMM(minutes);
      return { value, minutes, duration: d, label: `${value} (${durationLabel(d)})` };
    });
}
