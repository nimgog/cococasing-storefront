import { HttpClient, HttpParams } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-site-news-signup',
  templateUrl: './site-news-signup.component.html',
  styleUrls: ['./site-news-signup.component.scss'],
})
export class SiteNewsSignupComponent implements OnInit {
  // TODO: Consider creating a LocalStorage entry on signup and checking it - if exists, hide this component
  newsSignupForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {}

  get allowSubmit() {
    return this.newsSignupForm.valid && !this.isSubmitting;
  }

  ngOnInit() {
    this.newsSignupForm = new FormGroup({
      signupEmail: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.newsSignupForm.reset();
      }
    });
  }

  isInvalidTouched(controlName: string): boolean {
    const control = this.newsSignupForm.get(controlName);
    return control ? !control.valid && control.touched : false;
  }

  onSubmit() {
    if (!this.allowSubmit) {
      return;
    }

    this.isSubmitting = true;

    const params = new HttpParams().set(
      'EMAIL',
      this.newsSignupForm.value.signupEmail
    );

    const mailChimpUrl =
      environment.mailChimpNewsletterEndpoint + params.toString();

    this.httpClient
      .jsonp<{
        result: string;
        msg: string;
      }>(mailChimpUrl, 'c')
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => {
          if (response.result && response.result === 'success') {
            this.newsSignupForm.reset();

            if (response.msg.includes('already')) {
              this.notificationService.showInfoMessage({
                message: 'You are already subscribed.',
              });
            } else {
              this.notificationService.showSuccessMessage({
                message: 'You have been subscribed!',
              });
            }
          } else {
            this.reportSubscriptionIssue();
          }
        },
        error: () => {
          this.reportSubscriptionIssue();
        },
      });
  }

  private reportSubscriptionIssue() {
    this.notificationService.showErrorMessage({
      title: 'Subscription failed',
      message: 'Please try again later.',
    });
  }
}
