import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { ProfilePage } from '../profile/profile';
import { FindPage } from '../find/find';
import { PaymentPage } from '../payment/payment';
import { COLORS } from '../../config';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../../store/index';
import { Account } from '../../store/reducers/account';
import * as AccountAction from '../../store/actions/account';


import { SignupPage } from '../signup/signup';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    created$:Observable<any>;
    created:boolean = false;
    password$:Observable<any>;
    password:string = "";
    login:boolean = false;
    wallet$:Observable<any>;
    wallet:any;
    data$:Observable<any>;
    data:any;
    mosaics$:Observable<any>;
    mosaics:any;

    colors:any = COLORS; 
    items$:any;
    items:any = [];
    staticItems:any = [
        {"kind":2, "name":"Find Friends"},
        {"kind":3, "name":"Your Profile"},
    ];

    ya_balance:number = 0;
    xem_balance:number = 0;
    constructor(
        public navCtrl: NavController,
        public nem: NemProvider,
        private store: Store<any>
    ) {
        this.created$ = this.store.select(fromRoot.getAccountCreated);
        this.created$.subscribe(res =>{
            this.created = res;
        });
        this.password$ = this.store.select(fromRoot.getAccountPassword);
        this.password$.subscribe(res =>{
            if(res && res != ""){
                this.login = true;
            }
        });
        this.wallet$ = this.store.select(fromRoot.getAccountWallet);
        this.wallet$.subscribe(res =>{
            if(res){
                console.log(res);
                this.wallet = res;
                console.log(this.wallet.accounts[0].address);
                if(this.created){
                    this.nem.connector(this.wallet.accounts[0].address);
                    this.nem.getAccountMosaicsOwned(this.wallet.accounts[0].address);
                    this.nem.getProfile(this.wallet.accounts[0].address);
                }
            }
        });
        this.data$ = this.store.select(fromRoot.getAccountData);
        this.data$.subscribe(res =>{
            if(res){
                console.log(res);
                this.data = res;
            }
        });
        this.items$ = this.store.select(fromRoot.getAccountItems);
        this.items$.subscribe(res =>{
            console.log(res);
            this.items = [];
            if(res){
                this.items = res.concat(this.staticItems);
            }else{
                this.items = this.items.concat(this.staticItems);
            }
        });
        this.mosaics$ = this.store.select(fromRoot.getAccountMosaics);
        this.mosaics$.subscribe(res =>{
            if(res){
                console.log(res);
                this.mosaics = res.data;
                this.ya_balance = this.nem.getMosaicQuantity(this.mosaics, "greeting:ya");
                this.xem_balance = this.nem.getMosaicQuantity(this.mosaics, "nem:xem");
            }
        });
    }
    goToCreateAccount(){
        this.navCtrl.push(SignupPage);
    }
    goToPaymentPage(){
        this.navCtrl.push(PaymentPage);
    }
    action(item){
        console.log(item);
        if(item.state == 0 && item.kind == 1 && item.address){
            if(item.state == 0){
                item.state = 1;
                setTimeout(()=>{
                    item.state = 0;
                }, 600);
            }
            let entity = this.nem.prepareTransaction(0, item.address, "" , 1);
            this.nem.send(entity);
        }
        if(item.kind == 2){
            this.navCtrl.push(FindPage);
        }
        if(item.kind == 3){
            this.navCtrl.push(ProfilePage);
        }
    }
    chkPassword(){
        console.log(this.password);
        this.nem.login(this.password);
    }
    deleteItem(idx){
        this.store.dispatch(new AccountAction.DeleteItems(idx));
    }
}
