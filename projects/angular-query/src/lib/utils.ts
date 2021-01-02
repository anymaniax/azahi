import { notifyManager, QueryObserverOptions } from './query';

export const setBatchCalls = <Options extends QueryObserverOptions>(
  options: Options
): Options => {
  if (options.onError) {
    options.onError = notifyManager.batchCalls(options.onError);
  }

  if (options.onSuccess) {
    options.onSuccess = notifyManager.batchCalls(options.onSuccess);
  }

  if (options.onSettled) {
    options.onSettled = notifyManager.batchCalls(options.onSettled);
  }
  return options;
};
