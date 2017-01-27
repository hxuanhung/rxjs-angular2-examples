import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  binding = '1';
  doAction = '';
  onChange(input){
    this.doAction = input;
  }
}
