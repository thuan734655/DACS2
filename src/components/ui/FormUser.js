import { Avatar, Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserPublicProfile } from "../../hooks/useUserPublicProfile";
import { unfriendUser } from "../../services/userService";

const API_URL = "http://localhost:5000";
const FormUser = (props) => {
  const { idUser } = props;
  const navigate = useNavigate();
  const { currentUser, reload, currentUserId, isOwner } =
    useUserPublicProfile(idUser);

  const handleUnfriend = async () => {
    try {
      await unfriendUser(idUser);
      reload(); // Reload the user data after unfriending
    } catch (error) {
      console.error("Lỗi khi hủy kết bạn:", error);
    }
  };

  console.log(currentUser, idUser);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={currentUserId}>
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
          src={
            currentUser?.avatar
              ? `${API_URL}${currentUser.avatar}`
              : "/default-avatar.png"
          }
          alt={currentUser.fullName}
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
          {currentUser.fullName}
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
          onClick={() => navigate(`/profile/${currentUserId}`)}
        >
          Xem trang cá nhân
        </Button>
        {!isOwner && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleUnfriend}
            sx={{
              mt: 2,
              borderRadius: "20px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#ffebee",
              },
            }}
          >
            Hủy kết bạn
          </Button>
        )}
      </Paper>
    </Grid>
  );
};

export default FormUser;
