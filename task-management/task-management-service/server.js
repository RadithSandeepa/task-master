import express from 'express';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';
import Task from './taskModel.js';

const app = express();
const port = 8090; // You can choose any port that is free
app.use(bodyParser.json());

// Sync Sequelize models
Task.sequelize.sync().then(() => {
    console.log(`Database & tables created!`);
});

app.use(bodyParser.json());

// Get tasks endpoint
app.get('/tasks', async (req, res) => {
    try {
        const { upcoming, email } = req.query;
        let whereCondition = {};

        if (upcoming === 'true') {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            whereCondition.appointmentDate = {
                [Sequelize.Op.gte]: now,
                [Sequelize.Op.lt]: tomorrow,
            };
        }

        if (email) {
            whereCondition.email = email; 
        }

        // Filter by email address if provided
        const tasks = await Task.findAll({
            where: whereCondition,
            order: [['dueDate', 'ASC']], // Optionally, order by due date
        });

        res.status(200).send(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send(error);
    }
});

// Create task endpoint
app.post('/tasks', async (req, res) => {
    try {
        const { name, title, dueDate, email } = req.body;
        const newTask = await Task.create({ name, title, dueDate, email });
        res.status(201).send(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send(error);
    }
});

// Update task endpoint
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { name, title, dueDate, email } = req.body;

    try {
        const task = await Task.findOne({ where: { id } });

        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        task.name = name;
        task.title = title;
        task.dueDate = dueDate;
        task.email = email;

        await task.save();
        res.status(200).send(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send(error);
    }
});

// Delete task endpoint
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Task.destroy({ where: { id } });

        if (result === 0) {
            return res.status(404).send({ message: 'Task not found' });
        }

        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
