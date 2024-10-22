import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  template: ` <span class="loader w-12 h-12 relative inline-block border-[5px] border-sky-500 rounded-full after:w-12 after:h-12 after:border-[5px] after:border-sky-500 after:absolute after:rounded-full after:left-[50%] after:top-[50%] after:-translate-x-[50%] after:-translate-y-[50%] after:content-['']"></span> `,
  styleUrl: './loader.component.css',
  host: {
    'class': 'w-full h-full flex items-center justify-center'
  }
})
export class LoaderComponent {}
