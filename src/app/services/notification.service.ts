import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static readonly DefaultSuccessConfig: Partial<IndividualConfig<any>> =
    {
      timeOut: 3000,
    };

  constructor(private readonly toastrService: ToastrService) {}

  showSuccessMessage(notification: Notification) {
    this.toastrService.success(notification.message, notification.title, {
      ...NotificationService.DefaultSuccessConfig,
      ...(notification.config || {}),
    });
  }

  showErrorMessage(notification: Notification) {
    this.toastrService.error(
      notification.message,
      notification.title,
      notification.config
    );
  }
}
