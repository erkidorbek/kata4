import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements AfterViewInit {
  @Input({ required: true }) min = 1;
  @Input({ required: true }) max = 100;
  @Input({ required: true }) start = 1;

  @Output() valueChange = new EventEmitter<{ from: number, to: number }>();


  constructor() { }

  @ViewChild('fromSlider') fromSlider!: ElementRef<HTMLInputElement>;
  @ViewChild('toSlider') toSlider!: ElementRef<HTMLInputElement>;
  @ViewChild('fromInput') fromInput!: ElementRef<HTMLInputElement>;
  @ViewChild('toInput') toInput!: ElementRef<HTMLInputElement>;

  readonly disabledColor = '#C6C6C6';
  readonly mainColor = '#e3068c';

  ngAfterViewInit() {
    this.fillSlider(this.fromSlider.nativeElement, this.toSlider.nativeElement, this.disabledColor, this.mainColor, this.toSlider.nativeElement);
    this.setToggleAccessible(this.toSlider.nativeElement);
  }

  handleFromSlider() {
    this.controlFromSlider(this.fromSlider.nativeElement, this.toSlider.nativeElement, this.fromInput.nativeElement);
  }

  handleToSlider() {
    this.controlToSlider(this.fromSlider.nativeElement, this.toSlider.nativeElement, this.toInput.nativeElement);
  }

  handleFromInput() {
    this.controlFromInput(this.fromSlider.nativeElement, this.fromInput.nativeElement, this.toInput.nativeElement, this.toSlider.nativeElement);
  }

  handleToInput() {
    this.controlToInput(this.toSlider.nativeElement, this.fromInput.nativeElement, this.toInput.nativeElement, this.toSlider.nativeElement);
  }

  controlFromInput(fromSlider: HTMLInputElement, fromInput: HTMLInputElement, toInput: HTMLInputElement, controlSlider: HTMLInputElement) {
    const [from, to] = this.getParsed(fromInput, toInput);
    this.fillSlider(fromInput, toInput, this.disabledColor, this.mainColor, controlSlider);
    if (from > to) {
      fromSlider.value = to.toString();
      fromInput.value = to.toString();
    } else {
      fromSlider.value = from.toString();
    }
  }

  controlToInput(toSlider: HTMLInputElement, fromInput: HTMLInputElement, toInput: HTMLInputElement, controlSlider: HTMLInputElement) {
    const [from, to] = this.getParsed(fromInput, toInput);
    this.fillSlider(fromInput, toInput, this.disabledColor, this.mainColor, controlSlider);
    this.setToggleAccessible(toInput);
    if (from <= to) {
      toSlider.value = to.toString();
      toInput.value = to.toString();
    } else {
      toInput.value = from.toString();
    }
  }

  controlFromSlider(fromSlider: HTMLInputElement, toSlider: HTMLInputElement, fromInput: HTMLInputElement) {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    this.fillSlider(fromSlider, toSlider, this.disabledColor, this.mainColor, toSlider);
    if (from > to) {
      fromSlider.value = to.toString();
      fromInput.value = to.toString();
    } else {
      fromInput.value = from.toString();
    }
  }

  controlToSlider(fromSlider: HTMLInputElement, toSlider: HTMLInputElement, toInput: HTMLInputElement) {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    this.fillSlider(fromSlider, toSlider, this.disabledColor, this.mainColor, toSlider);
    this.setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = to.toString();
      toInput.value = to.toString();
    } else {
      toInput.value = from.toString();
      toSlider.value = from.toString();
    }
  }

  getParsed(currentFrom: HTMLInputElement, currentTo: HTMLInputElement): number[] {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }

  fillSlider(from: HTMLInputElement, to: HTMLInputElement, sliderColor: string, rangeColor: string, controlSlider: HTMLInputElement) {
    const rangeDistance = parseInt(to.max, 10) - parseInt(to.min, 10);
    const fromPosition = parseInt(from.value, 10) - parseInt(to.min, 10);
    const toPosition = parseInt(to.value, 10) - parseInt(to.min, 10);
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
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

  // valueChange() {
  //   this.valueChange.emit({
  //     from: parseInt(this.fromInput.nativeElement.value, 10),
  //     to: parseInt(this.toInput.nativeElement.value, 10)
  //   });
  // }
}

