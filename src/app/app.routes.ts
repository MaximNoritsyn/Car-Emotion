import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import {ParticipantsComponent} from './views/participants/participants.component';

const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: DashboardComponent},
    {path: 'participants', component: ParticipantsComponent, children:
        [{path: ':id', component: ParticipantsComponent}]},
    {path: 'participant/:id', component: ParticipantsComponent}
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
