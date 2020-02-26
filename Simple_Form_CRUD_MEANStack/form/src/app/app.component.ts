import { Component,NgZone } from '@angular/core';
import {NgForm} from '@angular/forms';
import {FormServiceService} from './form-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	formData:any={};
//   title = 'form';
  dataF :any;
  editformData:any={};
  editIndex:any;
  constructor(public service:FormServiceService,public ngZone:NgZone){
  	this.ngZone.run(()=>{

  		this.service.getData().then((result)=>{
  		this.dataF = result['users'];
  	})
  	});
  	
  }
  removeData(i){
  	console.log(i)
  	this.service.removeData(this.dataF[i]).then((result)=>{
  		console.log(result);
  		this.dataF.splice(i,1);
  		// this.dataF = result['users'];
  	})
  }
  editForm(i){
  	console.log(i);
  	this.editIndex = i;
  	// modal.open();
  	// document.getElementById("myModal").style.display="block";
  }
  update(){
  	let data={
  		_id:this.dataF[this.editIndex]._id,
  		name:this.editformData.name,
  		email:this.editformData.email,
  		msg:this.editformData.msg
  	}
  	console.log(data);
  	this.service.update(data).then((result)=>{
  		console.log(result);
  		this.dataF.splice(this.dataF[this.editIndex],1);
  		this.dataF.push(result);	
  		// this.dataF = result['users'];
  	})
  }
  Fun(p:NgForm){
  	this.service.addData(this.formData).then((result)=>{
  		console.log(result);
  		this.dataF.push(result);
  	// 	this.service.getData().then((result)=>{
  	// 	this.data = result.users;
  	// 	console.log(this.data);
  	// })
  	 ;
  	})
  }
}
