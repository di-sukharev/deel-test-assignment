import citiesMock from "./citiesMock.json";

export const fetchAutoCompleteCities = async (
  query: string
): Promise<string[]> => {
  return Promise.resolve(
    citiesMock.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(query.toLowerCase()) > -1
    )
  );
};
