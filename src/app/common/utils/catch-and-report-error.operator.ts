import { Observable, catchError, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

export function catchAndReportError<T>(
  notificationService: NotificationService
) {
  return (source: Observable<T>) =>
    source.pipe(
      catchError((error: unknown) => {
        notificationService.showUnknownErrorMessage();
        return throwError(() => error);
      })
    );
}
