import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  constructor(temp: number, feelsLike: number, humidity: number, windSpeed: number, uvIndex: number, visibility: number) {
    this.temp = temp;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.uvIndex = uvIndex;
    this.visibility = visibility;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private APIKey = process.env.WEATHER_API_KEY || "6d108acbdb1fc897e09215a9b7d4ad1b"
  private baseURL = "https://api.openweathermap.org/data/2.5/"

  async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await axios.get(this.buildGeocodeQuery(query));0
    const [locationData] = response.data;
  
    if (!locationData) {
      throw new Error("Location not found");
    }
  
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  

  buildGeocodeQuery(query: string) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.APIKey}`;
  }
  

  buildWeatherQuery(coordinates: Coordinates) {
    return `${this.baseURL}onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIKey}&units=imperial`;
  }

  async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await axios.get(this.buildWeatherQuery(coordinates));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      throw new Error("Weather data fetch failed");
    }
  }
  

  parseCurrentWeather(response: any) {
    return new Weather(
      response.current.temp,
      response.current.feels_like,
      response.current.humidity,
      response.current.wind_speed,
      response.current.uvi,
      response.current.visibility
    );
  }

  buildForecastArray(_currentWeather: Weather, weatherData: { daily: any[] }) {
    const forecastArray = [];
    for (let i = 1; i < 6; i++) {
      const forecast = {
        date: weatherData.daily[i].dt,
        temp: weatherData.daily[i].temp.day,
        weather: weatherData.daily[i].weather[0].description,
      };
      forecastArray.push(forecast);
    }
    return forecastArray;
  }

  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData);
    return { currentWeather, forecastArray, city };

  }

  
  
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
