// components/MeasurementLineChart.tsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { colors } from '@/theme/colors';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MeasurementData {
    date: string;
    value: number;
}

interface MeasurementLineChartProps {
    data: MeasurementData[];
    title: string;
    yAxisLabel: string;
}

const MeasurementLineChart: React.FC<MeasurementLineChartProps> = ({ data, title, yAxisLabel }) => {
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: yAxisLabel,
                data: data.map(item => item.value),
                fill: false,
                backgroundColor: 'rgb(255, 255, 255)',
                borderColor: colors.secondary.main,
            },
        ],
    };

    console.log("Chart data is", chartData)

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: yAxisLabel,
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    return <Line className='max-h-[500px]' options={options} data={chartData} />;
};

export default MeasurementLineChart;
