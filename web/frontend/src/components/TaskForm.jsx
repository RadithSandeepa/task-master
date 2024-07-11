import {  useState } from 'react';
import { TextField, Button, ThemeProvider } from '@mui/material';
import { addTask } from '../services/taskmanagementservice';
import "./taskform.scss";
import theme from '../theme';

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
        <ThemeProvider theme={theme}>
        <form className='form' onSubmit={handleSubmit} style={{ width: '70%'}}>
            <h5 className="header">Add Task</h5>
            <TextField
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '90%' }}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Due Date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '90%' }}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button type="submit" variant="contained" sx={{ backgroundColor: 'rgba(14, 14, 128, 0.748)', color: 'white','&:hover': {transform: 'scale(1.1)', backgroundColor: 'rgba(14, 14, 128, 0.748)', },}}  style={{ marginTop: 20, width: '80%' }}>
                Add Task
            </Button>
        </form>
        </ThemeProvider>
    );
};

export default TaskForm;
