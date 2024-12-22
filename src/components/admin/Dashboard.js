import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiBarChart2 } from 'react-icons/fi';
import { mockStats, mockReports } from '../../mock/reportData';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const recentReports = mockReports.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reports"
          value={mockStats.totalReports}
          icon={FiBarChart2}
          color="text-blue-600"
        />
        <StatCard
          title="Pending Reports"
          value={mockStats.pendingReports}
          icon={FiClock}
          color="text-yellow-600"
        />
        <StatCard
          title="Resolved Reports"
          value={mockStats.resolvedReports}
          icon={FiCheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Recent Reports (24h)"
          value={mockStats.recentReports}
          icon={FiAlertCircle}
          color="text-red-600"
        />
      </div>

      {/* Report Types Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Report Types Distribution</h2>
          <div className="space-y-4">
            {Object.entries(mockStats.reportTypes).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{type}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(count / mockStats.totalReports) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <img
                  src={report.user.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {report.user.name}
                  </p>
                  <p className="text-sm text-gray-500">{report.type}</p>
                </div>
                <span
                  className={`ml-auto px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
