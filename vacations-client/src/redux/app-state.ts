import { Vacation } from "../models/Vacation";

export class AppState {
    public isLoggedIn: boolean = false;
    public userName: string = "";
    public vacations: Vacation[] = [];
    public vacationDetails: Vacation = new Vacation(null, "", "", "", new Date(), new Date(), 1);
    public socket: any;
}