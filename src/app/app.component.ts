import { Component, computed, effect, signal } from '@angular/core';
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
  maxFilter = signal(this.productService.maxPrice);
  products = computed(() => this.productService.filterProducts(this.minFilter(), this.maxFilter()));

  min = this.productService.minPrice;
  max = this.productService.maxPrice;

  constructor(public productService: ProductService) {
    effect(() => {
      console.log(this.minFilter(), this.maxFilter());
    })
  }

  updateFilter(from: number, to?: number) {
    this.minFilter.set(from);
    if (!to) {
      this.maxFilter.set(200);
    } else {
      this.maxFilter.set(to);
    }
  }
}
