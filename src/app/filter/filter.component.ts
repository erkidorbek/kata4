import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Signal, ViewChild, computed, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {
  readonly disabledColor = '#C6C6C6';
  readonly mainColor = '#e3068c';

  min = input.required<number>()
  max = input.required<number>()
  steps = input<boolean>(false);
  range = input<boolean>(false);

  minValue = signal(1);
  maxValue = signal(100);
  stepValue = computed(() => Math.floor((this.max() - this.min()) / 10));

  @Output() valueChange = new EventEmitter<{ from: number, to: number }>();

  @ViewChild('fromSlider') fromSlider!: ElementRef<HTMLInputElement>;
  @ViewChild('toSlider') toSlider!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      if (!!this.toSlider) {
        this.fillMultiSlider(this.toSlider.nativeElement);
      } else if (!!this.fromSlider) {
        this.fillSingleSlider(this.fromSlider.nativeElement);
      }

      this.valueChange.emit({ from: this.minValue(), to: this.maxValue() ?? this.max() });
    })
  }

  ngOnInit(): void {
    this.minValue.update(() => this.min());
    this.maxValue.update(() => this.max());
  }

  // controlToInput(toSlider: HTMLInputElement, fromInput: HTMLInputElement, toInput: HTMLInputElement, controlSlider: HTMLInputElement) {
  //   const [from, to] = this.getParsed(fromInput, toInput);
  //   this.fillSlider(this.disabledColor, this.mainColor, controlSlider);
  //   this.setToggleAccessible(toInput);
  //   if (from <= to) {
  //     toSlider.value = to.toString();
  //     toInput.value = to.toString();
  //   } else {
  //     toInput.value = from.toString();
  //   }
  // }

  fillMultiSlider(controlSlider: HTMLInputElement) {
    const rangeDistance = computed(() => this.max() - this.min())
    const fromPosition = computed(() => this.minValue() - this.min());
    const toPosition = computed(() => this.maxValue() - this.min());

    controlSlider.style.background = `linear-gradient(
      to right,
      ${this.disabledColor} 0%,
      ${this.disabledColor} ${(fromPosition()) / (rangeDistance()) * 100}%,
      ${this.mainColor} ${((fromPosition()) / (rangeDistance())) * 100}%,
      ${this.mainColor} ${(toPosition()) / (rangeDistance()) * 100}%, 
      ${this.disabledColor} ${(toPosition()) / (rangeDistance()) * 100}%, 
      ${this.disabledColor} 100%)`;
  }

  fillSingleSlider(controlSlider: HTMLInputElement) {
    const rangeDistance = computed(() => this.max() - this.min())
    const fromPosition = computed(() => this.minValue() - this.min());

    controlSlider.style.background = `linear-gradient(
      to right,
      ${this.mainColor} 0%,
      ${this.mainColor} ${((fromPosition()) / (rangeDistance())) * 100}%,
      ${this.disabledColor} ${(fromPosition()) / (rangeDistance()) * 100}%,
      ${this.disabledColor} 100%)`;
  }

  setToggleAccessible(currentTarget: HTMLInputElement) {
    const toSlider = this.toSlider.nativeElement;
    if (Number(currentTarget.value) <= 0) {
      toSlider.style.zIndex = '2';
    } else {
      toSlider.style.zIndex = '0';
    }
  }

  handleMin(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.minValue.update(() => parseInt(value));
  }

  handleMax(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.maxValue.update(() => parseInt(value));
  }
}

