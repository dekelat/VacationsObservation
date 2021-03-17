import React, { Component } from 'react';
import axios from "axios";
import { Unsubscribe } from "redux";
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { Vacation } from '../../models/Vacation';
import VacationCard from '../vacation-card/vacation-card';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import chartIcon from "../../resources/bar-chart.svg";
import addIcon from "../../resources/add.svg"

interface AdminState {
    vacations: Vacation[];
}

export default class Admin extends Component<any, AdminState> {

    private unsubscribeStore: Unsubscribe;

    constructor(props: any) {
        super(props);
        this.state = { vacations: [] };

        // Update state vacations with the most updated version from store
        this.unsubscribeStore = store.subscribe(
            () => this.setState({ vacations: store.getState().vacations })
        );
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    public async componentDidMount() {
        const token = sessionStorage.getItem("userToken");
        const userType = sessionStorage.getItem("userType");

        // Authenticate user
        if (!token) {
            this.props.history.push("/home");
            return;
        }
        if (userType === 'CUSTOMER') {
            this.props.history.push("/customer");
            return;
        }

        this.establishSocketConnection(token);
        this.getAllVacations(token);
    }

    private establishSocketConnection = (token: string) => {
        const socket = io('http://34.65.206.19:3002/', { query: "token=" + token }).connect();

        // Save socket for later disconnection
        store.dispatch({ type: ActionType.SetSocket, payload: socket });
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
            <div className="admin">

                <div className="menu">
                    <Link to="/manage_vacation">
                        <img className="icon-img" src={addIcon} alt="chart" />Add Vacation
                    </Link>

                    <Link to="/reports" >
                        <img className="icon-img" src={chartIcon} alt="chart" />Reports
                    </Link>
                </div>

                <div className="vacations-cards-container">
                    {this.state.vacations.map(vacation =>
                        <VacationCard isAdminCard={true} vacation={vacation}
                            key={vacation.id} />
                    )}
                </div>

            </div>
        );
    }
}