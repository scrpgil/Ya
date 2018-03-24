import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import { Injectable } from '@angular/core';
import nem from "nem-sdk";

import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/index';
import { Account } from '../../store/reducers/account';
import * as AccountAction from '../../store/actions/account';

@Injectable()
export class NemProvider {
    endpoint:any;
    websocket:any;
    connecting:boolean = false;
    network_id:number;
    xem_supply:number = 0;
    common:any;
    mosaics:any;
    node_url:string = "";

    account$:Observable<any>;
    account:any;
    wallet:any;
    constructor(
        private db: AngularFireDatabase,
        private app: FirebaseApp,
        public store: Store<any>
    ) {
        this.node_url = "https://testnet-nis.xiaca.org";
        //this.node_url = "http://23.228.67.85";
        this.endpoint = nem.model.objects.create("endpoint")(this.node_url, 7891);
        this.websocket = nem.model.objects.create("endpoint")(this.node_url, 7779);
        this.network_id = nem.model.network.data.testnet.id;
        this.common = nem.model.objects.create("common")("", "");
        this.asyncSetup();
        this.account$ = this.store.select('account');
        this.account$.subscribe(res =>{
            if(res.wallet){
                this.wallet = res.wallet;
            }
            if(res.password && res.password != "" && this.wallet){
                console.log(this.wallet.accounts[0].address);
                this.common = nem.model.objects.create("common")(res.password, "");
                let result = nem.crypto.helpers.passwordToPrivatekey(this.common, this.wallet.accounts[0], this.wallet.accounts[0].algo);
            }
        });
    }

    asyncSetup(){
        this.attachMosaics();
    }

    // モザイク定義ファイルを取得
    attachMosaics(){
        let m = nem.model.objects.create("mosaicAttachment")("greeting", "ya", 0); 
        nem.com.requests.namespace.mosaicDefinitions(this.endpoint, m.mosaicId.namespaceId).then((res)=> {
            console.log(res);
            this.mosaics =  res;
            for(let i = 0; i<this.mosaics.data.length;i++){
                let mosaicName = this.mosaicIdToName(this.mosaics.data[i].mosaic.id);
                nem.com.requests.mosaic.supply(this.endpoint, mosaicName).then((res)=> {
                    console.log(res);
                    this.mosaics.data[i].mosaic["supply"] = res.supply;
                },
                err => {
                    console.error(err);
                });
            }
        },
        err => {
            console.error(err);
        });
        nem.com.requests.mosaic.supply(this.endpoint, "nem:xem").then((res)=> {
            console.log(res);
            this.xem_supply = res.supply;
        },
        err => {
            console.error(err);
        });
    }

    getAccountData(address): Observable<any>{
        let promise =  nem.com.requests.account.data(this.endpoint, address);
        return Observable.fromPromise(promise);
    }
    getAccountMosaicsOwned(address){
        nem.com.requests.account.mosaics.owned(this.endpoint, address).then((res)=>{
            this.store.dispatch(new AccountAction.RegisterMosaics(res));
        },
        err => {
            console.error(err);
        });
        nem.com.requests.mosaic.supply(this.endpoint, "greeting:ya").then((res)=>{
            console.log(res);
        },
        err => {
            console.error(err);
        });
    }
    getAccountTransactionAll(address): Observable<any>{
        let promise = nem.com.requests.account.transactions.all(this.endpoint, address);
        return Observable.fromPromise(promise);
    }
    getAccountHarvestingBlocks(address): Observable<any>{
        let promise = nem.com.requests.account.harvesting.blocks(this.endpoint, address);
        return Observable.fromPromise(promise);
    }
    createWallet(walletName, password){
        let wallet = nem.model.wallet.createPRNG(walletName, password, nem.model.network.data.testnet.id);
        return wallet;
    }
    createRandomKeyWallet(){
        return nem.crypto.helpers.randomKey();
    }
    connector(address){
        if(this.connecting == false){
            let connector = nem.com.websockets.connector.create(this.websocket, address);
            connector.connect().then(()=> {
                this.connecting = true;
                console.log("Connected");
                nem.com.websockets.subscribe.account.data(connector, (res)=> {
                    this.store.dispatch(new AccountAction.RegisterData(res));
                });

                nem.com.websockets.subscribe.account.transactions.unconfirmed(connector, (res)=> {
                    let ding = new Audio('../assets/audio/ding.ogg');
                    ding.play();
                    this.getAccountMosaicsOwned(address);
                });
                nem.com.websockets.subscribe.account.transactions.confirmed(connector, (res)=> {
                    let ding = new Audio('../assets/audio/ding2.ogg');
                    ding.play();
                    this.getAccountMosaicsOwned(address);
                });
                nem.com.websockets.requests.account.data(connector);
                nem.com.websockets.requests.account.transactions.recent(connector);
            },
            err => {
                console.error(err);
            });
        }
    }

    getMosaicQuantity(mosaics, name){
        let q = -1;
        for(let i = 0; i < mosaics.length; i++){
            let m = mosaics[i];
            let mosaicName = this.mosaicIdToName(m.mosaicId);
            if(name == mosaicName){
                q = m.quantity;
            }
        }
        return q;
    }
    mosaicIdToName(mosaicId){
        return nem.utils.format.mosaicIdToName(mosaicId);
    }
    prepareTransaction(amount, recipient:string = "", message:string = "" , mosaicsAmount:number = 0) {
        // Create a new object to not affect the view
        let cleanTransferTransaction = nem.model.objects.get("transferTransaction");

        cleanTransferTransaction.recipient = recipient;

        cleanTransferTransaction.message = message;
        cleanTransferTransaction.messageType = 1;

        let entity:any;
        if(mosaicsAmount > 0){
            cleanTransferTransaction.amount = 1;
            let xemMosaic = nem.model.objects.create("mosaicAttachment")("nem", "xem", amount);
            let yaMosaic = nem.model.objects.create("mosaicAttachment")("greeting", "ya", mosaicsAmount); 
            let metaData = this.getMosaicMetaData();
            console.log(metaData);
            let m = this.cleanMosaicAmounts([xemMosaic, yaMosaic],metaData);
            cleanTransferTransaction.mosaics = m;
            entity = nem.model.transactions.prepare("mosaicTransferTransaction")(this.common, cleanTransferTransaction, metaData, this.network_id);
        }else{
            cleanTransferTransaction.amount = amount;
            cleanTransferTransaction.mosaics = null;
            entity = nem.model.transactions.prepare("transferTransaction")(this.common, cleanTransferTransaction, this.network_id);
        }

        return entity;
    }
    cleanMosaicAmounts(elem, mosaicDefinitions) { // Deep copy: https://stackoverflow.com/a/5344074
        let copy;
        if(Object.prototype.toString.call(elem) === '[object Array]') {
            copy = JSON.parse(JSON.stringify(elem));
        } else {
            let _copy = [];
            _copy.push(JSON.parse(JSON.stringify(elem)))
            copy = _copy;
        }
        for (let i = 0; i < copy.length; i++) {
            // Check text amount validity
            if(!nem.utils.helpers.isTextAmountValid(copy[i].quantity)) {
                return [];
            } else {
                let divisibility = mosaicDefinitions[nem.utils.format.mosaicIdToName(copy[i].mosaicId)].mosaicDefinition.properties[0].value;
                // Get quantity from inputed amount
                copy[i].quantity = Math.round(nem.utils.helpers.cleanTextAmount(copy[i].quantity) * Math.pow(10, divisibility));
            }
        }
        return copy;
    }
    send(entity){
        console.log(entity);
        nem.model.transactions.send(this.common, entity, this.endpoint).then((res)=> {
            console.log(res);
        }, 
        (err)=> {
            console.error(err);
        });
    }
    getMosaicMetaData(){
        let mosaicAttachment = nem.model.objects.create("mosaicAttachment")("greeting", "ya", 0); 
        let metaData = nem.model.objects.get("mosaicDefinitionMetaDataPair");
        let fullMosaicName  = nem.utils.format.mosaicIdToName(mosaicAttachment.mosaicId);
        let neededDefinition = nem.utils.helpers.searchMosaicDefinitionArray(this.mosaics.data, ["ya"]);
        if(undefined === neededDefinition[fullMosaicName]) return console.error("Mosaic not found !");
        metaData[fullMosaicName] = {};
        metaData[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];
        metaData[fullMosaicName].supply = neededDefinition[fullMosaicName].supply;
        metaData["nem:xem"].supply = this.xem_supply;
        return metaData;
    }
    login(password){
        console.log(this.wallet);
        if(this.wallet){
            this.common = nem.model.objects.create("common")(password, "");
            let result = nem.crypto.helpers.passwordToPrivatekey(this.common, this.wallet.accounts[0], this.wallet.accounts[0].algo);
            console.log(result);
            if(64 <= this.common.privateKey.length && this.common.privateKey.length <= 66){
                this.store.dispatch(new AccountAction.RegisterPassword(password));
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    getProfile(address){
        this.db.object(`users/${address}`).valueChanges().subscribe((res) => {
            console.log(res);
            if(res){
                this.store.dispatch(new AccountAction.RegisterProfile(res));
            }
        });
    }
    getDb(){
        return this.db;
    }
}
