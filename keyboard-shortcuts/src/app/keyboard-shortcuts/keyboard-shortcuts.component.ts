import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { KeyboardShortcutsService } from './keyboard-shortcuts.service';
@Component({
  selector: 'app-keyboard-shortcuts',
  templateUrl: './keyboard-shortcuts.component.html',
  styleUrls: ['./keyboard-shortcuts.component.css']
})
export class KeyboardShortcutsComponent implements OnInit {
  sequenceSbj: ReplaySubject<any>;
  $shortcutSequences: Observable<any>;
  $validShortcuts: Observable<any>;
  $invalidShortcuts: Observable<any>;
  $shortCutPrompts: Observable<any>;
  validShortcutsList = [];
  invalidShortcutsList = [];
  constructor(private kbShortcuts: KeyboardShortcutsService) {
    this.sequenceSbj = new ReplaySubject();
    this.sequenceSbj.next('Ctrl+Alt+D');
    this.sequenceSbj.next('Ctrl+Alt+S');
    this.sequenceSbj.next('Trash');

    this.$shortcutSequences = this.sequenceSbj
      .map(text => {
        return {
          id: (text as string).replace(/\+/g, '_'),
          text: text
        };
      });

    this.$shortcutSequences
      .subscribe(value => {
        console.log(`value`, value);
      });

    this.$validShortcuts = this.$shortcutSequences.filter(seq => kbShortcuts.validate(seq.text));
    this.$invalidShortcuts = this.$shortcutSequences.filter(seq => !kbShortcuts.validate(seq.text));
    this.$shortCutPrompts = this.$validShortcuts
      .flatMap(obj => {
        return kbShortcuts.createShortcutStream(obj.text)
          .scan((acc, x, seed) => acc + 1, 0)
          .map(count => {
            return {
              id: obj.id,
              count: count
            };
          });
      }
      );

    this.$validShortcuts.subscribe(obj => this.validShortcutsList.push(obj));
    this.$invalidShortcuts.subscribe(obj => this.invalidShortcutsList.push(obj));
    this.$shortCutPrompts.subscribe(obj => {
      let r = this.validShortcutsList.filter(_obj => _obj.id == obj.id);
      if (r[0]) {
        r[0].count = obj.count;
      }
    });

  }
  ngOnInit() {
  }
}
