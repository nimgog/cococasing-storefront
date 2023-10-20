import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})
export class ContactPageComponent implements OnInit {
  readonly bodyMinLength = 80;
  readonly bodyMaxLength = 1000;

  contactForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  get allowSubmit() {
    return this.contactForm.valid && !this.isSubmitting;
  }

  ngOnInit() {
    this.contactForm = new FormGroup({
      orderNumber: new FormControl(null),
      fullName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null),
      body: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.bodyMinLength),
        Validators.maxLength(this.bodyMaxLength),
      ]),
    });
  }

  isInvalidTouched(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return control ? !control.valid && control.touched : false;
  }

  // TODO: Swap out the Formspree form endpoint
  onSubmit() {
    if (!this.allowSubmit) {
      return;
    }

    this.isSubmitting = true;

    const formData = Object.entries(this.contactForm.value).reduce(
      (result, entry) => {
        result.append(entry[0], entry[1] as string);
        return result;
      },
      new FormData()
    );

    this.httpClient
      .post(environment.formspreeContactEndpoint, formData, {
        headers: new HttpHeaders().set('Accept', 'application/json'),
      })
      .subscribe({
        next: () => {
          this.contactForm.reset();

          this.notificationService.showSuccessMessage({
            title: 'Request sent',
            message: 'We will contact you soon!',
          });
        },
        error: () => {
          this.notificationService.showErrorMessage({
            title: 'Request sending failed',
            message: 'Please try again later.',
          });
        },
        complete: () => (this.isSubmitting = false),
      });
  }
}
