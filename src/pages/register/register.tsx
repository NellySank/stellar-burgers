import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { TRegisterData } from '@api';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  registerUser,
  selectIsAuthenticated,
  selectLoading,
  selectError
} from '../../services/profileSlice';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectLoading);
  const errorRegistration = useSelector(selectError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password || !userName) {
      return;
    }

    const data: TRegisterData = { email, name: userName, password };
    dispatch(registerUser(data));
  };

  if (isAuthenticated) {
    navigate('/profile');
  }

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <RegisterUI
          errorText={errorRegistration ?? ''}
          email={email}
          userName={userName}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          setUserName={setUserName}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
