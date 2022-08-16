import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  isHovered : boolean = false;
  isEditing : boolean = false;
  isChecked : boolean = false;
  contentTodo : string = 'Todo Item'
  
  constructor() { }

  ngOnInit(): void {
  }

}
