import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  
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
  
  VideoCall,
  PhotoCamera,
  Event,
} from "@mui/icons-material";

const ProfileUI = () => {
  const [postContent, setPostContent] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  
 
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
          src="data:image/jpeg;base64,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"
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
            src={user ? user.avatar : "/placeholder.svg?height=168&width=168"}
            alt="Hoàng Phi"
            sx={{
              width: 168,
              height: 168,
              border: "4px solid white",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}
          />
          <IconButton
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
            <CameraAlt />
          </IconButton>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
           {user ? user.fullName :  "Người dùng"}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            2,3K người bạn · 1,8K người theo dõi
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              sx={{ 
                borderRadius: "20px",
                px: 3,
                textTransform: "none",
                fontWeight: "medium"
              }}
            >
              Chỉnh sửa trang cá nhân
            </Button>
            <Button
              variant="outlined"
              sx={{ 
                borderRadius: "20px",
                px: 3,
                textTransform: "none",
                fontWeight: "medium"
              }}
            >
              + Thêm vào tin
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: "divider",
        mb: 4,
        px: 4
      }}>
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
          <Tab label="Ảnh" />
          <Tab label="Video" />
          <Tab label="Reels" />
        </Tabs>
      </Box>

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