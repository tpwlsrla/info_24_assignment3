import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DashboardPage } from './api.jsx';
import { StationListPage, DirectionPieChart,DirectionHistogram, TrainLineHistogram } from './api.jsx';


function App() {
return (
  <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">지하철 정보 시스템</h1>
            <div className="space-x-6">
              <Link
                to="/"
                className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300"
              >
                대시보드
              </Link>
              <br/>
              <Link
                to="/stations"
                className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300"
              >
                역사 목록
              </Link>
              <br/>
              <Link
                to="/pie"
                className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300"
              >
                상/하행 비율
              </Link>
              <br/>
              <Link
                to="/histo"
                className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300"
              >
                상/하행 비율 히스토그램
              </Link>
              <br/>
              <Link
                to="/trainhisto"
                className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-300"
              >
                열차 노선별 히스토그램
              </Link>
              <br/>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto mt-6 px-4">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/stations" element={<StationListPage />} />
            <Route path="/pie" element={<DirectionPieChart />} />
            <Route path="/histo" element={<DirectionHistogram />} />
            <Route path="/trainhisto" element={<TrainLineHistogram />} />
          </Routes>
        </div>
      </div>
    </Router>
);
}



export default App;
