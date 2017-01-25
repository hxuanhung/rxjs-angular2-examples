import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'app-remote-control',
  templateUrl: './remote-control.component.html',
  styleUrls: ['./remote-control.component.css']
})
export class RemoteControlComponent implements OnInit {
  inputChange = new Subject();
  @Output() search = new EventEmitter();
  numberSbj = new Subject();

  number$ = this.numberSbj.map(e => String(e))
    .scan((a, b) => {
      console.log(`ab`, a, b, a + b, (a.length === 2) ? a : a + b);
      return (a.length === 2) ? a : a + b;
    })
    .distinctUntilChanged()
  /*completed = this.numberSbj.switchMap(live => {
    console.log(`Switchmap`, live);
    return Observable.timer(2000, 100).switchMap(e => {
      console.log(`timer`, e);
      return Observable.of(live);
    });
  })*/
  // progress = this.numberSbj.takeUntil(this.completed).repeat();
  progress$: Observable<any>;

  private searchBox;
  constructor() { }

  ngOnInit() {
    /*this.completed.subscribe(e => {
      console.log(`completed`, e);
    })*/
    this.init();
    this.progress$.subscribe(function (x) {
      console.log('Next: %s', x);
    },
      function (err) {
        console.log('Error: %s', err);
      },
      function () {
        console.log('Completed');
      })
    /*this.progress.subscribe(e => {
      console.log(`progress`, e);
    })*/
    // this.inputChange.subscribe(e => console.log(e));
    // this.numberSbj.subscribe(key => console.log(key));
  }
  onChange(e) {
    console.log(`onChange`, e);
    this.inputChange.next(e);
  }

  init() {
    this.progress$ = this.number$.takeUntil(Observable.timer(2000)).repeat();
  }

  resetInput() {
    /*this.numberSbj.next(0);
    this.numberSbj.next(0);*/
    this.progress$ = Observable.empty();
    this.init();
  }
}
