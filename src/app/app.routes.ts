import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import {ParticipantComponent} from './views/participants/participant/participant.component';
import {ParticipantsComponent} from './views/participants/participants.component';
import {EventsComponent} from './views/events/events.component';
import {SeasonComponent} from './views/events/season/season.component';
import {EventComponent} from './views/events/event/event.component';
import {AdminboardComponent} from './views/adminboard/adminboard.component';
import {CompetitionclassComponent} from './views/adminboard/competitionclass/competitionclass.component';
import {TeamComponent} from './views/team/team.component';
import {PersonsComponent} from './views/persons/persons.component';
import {PersonComponent} from './views/persons/person/person.component';
import {CurrentresultComponent} from './views/dashboard/currentresult/currentresult.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import { AuthGuard } from './services/auth-guard.service';


const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'events', component: EventsComponent},
    {path: 'adminboard', canActivate: [AuthGuard], component: AdminboardComponent, children:
        [{path: 'competitionclass/:idclass', component: CompetitionclassComponent},
          {path: 'competitionclass', component: CompetitionclassComponent}]},
    {path: 'season', component: SeasonComponent},
    {path: 'season/:idseason', component: SeasonComponent},
    {path: 'event', component: EventComponent},
    {path: 'event/:idevent', component: EventComponent, children:
        [{path: '', component: ParticipantsComponent}]},
    {path: 'participant/:idevent/:idParticipant', component: ParticipantComponent},
    {path: 'participant/:idevent', component: ParticipantComponent},
    {path: 'team/:idseason/:idteam', component: TeamComponent},
    {path: 'team/:idseason', component: TeamComponent},
    {path: 'person/:idperson', component: PersonComponent},
    {path: 'persons', component: PersonsComponent},
    {path: '', component: DashboardComponent, children:
      [{path: '', component: CurrentresultComponent}]},
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
