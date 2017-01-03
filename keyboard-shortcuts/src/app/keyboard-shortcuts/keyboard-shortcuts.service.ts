import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { default as keyCodeMap } from './keyCodeMap';

@Injectable()
export class KeyboardShortcutsService {
  keyDowns: any;
  keyUps: any;
  keyEvents: any;
  constructor() {
    this.keyDowns = Observable.fromEvent(document, 'keydown');

    this.keyUps = Observable.fromEvent(document, 'keyup');

    this.keyEvents = Observable
      .merge(this.keyDowns, this.keyUps)
      .distinctUntilChanged(
      (a: KeyboardEvent, b: KeyboardEvent) => {
        return a.keyCode === b.keyCode && a.type === b.type;
      }
      )
      .share();
  }

  validate = text => {
    let arr = text.split('+');
    for (let i = 0; i < arr.length; i++) {
      if (keyCodeMap[arr[i].toLowerCase()] === undefined) {
        return false;
      }
    }
    return true;
  }

  createKeyPressStream = (charCode) => {
    return {
      char: charCode,
      stream: this.keyEvents
        .filter((event) => event.keyCode === charCode)
        .map(function (e) {
          return e.type;
        })
    };
  }

  createShortcutStream = (text) => {
    return Observable
      .from(text.split('+'))
      .map(c => {
        let code = keyCodeMap[(c as string).toLowerCase()];
        if (code === undefined) {
          throw new Error('Invalid sequence ' + text);
        }
        return code;
      })
      .map(this.createKeyPressStream)
      .map(obj => obj.stream)
      .toArray()
      .flatMap(arr => {
        return Observable.combineLatest(arr);
      })
      .filter(arr => {
        let isDown = true;
        for (let i = 0; i < arr.length; i++) {
          isDown = isDown && (arr[i] === 'keydown');
        }
        return isDown;
      })
      .map(x => text);

  }
}
