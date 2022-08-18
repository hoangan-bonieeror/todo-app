import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output , AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Todo } from 'src/app/model/todo.model';

// const fadeStrikeThroughAnimation = 
@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  animations : [trigger('fadeStrikeThrough', [
    state(
      'active',
      style({
        fontSize : '18px',
        color : 'black'
    })),
    state(
      'completed',
      style({
        fontSize : '17px',
        color : 'lightgrey',
        textDecoration : 'line-through'
    })),
    transition('active <=> completed', [animate(250)])
  ])]
})
export class TodoItemComponent implements OnInit, AfterViewInit {
  @Input() todo : Todo;
  @Output() changeStatus : EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() editTodo : EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() deleteTodo : EventEmitter<number> = new EventEmitter<number>();
  @ViewChildren('formEdit') private formEdit : QueryList<ElementRef<HTMLFormElement>>;

  isHovered : boolean = false;
  isEditing : boolean = false;
  
  constructor() { }

  ngOnInit(): void {
    // console.log(this.todo)
  }

  ngAfterViewInit() {
    this.formEdit.changes.subscribe((list: QueryList<ElementRef<HTMLFormElement>>) => {
      if (list.length > 0) {
        // console.log(list.first.nativeElement.childNodes[0])
        let inputElement = <HTMLInputElement>list.first.nativeElement.childNodes[0]
        inputElement.focus();
      }
    });
  }

  changeTodoStatus = () => {
    this.changeStatus.emit({...this.todo, isCompleted: !this.todo.isCompleted })
  }

  submitEdit = (event : KeyboardEvent) => {
    const { keyCode } = event;
    event.preventDefault();

    if(keyCode === 13) {
      this.editTodo.emit(this.todo);
      this.isEditing = false;
    }
  }

  submitDelete = () => {
    this.deleteTodo.emit(this.todo.id);
  }
}
