import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
const TIME = 2000;
@Component({
  selector: 'app-remote-control',
  templateUrl: './remote-control.component.html',
  styleUrls: ['./remote-control.component.css']
})
export class RemoteControlComponent implements OnInit {
  @Input() maxInput: number = 0;
  numberSbj = new Subject();

  number$ = this.numberSbj.map(e => String(e))
    .scan((a, b) => (a.length === this.maxInput) ? b : a + b)
    .distinctUntilChanged()
  progress$: Observable<string>;
  progress: string;
  constructor() { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.progress$ = this.number$.takeUntil(Observable.timer(TIME * this.maxInput)).repeat();
    this.progress$.subscribe(x => this.progress = x);
  }

  resetInput() {
    this.progress$ = Observable.empty();
    this.init();
  }

  correctInput() {
    this.resetInput();
    setTimeout(() => {
      let str = this.progress.substring(0, this.progress.length - 1).split('');
      str.forEach(x => this.numberSbj.next(x));
    }, 1);
  }
}
