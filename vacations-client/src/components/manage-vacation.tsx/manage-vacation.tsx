import axios from "axios";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Vacation } from "../../models/Vacation";
import { ActionType } from "../../redux/action-type";
import { store } from "../../redux/store";
import GenericAlert from "../generic-alert/generic-alert";
import "./manage-vacation.css";

interface ManageVacationState {
    id: number;
    destination: string;
    description: string;
    imageUrl: string;
    price: number;
    startDate: Date;
    endDate: Date;
    isOpenAlert: boolean;
    alertType: string;
    alertContent: string;
}

export default class ManageVacation extends Component<any, ManageVacationState>{

    public constructor(props: any) {
        super(props);

        let vacation = store.getState().vacationDetails;

        this.state = {
            id: vacation.id,
            destination: vacation.destination,
            description: vacation.description,
            imageUrl: vacation.imageUrl,
            price: vacation.price,
            startDate: new Date(vacation.startDate),
            endDate: new Date(vacation.endDate),
            isOpenAlert: false,
            alertContent: "",
            alertType: ""
        }
    }

    public componentDidMount() {
        const token = sessionStorage.getItem("userToken");
        const userType = sessionStorage.getItem("userType");

        // If the user isn't logged in, go back to login screen
        if (!token) {
            this.props.history.push("/home");
            return;
        }
        if (userType === 'CUSTOMER') {
            this.props.history.push("/customer");
            return;
        }
        if (store.getState().vacations.length === 0) {
            this.props.history.push("/admin");
            return;
        }

        axios.defaults.headers.common['authorization'] = sessionStorage.getItem("userToken");
    }

    private setDestination = (event: ChangeEvent<HTMLInputElement>) => {
        const destination = event.target.value;
        this.setState({ destination });
    }

    private setDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const description = event.target.value;
        this.setState({ description });
    }

    private setImageUrl = (event: ChangeEvent<HTMLInputElement>) => {
        const imageUrl = event.target.value;
        this.setState({ imageUrl });
    }

    private setPrice = (event: ChangeEvent<HTMLInputElement>) => {
        const price = +event.target.value;
        this.setState({ price });
    }

    private setStartDate = (event: ChangeEvent<HTMLInputElement>) => {
        const startDate = new Date(event.target.value);
        this.setState({ startDate });
    }

    private setEndDate = (event: ChangeEvent<HTMLInputElement>) => {
        const endDate = new Date(event.target.value);
        this.setState({ endDate });
    }

    private onSaveVacation = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            let vacation = new Vacation(this.state.id,
                this.state.destination,
                this.state.description,
                this.state.imageUrl,
                this.state.startDate,
                this.state.endDate,
                this.state.price);

            // If the vacation already has an id - update it
            if (vacation.id) {
                await axios.put("http://34.65.206.19:3001/vacations/", vacation);
            }
            // It's a new vacation - add it
            else {
                vacation.id = store.getState().vacations[store.getState().vacations.length - 1].id + 1;
                await axios.post("http://34.65.206.19:3001/vacations/", vacation);
                store.dispatch({ type: ActionType.AddVacation, payload: vacation });
            }

            this.clearFields();
            this.openAlert("success", "Successfully saved");
        }
        catch (error) {
            console.error(error);
            this.openAlert("error", error.response.data.error);
        }
    }

    private clearFields = () => {
        this.setState({
            id: null,
            destination: "",
            description: "",
            imageUrl: "",
            price: 1,
            startDate: new Date(),
            endDate: new Date()
        });
    }

    private onCancel = () => {
        let vacation = new Vacation(null, "", "", "", new Date(), new Date(), 1);
        store.dispatch({ type: ActionType.ManageVacation, payload: vacation });
        this.props.history.push("/admin");
    }

    private closeAlert = () => {
        this.setState({ isOpenAlert: false });
    }

    private openAlert = (alertType: string, alertContent: string) => {
        this.setState({ isOpenAlert: true, alertType, alertContent });
    }

    public render() {
        return (
            <div className="manage-vacation">

                {this.state.isOpenAlert && <GenericAlert show={this.state.isOpenAlert}
                    handleClose={this.closeAlert} content={this.state.alertContent}
                    styleType={this.state.alertType} />}

                <form onSubmit={this.onSaveVacation}>
                    <div className="form-input-group">
                        <div className="icon form-icon">
                            <i className="fas fa-map-pin" />
                        </div>
                        <div>
                            <input type="text" className="form-input" placeholder=" "
                                name="destination" required value={this.state.destination}
                                onChange={this.setDestination} />
                            <label className="form-label">Destination</label>
                        </div>
                    </div>

                    <div className="form-input-group">
                        <div className="icon form-icon">
                            <i className="fas fa-camera" />
                        </div>
                        <div>
                            <input type="text" className="form-input" placeholder=" "
                                name="imageUrl" maxLength={250} required
                                value={this.state.imageUrl}
                                onChange={this.setImageUrl} />
                            <label className="form-label">Image</label>
                        </div>
                    </div>

                    <div className="form-input-group">
                        <div className="icon form-icon">
                            <i className="fas fa-dollar-sign" />
                        </div>
                        <div>
                            <input type="number" className="form-input" placeholder=" "
                                name="price" min="1" required value={this.state.price}
                                onChange={this.setPrice} />
                            <label className="form-label">Price</label>
                            <div className="icon error-icon" >
                                <i className="fas fa-exclamation-circle">
                                    <small> must be greater than 0</small></i>
                            </div>
                        </div>
                    </div>

                    <div className="form-input-group">
                        <div className="icon form-icon">
                            <i className="fas fa-calendar-alt" />
                        </div>
                        <div>
                            <input type="date" className="form-input" placeholder=" "
                                min={new Date().toISOString().split('T')[0]}
                                value={this.state.startDate.toISOString().split('T')[0]}
                                name="startDate" required
                                onChange={this.setStartDate} />
                            <label className="form-label">Start Date</label>
                        </div>
                    </div>

                    <div className="form-input-group">
                        <div className="icon form-icon">
                            <i className="fas fa-calendar-alt" />
                        </div>
                        <div>
                            <input type="date" className="form-input" placeholder=" "
                                min={this.state.startDate.toISOString().split('T')[0]}
                                value={this.state.endDate.toISOString().split('T')[0]}
                                name="endDate" required
                                onChange={this.setEndDate} />
                            <label className="form-label">End Date</label>
                            <div className="icon error-icon">
                                <i className="fas fa-exclamation-circle">
                                    <small> must be later than start date</small></i>
                            </div>
                        </div>
                    </div>

                    <div className="form-input-group textarea-group">
                        <div className="icon form-icon">
                            <i className="fas fa-info" />
                        </div>
                        <div className="form-textarea">
                            <textarea className="form-input" placeholder=" "
                                name="description" maxLength={800} required
                                value={this.state.description}
                                onChange={this.setDescription} />
                            <label className="form-label">Description</label>
                        </div>
                    </div>

                    <input type="button" className="btn cancel-btn"
                        value="Cancel" onClick={this.onCancel} />
                    <input type="submit" className="btn" value="Save" />

                </form>

            </div>
        );
    }
}