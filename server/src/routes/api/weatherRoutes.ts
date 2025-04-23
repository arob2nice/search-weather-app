import { Router, type Request, type Response } from 'express';
import WeatherService from '../../service/weatherService.js';  // Import WeatherService
import HistoryService from '../../service/historyService.js';

const router = Router();

// POST Request to retrieve weather data by city name
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    
    // Call WeatherService to get weather data for the city
    const weatherData = await WeatherService.getWeatherForCity(city);
    
    // Save city to search history
    await HistoryService.addCity(city);
    
    // Return the weather data as response
    res.json(weatherData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An error occurred' });
    }
  }
});

// GET Request to retrieve weather data from city name
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    
    // Ensure city is of type string
    const weatherData = await WeatherService.getWeatherForCity(city as string);
    
    // Return the weather data as response
    res.json(weatherData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An error occurred' });
    }
  }
});

// POST Request to save city to history
router.post('/history', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    await HistoryService.addCity(city);
    res.json({ message: 'City added to search history' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// GET Request to retrieve all search history (list of cities)
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An error occurred' });
    }
  }
});

// BONUS: DELETE Request to remove city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.json({ message: 'City removed from search history' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;
