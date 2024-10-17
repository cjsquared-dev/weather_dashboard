import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
  // TODO: GET weather data from city name
  // TODO: save city to search history
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }
  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city);
    return res.status(200).json(weatherData);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving weather data', error });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving search history', error });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City removed from search history' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing city from search history', error });
  }
});

export default router;
