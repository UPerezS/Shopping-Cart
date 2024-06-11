import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  products: any[] = [];
  selectedProducts: any[] = [];
  productsDialog: boolean = false;
  submitted: boolean = false;
  productForm: FormGroup; // Formulario reactivo

  constructor(private router: Router, private messageService: MessageService, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    if (this.products.length === 0) {
      this.loadProducts();
    }

    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  loadProducts() {
    this.http.get<any[]>('http://localhost:3000/products').subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products', life: 3000 });
      }
    );
  }

  openNew() {
    this.productForm.reset();
    this.submitted = false;
    this.productsDialog = true;
  }

  hideDialog() {
    this.productsDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
  
    if (this.productForm.valid) {
      const product = this.productForm.value;
  
      if (product.id) {
        // Actualizar el producto existente
        const index = this.findIndexById(product.id);
        if (index !== -1) {
          this.products[index] = product;
          this.http.put(`http://localhost:3000/products/${product.id}`, product).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
              this.productsDialog = false;
            },
            error: (err) => {
              console.error('Error updating product:', err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product update failed', life: 3000 });
            }
          });
        }
      } else {
        // Crear un nuevo producto
        product.id = this.createId();
        product.image = 'product-placeholder.svg';
  
        this.http.post('http://localhost:3000/products', product).subscribe({
          next: () => {
            this.products.push(product);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            this.products = [...this.products];
            this.productsDialog = false;
          },
          error: (err) => {
            console.error('Error creating product:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product creation failed', life: 3000 });
          }
        });
      }
    }
  }
  

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    return Math.floor(Math.random() * 1000);
  }

  deleteSelectedProducts() {
    this.products = this.products.filter(product => !this.selectedProducts.includes(product));
    this.selectedProducts = [];
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Selected products deleted' });
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return '';
    }
  }

  editProduct(product: any) {
    this.productForm.patchValue(product);
    this.productsDialog = true;
  }

  deleteProduct(product: any) {
    this.products = this.products.filter(p => p.id !== product.id);
    this.messageService.add({ severity: 'success', summary: 'Product Deleted', detail: `Product ${product.name} deleted` });
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
