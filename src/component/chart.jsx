import React from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

export function LineChart({ arrivals }) {
  const data = {
    labels: arrivals.map(item => item.btrainNo),
    datasets: [{
      label: '열차 번호',
      data: arrivals.map(item => item.btrainNo.length),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return <Line data={data} />;
}

export function BarChart({ arrivals }) {
  const data = {
    labels: arrivals.map(item => item.trainLineNm),
    datasets: [{
      label: '열차 상태 분포',
      data: arrivals.map(item => item.btrainSttus === '일반' ? 1 : 0),
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    }]
  };

  return <Bar data={data} />;
}

export function PieChart({ arrivals }) {
  const data = {
    labels: ['상행', '하행'],
    datasets: [{
      data: [
        arrivals.filter(item => item.updnLine === '상행').length,
        arrivals.filter(item => item.updnLine === '하행').length
      ],
      backgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  return <Pie data={data} />;
}