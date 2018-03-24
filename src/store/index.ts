import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';
 
import * as fromAccount from './reducers/account';
 
export const reducers: ActionReducerMap<any> = {
  account: fromAccount.reducer,
};

export const getAccount = createFeatureSelector<fromAccount.Account>('account');
export const getAccountWallet = createSelector(getAccount, fromAccount.getAccountWallet);
export const getAccountCreated = createSelector(getAccount, fromAccount.getAccountCreated);
export const getAccountProfile = createSelector(getAccount, fromAccount.getAccountProfile);
export const getAccountPassword = createSelector(getAccount, fromAccount.getAccountPassword);
export const getAccountData = createSelector(getAccount, fromAccount.getAccountData);
export const getAccountItems = createSelector(getAccount, fromAccount.getAccountItems);
export const getAccountMosaics = createSelector(getAccount, fromAccount.getAccountMosaics);
