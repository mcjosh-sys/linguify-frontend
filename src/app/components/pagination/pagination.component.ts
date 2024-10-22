import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'class-variance-authority/types';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule, HlmIconComponent],
  providers: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronsLeft,
      lucideChevronRight,
      lucideChevronsRight,
    }),
  ],
  templateUrl: './pagination.component.html',
  styles: `
    .page-item{
    @apply flex items-center justify-center p-3 cursor-pointer;
    width: 40px;
    height: 40px;
}

.page-item.disabled{
    @apply pointer-events-none text-muted-foreground
}
  `,
})
export class PaginationComponent {
  @Input() totalItems!: number;
  @Input() pageSize!: number;
  @Input() currentPage: number = 1;
  @Input() maxVisiblePages: number = 5; // Maximum visible page links
  @Input() firstLabel?: string;
  @Input() lastLabel?: string;
  @Input() previousLabel?: string;
  @Input() nextLabel?: string;
  @Input() showPageJump: boolean = false; // Enable/disable page jump input
  className!: ClassValue;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() currentPageChange = new EventEmitter<number>();

  totalPages: number = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  jumpToPage: number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['totalItems'] ||
      changes['pageSize'] ||
      changes['currentPage']
    ) {
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.generatePages();
    }
  }

  generatePages(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();
  }

  updateVisiblePages(): void {
    const halfRange = Math.floor(this.maxVisiblePages / 2);
    let startPage = Math.max(this.currentPage - halfRange, 1);
    let endPage = Math.min(
      startPage + this.maxVisiblePages - 1,
      this.totalPages
    );

    if (endPage - startPage < this.maxVisiblePages - 1) {
      startPage = Math.max(endPage - this.maxVisiblePages + 1, 1);
    }

    this.visiblePages = this.pages.slice(startPage - 1, endPage);
  }

  selectPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage);
      this.updateVisiblePages();
    }
  }

  @Input()
  set class(val: ClassValue) {
    this.className = val;
  }
}
