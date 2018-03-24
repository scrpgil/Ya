import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';
import { Store } from '@ngrx/store';
import { COLORS } from '../../config';
import * as AccountAction from '../../store/actions/account';

@IonicPage()
@Component({
    selector: 'page-find',
    templateUrl: 'find.html',
})
export class FindPage {
    colors:any = COLORS; 
    db:any;
    names:any = [];
    keyword:string = "";

    constructor(
        public navCtrl: NavController,
        public store: Store<any>,
        public nem: NemProvider,
        public util: UtilProvider,
        public navParams: NavParams
    ) {
        this.db = this.nem.getDb();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FindPage');
    }

    back(){
        this.navCtrl.pop();
    }
    onInput(){
        if(this.keyword == ''){
            this.names = [];
            return;
        }
        this.db.list('users', ref => ref.orderByChild('name').startAt(this.keyword)).valueChanges().subscribe((res) => {
            this.names = res;
        });
    }
    addAddress(n){
        n["kind"] = 1;
        n["state"] = 0;
        this.store.dispatch(new AccountAction.AddItems(n));
        this.util.onToast("追加しました");
    }
}
