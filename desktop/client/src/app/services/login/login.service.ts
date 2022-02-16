import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    username: string;
    password: string;
    socket: any;

    constructor() {
        this.username = '';
        this.password = '';
    }
}
