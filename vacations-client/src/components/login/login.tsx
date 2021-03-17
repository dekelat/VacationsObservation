import axios from "axios";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Link } from "react-router-dom";
import { SuccessfulLoginServerResponse } from "../../models/SuccessfulLoginServerResponse";
import { UserLoginDetails } from "../../models/UserLoginDetails";

interface LoginState {
    userName: string;
    password: string;
}

export default class Login extends Component<any, LoginState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            userName: "",
            password: ""
        }
    }

    private setUserName = (event: ChangeEvent<HTMLInputElement>) => {
        const userName = event.target.value;
        this.setState({ userName });
    }

    private setPassword = (event: ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        this.setState({ password });
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

    private login = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            let userLoginDetails = new UserLoginDetails(this.state.userName, this.state.password);
            const response = await axios.post<SuccessfulLoginServerResponse>
                ("http://34.65.206.19:3001/users/login", userLoginDetails);
            const serverResponse = response.data;

            const userToken = axios.defaults.headers.common['authorization'] = serverResponse.token;
            sessionStorage.setItem("userToken", userToken);
            sessionStorage.setItem("userName", userLoginDetails.userName);

            if (serverResponse.userType === "ADMIN") {
                sessionStorage.setItem("userType", "ADMIN");
                this.props.history.push('/admin');
            }
            else if (serverResponse.userType === "CUSTOMER") {
                sessionStorage.setItem("userType", "CUSTOMER");
                this.props.history.push('/customer');
            }
        }
        catch (error) {
            alert(error.response.data.error);
        }
    }

    public render() {
        return (
            <div className="login">
                <form onSubmit={this.login}>

                    <div className="form-input-group">
                        <div className="icon form-icon">
                            <i className="fas fa-user" />
                        </div>
                        <div>
                            <input type="text" className="form-input" placeholder=" "
                                value={this.state.userName} onChange={this.setUserName}
                                name="username" required />
                            <label className="form-label">Username</label>
                        </div>
                    </div>

                    <div className="form-input-group">
                        <div className="icon form-icon">
                            <i className="fas fa-lock" />
                        </div>
                        <div>
                            <input type="password" className="form-input" placeholder=" "
                                value={this.state.password} onChange={this.setPassword}
                                name="password" required />
                            <label className="form-label">Password</label>
                        </div>
                    </div>

                    <input type="submit" className="btn" value="login" />
                    <Link to="/register" className="link">Not a member yet?</Link>
                </form>
            </div>
        );
    }
}