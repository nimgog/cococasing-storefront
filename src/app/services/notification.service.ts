import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Notification } from '../models/notification';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotificationConfig = Partial<IndividualConfig<any>>;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private static readonly DefaultSuccessConfig: NotificationConfig = {
    timeOut: 3000,
  };

  private static readonly DefaultInfoConfig: NotificationConfig = {
    timeOut: 3000,
  };

  private static readonly DefaultErrorConfig: NotificationConfig = {};

  constructor(private toastrService: ToastrService) {}

  showSuccessMessage(notification: Notification) {
    this.toastrService.success(notification.message, notification.title, {
      ...NotificationService.DefaultSuccessConfig,
      ...(notification.config || {}),
    });
  }

  showInfoMessage(notification: Notification) {
    this.toastrService.info(notification.message, notification.title, {
      ...NotificationService.DefaultInfoConfig,
      ...(notification.config || {}),
    });
  }

  showErrorMessage(notification: Notification) {
    this.toastrService.error(notification.message, notification.title, {
      ...NotificationService.DefaultErrorConfig,
      ...(notification.config || {}),
    });
  }

  showUnknownErrorMessage() {
    this.showErrorMessage({
      title: 'Something went wrong',
      message: 'Please refresh the page and try again.',
    });
  }
}
