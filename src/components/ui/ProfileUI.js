import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import {
  CameraAlt,
  Edit,
  MoreHoriz,
  ThumbUp,
  Comment,
  Share,
  VideoCall,
  PhotoCamera,
  Event,
} from "@mui/icons-material";

const ProfileUI = () => {
  const [postContent, setPostContent] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // Cập nhật state
    }
  }, []);

  // Render giao diện
  if (!user) {
    return <p>No user data found.</p>;
  }
  const posts = [
    {
      id: 1,
      author: "Hoàng Phi",
      date: "9 Tháng 3, 2024",
      content:
        "Khai trương web bán 4g siêu rẻ cho anh ae sale chỉ với 15k / tháng nhanh tay cài đặt cho mình 1 gói nào đi đâu cũng có mạng sài , đúng k giới hạn tốc độ cao mãi zô 👇👇\n\nLink web : https://datasieure.click",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 2,
      author: "Hoàng Phi",
      date: "8 Tháng 3, 2024",
      content: "Hôm nay là một ngày tuyệt vời! 🌞",
      image: null,
    },
    {
      id: 3,
      author: "Hoàng Phi",
      date: "7 Tháng 3, 2024",
      content:
        "Đã có ai thử dịch vụ mới của chúng tôi chưa? Hãy chia sẻ trải nghiệm của bạn nhé!",
      image: "/placeholder.svg?height=300&width=500",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {/* Cover Image Section */}
      <Box sx={{ 
        position: "relative", 
        borderRadius: "16px", 
        overflow: "hidden",
        height: 300,
        mb: 4,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
      }}>
        <img
          src="/placeholder.svg?height=300&width=800"
          alt="Set background"
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover"
          }}
        />
        <Button
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
      </Box>

      {/* Profile Info Section */}
      <Box sx={{ 
        px: 4, 
        mb: 4,
        display: "flex",
        alignItems: "flex-end",
        gap: 3
      }}>
        <Box sx={{ position: "relative", mt: -8 }}>
          <Avatar
            src={user.avatar}
            alt="Hoàng Phi"
            sx={{
              width: 168,
              height: 168,
              border: "4px solid white",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h5">{user.fullName}</Typography>
          <Typography color="textSecondary">2,3K người bạn</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained">+ Thêm vào tin</Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            style={{ marginLeft: "8px" }}
          >
            Chỉnh sửa trang cá nhân
          </Button>
        </Grid>
      </Grid>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Bài viết" />
        <Tab label="Giới thiệu" />
        <Tab label="Bạn bè" />
        <Tab label="Ảnh" />
        <Tab label="Video" />
        <Tab label="Reels" />
      </Tabs>

      {/* Content Section */}
      {tabValue === 0 && (
        <Grid container spacing={3} sx={{ px: 4 }}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={5} lg={4}>
            <Card sx={{ 
              borderRadius: "16px",
              mb: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Giới thiệu
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography>🎥 YTB: ANH PHI</Typography>
                  <Typography>
                    🌐 Web hack data 4g giá rẻ: https://datasieure.click
                  </Typography>
                  <Typography>🏢 Làm việc tại make money online</Typography>
                  <Typography>💼 Làm việc tại Freelancer</Typography>
                  <Typography>👥 1.831 người theo dõi</Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ 
                    mt: 3,
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: "medium"
                  }}
                >
                  Chỉnh sửa chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={7} lg={8}>
            {/* Create Post Card */}
            <Card sx={{ 
              borderRadius: "16px",
              mb: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
            }}>
              <CardContent>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Avatar src="/placeholder.svg?height=40&width=40" />
                  <TextareaAutosize
                    minRows={2}
                    placeholder="Bạn đang nghĩ gì?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "20px",
                      border: "1px solid #ddd",
                      resize: "none",
                      fontFamily: "inherit",
                      fontSize: "1rem",
                    }}
                  />
                </Box>
                <Box sx={{ 
                  display: "flex",
                  gap: 2,
                  borderTop: "1px solid #eee",
                  pt: 2
                }}>
                  <Button
                    startIcon={<VideoCall />}
                    sx={{ 
                      flex: 1,
                      borderRadius: "20px",
                      textTransform: "none",
                      fontWeight: "medium"
                    }}
                  >
                    Video trực tiếp
                  </Button>
                  <Button
                    startIcon={<PhotoCamera />}
                    sx={{ 
                      flex: 1,
                      borderRadius: "20px",
                      textTransform: "none",
                      fontWeight: "medium"
                    }}
                  >
                    Ảnh/Video
                  </Button>
                  <Button
                    startIcon={<Event />}
                    sx={{ 
                      flex: 1,
                      borderRadius: "20px",
                      textTransform: "none",
                      fontWeight: "medium"
                    }}
                  >
                    Sự kiện
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <Card 
                key={post.id} 
                sx={{ 
                  borderRadius: "16px",
                  mb: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      src="/placeholder.svg?height=40&width=40"
                      alt={post.author}
                    />
                  }
                  action={
                    <IconButton>
                      <MoreHoriz />
                    </IconButton>
                  }
                  title={
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {post.author}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      {post.date}
                    </Typography>
                  }
                />
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
                    {post.content}
                  </Typography>
                  {post.image && (
                    <Box sx={{ 
                      borderRadius: "16px",
                      overflow: "hidden",
                      mb: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}>
                      <img
                        src={post.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                    </Box>
                  )}
                  <Box sx={{ 
                    display: "flex",
                    gap: 2,
                    borderTop: "1px solid #eee",
                    pt: 2
                  }}>
                    <Button
                      startIcon={<ThumbUp />}
                      sx={{ 
                        flex: 1,
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: "medium"
                      }}
                    >
                      Thích
                    </Button>
                    <Button
                      startIcon={<Comment />}
                      sx={{ 
                        flex: 1,
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: "medium"
                      }}
                    >
                      Bình luận
                    </Button>
                    <Button
                      startIcon={<Share />}
                      sx={{ 
                        flex: 1,
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: "medium"
                      }}
                    >
                      Chia sẻ
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Box sx={{ px: 4 }}>
          <Card sx={{ 
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Giới thiệu
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography>🎥 YTB: ANH PHI</Typography>
                <Typography>
                  🌐 Web hack data 4g giá rẻ: https://datasieure.click
                </Typography>
                <Typography>🏢 Làm việc tại make money online</Typography>
                <Typography>💼 Làm việc tại Freelancer</Typography>
                <Typography>👥 1.831 người theo dõi</Typography>
                <Typography>🔗 datasieure.click</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  sx={{ 
                    flex: 1,
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: "medium"
                  }}
                >
                  Chỉnh sửa tiểu sử
                </Button>
                <Button
                  variant="outlined"
                  sx={{ 
                    flex: 1,
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: "medium"
                  }}
                >
                  Chỉnh sửa chi tiết
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};
export default ProfileUI;
