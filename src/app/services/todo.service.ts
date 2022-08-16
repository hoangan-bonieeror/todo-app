import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../model/filtering.model';
import { Todo } from '../model/todo.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private static readonly TodoStorageKey = 'todos';

  private todos : Todo[] = new Array<Todo>;
  private filteredTodos : Todo[] = new Array<Todo>;
  private lengthSubject : BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayedTodosSubject : BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([])
  private currentFilter : Filter = Filter.All;

  todo$ : Observable<Todo[]> = this.displayedTodosSubject.asObservable();
  length$ : Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService : LocalStorageService) { }

  fetchFromLocalStorage = () => {
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos.map(todo => <Todo>({...todo}))];
    this.pushDataToFlow();
  } 

  updateToLocalStorage = () => {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    
    this.pushDataToFlow();
  }


  filterTodos = (filterMode : Filter, isFiltering : boolean) => {
    this.currentFilter = filterMode;

    switch(filterMode) {
      case Filter.Active :
        this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;
      case Filter.Completed :
        this.filteredTodos = this.todos.filter(todo => todo.isCompleted)
        break;
      case Filter.All :
        this.filteredTodos = <Todo[]>[...this.todos.map(todo => ({...todo}))];
    }

    isFiltering && this.pushDataToFlow();
  }

  private pushDataToFlow = () => {
    this.displayedTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }
}
