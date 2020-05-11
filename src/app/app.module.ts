import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AboutComponent } from './sidebar-content/about/about.component';
import { ExperienceComponent } from './sidebar-content/experience/experience.component';
import { ProjectsComponent } from './sidebar-content/projects/projects.component';
import { SkillsComponent } from './sidebar-content/skills/skills.component';
import { EducationComponent } from './sidebar-content/education/education.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    SkillsComponent,
    EducationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
