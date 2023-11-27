import { Topic } from './topic';

export interface Section {
  id: string;
  title: string;
  topics: Topic[];
}
