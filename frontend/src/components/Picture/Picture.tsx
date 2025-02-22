import React, { useState } from 'react';
import { IPicture } from '../../types';
import { selectIsFetching } from '../../store/slices/picturesSlice.ts';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { selectUser } from '../../store/slices/usersSlice.ts';
import { api_URL } from '../../globalConstants.ts';
import ButtonLoading from '../UI/ButtonLoading/ButtonLoading.tsx';
import { deletePicture, getPictures } from '../../store/thunks/picturesThunk.ts';
import { toast } from 'react-toastify';
import Modal from '../UI/Modal/Modal.tsx';

interface Props {
  picture: IPicture;
}

const Picture: React.FC<Props> = ({picture}) => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsFetching);
  const location = useLocation();
  const currentGallery = location.pathname === '/pictures' && location.search === `?user=${picture.user._id}`;
  const [showModal, setShowModal] = useState<boolean>(false);

  const deleteItem = async (pictureId: string) => {
    if (confirm('Sure you want to delete picture?')) {
      await dispatch(deletePicture(pictureId));
      navigate('/');
      await dispatch(getPictures());
      toast.info('Picture deleted.');
    } else {
      toast.info('Deleting cancelled.');
    }
  };

  return (
    <>
      <div className="card" style={{maxWidth: '300px'}}>
        <div className="w-100 card-header picture-card border-bottom-0">
          <h4 className="text-white card-title text-center m-0 p-0 text-lowercase">{picture.name}</h4>
        </div>

        <div className="card-body d-flex flex-column gap-4 align-items-center">
          <div className="w-100">
            <img
              src={`${api_URL}/${picture.image}`}
              alt={picture.name}
              className="w-100 object-fit-cover rounded-3"
              role="button"
              style={{aspectRatio: '1/1'}}
              onClick={() => setShowModal(true)}
            />
          </div>

          {!currentGallery ?
            <NavLink
              to={`/pictures?user=${picture.user._id}`}
              style={{color: '#4389cc'}}
              className="mt-auto text-decoration-none btn btn-blue"
            >
              View {picture.user.displayName}'s gallery 🤍
            </NavLink> : null
          }
        </div>

        {user && user.role === 'admin' || user?._id === picture.user._id ?
          <div className="mb-4 d-flex justify-content-center gap-3">
            <ButtonLoading
              isLoading={isLoading}
              isDisabled={isLoading}
              text="Delete"
              onClick={() => deleteItem(picture._id)}
            >
              <i className="bi bi-x-lg"></i>
            </ButtonLoading>
          </div> : null
        }
      </div>

      <Modal show={showModal} defaultModalBtn closeModal={() => setShowModal(false)}>
        <div className="modal-body">
          <img src={`${api_URL}/${picture.image}`} alt={picture.name} className="w-100 h-auto rounded-3"/>
        </div>
      </Modal>
    </>
  );
};

export default Picture;