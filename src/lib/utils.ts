import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const handleError = async (error: Error) => {
  if (error instanceof AxiosError) {
    const { response } = error;
    const errorCode = response?.data.error?.code;
    if (errorCode === 'auth/access-token-expired') {
      return window.location.reload();
    }

    if (errorCode === 'aws-identity/identity-instance-not-found') {
      toast.error('Please enter identity instance ID in settings', {
        duration: 3000,
      });
      setTimeout(() => {
        window.location.replace('/settings');
      }, 3000);
      return;
    }

    toast.error(
      response?.data?.error?.details?.[0] ?? errorCode ?? 'An error occurred'
    );
  } else {
    toast.error(
      'An error occurred. Please try again later or contact support.'
    );
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
