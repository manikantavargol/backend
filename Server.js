const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Endpoint to fetch weather data
app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const apiKey = 'YOUR_WEATHER_API_KEY'; // Replace with your API key
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );

        // Extract temperature from response
        const temperature = response.data.main.temp;

        return { city, temperature };
      })
    );

    const formattedWeather = weatherData.reduce((acc, { city, temperature }) => {
      acc[city] = `${Math.round(temperature - 273.15)}C`; // Convert Kelvin to Celsius
      return acc;
    }, {});

    res.json({ weather: formattedWeather });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
