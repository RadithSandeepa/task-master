import React, {  useState } from 'react';
import { TextField, Button } from '@mui/material';
import { addTask } from '../services/taskmanagementservice';

const TaskForm = ({ userDetails, handleOpenSnackbar, onAddTask }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    
    //set time according to colombo time zone...
    const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Colombo"}));
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const colomboTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newTask = {
            name: userDetails.name,
            title,
            dueDate,
            email: userDetails.email,
        };

        try {
            await addTask(newTask); // Call the createTask function
            handleOpenSnackbar('Task added successfully!');
            onAddTask(newTask);
            setTitle('');
            setDueDate('');
        } catch (error) {
            console.error('Failed to add task:', error);
            handleOpenSnackbar('Failed to add task. Please try again.');
        }
    };

    const validateForm = () => {
        let isValid = true;
       
        if (!title) {
            handleOpenSnackbar('Task title is required.');
            isValid = false;
        }

        if (!dueDate) {
            handleOpenSnackbar('Due date is required.');
            isValid = false;
        }

        if (dueDate < colomboTime) {
            handleOpenSnackbar('Due date must be later than the current time.');
            isValid = false;
        }

        return isValid;
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Due Date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
                Add Task
            </Button>
        </form>
    );
};

export default TaskForm;
