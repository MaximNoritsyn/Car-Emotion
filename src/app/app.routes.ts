import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import {ParticipantComponent} from './views/participants/participant/participant.component';
import {ParticipantsComponent} from './views/participants/participants.component';

const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: DashboardComponent},
    {path: 'participants', component: ParticipantsComponent, children:
        [{path: ':keyparticipant', component: ParticipantComponent}]},
    {path: 'participant/:keyparticipant', component: ParticipantComponent},
    {path: 'newparticipant', component: ParticipantComponent},
    {path: '**', redirectTo: ''}
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
