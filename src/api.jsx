import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseString } from 'xml2js';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2'; // Bar 차트를 사용해서 히스토그램을 그릴 것
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // 파이 차트에 필요한 ArcElement
  Tooltip,
  Legend
} from 'chart.js';

// 사용하려는 차트의 요소들을 등록합니다.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // 파이 차트에는 이 요소가 필수입니다.
  Tooltip,
  Legend
);
// API function to fetch subway arrivals (already defined in your code)
const API_KEY = '70626e7a41726c613637536c4e534c';
export const fetchSubwayArrivals = async () => {
  try {
    const response = await axios.get(
      `http://swopenAPI.seoul.go.kr/api/subway/${API_KEY}/xml/realtimeStationArrival/0/5/서울`
    );
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};

// Utility function to parse XML string
const parseXML = (xmlString) => {
  return new Promise((resolve, reject) => {
    parseString(xmlString, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};


export function TrainLineHistogram() {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const xmlData = await fetchSubwayArrivals();

        // XML 파싱
        const parsedData = await parseXML(xmlData);

        // 도착 데이터를 가공
        const processedArrivals = parsedData.realtimeStationArrival.row
          ? parsedData.realtimeStationArrival.row.map((row) => ({
              btrainNo: Array.isArray(row.btrainNo) ? row.btrainNo[0] : row.btrainNo,
              trainLineNm: Array.isArray(row.trainLineNm) ? row.trainLineNm[0] : row.trainLineNm,
              arvlMsg2: Array.isArray(row.arvlMsg2) ? row.arvlMsg2[0] : row.arvlMsg2,
              updnLine: Array.isArray(row.updnLine) ? row.updnLine[0] : row.updnLine,
              btrainSttus: Array.isArray(row.btrainSttus) ? row.btrainSttus[0] : row.btrainSttus,
              statnNm: Array.isArray(row.statnNm) ? row.statnNm[0] : row.statnNm,
            }))
          : [];

        setArrivals(processedArrivals);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // 1분마다 새로고침

    return () => clearInterval(interval); // 클린업 함수
  }, []);

  // 열차 노선 데이터를 기준으로 카운팅하여 히스토그램 데이터 생성
  const trainLineData = () => {
    const trainLines = {};

    arrivals.forEach((item) => {
      const line = item.trainLineNm;
      if (trainLines[line]) {
        trainLines[line]++;
      } else {
        trainLines[line] = 1;
      }
    });

    const labels = Object.keys(trainLines);
    const data = Object.values(trainLines);

    return {
      labels,
      datasets: [
        {
          label: '열차 노선별 도착 비율',
          data,
          backgroundColor: '#4CAF50',
          hoverBackgroundColor: '#45A049',
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw} 대`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: '열차 노선',
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '열차 수',
        },
      },
    },
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">열차 노선별 도착 비율 히스토그램</h2>
      <Bar data={trainLineData()} options={options} />
    </div>
  );
}



export function DirectionHistogram() {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const xmlData = await fetchSubwayArrivals();

        // XML 파싱
        const parsedData = await parseXML(xmlData);

        // 도착 데이터를 가공
        const processedArrivals = parsedData.realtimeStationArrival.row
          ? parsedData.realtimeStationArrival.row.map((row) => ({
              btrainNo: Array.isArray(row.btrainNo) ? row.btrainNo[0] : row.btrainNo,
              trainLineNm: Array.isArray(row.trainLineNm) ? row.trainLineNm[0] : row.trainLineNm,
              arvlMsg2: Array.isArray(row.arvlMsg2) ? row.arvlMsg2[0] : row.arvlMsg2,
              updnLine: Array.isArray(row.updnLine) ? row.updnLine[0] : row.updnLine,
              btrainSttus: Array.isArray(row.btrainSttus) ? row.btrainSttus[0] : row.btrainSttus,
              statnNm: Array.isArray(row.statnNm) ? row.statnNm[0] : row.statnNm,
            }))
          : [];

        setArrivals(processedArrivals);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // 1분마다 새로고침

    return () => clearInterval(interval); // 클린업 함수
  }, []);

  // 상/하행 데이터를 기준으로 카운팅하여 히스토그램 데이터 생성
  const directionData = {
    labels: ['상행', '하행'],
    datasets: [
      {
        label: '상/하행 비율',
        data: [
          arrivals.filter((item) => item.updnLine === '상행').length,
          arrivals.filter((item) => item.updnLine === '하행').length,
        ],
        backgroundColor: ['#4CAF50', '#FF5722'],
        hoverBackgroundColor: ['#45A049', '#E64A19'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw} 대`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: '상/하행',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '열차 수',
        },
      },
    },
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">상/하행 비율 히스토그램</h2>
      <Bar data={directionData} options={options} />
    </div>
  );
}

export function DirectionPieChart() {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const xmlData = await fetchSubwayArrivals();

        // Parse the XML string to a JavaScript object
        const parsedData = await parseXML(xmlData);

        // Extract and process row data
        const processedArrivals = parsedData.realtimeStationArrival.row
          ? parsedData.realtimeStationArrival.row.map((row) => ({
              btrainNo: Array.isArray(row.btrainNo) ? row.btrainNo[0] : row.btrainNo,
              trainLineNm: Array.isArray(row.trainLineNm) ? row.trainLineNm[0] : row.trainLineNm,
              arvlMsg2: Array.isArray(row.arvlMsg2) ? row.arvlMsg2[0] : row.arvlMsg2,
              updnLine: Array.isArray(row.updnLine) ? row.updnLine[0] : row.updnLine,
              btrainSttus: Array.isArray(row.btrainSttus) ? row.btrainSttus[0] : row.btrainSttus,
              statnNm: Array.isArray(row.statnNm) ? row.statnNm[0] : row.statnNm,
            }))
          : [];

        setArrivals(processedArrivals);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // 1분마다 새로고침

    return () => clearInterval(interval); // 클린업 함수
  }, []);

  const directionData = {
    labels: ['상행', '하행'],
    datasets: [
      {
        label: '상/하행 비율',
        data: [
          arrivals.filter((item) => item.updnLine === '상행').length,
          arrivals.filter((item) => item.updnLine === '하행').length,
        ],
        backgroundColor: ['#4CAF50', '#FF5722'],
        hoverBackgroundColor: ['#45A049', '#E64A19'],
      },
    ],
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">상/하행 비율</h2>
      <Pie data={directionData} />
    </div>
  );
}


export function DashboardPage() {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const xmlData = await fetchSubwayArrivals();
        
        // Parse the XML string to a JavaScript object
        const parsedData = await parseXML(xmlData);
        
        // Extract and process row data
        const processedArrivals = parsedData.realtimeStationArrival.row
          ? parsedData.realtimeStationArrival.row.map(row => ({
              btrainNo: Array.isArray(row.btrainNo) ? row.btrainNo[0] : row.btrainNo,
              trainLineNm: Array.isArray(row.trainLineNm) ? row.trainLineNm[0] : row.trainLineNm,
              arvlMsg2: Array.isArray(row.arvlMsg2) ? row.arvlMsg2[0] : row.arvlMsg2,
              updnLine: Array.isArray(row.updnLine) ? row.updnLine[0] : row.updnLine,
              btrainSttus: Array.isArray(row.btrainSttus) ? row.btrainSttus[0] : row.btrainSttus,
              statnNm: Array.isArray(row.statnNm) ? row.statnNm[0] : row.statnNm
            }))
          : [];

        setArrivals(processedArrivals);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // 1분마다 새로고침
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-6">지하철 실시간 대시보드</h1>
      <p className="text-gray-700 text-lg">현재 서울 지하철의 실시간 정보를 확인할 수 있습니다.</p>
      <StationListPage arrivals={arrivals} />
    </div>
  );
}

export function StationListPage({ arrivals = [] }) {
  return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-4">지하철 도착 정보</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">역명</th>
              <th className="border px-4 py-2 text-left">열차 번호</th>
              <th className="border px-4 py-2 text-left">노선명</th>
              <th className="border px-4 py-2 text-left">도착 메시지</th>
              <th className="border px-4 py-2 text-left">상/하행</th>
            </tr>
          </thead>
          <tbody>
            {arrivals.length > 0 ? (
              arrivals.map((arrival, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{arrival.statnNm}</td>
                  <td className="border px-4 py-2">{arrival.btrainNo}</td>
                  <td className="border px-4 py-2">{arrival.trainLineNm}</td>
                  <td className="border px-4 py-2">{arrival.arvlMsg2}</td>
                  <td className="border px-4 py-2">{arrival.updnLine}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  도착 정보가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );
}