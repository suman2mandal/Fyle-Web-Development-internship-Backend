import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
const port = 5000;


const temp_token = process.env.key;
const token = temp_token.replace(/"/g, '');
const headers = new Headers();
headers.append("Authorization", `Bearer ${token}`);
const options = {
    method: "GET",
    headers: headers,
};

const axiosInstance = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `Bearer ${token}`
    }
});

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


app.get('/', (req, res) => {
    console.log(token,"token is ...");
    res.send('Hello World!🚀');
});

app.get('/user/:username', async (req, res) => {
    try {
        console.log(token,"token is ...");
        const username = req.params.username;
        const itemsPerPage = 10;
        const page = req.query.page || 1;
        const url = `/users/${username}/repos?page=${page}&per_page=${itemsPerPage}`;

        const response = await axiosInstance.get(url);
        const repos = response.data.map(repo => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            topics: repo.topics,
            url: repo.html_url
        }));

        res.json(repos);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching data from GitHub.');
    }
});

app.get('/user/:username/profile', async (req, res) => {
    try {
        console.log(token,"token is ...");
        const username = req.params.username;
        const url = `/users/${username}`;

        const response = await axiosInstance.get(url);
        const profile = {
            name: response.data.name,
            bio: response.data.bio,
            location: response.data.location,
            twitter_username: response.data.twitter_username,
            html_url: response.data.html_url,
            avatar_url: response.data.avatar_url
        };

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching data from GitHub.');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
