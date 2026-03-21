// src/app/google/routes.ts

import { Routes } from '@angular/router';
import { googleOauthConfig } from './config';
import { formDirtyComfirmation } from './helpers';
import { AuthorizationPage } from './pages/authorization-page/authorization-page';
import { EventInsertPage } from './pages/event-insert-page/event-insert-page';
import { EventsListPage } from './pages/events-list-page/events-list-page';
import { GoogleRoot } from './pages/google-root/google-root';
import { FormPage } from './pages/types';
import { CalendarService } from './services/calendar.service';
import { OauthClient } from './services/oauth.client';
import { OAUTH_CLIENT_CONFIGURATION } from './types/services';

// นำเข้า Service และ Component ที่สร้างใหม่
import { PeopleService } from './services/people.service';
import { PeopleListPage } from './pages/people-list-page/people-list-page';
import { CreateContactPage } from './pages/create-contact-page/create-contact-page'; // 👈 นำเข้า CreateContactPage

export default [
  {
    path: '',
    providers: [
      { provide: OAUTH_CLIENT_CONFIGURATION, useValue: googleOauthConfig },
      OauthClient,
      CalendarService,
      PeopleService,
    ],
    children: [
      { path: 'authorization', data: { fullPage: true }, component: AuthorizationPage },

      {
        path: '',
        component: GoogleRoot,
        children: [
          { path: '', redirectTo: 'events', pathMatch: 'full' },

          {
            path: 'events',
            children: [
              { path: '', component: EventsListPage },
              {
                path: 'insert',
                canDeactivate: [
                  (component: Partial<FormPage>) => {
                    if (component.dirty?.() ?? true) {
                      return formDirtyComfirmation();
                    } else {
                      return true;
                    }
                  },
                ],
                component: EventInsertPage,
              },
            ],
          },

     
          {
            path: 'people',
            children: [
              { path: '', component: PeopleListPage },
              { path: 'create', component: CreateContactPage }, 
            ],
          },
        ],
      },
    ],
  },
] as Routes;
