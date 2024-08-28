import { Query } from '@/types';
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
  const [month, day, year] = [
    date.getMonth(),
    date.getDate(),
    date.getFullYear(),
  ];
  // const day = date.getDate();

  const monthName = months[month];
  // const year = date.getFullYear();

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

export const formatDateId = (timestampString: string, withTimes = true) => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const date = new Date(timestampString);
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  let text = `${day} ${monthName} ${year}`;

  if (withTimes) {
    const [hoursLocal, minutesLoca] = date.toLocaleTimeString().split(':');
    text += ` ${hoursLocal}:${minutesLoca}`;

    // const hours = date.getHours();
    // const minutes = date.getMinutes();
    // const hoursPadStr = hours.toString().padStart(2, '0');
    // const minutesPadStr = minutes.toString().padStart(2, '0');
    // text += ` ${hoursPadStr}:${minutesPadStr}`;
  }

  return text;
};

export const getLocaleDateString = (
  date: Date,
  opts?: Partial<{
    addDay: number;
    format: 'yyyy-mm-dd' | 'dd-mm-yyyy' | 'yyyy-mm-ddThh:MM';
    addHours: number;
  }>
) => {
  let theDate = date;
  if (opts?.addDay) {
    theDate = new Date(date.getTime() + opts.addDay * 24 * 60 * 60 * 1000);
  }

  if (opts?.addHours) {
    theDate = new Date(date.getTime() + opts.addHours * 60 * 60 * 1000);
  }

  let [monthStr, dateStr, yearStr] = theDate.toLocaleDateString().split('/');

  dateStr = dateStr.padStart(2, '0');
  monthStr = monthStr.padStart(2, '0');

  if (opts?.format === 'yyyy-mm-dd') {
    return `${yearStr}-${monthStr}-${dateStr}`;
  }

  if (opts?.format === 'dd-mm-yyyy') {
    return `${dateStr}-${monthStr}-${yearStr}`;
  }

  if (opts?.format === 'yyyy-mm-ddThh:MM') {
    return `${yearStr}-${monthStr}-${dateStr}T${theDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${theDate.getMinutes().toString().padStart(2, '0')}`;
  }

  return `${dateStr}-${monthStr}-${yearStr}`;
};

export const getPsTagsInfo = (tags: Record<string, string>) => {
  let showOrHide: 'SHOW' | 'HIDE' = 'HIDE';
  let showHideValue = 'ALL USERS';

  if ('showTo' in tags) {
    showHideValue = tags['showTo'];
    showOrHide = 'SHOW';
  }

  if ('hideFrom' in tags) {
    showHideValue = tags['hideFrom'];
    showOrHide = 'HIDE';
  }

  const isShow = showOrHide === 'SHOW';
  const isAll = showHideValue === 'ALL USERS';

  return {
    showOrHide,
    showHideValue,
    isShow,
    isAll,
  };
};

export const encodeQueryData = (data: Query) => {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
};
