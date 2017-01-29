import { Component, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Observable } from 'rxjs/Rx';
const TIME = 5000;
@Component({
  selector: 'app-numeric-keypad',
  templateUrl: './numeric-keypad.component.html',
  styleUrls: ['./numeric-keypad.component.css']
})
export class NumericKeypadComponent implements OnInit {

  @Input() maxInput: number = 0;
  @Input() showInput: boolean = true;
  @Input() addLeadingZeros = false;
  @Input() keyboardLabel: string = '';
  @Input() keyboardInput: string = '';
  @Output() sendInput = new EventEmitter();
  numberSbj = new Subject();

  number$ = this.numberSbj.map(e => String(e))
    .scan((a, b) => (a.length === this.maxInput) ? b : a + b)
    .distinctUntilChanged();
  progress$: Observable<string>;
  progress: string;
  progressWithLeadingZeros: string;
  progressSub: Subscription;

  constructor() { }

  ngOnChanges() {
    if (this.keyboardInput.length > 0) {
      this.addInput(this.keyboardInput);
    }
  }

  ngOnInit() {
    this.init();
    if (this.keyboardInput.length > 0) {
      this.keyboardInput = this.padLeadingZeros(this.keyboardInput, this.maxInput);
      this.addInput(this.keyboardInput);
    }
  }

  ngOnDestroy() {
    this.progressSub.unsubscribe();
  }

  init() {
    this.progress$ = this.number$.takeUntil(Observable.timer(TIME)).repeat();
    this.progressSub = this.progress$.subscribe(x => {
      this.progress = x;
      if (this.addLeadingZeros) {
        this.progressWithLeadingZeros = this.padLeadingZeros(this.progress, this.maxInput);
      }
      this.sendInput.emit(this.progress);
    });
  }

  reset() {
    this.progressSub.unsubscribe();
    this.progress$ = Observable.empty();
    this.init();
  }

  resetInput() {
    this.progress = '';
    if (this.addLeadingZeros) {
      this.progressWithLeadingZeros = this.padLeadingZeros(this.progress, this.maxInput);
    }
    this.reset();
    this.sendInput.emit('');
  }

  correctInput() {
    this.reset();
    setTimeout(() => {
      this.addInput(this.progress.substring(0, this.progress.length - 1));
    }, 1);
  }

  addInput(input = '') {
    const str = input.split('');
    if (str.length > 0) {
      str.forEach(x => this.numberSbj.next(x));
    } else {
      this.numberSbj.next('');
    }
    if (this.addLeadingZeros) {
      this.progressWithLeadingZeros = this.padLeadingZeros(input, this.maxInput);
    }
    this.sendInput.emit(input);
  }

  padLeadingZeros(str: string, targetLength: number): string {
    return ('00000' + str).slice(-targetLength);
  }

}
