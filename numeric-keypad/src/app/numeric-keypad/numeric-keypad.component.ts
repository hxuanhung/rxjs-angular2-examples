import { Component, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Observable } from 'rxjs/Rx';
/**
 * TIMES*1000 = number of seconds to wait between two consecutive inputs
 */
const TIMES = 5;
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
  number$: Observable<string>;
  numberSubscription: Subscription;
  progress: string;
  flagCounter$: Observable<any>;
  flagSubscription: Subscription;
  flag = false;
  progressWithLeadingZeros: string;

  constructor() { }

  ngOnChanges() {
    if (this.numberSubscription) {
      this.resetNumberStream();
    }
    if (this.keyboardInput.length > 0) {
      this.addInput(this.keyboardInput);
    }
  }

  ngOnInit() {
    this.initNumberStream();

    this.flagCounter$ = this.number$.switchMap(x => Observable.interval(1000));
    this.flagSubscription = this.flagCounter$.subscribe(count => {
      count >= TIMES ? this.flag = true : this.flag = false;
    });

    if (this.keyboardInput.length > 0) {
      /**
       * Pad leading zeros if a default keyboard input is provided to reset once on the very first click
       */
      this.keyboardInput = this.padLeadingZeros(this.keyboardInput, this.maxInput);
      this.addInput(this.keyboardInput);
    }
  }

  ngOnDestroy() {
    if (this.flagSubscription) {
      this.flagSubscription.unsubscribe();
    }
    if (this.numberSubscription) {
      this.numberSubscription.unsubscribe();
    }
  }

  initNumberStream() {
    this.number$ = this.numberSbj
      .map(e => String(e))
      .scan((a, b) => (a.length === this.maxInput || this.flag) ? b : a + b)
      .distinctUntilChanged();

    this.numberSubscription = this.number$.subscribe(x => {
      this.progress = x;
      if (this.addLeadingZeros) {
        this.progressWithLeadingZeros = this.padLeadingZeros(this.progress, this.maxInput);
      }
      this.sendInput.emit(this.progress);
    });
  }

  resetNumberStream() {
    if (this.numberSubscription) {
      this.numberSubscription.unsubscribe();
    }
    this.number$ = Observable.empty();
    this.initNumberStream();
  }

  resetInput() {
    this.progress = '';
    this.sendInput.emit(this.progress);
    if (this.addLeadingZeros) {
      this.progressWithLeadingZeros = this.padLeadingZeros('', this.maxInput);
    }
    this.resetNumberStream();
  }

  correctInput() {
    this.resetNumberStream();
    this.addInput(this.progress.substring(0, this.progress.length - 1));
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
