import React, { useEffect, useState } from 'react';
import { getUpcomingTasks } from '../services/taskmanagementservice';
import { List, ListItem, ListItemText, Typography, Paper, Avatar, ListItemAvatar, IconButton } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

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

    useEffect(() => {
        fetchTasks();
    }, [email, triggerRefresh]);


    if (tasks.length === 0) {
        return (
            <Typography variant="subtitle1" style={{ marginTop: 20, textAlign: 'center' }}>
                No tasks added yet. Add some tasks!
            </Typography>
        );
    }

    return (
        <Paper elevation={3} style={{ marginTop: 20, padding: '20px' }}>
            <Typography variant="h6" style={{ marginBottom: 10 }}>
                Upcoming Tasks
            </Typography>
            <List>
                {tasks.map((task, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar>
                                <EventIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={task.title}
                            secondary={`Due on ${format(new Date(task.dueDate), 'MMMM d, yyyy, h:mm a')}`}
                        />
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default UpcomingTasks;
