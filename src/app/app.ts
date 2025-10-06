import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GlobalLoadingComponent } from './core/components/global-loading/global-loading.component';
import { ToastComponent } from './core/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoadingComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gestion-productos');
}
