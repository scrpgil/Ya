import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/index';
import { UtilProvider } from '../../providers/util/util';
import { YA_ADDRESS} from '../../config';

@IonicPage()
@Component({
    selector: 'page-payment',
    templateUrl: 'payment.html',
})
export class PaymentPage {
    wallet$:Observable<any>;
    wallet:any;
    YA_ADDRESS:string = YA_ADDRESS;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public util: UtilProvider,
        private store: Store<any>
    ) {
        this.wallet$ = this.store.select(fromRoot.getAccountWallet);
        this.wallet$.subscribe(res =>{
            if(res){
                this.wallet = res;
                console.log(this.wallet.accounts[0].address);
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PaymentPage');
    }
    back(){
        this.navCtrl.pop();
    }
    copy(text){
        this.util.copy(text);
    }
}
