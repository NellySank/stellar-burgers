import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIsAuthenticated,
  loginUser,
  selectLoading
} from '../../services/profileSlice';
import { TLoginData } from '@api';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const userData: TLoginData = { email, password };
    dispatch(loginUser(userData));
  };

  if (isAuthenticated) {
    navigate('/profile');
  }

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <LoginUI
          errorText=''
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
