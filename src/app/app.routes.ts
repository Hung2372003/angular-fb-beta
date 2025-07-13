import { Routes } from '@angular/router';
import { MessengerComponent } from './layout/messenger/messenger.component';
import { ChatHistoryComponent } from './shared/components/chat-history/chat-history.component';
import { ChatBoxComponent } from './shared/components/chat-box/chat-box.component';
import { LoginComponent } from './layout/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { ActionsMenuComponent } from './shared/components/actions-menu/actions-menu.component';

export const routes: Routes = [
    {path:'',redirectTo:'login', pathMatch:'full'},
    // {path:'chat-history', component: ChatHistoryComponent},
    // {path:'chat-box', component: ChatBoxComponent},
    // {path:'mesage', component: MessengerComponent},
    {path:'messenger',canActivate: [authGuard],component: MessengerComponent},
    {path:'login',component:LoginComponent},
    {path:'action-menu',component: ActionsMenuComponent}
];
