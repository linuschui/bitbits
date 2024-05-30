import axios from 'axios';
import { useQuery } from 'react-query';

const fetchCrimeData = async () => {
  const serverUrl = `${process.env.SERVER_URL}/api/notificationslist/recent`;
  if (!serverUrl) {
    throw new Error('SERVER_URL is not defined in the environment variables.');
  }
  const response = await axios.get(serverUrl);
  const sortedNotifications = response.data;
  console.log(sortedNotifications);
  return sortedNotifications;
};

export const useNotification = () => {
  return useQuery({
    queryKey: ['crimeData'],
    queryFn: fetchCrimeData,
    staleTime: Infinity,
  });
};
