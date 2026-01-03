import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIsAuthenticated,
  loginUser,
  selectLoading,
  selectError,
  getUser
} from '../../services/profileSlice';
import { TLoginData } from '@api';
import { useNavigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectLoading);
  const errorLogin = useSelector(selectError);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch, getUser]);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/profile';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const userData: TLoginData = { email, password };
    dispatch(loginUser(userData));
  };

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <LoginUI
          errorText={errorLogin ?? ''}
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
