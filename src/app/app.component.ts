import { Component } from '@angular/core';
import { icons } from 'src/app/environments/icons';

const user_icon = icons.user_icon;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user_icon: string = user_icon;

  public activeSection: string = 'inventario';
  public products: number = 0;

  // Función para cambiar la sección visible
  changeSection(section: string) {
    this.activeSection = section;
  }

  // Función para agregar clases condicionales a los elementos según la sección activa
  sectionClass(section: string): { 'active-section': boolean } {
    return { 'active-section': this.activeSection === section };
  }
}
