// import { apiPrivate } from '@/api';
// import { useAuth } from '@/hooks';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const handleError = async (error: Error) => {
  // const { setAuth } = useAuth();
  if (error instanceof AxiosError) {
    const { response } = error;
    // if (response?.data.error?.code === 'auth/access-token-expired') {
    //   const response = await apiPrivate.get('/auth.refresh');
    //   setAuth((prev) => {
    //     return {
    //       ...prev,
    //       accessToken: response.data.result.accessToken,
    //       user: response.data.result.user,
    //     };
    //   });
    // }
    toast.error(
      response?.data?.error?.details?.[0] ??
        response?.data.error?.code ??
        'An error occurred'
    );
  } else {
    toast.error(error.message);
  }
};

export const formatDate = (timestampString: string, withTimes = true) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(timestampString);
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  let text = `${day} ${monthName} ${year}`;

  if (withTimes) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hoursPadStr = hours.toString().padStart(2, '0');
    const minutesPadStr = minutes.toString().padStart(2, '0');
    text += ` ${hoursPadStr}:${minutesPadStr}`;
  }

  return text;
};
