import { createSlice } from '@reduxjs/toolkit';
import { IPicture, ValidationError } from '../../types';
import { RootState } from '../../app/store.ts';
import { addPicture, deletePicture, getPictures, getUserPictures } from '../thunks/picturesThunk.ts';

interface PicturesState {
  pictures: IPicture[];
  picture: IPicture | null;
  isFetching: boolean;
  fetchingError: boolean;
  isCreating: boolean;
  creatingError: ValidationError | null;
}

const initialState: PicturesState = {
  pictures: [],
  picture: null,
  isFetching: false,
  fetchingError: false,
  isCreating: false,
  creatingError: null,
};

export const selectPictures = (state: RootState) => state.pictures.pictures;

export const selectIsFetching = (state: RootState) => state.pictures.isFetching;
export const selectIsCreating = (state: RootState) => state.pictures.isCreating;

export const selectCreatingError = (state: RootState) => state.pictures.creatingError;

const picturesSlice = createSlice({
  name: 'pictures',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPictures.pending, (state) => {
        state.isFetching = true;
        state.fetchingError = false;
      })
      .addCase(getPictures.fulfilled, (state, {payload: pictures}) => {
        state.isFetching = false;
        state.pictures = pictures;
      })
      .addCase(getPictures.rejected, (state) => {
        state.isFetching = false;
        state.fetchingError = true;
      })

      .addCase(getUserPictures.pending, (state) => {
        state.isFetching = true;
        state.fetchingError = false;
      })
      .addCase(getUserPictures.fulfilled, (state, {payload: pictures}) => {
        state.isFetching = false;
        state.pictures = pictures;
      })
      .addCase(getUserPictures.rejected, (state) => {
        state.isFetching = false;
        state.fetchingError = true;
      })

      .addCase(addPicture.pending, (state) => {
        state.isCreating = true;
        state.creatingError = null;
      })
      .addCase(addPicture.fulfilled, (state, {payload: picture}) => {
        state.isCreating = false;
        state.picture = picture;
      })
      .addCase(addPicture.rejected, (state, {payload: error}) => {
        state.isCreating = false;
        state.creatingError = error || null;
      })

      .addCase(deletePicture.pending, (state) => {
        state.isFetching = true;
        state.fetchingError = false;
      })
      .addCase(deletePicture.fulfilled, (state) => {
        state.isFetching = false;
      })
      .addCase(deletePicture.rejected, (state) => {
        state.isFetching = false;
        state.fetchingError = true;
      });
  }
});

export const picturesReducer = picturesSlice.reducer;