import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Unsubscribe } from "redux";
import { ActionType } from "../../redux/action-type";
import { store } from "../../redux/store";
import "./header.css";
import logo from "../../resources/observacation.png";

interface HeaderState {
    isLoggedIn: boolean;
}

export default class Header extends Component<any, HeaderState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = { isLoggedIn: false };
        this.unsubscribeStore = store.subscribe(
            () => this.setState(
                { isLoggedIn: store.getState().isLoggedIn }
            ));
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    private onLogout = () => {
        const socket = store.getState().socket;
        if (socket) {
            socket.disconnect();
        }
        sessionStorage.clear();
        store.dispatch({ type: ActionType.Logout });
    }

    public render() {
        return (
            <div className="header">
                {sessionStorage.getItem("userToken") && <div>
                    <h5>Hello, {sessionStorage.getItem("userName")} </h5>
                    <Link to="/home" onClick={this.onLogout}>logout</Link>
                </div>}

                <img src={logo} alt="logo" />
            </div>
        );
    }
}