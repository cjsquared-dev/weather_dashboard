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
    try{
      const response = await fetch(query);
      const data = await response.json();
      return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
      console.log(error);
      return error;
    }
    

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
    const date = response.list[0].dt_txt;
    const temperature = response.list[0].main.temp;
    const windSpeed = response.list[0].wind_speed;
    const humidity = response.list[0].humidity;
    const icon = response.list[0].weather.icon;
    const iconDescription = response.list[0].weather.description;
    const city = response.city.name;
    return new Weather(date,temperature, windSpeed, humidity, icon, iconDescription, city);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData:any[]) {
    const forecastArray: Weather[] = [currentWeather];
    return weatherData.map(data => ({
      date: data.dt_txt,
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
  //console.log('coordinates:', coordinates);
  const weatherData = await this.fetchWeatherData(coordinates);
  //console.log('weatherData:', weatherData);
  const currentWeather = this.parseCurrentWeather(weatherData);
  return this.buildForecastArray(currentWeather, weatherData.list);
}
}

export default new WeatherService();
