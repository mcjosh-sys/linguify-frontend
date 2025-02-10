import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function tw(strings: TemplateStringsArray, ...values: any[]): string {
  return String.raw({ raw: strings }, ...values);
}
