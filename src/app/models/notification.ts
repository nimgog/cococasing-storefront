import { IndividualConfig } from 'ngx-toastr';

export interface Notification {
  title?: string;
  message?: string;
  config?: Partial<IndividualConfig<any>>;
}
