import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchReportData = async () => {
  const serverUrl = `http://localhost:3500/get_report_location`;
  if (!serverUrl) {
    throw new Error('SERVER_URL is not defined in the environment variables.');
  }
  const response = await axios.get(serverUrl);
  console.log(response.data);
  return response.data;
};

export const useReportData = () => {
  return useQuery({
    queryKey: ['reportData'],
    queryFn: fetchReportData,
    staleTime: 30000,
  });
};
