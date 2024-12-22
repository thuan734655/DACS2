import React from "react";
import { FiTrash2, FiEye, FiCheckCircle } from "react-icons/fi";
import socket from "../../services/socket";

const AdminLayout = () => {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedReport, setSelectedReport] = React.useState(null);

  React.useEffect(() => {
    socket.emit("getAllReport");

    socket.on("responseAllReport", (data) => {
      if (data.success && Array.isArray(data.reports)) {
        setReports(data.reports);
        setLoading(false);
      }
    });

    return () => {
      socket.off("responseAllReport");
    };
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleResolveReport = (reportId) => {
    socket.emit("updateReportStatus", { reportId, status: "RESOLVED" });
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      socket.emit("deleteReport", { reportId });
      if (selectedReport?.idReport === reportId) {
        setSelectedReport(null);
      }
    }
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      POST: "Bài viết",
      COMMENT: "Bình luận",
      REPLY: "Phản hồi",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Báo cáo</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Tổng số: {reports.length}
            </span>
            <span className="text-sm text-yellow-500">
              Đang chờ: {reports.filter((r) => r.status === "PENDING").length}
            </span>
            <span className="text-sm text-green-500">
              Đã xử lý: {reports.filter((r) => r.status === "RESOLVED").length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lý do
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report.idReport}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getReportTypeLabel(report.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              report.status === "RESOLVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {report.status === "RESOLVED"
                              ? "Đã xử lý"
                              : "Đang chờ"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Xem chi tiết"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleResolveReport(report.idReport)}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title="Đánh dấu đã xử lý"
                          >
                            <FiCheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report.idReport)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa báo cáo"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="lg:col-span-1">
            {selectedReport ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Chi tiết báo cáo</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ID Báo cáo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedReport.idReport}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại báo cáo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {getReportTypeLabel(selectedReport.type)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lý do
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedReport.reason}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Thông tin liên quan
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {selectedReport.type === "POST" && (
                        <>
                          <p>Content: {selectedReport.relatedData.text}</p>
                          {selectedReport.relatedData.mediaUrls && (
                            <div className="mt-2">
                              <p className="font-medium">Media:</p>
                              <div className="grid grid-cols-3 gap-2 mt-1">
                                {selectedReport.relatedData.mediaUrls.map(
                                  (url, index) => (
                                    <img
                                      key={index}
                                      src={`http://localhost:5000${url}`}
                                      alt={`Media ${index + 1}`}
                                      className="w-full h-20 object-cover rounded"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {selectedReport.type === "COMMENT" && (
                        <>
                          <p>Content: {selectedReport.relatedData.text}</p>
                          {selectedReport.relatedData.fileUrls && (
                            <div className="mt-2">
                              <p className="font-medium">Media:</p>
                              <div className="grid grid-cols-3 gap-2 mt-1">
                                {selectedReport.relatedData.fileUrls.map(
                                  (url, index) => (
                                    <img
                                      key={index}
                                      src={`http://localhost:5000${url}`}
                                      alt={`Media ${index + 1}`}
                                      className="w-full h-20 object-cover rounded"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tạo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedReport.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedReport.status === "RESOLVED"
                        ? "Đã xử lý"
                        : "Đang chờ"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Chọn một báo cáo để xem chi tiết
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
