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
  steps = input<boolean>();
  range = input<boolean>(false);

  minValue = signal(1);
  maxValue = signal(100);
  stepValue = computed(() => Math.floor((this.max() - this.min()) / 10));

  @Output() valueChange = new EventEmitter<{ from: number, to?: number }>();

  constructor() {
    effect(() => {
      this.fillSlider(this.disabledColor, this.mainColor, this.toSlider.nativeElement);
      this.valueChange.emit({ from: this.minValue(), to: this.maxValue() });
    })
  }

  @ViewChild('fromSlider') fromSlider!: ElementRef<HTMLInputElement>;
  @ViewChild('toSlider') toSlider!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.minValue.update(() => this.min());
    this.maxValue.update(() => this.max());

    // this.stepValue.update(() => (this.max() - this.min() / this.steps()));
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

  fillSlider(sliderColor: string, rangeColor: string, controlSlider: HTMLInputElement) {
    const rangeDistance = computed(() => this.max() - this.min())
    const fromPosition = computed(() => this.minValue() - this.min());
    const toPosition = computed(() => this.maxValue() - this.min());

    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition()) / (rangeDistance()) * 100}%,
      ${rangeColor} ${((fromPosition()) / (rangeDistance())) * 100}%,
      ${rangeColor} ${(toPosition()) / (rangeDistance()) * 100}%, 
      ${sliderColor} ${(toPosition()) / (rangeDistance()) * 100}%, 
      ${sliderColor} 100%)`;
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
    // this.valueChange.emit({ from: this.minValue(), to: this.maxValue() });
  }
}

