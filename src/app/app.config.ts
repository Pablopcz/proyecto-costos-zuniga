import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
  provideRouter(routes), 
  provideFirebaseApp(() => initializeApp({
    "projectId": "proyecto-zuniga-2026-7c293",
    "appId": "1:299562697600:web:0e8e7bc9e914b435c83765",
    "storageBucket": "proyecto-zuniga-2026-7c293.firebasestorage.app",
    "apiKey": "AIzaSyDlbJo60DnCO9-IUKMX_XaeCFlaakB6KOA",
    "authDomain": "proyecto-zuniga-2026-7c293.firebaseapp.com",
    "messagingSenderId": "299562697600",
    "measurementId": "G-PGSYPMMGSX"
  })), 
  provideAuth(() => getAuth()), 
  provideDatabase(() => getDatabase())
]
};
