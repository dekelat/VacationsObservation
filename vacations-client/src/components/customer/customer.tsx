import React, { Component } from 'react';
import axios from "axios";
import { Unsubscribe } from "redux";
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { Vacation } from '../../models/Vacation';
import { io } from 'socket.io-client';
import VacationCard from '../vacation-card/vacation-card';

interface CustomerState {
    vacations: Vacation[];
}

export default class Customer extends Component<any, CustomerState> {

    private unsubscribeStore: Unsubscribe;

    constructor(props: any) {
        super(props);
        this.state = { vacations: [] };

        // Update state vacations with the most updated version from store
        this.unsubscribeStore = store.subscribe(
            () => this.setState(
                {
                    vacations: store.getState().vacations
                }
            )
        );
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    public componentDidMount() {
        const token = sessionStorage.getItem("userToken");
        const userType = sessionStorage.getItem("userType");

        // Authenticate user
        if (!token) {
            this.props.history.push("/home");
            return;
        }
        if (userType === 'ADMIN') {
            this.props.history.push("/admin");
            return;
        }

        this.establishSocketConnection(token);
        this.getAllVacations(token);
    }

    private establishSocketConnection = (token: string) => {
        const socket = io('http://34.65.206.19:3002/', { query: "token=" + token }).connect();

        // Save socket for later disconnection
        store.dispatch({ type: ActionType.SetSocket, payload: socket });

        // Handle socket server requests
        socket.on("DELETE_VACATION", (vacationId: number) => {
            store.dispatch({ type: ActionType.DeleteVacation, payload: +vacationId });
        })
        socket.on("ADD_VACATION", (vacation: Vacation) => {
            store.dispatch({ type: ActionType.AddVacation, payload: vacation });
        })
        socket.on("EDIT_VACATION", (vacationToEdit: Vacation) => {
            store.dispatch({ type: ActionType.EditVacation, payload: vacationToEdit });
        })
    }

    private getAllVacations = async (token: string) => {
        axios.defaults.headers.common['authorization'] = token;
        try {
            const response = await axios.get<Vacation[]>("http://34.65.206.19:3001/vacations/");
            store.dispatch({ type: ActionType.GetAllVacations, payload: response.data });
        }
        catch (error) {
            alert(error.response.data.error);
        }
    }

    public render() {
        return (
            <div className="customer">
                <div className="vacations-cards-container">
                    {this.state.vacations.sort((a, b) =>
                        a.isFollowing === b.isFollowing ? 0 : a.isFollowing ? -1 : 1
                    ).map(vacation =>
                        <VacationCard isAdminCard={false} vacation={vacation} key={vacation.id} />
                    )}
                </div>
            </div>
        );
    }
}