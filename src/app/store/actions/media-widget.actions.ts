import { Media } from '@/app/models/admin.models';
import { createAction, props } from '@ngrx/store';

export const mediaActionTypes = {
  OPEN: '[MediaWidget] Open',
  CLOSE: '[MediaWidget] Close',
  LOAD_MEDIA: '[MediaWidget] Load Media',
  LOAD_MEDIA_SUCCESS: '[MediaWidget] Load Media Success',
  LOAD_MEDIA_FAILURE: '[MediaWidget] Load Media Failure',
  ADD_ITEM: '[MediaWidget] Add Item',
  SELECT: '[MediaWidget] Select Media',
};

export const open = createAction(mediaActionTypes.OPEN);
export const close = createAction(mediaActionTypes.CLOSE);
export const loadMedia = createAction(mediaActionTypes.LOAD_MEDIA);
export const loadMediaSuccess = createAction(
  mediaActionTypes.LOAD_MEDIA_SUCCESS,
  props<{
    media: {
      audio: [];
      images: [];
    };
  }>()
);
export const loadMediaFailure = createAction(
  mediaActionTypes.LOAD_MEDIA_FAILURE,
  props<{ errorMsg: string }>()
);
export const addItem = createAction(
  mediaActionTypes.ADD_ITEM,
  props<{ item: Media }>()
);
export const onSelect = createAction(
  mediaActionTypes.SELECT,
  props<{ selected: Media }>()
);
