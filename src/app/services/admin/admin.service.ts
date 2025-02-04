import { Injectable } from "@angular/core";
import { RoleModel, UserModel } from "../../../assets/models/user.model";
import { accounts, roles } from "../../../assets/accounts.json";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AdminService {

    getUsers(): Observable<UserModel[]> {
        return of<UserModel[]>(accounts as UserModel[]);
    }

    getRoles(): Observable<RoleModel[]> {
        return of<RoleModel[]>(roles);
    }

    updateUser(user: UserModel): Observable<undefined> {
        accounts.forEach((account: UserModel, index: number) => {
            if (account.id === user.id) {
                accounts[index] = user;
                console.log("udpdated user "+user.username);
                alert("udpdated user "+user.username)
            }
        });
        return of<undefined>(undefined);
    }

    deleteUser(user: UserModel): Observable<undefined> {
        accounts.forEach((account: UserModel, index: number) => {
            if (account.id === user.id) {
                accounts.splice(index, 1);
                console.log("deleted user "+user.username);
                alert("deleted user "+user.username)
            }
        });
        return of<undefined>(undefined);
    }

    createUser(user: UserModel): Observable<undefined> {
        accounts.push(user);
        console.log("created user "+user.username);
        alert("created user "+user.username)
        return of<undefined>(undefined);
    }
}