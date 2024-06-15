import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

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

    const options = {
        chart: {
            type: 'pie',
        },
        labels: ['Total Tickets', 'Total Open Tickets', 'Total ReOpen Tickets', 'Total Closed Tickets'],
        legend: {
            position: 'bottom',
        },
        colors: ['#00a651', '#ffcc5c', '#005c91', '#ff6f31'],
    };

    // const series = [43.8, 31.3, 18.8, 6.3];
    // const series = [showCount?.totalTickets, showCount?.totalOpenTickets, reopenTicketTotal, showCount?.totalClosedTickets];
    const series = [
        showCount?.totalTickets || 0,
        showCount?.totalOpenTickets || 0,
        reopenTicketTotal || 0,
        showCount?.totalClosedTickets || 0,
    ];
    return (
        <div>
            <div id="chart" className='d-flex justify-content-center'>
                {
                    showCount?.totalTickets !== undefined ? (
                        <Chart options={options} series={series} type="pie" width={400} />
                    ) :
                        (
                            <div style={{ width: "400px" }}></div>
                        )
                }
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default TicketChart;
