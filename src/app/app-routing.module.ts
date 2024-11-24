import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TodoComponent } from './todo/todo.component';
import { AuthGuard } from './guards/auth.guard';

const routes:Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login', component : LoginComponent},
  {path:'register', component : RegisterComponent},
  {path:'todo', component : TodoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
