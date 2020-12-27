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
import {IsAdminGuard, IsLoggedGuard} from './services/auth-guard.service';
import {ResultsComponent} from './views/results/results.component';
import {TotalresultsComponent} from './views/results/totalresults/totalresults.component';
import {UserComponent} from './views/login/user/user.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'events', component: EventsComponent},
  {
    path: 'adminboard', canActivate: [IsAdminGuard], component: AdminboardComponent, children:
      [{path: 'competitionclass/:idclass', component: CompetitionclassComponent},
        {path: 'competitionclass', component: CompetitionclassComponent}]
  },
  {path: 'season', canActivate: [IsAdminGuard], component: SeasonComponent},
  {path: 'season/:idseason', canActivate: [IsAdminGuard], component: SeasonComponent},
  {path: 'event', component: EventComponent},
  {
    path: 'event/:idevent', component: EventComponent, children:
      [{path: '', component: ParticipantsComponent}]
  },
  {path: 'participant/:idevent/:idParticipant', component: ParticipantComponent},
  {path: 'participant/:idevent', component: ParticipantComponent},
  {path: 'results/:idevent', component: ResultsComponent},
  {path: 'team/:idseason/:idteam', component: TeamComponent},
  {path: 'team/:idseason', component: TeamComponent},
  {path: 'person/:idperson', component: PersonComponent},
  {path: 'persons', component: PersonsComponent},
  {path: 'totalresults/:competetion', component: TotalresultsComponent},
  {path: 'totalresults', component: TotalresultsComponent},
  {
    path: '', component: DashboardComponent, children:
      [{path: '', component: EventsComponent}]
  },
  {path: 'currentresultboard', canActivate: [IsAdminGuard], component: CurrentresultComponent},
  {path: 'user', canActivate: [IsLoggedGuard], component: UserComponent}
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
