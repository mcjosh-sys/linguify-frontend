import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm'

@Component({
  selector: 'app-promo',
  standalone: true,
  imports: [HlmButtonDirective, RouterLink],
  template: `
    <div class="space-y-2">
      <div class="flex items-center gap-x-2">
        <img src="/images/unlimited.svg" alt="Pro" height="26" width="26" />
        <h3 class="font-bold text-lg">Upgrade to pro</h3>
      </div>
      <p class="text-muted-foreground">Get unlimited hearts and more!</p>
    </div>
    <a hlmBtn variant="super" class="w-full" size="lg" routerLink="/shop"
      >Upgrade today</a
    >
  `,
  host: {
    class: 'border-2 rounded-xl p-4 space-y-4',
  },
})
export class PromoComponent {}
