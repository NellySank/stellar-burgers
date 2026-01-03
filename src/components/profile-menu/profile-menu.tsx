import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { logoutUser, selectLoading } from '../../services/profileSlice';
import { Preloader } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />
      )}
    </>
  );
};
