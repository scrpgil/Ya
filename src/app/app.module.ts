import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage } from '../pages/home/home';
import { SignupPageModule } from '../pages/signup/signup.module';

import { ProfilePage } from '../pages/profile/profile';
import { FindPageModule } from '../pages/find/find.module';
import { PaymentPageModule } from '../pages/payment/payment.module';

import { MyApp } from './app.component';
import { NemProvider } from '../providers/nem/nem';

import { StoreModule } from '@ngrx/store';
import { reducers } from '../store/index';

import { PipesModule } from '../pipes/pipes.module';

import { firebaseConfig } from '../firebaseConfig';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from "angularfire2/database-deprecated"
import { AngularFireDatabase } from 'angularfire2/database';
import { UtilProvider } from '../providers/util/util';


@NgModule({
    declarations: [
        HomePage,
        ProfilePage,
        MyApp,
    ],
    imports: [
        BrowserModule,
        PipesModule,
        FindPageModule,
        SignupPageModule,
        PaymentPageModule,
        IonicModule.forRoot(MyApp),
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(firebaseConfig),
        StoreModule.forRoot(reducers),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        HomePage,
        ProfilePage,
        MyApp,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AngularFireDatabase ,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        NemProvider,
    UtilProvider,
    ]
})
export class AppModule {}
