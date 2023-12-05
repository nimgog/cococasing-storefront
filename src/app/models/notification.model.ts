/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IndividualConfig } from 'ngx-toastr';

export type Notification = {
  title?: string;
  message?: string;
  config?: Partial<IndividualConfig<any>>;
};
