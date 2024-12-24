import React from "react";
import { FiTrash2, FiEye, FiSettings, FiMail, FiCheck } from "react-icons/fi";
import socket from "../../services/socket";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [nextKey, setNextKey] = React.useState(null);
  const [hasMore, setHasMore] = React.useState(true);
  const [showProcessDialog, setShowProcessDialog] = React.useState(false);
  const [processingReport, setProcessingReport] = React.useState(null);
  const [selectedAction, setSelectedAction] = React.useState(null);
  const [emailContent, setEmailContent] = React.useState("");
  const idUser = JSON.parse(localStorage.getItem("user"))?.idUser;
  const LIMIT = 4;
  const isInitialLoad = React.useRef(true);
  const currentKey = React.useRef(null);

  const handleReportResponse = (data) => {
    if (data.success) {
      if (isInitialLoad.current) {
        setReports(data.reports);
        isInitialLoad.current = false;
      } else {
        setReports((prev) => [...prev, ...data.reports]);
      }

      currentKey.current = data.nextKey;
      setNextKey(data.nextKey);
      setHasMore(data.nextKey !== null);
    }
    setLoading(false);
  };

  const handleProcessReport = (report) => {
    setProcessingReport(report);
    setShowProcessDialog(true);
    setSelectedAction(null);
    setEmailContent("");
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
  };

  const handleSendEmail = () => {
    if (emailContent.trim() && processingReport) {
      const data = {
        id:
          processingReport.type === "POST"
            ? processingReport.postId
            : processingReport.commentId,
        dataMail: {
          content: emailContent,
          title: `Phản hồi báo cáo ${
            processingReport.type === "POST" ? "bài viết" : "bình luận"
          }`,
          subject: `Phản hồi báo cáo từ hệ thống`,
        },
      };

      socket.emit("sendMail", data, processingReport.type);
      setEmailContent("");
      setSelectedAction(null);
      setShowProcessDialog(false);
      setProcessingReport(null);
    }
  };

  const handleDeleteContent = () => {
    if (processingReport) {
      const confirmMessage =
        processingReport.type === "POST"
          ? "Bạn có chắc chắn muốn xóa bài viết này?"
          : "Bạn có chắc chắn muốn xóa bình luận này?";

      if (window.confirm(confirmMessage)) {
        // Delete the content first
        if (processingReport.type === "POST") {
          socket.emit("deletePost", {
            postId: processingReport.postId,
            idUser: idUser,
          });
        } else if (processingReport.type === "COMMENT") {
          const commentId = processingReport.commentId;
          socket.emit("deleteComment", { commentId, idUser });
        }

        // Remove report from UI immediately
        setReports((prev) =>
          prev.filter((report) => report.idReport !== processingReport.idReport)
        );

        // Delete the report
        socket.emit("deleteReport", processingReport.idReport);

        // Close the dialog
        setShowProcessDialog(false);
        setProcessingReport(null);
        setSelectedAction(null);
      }
    }
  };

  const handleMarkResolved = () => {
    if (processingReport) {
      socket.emit("setReadReport", {
        idReport: processingReport.idReport,
        status: "RESOLVED",
        idUser: idUser,
      });

      // Update UI immediately
      setReports((prev) =>
        prev.map((report) =>
          report.idReport === processingReport.idReport
            ? { ...report, status: "RESOLVED" }
            : report
        )
      );

      setSelectedAction(null);

      // Close the dialog
      setShowProcessDialog(false);
      setProcessingReport(null);
    }
  };

  const closeProcessDialog = () => {
    setShowProcessDialog(false);
    setProcessingReport(null);
    setSelectedAction(null);
    setEmailContent("");
  };

  const handleSubmitProcess = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const actions = {
      sendEmail: formData.get("sendEmail") === "on",
      deleteContent: formData.get("deleteContent") === "on",
      markResolved: formData.get("markResolved") === "on",
    };
    const note = formData.get("note");

    if (processingReport) {
      // Send email if checked
      if (actions.sendEmail) {
        socket.emit("sendReportEmail", {
          reportId: processingReport.idReport,
          note,
        });
      }

      // Delete reported content if checked
      if (actions.deleteContent) {
        if (processingReport.type === "POST") {
          socket.emit("deletePost", {
            postId: processingReport.postId,
            idUser: processingReport.userId,
          });
        } else if (processingReport.type === "COMMENT") {
          socket.emit("deleteComment", processingReport.commentId);
        }
      }

      // Mark as resolved if checked
      if (actions.markResolved) {
        socket.emit("updateReportStatus", {
          reportId: processingReport.idReport,
          status: "RESOLVED",
          note,
        });

        // Update UI immediately
        setReports((prev) =>
          prev.map((report) =>
            report.idReport === processingReport.idReport
              ? { ...report, status: "RESOLVED", note }
              : report
          )
        );
      }

      // Close dialog
      setShowProcessDialog(false);
      setProcessingReport(null);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore && currentKey.current !== null) {
      setLoading(true);
      socket.emit("getAllReport", {
        limit: LIMIT,
        lastKey: currentKey.current,
      });
    }
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
      setReports((prev) =>
        prev.filter((report) => report.idReport !== reportId)
      );
      if (selectedReport?.idReport === reportId) {
        setSelectedReport(null);
      }
      socket.emit("deleteReport", reportId);
    }
  };

  // Handle delete responses from server
  React.useEffect(() => {
    const handleDeleteResponse = (response) => {
      if (!response.success) {
        // If deletion failed, restore the deleted report by fetching latest data
        setLoading(true);
        socket.emit("getAllReport", {
          limit: LIMIT,
          lastKey: currentKey.current,
        });
        alert("Không thể xóa nội dung. Vui lòng thử lại sau.");
      }
    };

    socket.on("responseDeletePost", handleDeleteResponse);
    socket.on("responseDeleteComment", handleDeleteResponse);
    socket.on("responseDeleteReport", handleDeleteResponse);

    return () => {
      socket.off("responseDeletePost", handleDeleteResponse);
      socket.off("responseDeleteComment", handleDeleteResponse);
      socket.off("responseDeleteReport", handleDeleteResponse);
    };
  }, []);

  React.useEffect(() => {
    const setupSocket = () => {
      setLoading(true);
      socket.emit("getAllReport", { limit: LIMIT, lastKey: null });
      socket.on("responseAllReport", handleReportResponse);
    };

    setupSocket();

    return () => {
      socket.off("responseAllReport", handleReportResponse);
    };
  }, []);

  React.useEffect(() => {
    socket.on("responseSendEmail", (data) => {
      if (data.success) {
        showToast("Gửi email phản hồi thành công!", "success");
      } else {
        showToast("Gửi email thất bại. Vui lòng thử lại!", "error");
      }
    });

    socket.on("responseUpdateReadReport", (data) => {
      if (data.success) {
        showToast("Đánh dấu xử lý thành công!", "success");
      }
    });

    return () => {
      socket.off("responseSendEmail");
      socket.off("responseUpdateReadReport");
    };
  }, [showToast]);

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      POST: "Bài viết",
      COMMENT: "Bình luận",
      REPLY: "Phản hồi",
    };
    return labels[type] || type;
  };

  const renderActionContent = () => {
    switch (selectedAction) {
      case "email":
        return (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Nhập nội dung email..."
              rows="4"
            />
            <div className="mt-2 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSendEmail}
                disabled={!emailContent.trim()}
              >
                Gửi Email
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/homepage")}
            className="group flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-blue-600 transition-all duration-300 ease-in-out"
          >
            <FaArrowLeft className="text-lg transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Quay lại trang chủ</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
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
                            onClick={() => handleProcessReport(report)}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title="Xử lý báo cáo"
                          >
                            <FiSettings className="h-5 w-5" />
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
                {hasMore && (
                  <div className="px-6 py-4 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang tải...
                        </span>
                      ) : (
                        "Tải thêm"
                      )}
                    </button>
                  </div>
                )}
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
      {/* Process Dialog */}
      {showProcessDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full">
            <h3 className="text-lg font-medium mb-4">Xử lý báo cáo</h3>

            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleActionSelect("email")}
                >
                  <FiMail className="mr-2" />
                  Gửi Email
                </button>
                <button
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDeleteContent}
                >
                  <FiTrash2 className="mr-2" />
                  Xóa Nội Dung
                </button>
                <button
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleMarkResolved}
                >
                  <FiCheck className="mr-2" />
                  Đánh Dấu Đã Xử Lý
                </button>
              </div>
              {renderActionContent()}
              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeProcessDialog}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
