import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import { AppRoutes } from './app.routes';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthService } from './services/auth.service';
import { ParticipantsService } from './services/participants.service';
import { AuthGuard } from './services/auth-guard.service';
import { ParticipantComponent } from './views/participants/participant/participant.component';
import { ParticipantsComponent } from './views/participants/participants.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Translate_Service } from './services/translate.service';
import { SeasonComponent } from './views/events/season/season.component';
import { EventsComponent } from './views/events/events.component';
import { EventsService} from './services/events.service';
import { CurrentdataService } from './services/currentdata.service';
import { EventComponent } from './views/events/event/event.component';
import {MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AdminboardComponent } from './views/adminboard/adminboard.component';
import { CompetitionclassComponent } from './views/adminboard/competitionclass/competitionclass.component';
import { TeamComponent } from './views/team/team.component';
import { PersonsComponent } from './views/persons/persons.component';
import { PersonComponent } from './views/persons/person/person.component';
import { ResultsComponent } from './views/results/results.component';
import { ResultComponent } from './views/results/result/result.component';
import { CurrentresultComponent } from './views/dashboard/currentresult/currentresult.component';
import {FactoryService} from './services/factory.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TotalresultsComponent } from './views/results/totalresults/totalresults.component';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';

registerLocaleData(localeUk);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ParticipantComponent,
    ParticipantsComponent,
    SeasonComponent,
    EventsComponent,
    EventComponent,
    AdminboardComponent,
    CompetitionclassComponent,
    TeamComponent,
    PersonsComponent,
    PersonComponent,
    ResultsComponent,
    ResultComponent,
    CurrentresultComponent,
    TotalresultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutes,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    DragDropModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }
    )
  ],
  providers: [
    AuthService,
    AuthGuard,
    ParticipantsService,
    Translate_Service,
    EventsService,
    CurrentdataService,
    FactoryService,
    {provide: LOCALE_ID, useValue: 'uk'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
