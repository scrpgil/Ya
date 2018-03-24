import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as AccountAction from '../../store/actions/account';

import { HomePage } from '../home/home';
import { YA_ADDRESS} from '../../config';

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
})
export class SignupPage {
    pageState:number = 0;
    PASSWORD:number = 0;
    ENTROPY:number = 1;
    BACKUP:number = 2;
    SEND:number = 3;

    password:string = "";
    repassword:string = "";

    entropyDone:boolean = false;
    wallet:any;
    base64Wallet:string = "";
    showBase64Wallet:boolean = false;

    YA_ADDRESS:string = "";

    account$:Observable<any>;
    account:Account;

    constructor(
        public navCtrl: NavController,
        public toastCtrl:  ToastController,
        public util: UtilProvider,
        public nem: NemProvider,
        private store: Store<any>,
        public navParams: NavParams
    ) {
        this.YA_ADDRESS = YA_ADDRESS;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignupPage');
        this.account$ = this.store.select('account');
        this.account$.subscribe(data =>{
            if(data){
                this.wallet = data.wallet;
                console.log(this.wallet);
                this.base64Wallet = btoa(JSON.stringify(this.wallet));
            }
        });
    }

    say(){
        let ya = new Audio('assets/audio/ya.ogg');
        ya.play();
        this.entropyDone = true;
    }
    goToEntropy(){
        this.pageState = this.ENTROPY;
    }
    goToBackup(){
        let date = new Date();
        let a = date.getTime() ;
        this.wallet = this.nem.createWallet("Ya-wallet-"+a, this.password);
        this.base64Wallet = btoa(JSON.stringify(this.wallet));
        this.pageState = this.BACKUP;
        this.store.dispatch(new AccountAction.RegisterWallet(this.wallet));
    }
    goToSend(){
        this.pageState = this.SEND;
    }
    goToHome(){
        this.navCtrl.setRoot(HomePage);
    }

    exportWallet(){
        var blob = new Blob([this.base64Wallet]);
        var url = window.URL || (window as any).webkitURL;
        var blobURL = url.createObjectURL(blob);

        var a = document.createElement('a');
        a.download = "Ya-wallet.wlt";
        a.href = blobURL;
        a.click();  
    }
    showWallet(){
        this.showBase64Wallet = true;
    }
    copy(text){
        this.util.copy(text);
    }
}

