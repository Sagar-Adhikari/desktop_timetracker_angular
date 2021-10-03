import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from 'src/model/user.model';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ContractMinView } from 'src/model/contract.model';

@Injectable()
export class UserService {
    constructor(private snackBar: MatSnackBar) { }

    private userSubject = new BehaviorSubject<UserModel>(null);
    user = this.userSubject.asObservable();

    private contractSubject = new BehaviorSubject<ContractMinView>(null);
    curContract = this.contractSubject.asObservable();

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    configSuccess: MatSnackBarConfig = {
        panelClass: ['background-success'],
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
    };

    configError: MatSnackBarConfig = {
        panelClass: ['background-fail'],
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
    };

    setUser(user: UserModel) {
        this.userSubject.next(user);
    }

    setCurContract(contract: ContractMinView) {
        this.contractSubject.next(contract);
    }

    sendMessage(msg, isError: boolean) {
        this.snackBar.open(msg, '', isError ? this.configError : this.configSuccess);
    }
}