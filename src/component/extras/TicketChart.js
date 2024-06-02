import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const TicketChart = (props) => {
    const { dashboardCount } = props;
    const [showCount, setCount] = useState({});
    const [reopenTicketTotal, setReopenTicket] = useState(0)

    useEffect(() => {
        if (dashboardCount !== undefined) {
            setCount(dashboardCount);
            const totalReopen = dashboardCount?.totalTickets - dashboardCount?.totalOpenTickets - dashboardCount?.totalClosedTickets
            setReopenTicket(totalReopen)
        }
        console.log(showCount?.totalTickets, showCount?.totalOpenTickets, showCount?.totalClosedTickets);
    }, [dashboardCount]);

    const chartOptions = {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Total Tickets', 'Total Open Tickets','Total ReOpen Tickets', 'Total Closed Tickets'],
        colors: ['rgb(255, 58, 110)', 'rgb(62, 201, 214)',,'rgb(255, 162, 29)', '#ff0000'], // Colors array
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <div>
            <div id="chart">
                {
                    showCount !== undefined && (
                        <ReactApexChart
                        options={{
                            ...chartOptions,
                            colors: ['rgb(255, 58, 110)', 'rgb(62, 201, 214)','rgb(255, 162, 29)', '#ff0000'] // Specify colors here
                        }}
                            series={[showCount?.totalTickets, showCount?.totalOpenTickets,reopenTicketTotal, showCount?.totalClosedTickets]}
                            type="pie"
                            width={380}
                        />
                    )
                }
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default TicketChart;
