import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectIsFetching, selectPictures } from '../../store/slices/picturesSlice.ts';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getUserPictures } from '../../store/thunks/picturesThunk.ts';
import Loader from '../../components/UI/Loader/Loader.tsx';
import Picture from '../../components/Picture/Picture.tsx';

const UserPictures = () => {
  const dispatch = useAppDispatch();
  const pictures = useAppSelector(selectPictures);
  const isLoading = useAppSelector(selectIsFetching);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('user');

  useEffect(() => {
    if (userId) {
      dispatch(getUserPictures(userId));
    }
  }, [dispatch, userId]);

  return (
    <>
      {
        isLoading ? <Loader/> :
          <div className="container d-flex flex-wrap gap-4 justify-content-center">
            {pictures?.length > 0 ?
              pictures.map((picture) =>
                <Picture key={picture._id} picture={picture}/>
              ) :
              <div className="d-flex flex-column w-25">
                <h3
                  className="text-center mt-5 mb-3"
                  style={{color: '#4389cc'}}
                >
                  You haven't added any pictures yet.
                </h3>
                <NavLink
                  to="/pictures/new"
                  className="text-decoration-none btn btn-blue w-auto d-inline-flex justify-content-center align-items-center gap-2"
                >
                  Post you first picture
                  <i className="bi bi-arrow-right-short fs-3"></i>
                </NavLink>
              </div>
            }
          </div>
      }
    </>
  );
};

export default UserPictures;