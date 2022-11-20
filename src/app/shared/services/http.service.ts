import { CustomerInterface } from '../types/customer.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestCustomerInterface } from '../types/request-customer.interface';
import { ResponseCustomerInterface } from '../types/response-customer.interface';
import { map, of, tap, Observable, catchError } from 'rxjs';
const url =
  'https://ng-crud------20221104-default-rtdb.firebaseio.com/customers';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  customers: CustomerInterface[] = [];
  constructor(private http: HttpClient) {}
  createData(
    customer: CustomerInterface
  ): Observable<RequestCustomerInterface> {
    return this.http
      .post<RequestCustomerInterface>(`${url}.json`, customer)
      .pipe(
        tap((res) => {
          this.customers.push({ ...{ key: res.name }, ...customer });
        })
      );
  }
  getData(): void {
    this.http
      .get<ResponseCustomerInterface>(`${url}.json`)
      .pipe(
        map((res: any) => {
          const arr: CustomerInterface[] = [];
          Object.keys(res).forEach((key) => arr.push({ key, ...res[key] }));
          return arr;
        })
      )
      .subscribe({
        next: (res: CustomerInterface[]) => (this.customers = res),
        error: catchError(this.errorHandler('GET')),
      });
  }
  updateData(
    customer: CustomerInterface,
    i: number
  ): Observable<CustomerInterface> {
    const { key, ...data } = customer;
    return this.http
      .put<CustomerInterface>(`${url}/${key}.json`, data)
      .pipe(tap((res: any) => (this.customers[i] = customer)));
  }
  deleteData(customer: CustomerInterface): void {
    this.http.delete(`${url}/${customer.key}.json`).subscribe({
      next: () => this.customers.splice(this.customers.indexOf(customer), 1),

      error: catchError(this.errorHandler('DE')),
    });
  }
  private errorHandler<T>(operation: string, res?: T) {
    return (err: any): Observable<any> => {
      console.error(`${operation} failed`);
      return of(res);
    };
  }
}
