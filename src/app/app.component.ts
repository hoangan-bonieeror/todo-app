import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'space-todo';
  hasTodo$ : Observable<boolean> = new Observable<boolean>();

  constructor (private todoService : TodoService) {}

  ngOnInit(): void {
      this.todoService.fetchFromLocalStorage();
      this.hasTodo$ = this.todoService.length$.pipe(map(length => length > 0))
  }
}
