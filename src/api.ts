import citiesMock from "./citiesMock.json";

export const fetchAutoCompleteCities = async (
  query: string
): Promise<string[]> => {
  // this is a simulation of a real API request
  // lets imagine that this api takes query and filters cities
  return Promise.resolve(
    citiesMock.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(query.toLowerCase()) > -1
    )
  );
};
