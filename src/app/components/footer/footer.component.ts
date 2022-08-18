import { Component, OnInit } from '@angular/core';
import { Filter, FilterButton } from 'src/app/model/filtering.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  filterButtons : FilterButton[] = [
    { type : Filter.All, label : 'All', isActive : true },
    { type : Filter.Active, label : 'Active', isActive : false },
    { type : Filter.Completed, label : 'Completed', isActive : false }
  ];

  length : number;
  constructor(private todoService : TodoService) { }

  ngOnInit(): void {
    this.todoService.length$.subscribe(todoLength => {
      this.length = todoLength;
    })
  }

  filterTodo = (event : MouseEvent) => {
    const btnElement = <HTMLButtonElement>event.target
    const index = this.filterButtons.findIndex(filter => filter.label == btnElement.id)

    this.filterButtons = [...this.filterButtons.map(filter => {
      return {
        ...filter,
        isActive : (filter.label === btnElement.id) ? true : false
      }
    })];

    this.todoService.filterTodos(this.filterButtons[index].type, true)
  }

  clearCompletedTodo = () => {
    this.todoService.clearCompletedTodo();
  }

}
