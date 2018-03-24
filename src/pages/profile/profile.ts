import { Component } from '@angular/core';
import { ToastController, NavController, NavParams } from 'ionic-angular';
import { COLORS } from '../../config';
import { HomePage } from '../home/home';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../../store/index';
import { Account } from '../../store/reducers/account';
import * as AccountAction from '../../store/actions/account';


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    colors:any = COLORS; 
    wallet$:any;
    wallet:any;
    profile$:any;
    profile:any;
    name:string="";
    fee:number = 0.05;

    constructor(
        public navCtrl: NavController,
        private store: Store<any>,
        public util: UtilProvider,
        public nem: NemProvider,
        public toastCtrl: ToastController,
        public navParams: NavParams
    ) {
        this.wallet$ = this.store.select(fromRoot.getAccountWallet).subscribe(res =>{
            if(res){
                console.log(res);
                this.wallet = res;
            }
        });
        this.profile$ = this.store.select(fromRoot.getAccountProfile).subscribe(res =>{
            console.log(res);
            if(res){
                this.profile = res;
                this.name = res.name;
            }
        });
    }

    ionViewDidLeave() {
        console.log('ionViewDidLoad ProfilePage');
        this.wallet$.unsubscribe();
        this.profile$.unsubscribe();
    }
    back(){
        this.navCtrl.pop();
    }
    updateFee(){
        let entity = this.nem.prepareTransaction(0,"TDQNQ4S7FXNKH7X6SCMGFPUMWZX2KGGUAS326NSF" , this.name , 0);
        this.fee = entity.fee / 1000000;
    }
    sendNickname(){
        if(this.name != ""){
            let entity = this.nem.prepareTransaction(0,"TDQNQ4S7FXNKH7X6SCMGFPUMWZX2KGGUAS326NSF" , this.name , 0);
            this.nem.send(entity);
            this.util.onToast("書き込みました");
        }
    }
    exportWallet(){
        let base64Wallet = btoa(JSON.stringify(this.wallet));
        var blob = new Blob([base64Wallet]);
        var url = window.URL || (window as any).webkitURL;
        var blobURL = url.createObjectURL(blob);

        var a = document.createElement('a');
        a.download = "Ya-wallet.wlt";
        a.href = blobURL;
        a.click();  
    }
    copyAddress(){
        this.util.copy(this.wallet.accounts[0].address);
    }

}
