import React, { useState } from 'react';
import { IPictureMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { selectCreatingError, selectIsCreating } from '../../store/slices/picturesSlice.ts';
import { addPicture, getPictures } from '../../store/thunks/picturesThunk.ts';
import { toast } from 'react-toastify';
import Loader from '../../components/UI/Loader/Loader.tsx';
import FileInput from '../../components/UI/FileInput/FileInput.tsx';
import ButtonLoading from '../../components/UI/ButtonLoading/ButtonLoading.tsx';

const initialState = {
  name: '',
  image: null
};

const AddPicture = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsCreating);
  const validationErr = useAppSelector(selectCreatingError);
  const [form, setForm] = useState<IPictureMutation>({...initialState});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addPicture({pictureMutation: form})).unwrap();
      navigate('/');
      toast.info('Picture created successfully!');
      await dispatch(getPictures());
    } catch (e) {
      console.error(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setForm((prevState) => ({...prevState, [name]: value}));
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {name, files} = e.target;

    if (files) {
      setForm((prevState) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    }
  };

  const getFieldError = (fieldName: string) => {
    try {
      return validationErr?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <div className="container mt-5" style={{padding: '10px', maxWidth: '500px'}}>
      <div className="text-center mb-4" style={{color: '#4389cc'}}>
        <h2 className="mt-2">New picture</h2>
      </div>

      {isLoading ? <Loader/> :
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label" style={{color: '#4389cc'}}>Picture name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              className={`form-control ${getFieldError('name') ? 'is-invalid' : ''}`}
            />
            {getFieldError('name') && (
              <div className="invalid-feedback">{getFieldError('name')}</div>
            )}
          </div>

          <div className="mb-3">
            <FileInput
              id="image"
              name="image"
              label="Image"
              onGetFile={onFileChange}
              file={form.image}
              className={`form-control ${getFieldError('image') ? 'is-invalid' : ''}`}
            />
            {getFieldError('image') && (
              <div className="invalid-feedback">{getFieldError('image')}</div>
            )}
          </div>

          <div className="d-flex gap-3 justify-content-center mb-3">
            <ButtonLoading
              isLoading={isLoading}
              isDisabled={isLoading}
              text="Publish"
            />
          </div>
        </form>
      }
    </div>
  );
};

export default AddPicture;