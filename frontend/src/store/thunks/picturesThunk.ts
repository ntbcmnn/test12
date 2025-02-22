import { createAsyncThunk } from '@reduxjs/toolkit';
import { IPicture, IPictureMutation, ValidationError } from '../../types';
import { RootState } from '../../app/store.ts';
import axiosApi from '../../axiosApi.ts';
import { isAxiosError } from 'axios';

export const getPictures = createAsyncThunk<IPicture[], void, { state: RootState; rejectValue: ValidationError }>(
  'pictures/getPictures',
  async (_, {getState}) => {
    const token = getState().users.user?.token;

    const response = await axiosApi.get<IPicture[]>('/pictures', {headers: {Authorization: token ? token : ''}});
    return response.data;
  }
);

export const getUserPictures = createAsyncThunk<
  IPicture[],
  string,
  { state: RootState; rejectValue: ValidationError }
>
(
  'pictures/getUserPictures',
  async (userId, {getState, rejectWithValue}) => {
    const token = getState().users.user?.token;

    try {
      const response = await axiosApi.get<IPicture[]>(`/pictures?user=${userId}`, {headers: {Authorization: token}});
      return response.data || [];
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        return rejectWithValue(error.response.data as ValidationError);
      }
      throw error;
    }
  }
);

export const addPicture = createAsyncThunk<
  IPicture,
  { pictureMutation: IPictureMutation },
  { state: RootState; rejectValue: ValidationError }
>(
  'pictures/addPicture',
  async ({pictureMutation}, {getState, rejectWithValue}) => {
    const token = getState().users.user?.token;

    try {
      const formData = new FormData();
      const keys = Object.keys(pictureMutation) as (keyof IPictureMutation)[];

      keys.forEach((key) => {
        const value: string | File | null = pictureMutation[key];

        if (value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axiosApi.post<IPicture>('/pictures', formData, {
        headers: {Authorization: token},
      });
      return response.data;
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        return rejectWithValue(error.response.data as ValidationError);
      }
      throw error;
    }
  }
);

export const deletePicture = createAsyncThunk<void, string, { state: RootState }>(
  'pictures/deletePicture',
  async (pictureId, {getState}) => {
    const token = getState().users.user?.token;

    await axiosApi.delete(`/pictures/${pictureId}`, {headers: {'Authorization': token}});
  }
);
