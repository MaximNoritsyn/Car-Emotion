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

const appRoutes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'events', component: EventsComponent},
    {path: 'adminboard', component: AdminboardComponent, children:
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
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
