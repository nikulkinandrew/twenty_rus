import { useApolloClient } from '@apollo/client';

export const useOptimisticEvict = () => {
  const cache = useApolloClient().cache;

  const performOptimisticEvict = (
    typename: string,
    fieldName: string,
    fieldValue: string,
  ) => {
    const serializedCache = cache.extract();

    const toBeDeletedIds: string[] = [];

    Object.values(serializedCache)
      .filter((item) => item.__typename === typename)
      .forEach((item) => {
        if (item[fieldName] === fieldValue) {
          cache.evict({ id: cache.identify(item) });
          toBeDeletedIds.push(item.id);
        }
      });
  };
  return {
    performOptimisticEvict,
  };
};
