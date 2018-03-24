import { Action } from '@ngrx/store';

export const RESTORE = '[Account] Restore';
export const REGISTER_PASSWORD = '[Account] RegisterPassword';
export const REGISTER_PROFILE = '[Account] RegisterProfile';
export const REGISTER_WALLET = '[Account] RegisterWallet';
export const REGISTER_DATA = '[Account] RegisterData';
export const ADD_ITEMS = '[Account] AddItems';
export const DELETE_ITEMS = '[Account] DeleteItems';
export const REGISTER_MOSAICS = '[Account] RegisterMosaics';
 
export class Restore implements Action {
  readonly type = RESTORE;
}

export class RegisterPassword implements Action {
    readonly type = REGISTER_PASSWORD;
    constructor(public payload: any) {}
}

export class RegisterProfile implements Action {
    readonly type = REGISTER_PROFILE;
    constructor(public payload: any) {}
}

export class RegisterWallet implements Action {
    readonly type = REGISTER_WALLET;
    constructor(public payload: any) {}
}
 
export class RegisterData implements Action {
    readonly type = REGISTER_DATA;
    constructor(public payload: any) {}
}
 
export class AddItems implements Action {
    readonly type = ADD_ITEMS;
    constructor(public payload: any) {}
}
 
export class DeleteItems implements Action {
    readonly type = DELETE_ITEMS;
    constructor(public payload: any) {}
}
 
export class RegisterMosaics implements Action {
    readonly type = REGISTER_MOSAICS;
    constructor(public payload: any) {}
}
 
export type All
  = RegisterData | RegisterWallet | RegisterPassword | AddItems | DeleteItems | RegisterProfile | Restore | RegisterMosaics;
