import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

axios.defaults.baseURL = process.env.API_OPENWHATER;

export const getClimate = async (lon: number, lat:number, date?: string) => 
        axios.get(`/forecast?appid=${process.env.API_OPENWHATER_KEY}&lat=${lat}&lon=${lon}&units=imperial&lang=es`)
             .then(({data}) => {
               return data.list.map((item: any) => {
                  return { date: item.dt_txt, tempMin: item.main.temp_min, tempMax: item.main.temp_max, wheater: item.weather[0].description}
               })
            });
    