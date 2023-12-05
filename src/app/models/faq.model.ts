export type Section = {
  id: string;
  title: string;
  topics: Topic[];
};

export type Topic = {
  title: string;
  scenarios: Scenario[];
};

export type Scenario = {
  title: string;
  body: string;
};
