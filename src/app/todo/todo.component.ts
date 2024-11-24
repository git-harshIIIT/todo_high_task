import { Component, OnInit } from '@angular/core';
import { TodoService } from '../shared/todo.service';
import { AuthService } from '../shared/auth.service';
import { AuthGuard } from '../guards/auth.guard';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styles: []
})
export class TodoComponent implements OnInit {
  todos: any[] = [];
  filteredTodos: any[] = []; 
  searchQuery: string = ''; 
  selectedFile: File | null = null;

  constructor(private todoService: TodoService,private authService: AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Get logged-in user's info
    if (user && user.uid) {
      this.todoService.firestoreCollection.ref
        .where('userId', '==', user.uid) // Filter tasks by the logged-in user's UID
        .onSnapshot(snapshot => {
          this.todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.filteredTodos = this.todos.sort((a: any, b: any) => a.isDone - b.isDone); // Sort tasks
        });
    } else {
      console.error('User not logged in!');
    }
  }
  

  // Handle file selection
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('File selected:', this.selectedFile); 
    }
  }

  // Add a new task
  onClick(titleInput: HTMLInputElement, descriptionInput: HTMLInputElement, dueDateInput: HTMLInputElement): void {
    if (!titleInput.value.trim() || !dueDateInput.value.trim()) {
      alert("Title and Due Date are required!");
      return;
    }
  
    const task = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      dueDate: dueDateInput.value.trim(),
      attachmentUrl: null as string | null,
    };
  
    if (this.selectedFile) {
      this.todoService.uploadAttachment(this.selectedFile).then((url: string) => {
        task.attachmentUrl = url; // Set the URL after upload
        this.todoService.addTodo(task);
        this.resetForm(titleInput, descriptionInput, dueDateInput);
      }).catch((error) => {
        console.error("Error uploading file: ", error);
      });
    } else {
      this.todoService.addTodo(task);
      this.resetForm(titleInput, descriptionInput, dueDateInput);
    }
  }
  

  // Reset form inputs
  resetForm(titleInput: HTMLInputElement, descriptionInput: HTMLInputElement, dueDateInput: HTMLInputElement): void {
    titleInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    this.selectedFile = null;
  }

  // Edit functionality
  onEditStart(item: any): void {
    item.isEditing = true;
    item.editTitle = item.title;
    item.editDescription = item.description;
    item.editDueDate = item.dueDate;
    item.editAttachmentUrl = item.attachmentUrl;
  }

  onEditCancel(item: any): void {
    item.isEditing = false;
  }

  onEditSave(item: any): void {
    if (!item.editTitle.trim() || !item.editDueDate.trim()) {
      alert("Title and Due Date are required!");
      return;
    }
  
    const updatedTask = {
      title: item.editTitle.trim(),
      description: item.editDescription.trim(),
      dueDate: item.editDueDate.trim(),
      attachmentUrl: item.editAttachmentUrl || null,
    };
  
    if (this.selectedFile) {
      this.todoService.uploadAttachment(this.selectedFile).then((url: string) => {
        updatedTask.attachmentUrl = url;
        this.todoService.updateTodo(item.id, updatedTask);
        item.isEditing = false;
      }).catch((error) => {
        console.error("Error uploading file: ", error);
      });
    } else {
      this.todoService.updateTodo(item.id, updatedTask);
      item.isEditing = false;
    }
  }

  onStatusChange(id: string, newStatus: boolean): void {
    this.todoService.updateTodoStatus(id, newStatus);
  }

  onDelete(id: string): void {
    this.todoService.deleteTodo(id);
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredTodos = this.todos; 
    } else {
      this.filteredTodos = this.todos.filter(todo => 
        todo.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  onLogout():void{
    this.authService.logout();
  }
}
