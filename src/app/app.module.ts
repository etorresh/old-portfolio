import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AboutComponent } from './sidebar-content/about/about.component';
import { ExperienceComponent } from './sidebar-content/experience/experience.component';
import { ProjectsComponent } from './sidebar-content/projects/projects.component';
import { SkillsComponent } from './sidebar-content/skills/skills.component';
import { EducationComponent } from './sidebar-content/education/education.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeService } from './sidebar-content/theme.service';
import { ParticlesTestComponent } from './particles-playground/particles-test/particles-test.component';
import {ParticlesDirective} from './particles.directive';
import {ParticlesService} from './particles.service';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    SkillsComponent,
    EducationComponent,
    ParticlesTestComponent,
    ParticlesDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
  ],
  providers: [ThemeService, ParticlesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
