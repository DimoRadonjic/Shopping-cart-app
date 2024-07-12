import { Component, inject, OnDestroy, TemplateRef } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from './toasts-container.component';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'ngbd-toast-global',
  standalone: true,
  imports: [NgbTooltipModule, ToastsContainer],
  templateUrl: './toast-global.component.html',
})
export class NgbdToastGlobal implements OnDestroy {
  toastService = inject(ToastService);

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  showStandard(template: TemplateRef<any>) {
    this.toastService.show({ template, type: 'info' });
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({ template, type: 'success' });
  }

  showDanger(template: TemplateRef<any>) {
    this.toastService.show({ template, type: 'danger' });
  }
}
