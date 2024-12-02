import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function ChartPage() {
  const [arrivals, setArrivals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://swopenAPI.seoul.go.kr/api/subway/70626e7a41726c613637536c4e534c/json/realtimeStationArrival/0/5/서울"
        );
        const data = await response.data;
        setArrivals(data.realtimeStationArrival.row);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  // Line Chart Data
  const lineData = {
    labels: arrivals.map(item => item.btrainNo),
    datasets: [{
      label: 'Train Number',
      data: arrivals.map(item => item.btrainNo.length), // 데이터를 실제 필요에 맞게 수정
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  // Bar Chart Data
  const barData = {
    labels: arrivals.map(item => item.trainLineNm),
    datasets: [{
      label: 'Train Status Count',
      data: arrivals.map(item => item.btrainSttus === '일반' ? 1 : 0), // 예시로 일반 열차만 카운트
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  // Pie Chart Data
  const pieData = {
    labels: ['상행', '하행'],
    datasets: [{
      data: [
        arrivals.filter(item => item.updnLine === '상행').length,
        arrivals.filter(item => item.updnLine === '하행').length
      ],
      backgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  return (
    <div>
      <h1>지하철 실시간 데이터 차트</h1>

      <div>
        <h3>Line Chart</h3>
        <Line data={lineData} />
      </div>

      <div>
        <h3>Bar Chart</h3>
        <Bar data={barData} />
      </div>

      <div>
        <h3>Pie Chart</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
}

export default ChartPage;
