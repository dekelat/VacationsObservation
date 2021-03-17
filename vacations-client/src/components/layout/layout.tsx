import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./layout.css";
import Header from "../header/header";
import Login from "../login/login";
import Customer from "../customer/customer";
import Register from "../register/register";
import Admin from "../admin/admin";
import VacationsReports from "../vacations-reports/vacations-reports";
import ManageVacation from "../manage-vacation.tsx/manage-vacation";

export default class Layout extends Component {
    public render() {
        return (
            <BrowserRouter>
                <section className="layout">
                    <header>
                        <Header />
                    </header>

                    <main>
                        <Switch>
                            <Route path="/home" component={Login} exact />
                            <Route path="/register" component={Register} exact />
                            <Route path="/customer" component={Customer} exact />
                            <Route path="/admin" component={Admin} exact />
                            <Route path="/manage_vacation" component={ManageVacation} exact />
                            <Route path="/reports" component={VacationsReports} exact />
                            <Redirect from="/" to="/home" exact />
                        </Switch>
                    </main>

                </section>
            </BrowserRouter>
        );
    }
}