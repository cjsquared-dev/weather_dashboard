import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  try {
      // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);
      // TODO: save city to search history
      const savedCity = await HistoryService.addCity(city);
      return res.status(200).json({ weatherData, savedCity });
  } catch (error) {
    return res.status(500).json({ message: 'Error retreiving weather data.' });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting city from search history.' });
  }
});

export default router;
