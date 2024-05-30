import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchCrimeData = async () => {
  const serverUrl = `http://localhost:3500/crime_data_statistics`;
  if (!serverUrl) {
    throw new Error('SERVER_URL is not defined in the environment variables.');
  }
  const response = await axios.get(serverUrl);
  return response.data;
};

export const useCrimeData = () => {
  return useQuery({
    queryKey: ['crimeData'],
    queryFn: fetchCrimeData,
  });
};
