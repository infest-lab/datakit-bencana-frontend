import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { Subject, Observable, Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-demography-form',
  templateUrl: './demography.component.html',
  styleUrls: ['./demography.component.css']
})
export class DemographyComponent implements OnInit, OnChanges, OnDestroy{
	
	@Output() display = new EventEmitter<boolean>();
	@Input() pointId:any;
	form: FormGroup;
	sub: Subscription;
	error: string='';
	success: string='';
	
	constructor(private formBuilder: FormBuilder, private appService:AppService, private authService: AuthService) {}

	ngOnInit() {
		this.buildForm();
	}
	ngOnChanges(){
		this.buildForm();
	}
	ngOnDestroy(){
		//this.sub.unsubscribe();
	}
	buildForm(){
		//console.log(this.pointId)
		this.form = this.formBuilder.group({
		  male: [0, Validators.required],
		  female: [0, Validators.required],
		  children: [0, Validators.required],
		  adult: [0, Validators.required],
		  lansia: [0, Validators.required],
		  difable: [0, Validators.required],
		  point: [this.pointId, Validators.required],
		  user: [this.authService.getUserId(), Validators.required]
		});
	}
	isFieldValid(field: string) {
		return !this.form.get(field).valid && this.form.get(field).touched;
	}
	displayFieldCss(field: string) {
		return {
			'is-invalid': this.isFieldValid(field),
			'is-valid': this.isFieldValid(field)
		};
	}
	save(){
		if(this.form.valid){
			//console.log(this.form);
			this.sub = this.appService.addDemography(this.form.value).subscribe(({data}) => {
				if(data.addDemography !== null){
					this.error='';
					this.success = 'berhasil';
					this.form.reset();
					this.buildForm();
				}else{
					this.error = 'Maaf, nampaknya terjadi masalah.';
				}
			})			
		}else{
			this.error = 'Silakan lengkapi form terlibih dulu.';
		}		
	}
	cancel(){
		this.display.emit(false)
	}

}
