import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';

import { NemProvider } from '../providers/nem/nem';

import { Store } from '@ngrx/store';
import * as AccountAction from '../store/actions/account';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomePage;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        public nem: NemProvider,
        splashScreen: SplashScreen,
        public store: Store<any>,
    ) {
        this.store.dispatch(new AccountAction.Restore());
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
}

