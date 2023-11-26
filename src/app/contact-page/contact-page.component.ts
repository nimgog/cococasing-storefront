import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})
export class ContactPageComponent implements OnInit {
  readonly messageMinLength = 80;
  readonly messageMaxLength = 1000;

  contactForm!: FormGroup;
  isSubmitting = false;
  turnstileSiteKey = environment.turnstileSiteKey;

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
      emailAddress: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      phoneNumber: new FormControl(null),
      message: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.messageMinLength),
        Validators.maxLength(this.messageMaxLength),
      ]),
      turnstileToken: new FormControl(null, Validators.required),
    });
  }

  isInvalidTouched(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return control ? !control.valid && control.touched : false;
  }

  onSubmit() {
    if (!this.allowSubmit) {
      return;
    }

    this.isSubmitting = true;

    this.httpClient
      .post(environment.contactWorkerEndpoint, this.contactForm.value, {
        headers: new HttpHeaders().set('Accept', 'application/json'),
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
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
            title: 'Failed to send request',
            message: 'Please try again later.',
          });
        },
      });
  }
}
