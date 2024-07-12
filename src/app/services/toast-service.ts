import { Injectable, TemplateRef } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'info';

export interface Toast {
  template: TemplateRef<any>;
  type: ToastType;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  getClassname(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-success text-light';
      case 'danger':
        return 'bg-danger text-light';
      case 'info':
      default:
        return 'bg-info text-light';
    }
  }

  getDelay(toast: Toast): number {
    if (toast.delay !== undefined) {
      return toast.delay;
    }

    switch (toast.type) {
      case 'success':
        return 10000;
      case 'danger':
        return 15000;
      case 'info':
      default:
        return 5000;
    }
  }
}
