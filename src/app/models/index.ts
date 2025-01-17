export interface RouterState extends Record<string, any> {
  afterAuthUrl?: string | null;
  error?: RouterError | null;
}

export interface RouterError {
  message: {
    title: string;
    description: string;
  };
  redirect: {
    label: string;
    url: string;
  };
}
