import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import {ParticipantComponent} from './views/participants/participant/participant.component';
import {ParticipantsComponent} from './views/participants/participants.component';
import {EventsComponent} from './views/events/events.component';
import {SeasonComponent} from './views/events/season/season.component';
import {EventComponent} from './views/events/event/event.component';

const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'events', component: EventsComponent},
    {path: 'season', component: SeasonComponent},
    {path: 'season/:idseason', component: SeasonComponent},
    {path: 'event/', component: EventComponent},
    {path: 'event/:idevent', component: EventComponent, children:
        [{path: '', component: ParticipantsComponent}]},
    {path: 'participant/:idevent/:idParticipant', component: ParticipantComponent},
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
