import { useState } from "react";
import handleSetInfo from "../../controller/HandleSetInfo";
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
  const [userData, setUserData] = useState({fullname:"",avatar:""});
  
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
    <Container maxWidth="md">
      <Box position="relative">
        <img
          src="/placeholder.svg?height=300&width=800"
          alt="Set background"
          style={{ width: "100%", height: 200, objectFit: "cover" }}
        />
        <Button
          variant="outlined"
          startIcon={<CameraAlt />}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Chỉnh sửa ảnh bìa
        </Button>
      </Box>

      <Grid
        container
        spacing={2}
        alignItems="center"
        style={{
          marginTop: "-50px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <Grid item>
          <Avatar
            src="/placeholder.svg?height=128&width=128"
            alt="Hoàng Phi"
            sx={{ width: 128, height: 128, border: "4px solid white" }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h5">Hoàng Phi</Typography>
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

      {tabValue === 0 && (
        <Box mt={4}>
          <Card>
            <CardContent>
              <TextareaAutosize
                minRows={3}
                placeholder="Bạn đang nghĩ gì?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                style={{ width: "100%", padding: "8px", fontFamily: "inherit" }}
              />
              <Grid container spacing={2} style={{ marginTop: "16px" }}>
                <Grid item>
                  <Button variant="outlined" startIcon={<VideoCall />}>
                    Video trực tiếp
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" startIcon={<PhotoCamera />}>
                    Ảnh/Video
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" startIcon={<Event />}>
                    Sự kiện trong đời
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box mt={4}>
            {posts.map((post) => (
              <Card key={post.id} style={{ marginBottom: "16px" }}>
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
                  title={post.author}
                  subheader={post.date}
                />
                <CardContent>
                  <Typography>{post.content}</Typography>
                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      style={{
                        marginTop: "16px",
                        borderRadius: "8px",
                        width: "100%",
                      }}
                    />
                  )}
                  <Grid container spacing={2} style={{ marginTop: "16px" }}>
                    <Grid item>
                      <Button startIcon={<ThumbUp />}>Thích</Button>
                    </Grid>
                    <Grid item>
                      <Button startIcon={<Comment />}>Bình luận</Button>
                    </Grid>
                    <Grid item>
                      <Button startIcon={<Share />}>Chia sẻ</Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Giới thiệu
              </Typography>
              <Typography>YTB: ANH PHI</Typography>
              <Typography>
                Web hack data 4g giá rẻ : https://datasieure.click
              </Typography>
              <Button variant="outlined" style={{ marginTop: "16px" }}>
                Chỉnh sửa tiểu sử
              </Button>
              <Box mt={4}>
                <Typography>🏢 Làm việc tại make money online</Typography>
                <Typography>🏢 Làm việc tại Freelancer</Typography>
                <Typography>👥 Có 1.831 người theo dõi</Typography>
                <Typography>🌐 datasieure.click</Typography>
              </Box>
              <Button variant="outlined" style={{ marginTop: "16px" }}>
                Chỉnh sửa chi tiết
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};
export default ProfileUI;
