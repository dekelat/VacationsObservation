import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";

// This function is NOT called direcrtly by you
export function reduce(oldAppState: AppState, action: Action): AppState {
    // Cloning the oldState (creating a copy)
    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.Login:
            newAppState.isLoggedIn = true;
            newAppState.userName = action.payload;
            break;
        case ActionType.Logout:
            newAppState.isLoggedIn = false;
            newAppState.userName = "";
            break;
        case ActionType.GetAllVacations:
            newAppState.vacations = action.payload;
            break;
        case ActionType.UpdateVacations:
            newAppState.vacations = action.payload;
            break;
        case ActionType.ManageVacation:
            newAppState.vacationDetails = action.payload;
            break;
        case ActionType.DeleteVacation:
            newAppState.vacations = newAppState.vacations.filter(vacation => {
                return vacation.id !== action.payload;
            });
            break;
        case ActionType.AddVacation:
            newAppState.vacations.push(action.payload);
            break;
        case ActionType.EditVacation:
            let vacationToEdit = action.payload;
            newAppState.vacations.forEach((vacation, index) => {
                if (vacation.id === vacationToEdit.id) {
                    vacationToEdit.isFollowing = vacation.isFollowing;
                    vacationToEdit.numOfFollowers = vacation.numOfFollowers;
                    newAppState.vacations.splice(index, 1, vacationToEdit);
                }
            })
            break;
        case ActionType.SetSocket:
            newAppState.socket = action.payload;
            break;
    }

    // After returning the new state, it's being published to all subscribers
    // Each component will render itself based on the new state
    return newAppState;
}