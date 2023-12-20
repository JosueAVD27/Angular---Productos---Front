import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { Category } from 'src/app/models/category.model';
import { icons } from 'src/app/environments/icons';

const edit_icon = icons.edit_icon;
const delete_icon = icons.delete_icon;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  errorMessage: string = '';

  editingCategories: any = null;

  // Icons
  edit_icon: string = edit_icon;
  delete_icon: string = delete_icon;

  // Modelo
  newCategory: Category = {
    nombre: ''
  };

  // Filtro
  categories: any[] = [];
  filteredCategories: any[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  searchTerm: string = '';

  get paginatedCategories(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredCategories.slice(startIndex, endIndex);
  }

  get lastPage(): number {
    return Math.ceil(this.filteredCategories.length / this.pageSize);
  }


  constructor(private crudService: CrudService) { }


  ngOnInit(): void {
    this.getCategories();
  }

  // Crud
  getCategories() {
    this.crudService.getCategories().subscribe(
      response => {
        if (response.message === 'Success') {
          this.categories = response.categorias;
          this.updatefilteredCategories();
        } else {
          console.error('Error:', response.message);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  addCategories() {
    if (!this.newCategory.nombre) {
      this.errorMessage = 'Por favor, complete todos los campos antes de agregar la categoria.';
      return;
    }

    this.crudService.addCategories(this.newCategory).subscribe(
      response => {
        this.errorMessage = '';

        this.newCategory = {
          nombre: ''
        };
        this.getCategories();
      },
      error => {
        this.errorMessage = 'Error al agregar la categoria: ' + error.message;
        console.error(this.errorMessage);
      }
    );
  }

  updateCategories(category: any) {
    this.newCategory = {
      nombre: category.nombre
    };

    // Establece la categoria actualmente editada
    this.editingCategories = category;
  }

  deleteCategories(categoryId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoria?')) {
      this.crudService.deleteCategories(categoryId).subscribe(
        response => {
          console.log('Categoria eliminada con éxito:', response);
          this.resetForm(); // Restablece el formulario después de eliminar
          this.getCategories();
        },
        error => {
          console.error('Error al eliminar la categoria:', error);
        }
      );
    }
  }

  addOrupdateCategories() {
    if (!this.newCategory.nombre) {
      this.errorMessage = 'Por favor, complete todos los campos antes de agregar o actualizar la categoria.';
      return;
    }

    if (this.editingCategories) {
      // Si se está editando, llama a la función de actualización
      this.crudService.updateCategories(this.editingCategories.id, this.newCategory).subscribe(
        response => {
          this.errorMessage = '';
          console.log('Categoria actualizada con éxito:', response);
          this.resetForm();
          this.getCategories();
        },
        error => {
          this.errorMessage = 'Error al actualizar la categoria: ' + error.message;
          console.error(this.errorMessage);
        }
      );
    } else {
      // Si no se está editando, llama a la función de adición
      this.crudService.addCategories(this.newCategory).subscribe(
        response => {
          this.errorMessage = '';
          console.log('Categoria agregada con éxito:', response);
          this.resetForm();
          this.getCategories();
        },
        error => {
          this.errorMessage = 'Error al agregar la categoria: ' + error.message;
          console.error(this.errorMessage);
        }
      );
    }
  }


  // Función para restablecer el formulario y los indicadores de edición
  resetForm() {
    this.newCategory = { nombre: '' };
    this.editingCategories = null;
    this.errorMessage = '';
  }



  // Filtro
  updatefilteredCategories() {
    this.filteredCategories = this.categories.filter(category => {
      const nombreMatches = category.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());

      return nombreMatches;
    });
  }

  nextPage() {
    const lastPage = Math.ceil(this.filteredCategories.length / this.pageSize);
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
