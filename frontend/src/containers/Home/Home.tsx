import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectIsFetching, selectPictures } from '../../store/slices/picturesSlice.ts';
import Loader from '../../components/UI/Loader/Loader.tsx';
import Picture from '../../components/Picture/Picture.tsx';
import { useEffect } from 'react';
import { getPictures } from '../../store/thunks/picturesThunk.ts';

const Home = () => {
  const dispatch = useAppDispatch();
  const pictures = useAppSelector(selectPictures);
  const isLoading = useAppSelector(selectIsFetching);

  useEffect(() => {
    dispatch(getPictures());
  }, [dispatch]);

  return (
    <>
      {
        isLoading ? <Loader/> :
          <div className="container d-flex flex-wrap gap-4 justify-content-center">
            {pictures.length > 0 ?
              pictures.map(picture =>
                <Picture picture={picture} key={picture._id}/>
              ) : <h2 className="text-center mt-5" style={{color: '#4389cc'}}>No pictures found</h2>
            }
          </div>
      }
    </>
  );
};

export default Home;