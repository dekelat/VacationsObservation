import axios from "axios";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Link } from "react-router-dom";
import { User } from "../../models/User";
import GenericAlert from "../generic-alert/generic-alert";
import "./register.css";

interface RegisterState {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    isInvalidUserName: boolean;
    isOpenAlert: boolean;
    alertType: string;
    alertContent: string;
}

export default class Register extends Component<any, RegisterState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            firstName: "",
            lastName: "",
            isInvalidUserName: false,
            isOpenAlert: false,
            alertType: "",
            alertContent: ""
        }
    }

    private setUserName = (args: ChangeEvent<HTMLInputElement>) => {
        const userName = args.target.value;
        this.setState({ userName });
    }

    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        this.setState({ password });
    }

    private setFirstName = (args: ChangeEvent<HTMLInputElement>) => {
        const firstName = args.target.value;
        this.setState({ firstName });
    }

    private setLastName = (args: ChangeEvent<HTMLInputElement>) => {
        const lastName = args.target.value;
        this.setState({ lastName });
    }

    public componentDidMount() {
        const token = sessionStorage.getItem("userToken");
        const userType = sessionStorage.getItem("userType");

        // Authenticate user
        if (token) {
            if (userType === "CUSTOMER") {
                this.props.history.push("/customer");
            }
            else {
                this.props.history.push("/admin");
            }
        }
    }

    private register = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            let user = new User(this.state.userName, this.state.password,
                'CUSTOMER', this.state.firstName, this.state.lastName);

            await axios.post("http://34.65.206.19:3001/users/", user);
            this.openAlert("success", "Registration complete! You can login now");
        }
        catch (err) {
            if (err.response.status === 601) {
                this.setState({ isInvalidUserName: true });
            }
            this.openAlert("error", err.response.data.error);
        }
    }

    private closeAlert = () => {
        this.setState({ isOpenAlert: false });
        if(this.state.alertType == "success") {
            this.props.history.push('/');
        }
    }

    private openAlert = (alertType: string, alertContent: string) => {
        this.setState({ isOpenAlert: true, alertType, alertContent });
    }

    public render() {
        return (
            <div className="register">

                {this.state.isOpenAlert && <GenericAlert show={this.state.isOpenAlert}
                    handleClose={this.closeAlert} content={this.state.alertContent}
                    styleType={this.state.alertType} />}

                <form onSubmit={this.register}>

                    <div className="form-input-group">
                        <div>
                            <input id="username" type="text" className="form-input"
                                placeholder=" " name="username"
                                value={this.state.userName} onChange={this.setUserName}
                                required />
                            <label className="form-label">Username</label>
                            {this.state.isInvalidUserName && <div className="icon error-icon">
                                <i className="fas fa-exclamation-circle">
                                    <small> User name already exists</small></i>
                            </div>}
                        </div>
                    </div>

                    <div className="form-input-group">
                        <div>
                            <input type="password" className="form-input" placeholder=" "
                                name="password" value={this.state.password}
                                onChange={this.setPassword} required />
                            <label className="form-label">Password</label>
                        </div>
                    </div>

                    <div className="form-input-group">
                        <div>
                            <input type="text" className="form-input" placeholder=" "
                                name="firstName" value={this.state.firstName}
                                onChange={this.setFirstName} required />
                            <label className="form-label">FirstName</label>
                        </div>
                    </div>

                    <div className="form-input-group">
                        <div>
                            <input type="text" className="form-input" placeholder=" "
                                name="lastName" value={this.state.lastName}
                                onChange={this.setLastName} required />
                            <label className="form-label">LastName</label>
                        </div>
                    </div>

                    <input type="submit" className="btn" value="register" />
                    <Link to="/home" className="link">Already a member?</Link>
                </form>
            </div>
        );
    }
}