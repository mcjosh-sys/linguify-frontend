import { Staff } from '@/app/models/admin.models';
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  host: {
    class: 'w-[80vw] min-h-[60vh] max-w-lg',
  },
})
export class SettingsComponent {
  @Input() staff!: Staff;
  @Input() isAdmin!: boolean;
  @Input() isCurrentUser!: boolean;

  ngOnInit() {
    console.log(this.staff);
  }
}
