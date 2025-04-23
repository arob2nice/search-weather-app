// TODO: Define a City class with name and id properties
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

class City {
  name: any;
  id: string;
  constructor(name: any, id: string) {
    this.name = name;
    this.id = id;
  }
}


// TODO: Complete the HistoryService class
class HistoryService {

  
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const searchHistory = await fs.readFile(path.join(__dirname, 'searchHistory.json'), 'utf8');
    return JSON.parse(searchHistory);
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.writeFile(path.join(__dirname, 'searchHistory.json'), JSON.stringify(cities));
  }  

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities.map((city: { name: any; id: string }) => new City(city.name, city.id));
  }  
    

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.getCities();
    const newCity = new City(city, uuidv4());
    cities.push(newCity);
    await this.write(cities);
  }  

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
 async removeCity(id: string) {
     const cities = await this.getCities();
     const updatedCities = cities.filter((city: { id: string }) => city.id !== id);
     await this.write(updatedCities);
  }
}

export default new HistoryService();
