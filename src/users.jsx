import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseStringPromise } from "xml2js"; // 설치 필요: npm install xml2js

function Users() {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // API 요청
        const response = await axios.get(
          "http://swopenAPI.seoul.go.kr/api/subway/70626e7a41726c613637536c4e534c/json/realtimeStationArrival/0/5/서울"
        );
  
        // XML 데이터를 JSON으로 변환
        const result = await parseStringPromise(response.data, { explicitArray: false });
        const rows = result.realtimeStationArrival.row;
  
        // 데이터를 콘솔에 출력
        console.log("Fetched data:", result);
        console.log("Parsed rows:", rows);
  
        // 각 열차 정보를 자세히 출력
        rows.forEach((arrival, index) => {
          console.log(`Train ${index + 1}:`);
          console.log("Train Line:", arrival.trainLineNm);
          console.log("Arrival Message:", arrival.arvlMsg2);
          console.log("Train Status:", arrival.btrainSttus);
          console.log("Train Number:", arrival.btrainNo);
          console.log("Station Name:", arrival.bstatnNm);
          console.log("Direction:", arrival.updnLine);
          console.log("Arrival Code:", arrival.arvlCd);
          console.log("-----------------------------------");
        });
  
        // 데이터 설정
        setArrivals(Array.isArray(rows) ? rows : [rows]);
      } catch (e) {
        console.error("Error fetching data:", e); // 에러를 콘솔에 출력
        setError(e);
      }
      setLoading(false);
    };
  
    fetchData();
  }, []);
  

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div>
      <h1>실시간 지하철 도착 정보</h1>
      <ul>
        {arrivals.map((arrival, index) => (
          <li key={index}>
            <strong>{arrival.trainLineNm}</strong> - {arrival.arvlMsg2} ({arrival.btrainSttus})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
