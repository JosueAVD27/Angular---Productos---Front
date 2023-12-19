import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { Product } from 'src/app/models/product.model';
import { Category } from 'src/app/models/category.model';
import { ProductCategory } from 'src/app/models/productCategory.model';
import { icons } from 'src/app/environments/icons';

const edit_icon = icons.edit_icon;
const delete_icon = icons.delete_icon;

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  errorMessage: string = '';

  editingProductCategory: any = null;

  // Icons
  edit_icon: string = edit_icon;
  delete_icon: string = delete_icon;

  // Modelo
  newProductCategory: ProductCategory = {
    producto_id: 0,
    categoria_id: 0
  };

  // Filtro
  productsCategory: any[] = [];
  filteredProductsCategories: any[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  searchTerm: string = '';

  products: Product[] = [];
  categories: Category[] = [];

  get paginatedProductsCategories(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProductsCategories.slice(startIndex, endIndex);
  }

  get lastPage(): number {
    return Math.ceil(this.filteredProductsCategories.length / this.pageSize);
  }


  constructor(private crudService: CrudService) { }


  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.getProductsCategories();
  }

  loadProducts() {
    this.crudService.getProducts().subscribe(
      response => {
        if (response.message === 'Success') {
          this.products = response.productos;
        } else {
          console.error('Error:', response.message);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  loadCategories() {
    this.crudService.getCategories().subscribe(
      response => {
        if (response.message === 'Success') {
          this.categories = response.categorias;
        } else {
          console.error('Error:', response.message);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  // Crud
  getProductsCategories() {
    this.crudService.getProductsCategories().subscribe(
      response => {
        if (response.message === 'Success') {
          this.productsCategory = response.productos_categorias;
          this.updateFilteredProductsCategories();
        } else {
          console.error('Error:', response.message);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  addProductCategories() {
    if (!this.newProductCategory.producto_id || !this.newProductCategory.categoria_id) {
      this.errorMessage = 'Por favor, complete todos los campos antes de agregar esta categorización.';
      return;
    }

    this.crudService.addProductsCategories(this.newProductCategory).subscribe(
      response => {
        this.errorMessage = '';

        console.log('Categorización agregado con éxito:', response);

        this.newProductCategory = {
          producto_id: 0,
          categoria_id: 0
        };
        this.getProductsCategories();
      },
      error => {
        this.errorMessage = 'Error al agregar la categorización: ' + error.message;
        console.error(this.errorMessage);
      }
    );
  }

  updateProductCategories(productCategory: any) {
    this.newProductCategory = {
      producto_id: productCategory.producto_id,
      categoria_id: productCategory.categoria_id
    };

    // Establece el producto actualmente editado
    this.editingProductCategory = productCategory;

    // Restablece el mensaje de error antes de realizar la actualización
    this.errorMessage = '';
  }

  deleteProductCategories(productoId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categorización?')) {
      this.crudService.deleteProductsCategories(productoId).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);

          // Verifica si la respuesta indica éxito o si es el mensaje "not found"
          if (response.message === 'Success' || response.message === 'ProductosCategorias not found...') {
            console.log('Categoría eliminada con éxito');
            this.resetForm();
            this.getProductsCategories();
          } else {
            console.error('Error al eliminar categorización:', response.message);
          }
        },
        error => {
          console.error('Error al eliminar categorización:', error);
        }
      );
    }
  }


  addOrUpdateProductCategory() {
    if (!this.newProductCategory.producto_id || !this.newProductCategory.categoria_id) {
      this.errorMessage = 'Por favor, complete todos los campos antes de agregar o actualizar la categorización.';
      return;
    }

    if (this.editingProductCategory) {
      // Si se está editando, llama a la función de actualización
      this.crudService.updateProductsCategories(this.editingProductCategory.id, this.newProductCategory).subscribe(
        response => {
          if (response.message === 'Success') {
            this.errorMessage = '';
            console.log('Categorización actualizada con éxito:', response);
            this.resetForm();
            this.getProductsCategories();
          } else {
            this.errorMessage = 'Error al actualizar la categorización: ' + response.message;
            console.error('Error:', response.message);
          }
        },
        error => {
          this.errorMessage = 'Error al actualizar la categorización: ' + error.message;
          console.error('Error:', error);
        }
      );
    } else {
      // Si no se está editando, llama a la función de adición
      this.crudService.addProductsCategories(this.newProductCategory).subscribe(
        response => {
          this.errorMessage = '';
          console.log('Categorización agregada con éxito:', response);
          this.resetForm();
          this.getProductsCategories();
        },
        error => {
          this.errorMessage = 'Error al agregar la categorización: ' + error.message;
          console.error(this.errorMessage);
        }
      );
    }
  }


  // Función para restablecer el formulario y los indicadores de edición
  resetForm() {
    this.newProductCategory = { producto_id: 0, categoria_id: 0 };
    this.editingProductCategory = null;
    this.errorMessage = '';
  }



  // Filtro
  updateFilteredProductsCategories() {
    this.filteredProductsCategories = this.productsCategory.filter(productCategory => {
      const productoMatches = productCategory.producto_nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const categoriaMatches = productCategory.categoria_nombre.toLowerCase().includes(this.searchTerm.toLowerCase());

      return productoMatches || categoriaMatches;
    });
  }

  nextPage() {
    const lastPage = Math.ceil(this.filteredProductsCategories.length / this.pageSize);
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
