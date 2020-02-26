import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class FormServiceService {
  constructor(public http:HttpClient) { }
  addData(data){
  	return new Promise((resolve,reject)=>{
  		// let headers = new Headers();
      this.http.post("http://127.0.0.1:8080/addData",data).subscribe(res =>{
        resolve(res);
        console.log(" service.ts login response:");
        console.log(res);
      },(err) =>{
          reject(err);
        });
    });
  }
  removeData(data){
  	return new Promise((resolve,reject)=>{
  		// let headers = new Headers();
      this.http.post("http://127.0.0.1:8080/removeData",data).subscribe(res =>{
        resolve(res);
        console.log(" service.ts login response:");
        console.log(res);
      },(err) =>{
          reject(err);
        });
    });
  }
  update(data){
  	return new Promise((resolve,reject)=>{
  		// let headers = new Headers();
      this.http.post("http://127.0.0.1:8080/update",data).subscribe(res =>{
        resolve(res);
        console.log(" service.ts login response:");
        console.log(res);
      },(err) =>{
          reject(err);
        });
    });
  }
  getData(){
  	return new Promise((resolve,reject)=>{
  		// let headers = new Headers();
      this.http.get("http://127.0.0.1:8080/getData").subscribe(res =>{
        resolve(res);
        console.log(" service.ts login response:");
        console.log(res);
      },(err) =>{
          reject(err);
        });
    });
  }
}
