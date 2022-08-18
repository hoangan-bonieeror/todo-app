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

  private todos : Todo[];
  private filteredTodos : Todo[];
  private lengthSubject : BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayedTodosSubject : BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([])
  private currentFilter : Filter = Filter.All;

  todo$ : Observable<Todo[]> = this.displayedTodosSubject.asObservable();
  length$ : Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService : LocalStorageService) { }

  fetchFromLocalStorage = () => {
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos];
    this.pushDataToFlow();
  } 

  updateToLocalStorage = () => {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false)
    this.pushDataToFlow();
  }


  filterTodos = (filterMode : Filter, isFiltering : boolean = true) => {
    this.currentFilter = filterMode;

    switch(filterMode) {
      case Filter.Active :
        this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;
      case Filter.Completed :
        this.filteredTodos = this.todos.filter(todo => todo.isCompleted)
        break;
      case Filter.All :
        this.filteredTodos = [...this.todos];
    }

    if(isFiltering) {
      this.pushDataToFlow()
      console.log('here')
    }
  }

  addTodo = (value : string) => {
    const timestampId = new Date(Date.now()).getTime();
    const newTodo = new Todo(timestampId, value);
    console.log(newTodo.content)
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeStatusTodo(id : number, isCompleted : boolean) {
    let index = this.todos.findIndex(todo => todo.id == id);
    let todoModify = this.todos[index];
    todoModify.isCompleted = isCompleted;
    this.todos.splice(index, 1, todoModify)
    this.updateToLocalStorage();
  }

  editTodo(id : number, content : string) {
    let index = this.todos.findIndex(todo => todo.id == id);
    let todoModify = this.todos[index];
    todoModify.content = content;
    this.todos.splice(index, 1, todoModify)
    this.updateToLocalStorage();
  }

  deleteTodo = (id : number) => {
    let index = this.todos.findIndex(todo => todo.id == id);
    this.todos.splice(index, 1)
    this.updateToLocalStorage();
  }

  toggleAll = () => {
    this.todos = this.todos.map(todo => {
      return <Todo>{
        ...todo,
        isCompleted : !this.todos.every(item => item.isCompleted)
      }
    })
    this.updateToLocalStorage();
  }

  clearCompletedTodo = () => {
    this.todos = this.todos.filter(todo => !todo.isCompleted);
    this.updateToLocalStorage();
  }

  private pushDataToFlow = () => {
    this.displayedTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }
}
