import "./home.scss";
import UpcomingTasks from '../../components/UpcomingTasks';
import TaskForm from '../../components/TaskForm';
import { Container, Typography, Box, CssBaseline, AppBar, Toolbar, IconButton, Snackbar, Divider } from '@mui/material';
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

const Home = ({ userDetails }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
    });
    const [tasksRefreshKey, setTasksRefreshKey] = useState(0);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenSnackbar = (message) => {
      setSnackbar({ open: true, message });
    };

    const triggerTaskRefresh = () => {
        setTasksRefreshKey(prevKey => prevKey + 1);
    };

    const fullName = userDetails.name ? userDetails.name : `${userDetails.first_name} ${userDetails.last_name}`;

  return (
    <div className="home">
        <p className="title">Welcome, {fullName}</p>
        <div className="body">
        <div className="left">
            <TaskForm userDetails={userDetails} onAddTask={triggerTaskRefresh} handleOpenSnackbar={handleOpenSnackbar}/>   
        </div>
        <div className="right">
            <UpcomingTasks email={userDetails.email} triggerRefresh={tasksRefreshKey} />
        </div>
        </div>
        <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
        />
    </div>
  )
}

export default Home;