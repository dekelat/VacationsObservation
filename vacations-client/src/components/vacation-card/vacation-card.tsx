import React, { ChangeEvent, Component } from "react";
import { Vacation } from "../../models/Vacation";
import { ActionType } from "../../redux/action-type";
import { store } from "../../redux/store";
import "./vacation-card.css";
import axios from "axios";
import { Link } from "react-router-dom";
import GenericAlert from "../generic-alert/generic-alert";

interface VacationCardProps {
    vacation: Vacation;
    isAdminCard: boolean;
}

interface VacationCardState {
    isOpenAlert: boolean;
}

export default class VacationCard extends Component<VacationCardProps, VacationCardState>{

    public constructor(props: VacationCardProps) {
        super(props);
        this.state = { isOpenAlert: false }
    }

    private toggleFollow = (event: ChangeEvent<HTMLInputElement>) => {
        const isToggleChecked = event.target.checked;
        const vacationId = this.props.vacation.id;

        if (isToggleChecked) {
            this.followVacation(vacationId);
        }
        else {
            this.unfollowVacation(vacationId);
        }

        let vacations = [...store.getState().vacations];
        vacations.forEach(vacation => {
            if (vacation.id === vacationId) {
                vacation.isFollowing = isToggleChecked;
                vacation.numOfFollowers += isToggleChecked ? 1 : -1;
                return;
            }
        });

        store.dispatch({ type: ActionType.UpdateVacations, payload: vacations });
    }

    private followVacation = async (vacationId: number) => {
        try {
            await axios.post("http://34.65.206.19:3001/vacations/followed_vacations/", { vacationId });
        }
        catch (error) {
            alert(error.response.data.error);
        }
    }

    private unfollowVacation = async (vacationId: number) => {
        try {
            await axios.delete(`http://34.65.206.19:3001/vacations/followed_vacations/${vacationId}`);
        }
        catch (error) {
            alert(error.response.data.error);
        }
    }

    private onDeleteVacation = () => {
        this.openAlert();
    }

    private deleteVacationFromServer = async () => {
        try {
            let vacationId = this.props.vacation.id;
            await axios.delete(`http://34.65.206.19:3001/vacations/${vacationId}`);
            store.dispatch({ type: ActionType.DeleteVacation, payload: vacationId });
        }
        catch (error) {
            alert(error.response.data.error);
        }
    }

    private onEdit = () => {
        store.dispatch({ type: ActionType.ManageVacation, payload: this.props.vacation });
    }

    private formatDateToString(date: Date): string {
        let dateString = "";
        date = new Date(date);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) {
            dateString += '0';
        }
        dateString += day + '/';
        if (month < 10) {
            dateString += '0';
        }
        dateString += month + '/';
        dateString += year;
        return dateString;
    }

    private closeAlert = () => {
        this.setState({ isOpenAlert: false });
    }

    private openAlert = () => {
        this.setState({ isOpenAlert: true });
    }

    public render() {
        return (
            <div className="vacation-card">

                {this.state.isOpenAlert && <GenericAlert show={this.state.isOpenAlert}
                    handleClose={this.closeAlert} content={"Are you sure you want to delete this vacation?"}
                    styleType="confirm" handleConfirmYes={this.deleteVacationFromServer}
                    handleConfirmNo={this.closeAlert} />}

                <div className="top-card-section">
                    {this.props.isAdminCard && <button className="delete-button"
                        onClick={this.onDeleteVacation}>
                        <i className="fas fa-times"></i>
                    </button>}

                    <div className="cover">
                        <img src={this.props.vacation.imageUrl} alt="" />
                    </div>
                    <div className="followers-label">
                        {this.props.vacation.numOfFollowers} Followers
                    </div>
                </div>

                <div className="bottom-card-section">
                    <div className="circle">

                        {!this.props.isAdminCard && <label className="follow-checkbox">
                            <input type="checkbox" checked={this.props.vacation.isFollowing}
                                onChange={this.toggleFollow} />
                            <i className="far fa-heart unchecked"></i>
                            <i className="fas fa-heart checked"></i>
                        </label>}

                        {this.props.isAdminCard && <Link to="/manage_vacation">
                            <button className="edit-button" onClick={this.onEdit}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>
                        </Link>}

                    </div>

                    <h2>{this.props.vacation.destination}</h2>
                    <h4>{this.formatDateToString(this.props.vacation.startDate)} -
                    {this.formatDateToString(this.props.vacation.endDate)}</h4>

                    <div className="description">
                        <p>{this.props.vacation.description}</p>
                    </div>

                    <div className="price">
                        <h3>{this.props.vacation.price}$</h3>
                    </div>
                </div>

            </div>
        );
    }
}