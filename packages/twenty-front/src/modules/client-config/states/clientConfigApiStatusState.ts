import { createState } from 'twenty-shared';

type ClientConfigApiStatus = {
  isLoaded: boolean;
  isErrored: boolean;
  error?: Error;
};

export const clientConfigApiStatusState = createState<ClientConfigApiStatus>({
  key: 'clientConfigApiStatus',
  defaultValue: { isLoaded: false, isErrored: false, error: undefined },
});
