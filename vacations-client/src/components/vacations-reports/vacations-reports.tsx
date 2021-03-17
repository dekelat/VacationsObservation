import axios from "axios";
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { VacationStats } from "../../models/VacationStats";
import "./vacations-reports.css";
import backIcon from "../../resources/beach.svg";

interface VacationsReportsState {
    labels: string[];
    data: number[];
}

export default class VacationsReports extends Component<any, VacationsReportsState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            labels: [],
            data: []
        }
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

        this.getFollowingStats(token);
    }

    private getFollowingStats = async (token: string) => {
        axios.defaults.headers.common['authorization'] = token;
        try {
            const response = await axios.get<VacationStats[]>(
                "http://34.65.206.19:3001/vacations/followed_vacations/");
            const labels = response.data.map(a => "Vacation " + a.vacationId);
            const data = response.data.map(a => a.numOfFollowers);
            this.setState({ labels, data });
        }
        catch (error) {
            alert(error.response.data.error);
        }
    }

    private randomColorPlugin = {
        beforeUpdate: function (chart: Chart) {

            var backgroundColor = [];
            var borderColor = [];

            // For every data we have ...
            for (var i = 0; i < chart.config.data.datasets[0].data.length; i++) {

                // Generate a random color
                var color = "rgba(" + Math.floor(Math.random() * 255) + "," +
                    Math.floor(Math.random() * 255) + "," +
                    Math.floor(Math.random() * 255) + ",";

                // Push this new color to both background and border color arrays
                backgroundColor.push(color + "0.6)");
                borderColor.push(color + "1)");
            }

            // Update the chart bars color properties
            chart.config.data.datasets[0].backgroundColor = backgroundColor;
            chart.config.data.datasets[0].borderColor = borderColor;

        }
    };

    public render() {
        return (
            <div className="reports-chart">

                <div className="menu">
                    <Link to="/admin" >
                        <img className="icon-img" src={backIcon} alt="chart" />Back Home
                    </Link>
                </div>

                <Bar plugins={[this.randomColorPlugin]}
                    data={{
                        labels: this.state.labels,
                        datasets: [
                            {
                                label: 'Followers',
                                data: this.state.data,
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                borderWidth: 2
                            }
                        ]
                    }}
                    options={{
                        title: {
                            display: true,
                            text: 'Vacations Followers',
                            fontSize: 20
                        },
                        scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Number of Followers'
                                },
                                ticks: {
                                    beginAtZero: true
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Vacation Identifier'
                                }
                            }]
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            backgroundColor: 'rgb(255, 255, 255)',
                            titleFontColor: 'rgb(0, 0, 0)',
                            bodyFontStyle: 'bold',
                            bodyFontSize: 14,
                            displayColors: false,
                            callbacks: {
                                title: function (tooltipItem, data) {
                                    if (tooltipItem.length > 0) {
                                        return "Vacation " + tooltipItem[0].xLabel + ": ";
                                    }
                                    return "";
                                },
                                label: function (tooltipItem, data) {
                                    if (data.datasets.length > 0) {
                                        return tooltipItem.value + " " +
                                            data.datasets[tooltipItem.datasetIndex].label;
                                    }
                                    return "";
                                },
                                labelTextColor: function (tooltipItem, chart) {
                                    let index = tooltipItem.index;
                                    let backgroundColors = new Array();
                                    backgroundColors.push(chart.data.datasets[0].backgroundColor);
                                    return backgroundColors[0][index];
                                }
                            }
                        }
                    }}
                />
            </div>
        );
    }
}