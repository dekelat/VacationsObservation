import React, { Component } from "react";
import "./generic-alert.css";

interface GenericAlertProps {
    show: boolean;
    content: string;
    handleClose: any;
    styleType: string;
    handleConfirmYes?: any;
    handleConfirmNo?: any;
}

export default class GenericAlert extends Component <GenericAlertProps>{

    public constructor(props: GenericAlertProps){
        super(props);
    }

    public render() {
        return (
            <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={this.props.handleClose}>&times;</button>

                    <div className="icon-box">
                        {this.props.styleType === 'success' && 
                        <i className="far fa-check-circle"/>}

                        {this.props.styleType === 'error' && 
                        <i className="far fa-exclamation-circle"/>}

                        {this.props.styleType === 'confirm' && 
                        <i className="far fa-question-circle"/>}
                    </div>

                    <p>{this.props.content}</p>

                    {this.props.styleType === 'confirm' && <div className="confirm">
                        <button className="btn yes" onClick={this.props.handleConfirmYes}>YES</button>
                        <button className="btn no" onClick={this.props.handleConfirmNo}>NO</button>
                    </div>}
                </div>
            </div>
        );
    }
}