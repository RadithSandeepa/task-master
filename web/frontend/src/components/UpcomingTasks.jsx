import React, { useEffect, useState } from 'react';
import { getUpcomingTasks, deleteTask } from '../services/taskmanagementservice';
import { List, ListItem, ListItemText, Typography, Paper, Avatar, ListItemAvatar, IconButton } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import "./upcomingtasks.scss";
import theme from "../theme"
import { ThemeProvider } from '@emotion/react';

const UpcomingTasks = ({ email, triggerRefresh }) => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        if (!email) return;

        try {
            const upcomingTasks = await getUpcomingTasks(email);
            setTasks(upcomingTasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const handleDelete = async (taskId) => {
        if (!taskId) return;

        try {
            await deleteTask(taskId);
            handleOpenSnackbar('Task deleted successfully!');
            fetchTasks(); // Refresh tasks after deletion
        } catch (error) {
            console.error('Failed to delete task:', error);
            handleOpenSnackbar('Failed to delete task. Please try again.');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [email, triggerRefresh]);

    if (tasks.length === 0) {
        return (
            <Typography variant="subtitle1" style={{ marginTop: 20, textAlign: 'center' , width: '100%'}}>
                No tasks added yet. Add some tasks!
            </Typography>
        );
    }

    return (
        <ThemeProvider theme={theme}>
        <Paper elevation={3} style={{ marginTop: 20, padding: '20px' }} className='paper'>
            <Typography variant="h6" style={{ marginBottom: 10}}>
                Tasks
            </Typography>
            <List>
                {tasks.map((task, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: 'rgba(7, 7, 83, 0.4)'}}>
                                <EventIcon sx={{ color: 'rgb(7, 7, 83)'}}/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                            primary={task.title}
                            secondary={`${format(new Date(task.dueDate), 'MMMM d, yyyy, h:mm a')}`}
                        />
                        <IconButton edge="end" aria-label="delete" sx={{ color: 'rgb(7, 7, 83)'}} onClick={() => handleDelete(task.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
        </ThemeProvider>
    );
};

export default UpcomingTasks;
