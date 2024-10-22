import { Media } from '@/app/models/admin.models';
import { Action, createReducer, on } from '@ngrx/store';
import { close, open } from '@store/actions/media-widget.actions';
import {
  addItem,
  loadMediaFailure,
  loadMediaSuccess,
  onSelect,
} from '../actions/media-widget.actions';

export type MediaType = 'image' | 'audio';
export type MediaWidgetState = {
  state: 'open' | 'closed';
  audio: Media[] 
  images: Media[]
  selectedMedia: Media | null;
  errorMsg: string;
};

export const initialState: MediaWidgetState = {
  state: 'closed',
  audio: [],
  images: [],
  selectedMedia: null,
  errorMsg: '',
};

const _mediaWidgetReducer = createReducer(
  initialState,
  on(open, (State) => {
    // console.log({State})
    return { ...State, state: 'open' as 'open' }
  }),
  on(close, (State) => ({
    ...State,
    state: 'closed' as 'closed',
    selectedMedia: null,
    errorMsg: '',
  })),
  on(loadMediaSuccess, (State, { media }) => ({ ...State, ...media })),
  on(loadMediaFailure, (State, { errorMsg }) => ({ ...State, errorMsg })),
  // on(addItem, (State, { item }) => ({
  //   ...State,
  //   media: [item, ...State.media],
  // })),
  on(onSelect, (State, { selected }) => ({ ...State, selectedMedia: selected }))
);

export function mediaWidgetReducer(
  state: MediaWidgetState | undefined,
  action: Action
) {
  return _mediaWidgetReducer(state, action);
}
