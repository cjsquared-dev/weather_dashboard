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
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }

}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string = process.env.API_BASE_URL;
  private apiKey?: string = process.env.API_KEY;
  private cityName: string = '';


  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/data/2.5/weather?q=${query}&appid=${this.apiKey}`);
    const data = await response.json();
    return { lat: data.coord.lat, lon: data.coord.lon };
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return { lat: locationData.lat, lon: locationData.lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;

  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const temperature = response.current.temp;
    const description = response.current.weather[0].description;
    const windSpeed = response.current.wind_speed;
    const humidity = response.current.humidity;
    const icon = response.current.weather[0].icon;
    const iconDescription = response.current.weather[0].description;
    const city = response.name;
    return new Weather(temperature, description, windSpeed, humidity, icon, iconDescription, city);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    return weatherData.map(data => ({
      date: data.dt,
      tempF: data.temp,
      windSpeed: data.wind_speed,
      humidity: data.humidity,
      icon: data.weather[0].icon,
      iconDescription: data.weather[0].description,
      city: currentWeather.city,
    }));
  }
  // TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string): Promise<Weather[]> {
  this.cityName = city;
  const coordinates = await this.fetchAndDestructureLocationData();
  const weatherData = await this.fetchWeatherData(coordinates);
  const currentWeather = this.parseCurrentWeather(weatherData);
  return this.buildForecastArray(currentWeather, weatherData);
}
}

export default new WeatherService();
