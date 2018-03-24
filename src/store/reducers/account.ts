import * as AccountActions from '../actions/account'

export type Action = AccountActions.All;

export interface Account {
    created: boolean;
    password: string;
    profile: any;
    wallet: any;
    data: any;
    items: any;
    mosaics: any;
}

export function reducer(account:Account = {created:false,password:"", profile:null, wallet:null,data:null,items:null,mosaics:null}, action: Action) {
    switch (action.type) {
        case AccountActions.RESTORE:{
            let n = localStorage.getItem("account");
            let a = account;
            if(n){
                let restore = JSON.parse(n);
                if("created" in restore){
                    a = restore;
                }
                if("items" in a){
                    if(a.items){
                        for(let i = 0; i < a.items.length; i++){
                            a.items[i].state = 0;
                        }
                    }
                }
                console.log(a);
            }
            return a;
        }
        case AccountActions.REGISTER_PASSWORD:{
            let a = {created:true, password: action.payload, profile:account.profile,  wallet:account.wallet, data:account.data,items:account.items, mosaics:account.mosaics};
            let save = Object.assign({}, a);
            delete save.password;
            localStorage.setItem("account", JSON.stringify(save));
            return a;
        }
        case AccountActions.ADD_ITEMS:{
            let i = action.payload;
            let items = [i];
            if(account.items){
                let dupli = false;
                for(let itr = 0; itr < account.items.length;itr++){
                    if(account.items[itr].address == i["address"]){
                        dupli = true;
                    }
                }
                if(!dupli){
                    items = items.concat(account.items);
                }else{
                    items = account.items;
                }
            }
            let a = {created:true, password: account.password, profile:account.profile,  wallet:account.wallet, data:account.data,items:items, mosaics:account.mosaics};
            let save = Object.assign({}, a);
            delete save.password;
            localStorage.setItem("account", JSON.stringify(save));
            return a;
        }
        case AccountActions.DELETE_ITEMS:{
            let idx = action.payload;
            let items = [].concat(account.items);
            items.splice(idx, 1);
            let a = {created:true, password: account.password, profile:account.profile,  wallet:account.wallet, data:account.data,items:items, mosaics:account.mosaics};
            let save = Object.assign({}, a);
            delete save.password;
            localStorage.setItem("account", JSON.stringify(save));
            console.log(a);
            return a;
        }
        case AccountActions.REGISTER_PROFILE:{
            let a = {created:true, password: account.password, profile:action.payload,  wallet:account.wallet, data:account.data,items:account.items, mosaics:account.mosaics};
            let save = Object.assign({}, a);
            delete save.password;
            localStorage.setItem("account", JSON.stringify(save));
            return a;
        }
        case AccountActions.REGISTER_WALLET:{
            let a = {created:true, password: account.password, profile:account.profile, wallet:action.payload, data:account.data,items:account.items, mosaics:account.mosaics};
            let save = Object.assign({}, a);
            delete save.password;
            localStorage.setItem("account", JSON.stringify(save));
            return a;
        }
        case AccountActions.REGISTER_DATA:{
            let a = {created:true, password: account.password, profile:account.profile, wallet:account.wallet, data:action.payload,items:account.items, mosaics:account.mosaics};
            let save = Object.assign({}, a);
            delete save.password;
            localStorage.setItem("account", JSON.stringify(save));
            return a;
        }
        case AccountActions.REGISTER_MOSAICS:{
            let a = {created:true, password: account.password, profile:account.profile, wallet:account.wallet, data:account.data,items:account.items, mosaics:action.payload};
            let save = Object.assign({}, a);
            delete save.password;
            localStorage.setItem("account", JSON.stringify(save));
            return a;
        }
        default:
            return account;
    };
};

export const getAccountCreated = (account: Account) => account.created;
export const getAccountPassword = (account: Account) => account.password;
export const getAccountProfile = (account: Account) => account.profile;
export const getAccountWallet = (account: Account) => account.wallet;
export const getAccountData = (account: Account) => account.data;
export const getAccountItems = (account: Account) => account.items;
export const getAccountMosaics = (account: Account) => account.mosaics;
