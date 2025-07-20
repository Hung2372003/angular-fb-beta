import { Routes } from '@angular/router';
import { LoginComponent } from './layout/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { ActionsMenuComponent } from './shared/components/actions-menu/actions-menu.component';
import { ChatComponent } from './layout/chat/chat.component';
import { MessengerComponent } from './layout/messenger/messenger.component';

export const routes: Routes = [
    {path:'',redirectTo:'login', pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'action-menu',component: ActionsMenuComponent},
    {path:'messenger',canActivate: [authGuard],component: MessengerComponent,
      children:[
        {path:'',redirectTo:'chat',pathMatch:'full'},
        {path:'chat',component:ChatComponent},
      ]
    },

];
