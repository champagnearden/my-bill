import { Injectable, WritableSignal, signal } from "@angular/core";
import accounts from "../../../assets/accounts.json";
import { DefaultUser, UserModel } from "../../../assets/models/user.model";
import CryptoJS from 'crypto-js';
import { LoginError } from "../../../assets/models/errors.model";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    private readonly userDataSignal = signal<UserModel>(this.getStoredUser());

    // Get the current user data signal
    get userData(): WritableSignal<UserModel> {
        return this.userDataSignal;
    }

    get isLoggedIn(): boolean {
        return this.userDataSignal().id !== 0;
    }

    // Set the user data
    setUserData(data: UserModel): void {
        this.userDataSignal.set(data);
        this.storeUser(data);
    }

    // Clear the user data
    private clearUserData(): void {
        this.userDataSignal.set(DefaultUser);
        this.storeUser(DefaultUser);
    }

    /**
     * @param username required for authenticating
     * @param password required for authenticating
     * @returns UserModel
     * @throws LoginError
     */
    login(username: string, password: string): UserModel {
        const hashed = this.hash(password);
        const acc:UserModel[] = accounts.accounts;
        for(let account of acc) {
            if(account.username === username && account.hash === hashed) {
                return account;
            }
        }
        const date = new Date();
        throw {message: 'Invalid credentials', code: 400, date: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`};
    }

    logout():void {
        this.clearUserData();
    }

    private hash(str: string) {
        return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(str));
    }

    private getStoredUser(): UserModel {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : DefaultUser;
    }

    private storeUser(user: UserModel): void {
        localStorage.setItem('user', JSON.stringify(user));
    }
}