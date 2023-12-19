import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { Product } from 'src/app/models/product.model';
import { icons } from 'src/app/environments/icons';

const edit_icon = icons.edit_icon;
const delete_icon = icons.delete_icon;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  errorMessage: string = '';

  editingProduct: any = null;

  // Icons
  edit_icon: string = edit_icon;
  delete_icon: string = delete_icon;

  // Modelo
  newProduct: Product = {
    nombre: '',
    precio: 0,
    stock: 0
  };

  // Filtro
  products: any[] = [];
  filteredProducts: any[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  searchTerm: string = '';

  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  get lastPage(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }


  constructor(private crudService: CrudService) { }


  ngOnInit(): void {
    this.getProducts();
  }

  // Crud
  getProducts() {
    this.crudService.getProducts().subscribe(
      response => {
        if (response.message === 'Success') {
          this.products = response.productos;
          this.updateFilteredProducts();
        } else {
          console.error('Error:', response.message);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  addProduct() {
    if (!this.newProduct.nombre || !this.newProduct.precio) {
      this.errorMessage = 'Por favor, complete todos los campos antes de agregar el producto.';
      return;
    }

    this.crudService.addProduct(this.newProduct).subscribe(
      response => {
        this.errorMessage = '';

        console.log('Producto agregado con éxito:', response);

        this.newProduct = {
          nombre: '',
          precio: 0,
          stock: 0
        };
        this.getProducts();
      },
      error => {
        this.errorMessage = 'Error al agregar producto: ' + error.message;
        console.error(this.errorMessage);
      }
    );
  }

  updateProduct(product: any) {
    this.newProduct = {
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock
    };

    // Establece el producto actualmente editado
    this.editingProduct = product;
  }

  deleteProduct(productId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.crudService.deleteProduct(productId).subscribe(
        response => {
          console.log('Producto eliminado con éxito:', response);
          this.resetForm(); // Restablece el formulario después de eliminar
          this.getProducts();
        },
        error => {
          console.error('Error al eliminar producto:', error);
        }
      );
    }
  }

  addOrUpdateProduct() {
    if (!this.newProduct.nombre || !this.newProduct.precio) {
      this.errorMessage = 'Por favor, complete todos los campos antes de agregar o actualizar el producto.';
      return;
    }

    if (this.editingProduct) {
      // Si se está editando, llama a la función de actualización
      this.crudService.updateProduct(this.editingProduct.id, this.newProduct).subscribe(
        response => {
          this.errorMessage = '';
          console.log('Producto actualizado con éxito:', response);
          this.resetForm();
          this.getProducts();
        },
        error => {
          this.errorMessage = 'Error al actualizar el producto: ' + error.message;
          console.error(this.errorMessage);
        }
      );
    } else {
      // Si no se está editando, llama a la función de adición
      this.crudService.addProduct(this.newProduct).subscribe(
        response => {
          this.errorMessage = '';
          console.log('Producto agregado con éxito:', response);
          this.resetForm();
          this.getProducts();
        },
        error => {
          this.errorMessage = 'Error al agregar el producto: ' + error.message;
          console.error(this.errorMessage);
        }
      );
    }
  }


  // Función para restablecer el formulario y los indicadores de edición
  resetForm() {
    this.newProduct = { nombre: '', precio: 0, stock: 0 };
    this.editingProduct = null;
    this.errorMessage = '';
  }



  // Filtro
  updateFilteredProducts() {
    this.filteredProducts = this.products.filter(product => {
      const nombreMatches = product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const precioMatches = product.precio.toString().includes(this.searchTerm);
      const cantidadMatches = product.stock.toString().includes(this.searchTerm);

      return nombreMatches || precioMatches || cantidadMatches;
    });
  }

  nextPage() {
    const lastPage = Math.ceil(this.filteredProducts.length / this.pageSize);
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
