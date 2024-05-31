import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchLocationData = async () => {
  const serverUrl = `http://localhost:3500/get_centroids_data`;
  if (!serverUrl) {
    throw new Error('SERVER_URL is not defined in the environment variables.');
  }
  const response = await axios.get(serverUrl);
  return response.data;
};

export const useLocationData = () => {
  return useQuery({
    queryKey: ['locationData'],
    queryFn: fetchLocationData,
  });
};
