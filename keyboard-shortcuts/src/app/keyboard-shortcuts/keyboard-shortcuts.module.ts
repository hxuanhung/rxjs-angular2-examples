import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardShortcutsComponent } from './keyboard-shortcuts.component';
import { KeyboardShortcutsService } from './keyboard-shortcuts.service';

@NgModule({
  imports: [CommonModule],
  exports: [KeyboardShortcutsComponent],
  declarations: [KeyboardShortcutsComponent],
  providers: [KeyboardShortcutsService],
})
export class KeyboardShortcutsModule { }
