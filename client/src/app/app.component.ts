import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
  lmenus: MenuItem[] = [];
  ngOnInit() {
    this.lmenus = [{
      label:"Home", routerLink: ['/document']
    }]
  }
}
