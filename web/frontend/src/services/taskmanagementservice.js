import axios from 'axios';

// Set up a base instance of axios
const api = axios.create({
  baseURL: window.configs.apiUrl,
});

// Function to add a task
export const addTask = async (taskDetails) => {
  try {
    const response = await api.post('/create-task', taskDetails);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Function to get upcoming tasks
export const getUpcomingTasks = async (email) => {
  try {
    const response = await api.get('/tasks', {
      params: {
        email: email,
        upcoming: 'true', // Assuming your backend supports this query parameter for filtering upcoming tasks
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    throw error;
  }
};

// Function to delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/delete-task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};