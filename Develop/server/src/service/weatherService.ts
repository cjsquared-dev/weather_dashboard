import dotenv from 'dotenv';
dotenv.config();
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  icon: string;

  constructor(city: string, temperature: number, humidity: number, windSpeed: number, uvIndex: number, icon: string) {
    this.city = city;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.uvIndex = uvIndex;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private cityName?: string;
  
  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(`${this.baseURL}/geocode/v1/json?q=${query}&api_key=${this.apiKey}`);
    const data = await response.json();
    return { lat: data.coord.lat, lon: data.coord.lon };
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return { lat: locationData.lat, lon: locationData.lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return (`${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.apiKey}`);
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return (`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`);
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery(city));
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const temperature = response.list[0].main.temp;
    const forecast = response.weather[0].icon;
    const humidity = response.list[0].main.humidity;
    const windSpeed = response.list[0].wind.speed;
    const uvIndex = response.list[0].uvIndex;
    return new Weather(this.cityName || '', temperature, humidity, windSpeed, uvIndex, forecast);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    return weatherData.map(data =>({
      data: data.dt_txt,
      temperature: data.main.temp,
      description: data.weather[0].description,
    }))
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData.list);
    return { currentWeather, forecast };

  }
}

export default new WeatherService();
