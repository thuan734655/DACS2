import { useEffect, useState } from "react";
import {
  getUserInfo,
  updateUserInfo,
  getFriendsList,
  updateUserCover,
  updateUserAvatar,
} from "../../services/userService";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { CameraAlt, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const ProfileUI = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const API_URL = "http://localhost:5000";
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({
    introduction: "",
    education: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    introduction: "",
    education: "",
    location: "",
  });
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUser(JSON.parse(userData));
      setCurrentUserId(parsedUser.idUser);
      const fetchUserInfo = async () => {
        const info = await getUserInfo(parsedUser.idUser);
        setUserInfo(info);
        setEditedInfo(info);
        setLoading(false);
      };
      fetchUserInfo();
    }
  }, []);
  // Add useEffect for fetching friends
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Xem profile người khác
          const info = await getUserInfo(id);
          setUserInfo(info);
          setEditedInfo(info);
          const response = await getUserInfo(id);
          if (response && response.data) {
            setUserInfo({
              ...response.data,
              background: response.data.background,
              avatar: response.data.avatar
            });
          }
          // Lấy danh sách bạn bè của người đó
          const friendsList = await getFriendsList(id);
          setFriends(
            friendsList.map((friend) => ({
              id: friend.idUser,
              fullName: friend.fullName || "Người dùng",
              avatar:
                friend.avatar ||
                `https://api.dicebear.com/6.x/avataaars/svg?seed=${friend.idUser}`,
            }))
          );
        } else {
          // Xem profile bản thân
          const userData = localStorage.getItem("user");
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            const info = await getUserInfo(parsedUser.idUser);
            setUserInfo(info);
            setEditedInfo(info);

            // Lấy danh sách bạn bè của bản thân
            const friendsList = await getFriendsList(parsedUser.idUser);
            setFriends(
              friendsList.map((friend) => ({
                id: friend.idUser,
                fullName: friend.fullName || "Người dùng",
                avatar:
                  friend.avatar ||
                  `https://api.dicebear.com/6.x/avataaars/svg?seed=${friend.idUser}`,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(userInfo);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserInfo(user.idUser, editedInfo);
      setUserInfo(editedInfo);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setEditedInfo({
      ...editedInfo,
      [field]: event.target.value,
    });
  };
  const vietnamProvinces = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "TP Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  const educationLevels = [
    "Trung học cơ sở",
    "Trung học phổ thông",
    "Trung cấp",
    "Cao đẳng",
    "Đại học",
    "Thạc sĩ",
    "Tiến sĩ",
    "Sau tiến sĩ",
  ];
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("userId", currentUserId);

        const response = await updateUserAvatar(formData);
        console.log("Upload response:", response);

        if (response && response.data && response.data.avatarUrl) {
          setUser((prev) => ({
            ...prev,
            avatar: response.data.avatarUrl,
          }));

          const userData = JSON.parse(localStorage.getItem("user"));
          userData.avatar = response.data.avatarUrl;
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error updating avatar:", error);
        // Có thể thêm thông báo lỗi cho người dùng ở đây
      } finally {
        setIsUploading(false);
      }
    }
  };
  const handleCoverChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("cover", file);
        formData.append("userId", currentUserId);

        const response = await updateUserCover(formData);
        console.log("Upload response:", response);

        if (response && response.data && response.data.coverUrl) {
          const coverPath = response.data.coverUrl;

          // Cập nhật state
          setUserInfo((prev) => ({
            ...prev,
            background: coverPath, // Đổi từ coverPhoto thành background
          }));

          // Cập nhật localStorage
          const userData = JSON.parse(localStorage.getItem("user"));
          if (userData) {
            userData.background = coverPath; // Đổi từ coverPhoto thành background
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error("Error updating cover photo:", error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {/* Cover Image Section */}
      <Box
        sx={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          height: 300,
          mb: 4,
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={
            user?.background
              ? `${API_URL}${user.background}`
              : "/default-background.png"
          }
          alt="Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {(!id || id === currentUserId?.toString()) && (
          <>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="cover-input"
              onChange={handleCoverChange}
            />
            <label htmlFor="cover-input">
              <Button
                component="span"
                variant="contained"
                startIcon={<CameraAlt />}
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                  backdropFilter: "blur(4px)",
                }}
              >
                Chỉnh sửa ảnh bìa
              </Button>
            </label>
          </>
        )}
      </Box>

      {/* Profile Info Section */}
      <Box
        sx={{
          px: 4,
          mb: 4,
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
        }}
      >
        <Box sx={{ position: "relative", mt: -8 }}>
          <Avatar
            src={
              user?.avatar ? `${API_URL}${user.avatar}` : "/default-avatar.png"
            }
            alt={user?.fullName || "User Avatar"}
            sx={{
              width: 168,
              height: 168,
              border: "4px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          {(!id || id === currentUserId?.toString()) && (
            <>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-input"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-input">
                <IconButton
                  component="span"
                  disabled={isUploading}
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.dark" },
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {isUploading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <CameraAlt />
                  )}
                </IconButton>
              </label>
            </>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {user ? user.fullName : "Người dùng"}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2 }}
          ></Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {(!id || id === currentUserId?.toString()) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{
                  borderRadius: "20px",
                  px: 3,
                  textTransform: "none",
                  fontWeight: "medium",
                }}
              >
                Chỉnh sửa trang cá nhân
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 4,
          px: 4,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
              fontSize: "1rem",
              minWidth: "auto",
              px: 3,
            },
          }}
        >
          <Tab label="Bài viết" />
          <Tab label="Giới thiệu" />
          <Tab label="Bạn bè" />
        </Tabs>
      </Box>

      {/* Content Section */}
      {tabValue === 0 && (
        <Grid container spacing={3} sx={{ px: 4 }}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={5} lg={4}>
            <Card
              sx={{
                borderRadius: "12px",
                mb: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      color: "#1a237e",
                    }}
                  >
                    Giới thiệu
                  </Typography>
                  {(!id || id === currentUserId?.toString()) &&
                    (!isEditing ? (
                      <IconButton
                        onClick={handleEdit}
                        size="small"
                        sx={{
                          color: "primary.main",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                          },
                        }}
                      >
                        <Edit sx={{ fontSize: 18 }} />
                      </IconButton>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          onClick={handleSave}
                          variant="contained"
                          size="small"
                          sx={{
                            textTransform: "none",
                            px: 2,
                            py: 0.5,
                            borderRadius: "8px",
                            fontSize: "0.875rem",
                          }}
                        >
                          Lưu
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "none",
                            px: 2,
                            py: 0.5,
                            borderRadius: "8px",
                            fontSize: "0.875rem",
                          }}
                        >
                          Hủy
                        </Button>
                      </Box>
                    ))}
                </Box>

                {loading ? (
                  <Typography variant="body2" color="text.secondary">
                    Đang tải...
                  </Typography>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                  >
                    <Box>
                      {isEditing ? (
                        <TextareaAutosize
                          minRows={3}
                          value={editedInfo.introduction}
                          onChange={handleChange("introduction")}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            fontSize: "0.9rem",
                            fontFamily: "inherit",
                            resize: "vertical",
                            marginTop: "8px",
                          }}
                          placeholder="Viết giới thiệu về bản thân..."
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: userInfo.introduction
                              ? "#2c3e50"
                              : "#94a3b8",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.6,
                          }}
                        >
                          {userInfo.introduction ||
                            "Chưa có thông tin giới thiệu"}
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#475569",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>🎓</span> Học vấn
                      </Typography>
                      {isEditing ? (
                        <Autocomplete
                          freeSolo
                          value={
                            editedInfo.education === null
                              ? ""
                              : editedInfo.education
                          }
                          onChange={(event, newValue) => {
                            setEditedInfo({
                              ...editedInfo,
                              education: newValue === null ? "" : newValue,
                            });
                          }}
                          onInputChange={(event, newInputValue) => {
                            setEditedInfo({
                              ...editedInfo,
                              education: newInputValue || "",
                            });
                          }}
                          options={educationLevels}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              placeholder="Nhập hoặc chọn trình độ học vấn"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  fontSize: "0.9rem",
                                  backgroundColor: "#fff",
                                },
                              }}
                            />
                          )}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: userInfo.education ? "#2c3e50" : "#94a3b8",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.6,
                          }}
                        >
                          {userInfo.education || "Chưa có thông tin học vấn"}
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#475569",
                          mb: 0.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>📍</span> Nơi ở hiện
                        tại
                      </Typography>
                      {isEditing ? (
                        <Autocomplete
                          freeSolo
                          value={editedInfo.location}
                          onChange={(event, newValue) => {
                            setEditedInfo({
                              ...editedInfo,
                              location: newValue,
                            });
                          }}
                          options={vietnamProvinces}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              placeholder="Nhập hoặc chọn tỉnh thành"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  fontSize: "0.9rem",
                                  backgroundColor: "#fff",
                                },
                              }}
                            />
                          )}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: userInfo.location ? "#2c3e50" : "#94a3b8",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.6,
                          }}
                        >
                          {userInfo.location || "Chưa có thông tin nơi cư trú"}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={7} lg={8}>
            {/* Create Post Card */}
            <Card
              sx={{
                borderRadius: "16px",
                mb: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}
            ></Card>

            {/* Posts */}
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Box sx={{ px: 4 }}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#1a237e",
                  }}
                >
                  Giới thiệu
                </Typography>
                {(!id || id === currentUserId?.toString()) &&
                  (!isEditing ? (
                    <IconButton
                      onClick={handleEdit}
                      size="small"
                      sx={{
                        color: "primary.main",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.04)",
                        },
                      }}
                    >
                      <Edit sx={{ fontSize: 18 }} />
                    </IconButton>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={handleSave}
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",
                          px: 2,
                          py: 0.5,
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                        }}
                      >
                        Lưu
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outlined"
                        size="small"
                        sx={{
                          textTransform: "none",
                          px: 2,
                          py: 0.5,
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                        }}
                      >
                        Hủy
                      </Button>
                    </Box>
                  ))}
              </Box>

              {loading ? (
                <Typography variant="body2" color="text.secondary">
                  Đang tải...
                </Typography>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  <Box>
                    {isEditing ? (
                      <TextareaAutosize
                        minRows={3}
                        value={editedInfo.introduction}
                        onChange={handleChange("introduction")}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                          fontSize: "0.9rem",
                          fontFamily: "inherit",
                          resize: "vertical",
                          marginTop: "8px",
                        }}
                        placeholder="Viết giới thiệu về bản thân..."
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: userInfo.introduction ? "#2c3e50" : "#94a3b8",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.6,
                        }}
                      >
                        {userInfo.introduction ||
                          "Chưa có thông tin giới thiệu"}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#475569",
                        mb: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>🎓</span> Học vấn
                    </Typography>
                    {isEditing ? (
                      <Autocomplete
                        freeSolo
                        value={
                          editedInfo.education === null
                            ? ""
                            : editedInfo.education
                        }
                        onChange={(event, newValue) => {
                          setEditedInfo({
                            ...editedInfo,
                            education: newValue === null ? "" : newValue,
                          });
                        }}
                        onInputChange={(event, newInputValue) => {
                          setEditedInfo({
                            ...editedInfo,
                            education: newInputValue || "",
                          });
                        }}
                        options={educationLevels}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            placeholder="Nhập hoặc chọn trình độ học vấn"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                backgroundColor: "#fff",
                              },
                            }}
                          />
                        )}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: userInfo.education ? "#2c3e50" : "#94a3b8",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.6,
                        }}
                      >
                        {userInfo.education || "Chưa có thông tin học vấn"}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#475569",
                        mb: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>📍</span> Nơi ở hiện
                      tại
                    </Typography>
                    {isEditing ? (
                      <Autocomplete
                        freeSolo
                        value={editedInfo.location}
                        onChange={(event, newValue) => {
                          setEditedInfo({
                            ...editedInfo,
                            location: newValue,
                          });
                        }}
                        options={vietnamProvinces}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            placeholder="Nhập hoặc chọn tỉnh thành"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                backgroundColor: "#fff",
                              },
                            }}
                          />
                        )}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: userInfo.location ? "#2c3e50" : "#94a3b8",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.6,
                        }}
                      >
                        {userInfo.location || "Chưa có thông tin nơi cư trú"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {tabValue === 2 && (
        <Box sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#1a237e", fontWeight: 600 }}
          >
            Bạn bè ({friends.length})
          </Typography>
          <Grid container spacing={2}>
            {friends.map((friend) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={friend.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Avatar
                    src={friend.avatar}
                    alt={friend.fullName}
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 2,
                      border: "3px solid #fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "#2c3e50",
                      mb: 1,
                    }}
                  >
                    {friend.fullName}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                    onClick={() => navigate(`/profile/${friend.id}`)}
                  >
                    Xem trang cá nhân
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};
export default ProfileUI;
