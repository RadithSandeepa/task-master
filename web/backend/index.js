import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import authenticate from './src/authenticate.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 8080;
app.use(bodyParser.json())

async function getAccessToken() {
    const tokenUrl = process.env.TASKS_OAUTH_TOKEN_URL; 
    const clientId = process.env.TASKS_OAUTH_CLIENT_ID; 
    const clientSecret = process.env.TASKS_OAUTH_CLIENT_SECRET; 

    try {
        const accessToken = await authenticate(tokenUrl, clientId, clientSecret);
        return accessToken;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        throw error; // Rethrow the error to handle it in the calling context
    }
}

// Endpoint to get tasks, filtering by email
app.get('/tasks', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).send('Email query parameter is required');
        }

        const accessToken = await getAccessToken();

        const taskmanagementServiceUrl = process.env.TASK_SERVICE_URL; 
        const response = await axios.get(`${taskmanagementServiceUrl}/tasks?email=${email}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

// Endpoint to create a task
app.post('/create-task', async (req, res) => {
    try {
        const accessToken = await getAccessToken();

        const taskmanagementServiceUrl = process.env.TASK_SERVICE_URL; 
        if (!taskmanagementServiceUrl) {
            throw new Error('Task service URL is not defined in the environment variables');
        }

        const response = await axios.post(`${taskmanagementServiceUrl}/tasks`, req.body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});