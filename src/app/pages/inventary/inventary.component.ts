import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { icons } from 'src/app/environments/icons';

const edit_icon = icons.edit_icon;
const delete_icon = icons.delete_icon;

@Component({
  selector: 'app-inventary',
  templateUrl: './inventary.component.html',
  styleUrls: ['./inventary.component.scss']
})
export class InventaryComponent implements OnInit {

  edit_icon: string = edit_icon;
  delete_icon: string = delete_icon;


  // Filtro
  inventario: any[] = [];
  filteredInventary: any[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  searchTerm: string = '';

  get paginatedInventary(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredInventary.slice(startIndex, endIndex);
  }

  get lastPage(): number {
    return Math.ceil(this.filteredInventary.length / this.pageSize);
  }

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.getInventario();
  }

  // Crud
  getInventario() {
    this.crudService.getInventario().subscribe(
      response => {
        if (response.message === 'Success') {
          this.inventario = response.movimientos;
          this.updateFilteredInventary();
        } else {
          console.error('Error:', response.message);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  deleteInventario(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.crudService.deleteInventario(id).subscribe(
        response => {
          console.log('Registro eliminado con éxito:', response);
          this.getInventario();
        },
        error => {
          console.error('Error al eliminar el registro:', error);
        }
      );
    }
  }


  // Filtro
  updateFilteredInventary() {
    this.filteredInventary = this.inventario.filter(inventary => {
      const productoMatches = inventary.producto_nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const cantidadMatches = inventary.cantidad.toString().includes(this.searchTerm);
      const fechadMatches = inventary.fecha_movimiento.toLowerCase().includes(this.searchTerm.toLowerCase());
      const tipoMatches = inventary.tipo_movimiento.toLowerCase().includes(this.searchTerm.toLowerCase());

      return productoMatches || cantidadMatches || fechadMatches || tipoMatches;
    });
  }

  nextPage() {
    const lastPage = Math.ceil(this.filteredInventary.length / this.pageSize);
    if (this.currentPage < lastPage) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}
