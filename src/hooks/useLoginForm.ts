import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useLogin } from '@/hooks';

// WARN: Unused code
export const useLoginForm = () => {
  const { mutate, isPending } = useLogin();

  const [creds, setCreds] = useState({
    username: '',
    password: '',
  });

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCreds((prevState) => ({ ...prevState, username: value }));
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCreds((prevState) => ({ ...prevState, password: value }));
  };

  const onEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disableBtn && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const resetCreds = () => {
    setCreds({ username: '', password: '' });
  };

  const onSubmit = async () => {
    mutate(creds);
    resetCreds();
  };

  const disableBtn = !creds.username || !creds.password;

  return {
    creds,
    onUsernameChange,
    onPasswordChange,
    onSubmit,
    disableBtn,
    isPending,
    onEnterPress,
  };
};
