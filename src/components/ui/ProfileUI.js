import { CameraAlt, Edit, ArrowBack } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useRef } from "react";
import { useUserPublicProfile } from "../../hooks/useUserPublicProfile";
import socket from "../../services/socket";
import SocialPost from "./SocialPost";
import {
  getFriendsList,
  getUserInfo,
  updateUserAvatar,
  updateUserCover,
  updateUserInfo,
} from "../../services/userService";
import FormUser from "./FormUser";

const API_URL = "https://dacs2-server-8.onrender.com";
const ProfileUI = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [friends, setFriends] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
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
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [fetchedPostIds, setFetchedPostIds] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [listPosts, setListPosts] = useState({});
  const postsContainerRef = useRef(null);
  const [friendId, setFriendId] = useState(null);
  const { currentUser, reload, currentUserId, isOwner } =
    useUserPublicProfile(id);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      loadPosts(1);
    }
  };

  useEffect(() => {
    getUserInfo(currentUserId).then((info) => {
      setUserInfo(info);
      setEditedInfo(info);
      setLoading(false);
    });

    // Lấy danh sách bạn bè của người đó
    getFriendsList(currentUserId).then((friendsList) => {
      setFriends(
        friendsList.map((friend) => ({
          id: friend.idUser,
          fullName: friend.fullName || "Người dùng",
          avatar:
            friend.avatar ||
            `https://api.dicebear.com/6.x/avataars/svg?seed=${friend.idUser}`,
        }))
      );
    });
  }, [currentUserId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const loadPosts = useCallback(
    (pageToLoad = 1) => {
      if (isLoadingPost || (!hasMore && pageToLoad !== 1)) return;
      if (
        friendId &&
        currentUserId == JSON.parse(localStorage.getItem("user")).idUser
      ) {
        return;
      }
      setIsLoadingPost(true);
      setError(null);

      if (pageToLoad === 1) {
        setListPosts({});
        setFetchedPostIds([]);
        setHasMore(true);
        setIsFirstLoad(true);
      }

      const isFriendRequest =
        currentUserId != JSON.parse(localStorage.getItem("user")).idUser;

      socket.emit(
        "getPostOfUser",
        currentUserId,
        fetchedPostIds,
        postsPerPage,
        page,
        isFriendRequest
      );
    },
    [currentUserId, fetchedPostIds, isLoadingPost, hasMore, postsPerPage]
  );

  const handleScroll = useCallback(() => {
    if (
      !postsContainerRef.current ||
      isLoadingPost ||
      !hasMore ||
      isLoadingMore
    )
      return;

    const container = postsContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;

    if (scrollPercentage > 80 && !isLoadingPost && hasMore) {
      setPage((prev) => prev + 1);
      setIsLoadingMore(true);
      loadPosts(page + 1);
    }
  }, [loadPosts, page, isLoadingPost, hasMore, isLoadingMore]);

  useEffect(() => {
    const container = postsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    socket.on("receivePostsAndSharePostOfUser", ({ posts, hasMorePosts }) => {
      console.log("Profile receivePosts", hasMorePosts);
      console.log("Profile receivePosts", posts);
      setListPosts((prevPosts) => {
        const newPosts = isFirstLoad ? posts : { ...prevPosts, ...posts };
        return newPosts;
      });

      setFetchedPostIds((prev) => [...prev, ...Object.keys(posts)]);
      setHasMore(hasMorePosts);
      setIsLoadingPost(false);
      setIsLoadingMore(false);
      setInitialLoadComplete(true);
      setIsFirstLoad(false);
    });

    return () => {
      socket.off("receivePostsAndSharePostOfUser");
    };
  }, [isFirstLoad]);

  useEffect(() => {
    if (!initialLoadComplete && currentUserId) {
      loadPosts(1);
    }
  }, [loadPosts, initialLoadComplete, currentUserId]);
  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(userInfo);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserInfo(currentUserId, editedInfo);
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

        await updateUserAvatar(formData);
        socket.on("updateAvatar", ({ userId, avatarPath }) => {
          reload();

          const userData = JSON.parse(localStorage.getItem("user"));
          userData.avatar = avatarPath;
          localStorage.setItem("user", JSON.stringify(userData));
        });
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

        await updateUserCover(formData);

        socket.on("updateCover", ({ userId, coverPath }) => {
          reload();

          const userData = JSON.parse(localStorage.getItem("user"));
          userData.background = coverPath;
          localStorage.setItem("user", JSON.stringify(userData));
        });
      } catch (error) {
        console.error("Error updating cover photo:", error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/homepage")}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Quay lại trang chủ
        </Button>
      </Box>
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
            currentUser?.background
              ? `${API_URL}${currentUser.background}`
              : "/default-background.png"
          }
          alt="Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {isOwner && (
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
              currentUser?.avatar
                ? `${API_URL}${currentUser.avatar}`
                : "/default-avatar.png"
            }
            alt={currentUser?.fullName || "User Avatar"}
            sx={{
              width: 168,
              height: 168,
              border: "4px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          {isOwner && (
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
            {currentUser ? currentUser.fullName : "Người dùng"}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2 }}
          ></Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {isOwner && (
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
                  {isOwner &&
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
            {/* Posts */}
            <div
              ref={postsContainerRef}
              className="space-y-4 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {isLoadingPost && isFirstLoad ? (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  Có lỗi xảy ra: {error}
                </div>
              ) : Object.keys(listPosts).length === 0 ? (
                <div className="text-center py-4">Chưa có bài viết nào</div>
              ) : (
                <>
                  {Object.entries(listPosts)
                    .sort(([, a], [, b]) => b.post.createdAt - a.post.createdAt)
                    .slice(0, page * postsPerPage)
                    .map(([postId, postData]) => {
                      if (!postData || !postData.post) return null;
                      return (
                        <SocialPost
                          key={postId}
                          postId={postData.post.postId || postId}
                          groupedLikes={postData.groupedLikes}
                          commentCountDefault={postData.commentCount}
                          post={postData.post}
                          postUser={postData.infoUserList[postData.post.idUser]}
                        />
                      );
                    })}

                  {isLoadingMore && (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                  )}

                  {!hasMore && Object.keys(listPosts).length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                      Đã hiển thị tất cả bài viết
                    </div>
                  )}
                </>
              )}
            </div>
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
                {isOwner &&
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
              <FormUser key={friend.id} idUser={friend.id} />
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};
export default ProfileUI;
