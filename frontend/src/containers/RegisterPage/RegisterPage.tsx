import React, { useState } from 'react';
import { RegisterMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectRegisterError, selectRegisterLoading } from '../../store/slices/usersSlice.ts';
import { NavLink, useNavigate } from 'react-router-dom';
import { googleLogin, register } from '../../store/thunks/usersThunk.ts';
import { GoogleLogin } from '@react-oauth/google';
import FileInput from '../../components/UI/FileInput/FileInput.tsx';
import ButtonLoading from '../../components/UI/ButtonLoading/ButtonLoading.tsx';
import { getPictures } from '../../store/thunks/picturesThunk.ts';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const registerError = useAppSelector(selectRegisterError);
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectRegisterLoading);
  const [form, setForm] = useState<RegisterMutation>({
    email: '',
    password: '',
    avatar: null,
    displayName: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setForm(prevState => ({...prevState, [name]: value}));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      navigate('/');
      toast.success('Successfully registered!');
      await dispatch(getPictures());
    } catch (e) {
      console.log(e);
    }
  };

  const getFieldError = (fieldName: string) => {
    try {
      return registerError?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate('/');
    toast.success('Logged in successfully!');
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {name, files} = e.target;

    if (files) {
      setForm((prevState: RegisterMutation) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth: '400px'}}>
      <div className="text-center mb-4">
        <i className="bi bi-unlock fs-2" style={{color: '#4389cc'}}></i>
        <h2 className="mt-2" style={{color: '#4389cc'}}>Sign Up</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className="mb-3 d-flex flex-column align-items-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                void googleLoginHandler(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          >
          </GoogleLogin>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label" style={{color: '#4389cc'}}>Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className={`form-control ${getFieldError('email') ? 'is-invalid' : ''}`}
          />
          {getFieldError('email') && (
            <div className="invalid-feedback">{getFieldError('email')}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="displayName" className="form-label" style={{color: '#4389cc'}}>The name you'll see in your
            profile</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={form.displayName}
            onChange={onChange}
            className={`form-control ${getFieldError('displayName') ? 'is-invalid' : ''}`}
          />
          {getFieldError('displayName') && (
            <div className="invalid-feedback">{getFieldError('displayName')}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label" style={{color: '#4389cc'}}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className={`form-control ${getFieldError('password') ? 'is-invalid' : ''}`}
          />
          {getFieldError('password') && (
            <div className="invalid-feedback">{getFieldError('password')}</div>
          )}
        </div>

        <div className="mb-3">
          <FileInput
            id="avatar"
            name="avatar"
            label="Avatar"
            onGetFile={onFileChange}
            file={form.avatar}
            className={`form-control ${getFieldError('avatar') ? 'is-invalid' : ''}`}
          />
          {getFieldError('avatar') && (
            <div className="invalid-feedback">{getFieldError('avatar')}</div>
          )}
        </div>

        <div className="d-flex gap-3 justify-content-center mb-3">
          <ButtonLoading
            isLoading={isLoading}
            isDisabled={isLoading}
            text="Sign Up"
          />
        </div>

        <div className="text-center mt-3">
          <NavLink to="/login" className="text-decoration-none">Already have an account? Sign in</NavLink>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;