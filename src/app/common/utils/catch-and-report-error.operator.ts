import type { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import type { NotificationService } from '../../services/notification.service';

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
