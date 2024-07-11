// import axios from 'axios';

// const TASK_MANAGEMENT_SERVICE_URL = window.configs.apiUrl;

// export const addTask = async (taskDetails) => {
//   try {
//     const response = await fetch(`${TASK_MANAGEMENT_SERVICE_URL}/create-task`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(taskDetails),
//     });

//     if (!response.ok) {
//       const message = `An error has occurred: ${response.status}`;
//       console.log(response)
//       throw new Error(message);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getUpcomingTasks = async (email) => {
//   try {
//     const response = await axios.get(`${TASK_MANAGEMENT_SERVICE_URL}/tasks`, {
//       params: {
//         email: email,
//         upcoming: 'true', // Assuming your backend supports this query parameter for filtering upcoming tasks
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching upcoming tasks:', error);
//     throw error;
//   }
// };

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

