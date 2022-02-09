import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import championData from '../dataset/champion_info_2.json'; 
import { Champion } from './champions/champion.model';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {
  constructor() { }

  data: {[index: string]:any} = championData.data;
  keys: Array<keyof {[index: string ]:Champion}> = Object.keys(championData.data);
  rowData: Champion[] = [];
  

  createDb() {
    this.keys.forEach((obj) => {
      if(this.data[obj].id >= 0){
        this.data[obj].tags = this.data[obj].tags.join(" , ")
        this.rowData.push(this.data[obj])
      }      
    });
    return {   
      champions: this.rowData
    };
  }
}