import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { AsyncPipe } from '@angular/common';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, FilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kata4';
  minFilter = signal(this.productService.minPrice);
  products = computed(() => {
    return this.productService.filterProducts(this.minFilter())
  });

  min = this.productService.minPrice;
  max = this.productService.maxPrice;

  constructor(public productService: ProductService) { }

  minFilterUpdate(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.minFilter.set(parseInt(value));
  }
}
