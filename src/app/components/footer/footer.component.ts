import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Filter, FilterButton } from 'src/app/model/filtering.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  filterButtons : FilterButton[] = [
    { type : Filter.All, label : 'All', isActive : true },
    { type : Filter.Active, label : 'Active', isActive : false },
    { type : Filter.Completed, label : 'Completed', isActive : false }
  ];

  length : number;
  hasCompletedTodo$ : Observable<boolean>;
  destroy$ : Subject<null> = new Subject<null>();
  constructor(private todoService : TodoService) { }

  ngOnInit(): void {
    this.hasCompletedTodo$ = this.todoService.todo$.pipe(
      map(todos => todos.some(todo => todo.isCompleted)),
      takeUntil(this.destroy$)
    )
    this.todoService.length$.pipe(takeUntil(this.destroy$)).subscribe(todoLength => {
      this.length = todoLength;
    })
  }

  ngOnDestroy(): void {
      this.destroy$.next(null);
      this.destroy$.complete();

  }

  filterTodo = (filterType : Filter) => {
    const filterMode = filterType;
    this.filterButtons.forEach(filter => {
      filter.isActive = filter.type === filterMode
    });

    this.todoService.filterTodos(filterMode)
  }

  clearCompletedTodo = () => {
    this.todoService.clearCompletedTodo();
  }

}
