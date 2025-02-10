import { GenericModalService } from '@/app/services/generic-modal.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  signal,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  BrnDialogContentDirective,
  BrnDialogState,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
  ],
  template: `
    <hlm-dialog [state]="state()" (closed)="close()">
      <hlm-dialog-content
        *brnDialogContent="let ctx"
        class="!max-w-xl text-primary"
      >
        <hlm-dialog-header class="mb-4">
          <h3 hlmDialogTitle class="text-xl font-bold">
            {{ title() }}
          </h3>
          <p hlmDialogDescription class="text-base">
            {{ description() }}
          </p>
        </hlm-dialog-header>
        <ng-container #modalContent></ng-container>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class GenericModalComponent {
  @ViewChild('modalContent', { read: ViewContainerRef })
  contentContainer!: ViewContainerRef;
  @ViewChild('span')
  some!: ElementRef;

  title = signal<string>('');
  description = signal<string>('');
  state = signal<BrnDialogState>('open');

  constructor(
    private genericModalService: GenericModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    this.genericModalService.genericModalState$.subscribe((modalState) => {
      this.state.set(modalState.state);
      this.title.set(modalState.title);
      this.description.set(modalState.description);

      this.cdr.detectChanges();

      if (this.state() === 'open' && modalState.component) {
        this.setContent(modalState.component, modalState.props);
      }
    });
  }

  setContent<T>(component: Type<T>, props: { [key: string]: any } | undefined) {
    if (this.contentContainer) {
      this.contentContainer.clear();
      const componentRef = this.contentContainer.createComponent(component);

      if (props) {
        Object.keys(props).forEach((key) => {
          (componentRef.instance as any)[key] = props[key];
        });
      }

      componentRef.changeDetectorRef.detectChanges(); // Ensure the view is updated
    }
  }

  close() {
    this.genericModalService.close();
  }
}
