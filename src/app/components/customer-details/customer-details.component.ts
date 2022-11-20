import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_CUSTOMER } from 'src/app/shared/data/mock.data';
import { CustomerInterface } from 'src/app/shared/types/customer.interface';

@Component({
  selector: 'crud-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  form!: FormGroup;

  constructor(private httpService: HttpService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    this.httpService.createData(this.form.value).subscribe({
      next: (RequestCustomerInterface) => this.form.reset(),
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.minLength(8)]],
      location: ['', [Validators.required]],
    });

    Object.keys(this.form.controls).forEach((key) =>
      this.form.controls[key].setValue(
        DEFAULT_CUSTOMER?.[key as keyof CustomerInterface]
      )
    );
  }
}
