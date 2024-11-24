import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  firestoreCollection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {
    this.firestoreCollection = firestore.collection('todos');
  }

  addTodo(task: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); 
    if (user && user.uid) {
      task.userId = user.uid; 
      this.firestoreCollection.add(task);
    } else {
      console.error('User not logged in!');
    }
  }

  updateTodoStatus(id: string, isDone: boolean): void {
    this.firestoreCollection.doc(id).update({ isDone });
  }

  deleteTodo(id: string): void {
    this.firestoreCollection.doc(id).delete();
  }

  uploadAttachment(file: File): Promise<string> {
    const filePath = `task-attachments/${new Date().getTime()}_${file.name}`; 
    const fileRef = this.storage.ref(filePath); 
    const task = this.storage.upload(filePath, file); 
  
    return task.snapshotChanges().toPromise().then(() => {
      return fileRef.getDownloadURL().toPromise(); 
    });
  }
  updateTodo(id: string, updatedTask: any): void {
    this.firestoreCollection.doc(id).update(updatedTask);
  }
  
}
