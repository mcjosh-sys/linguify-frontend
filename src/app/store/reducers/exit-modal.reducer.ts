import { Action, createReducer, on } from '@ngrx/store';
import { close, open } from '@store/actions/exit-modal.actions';

export type ExitModalState = {
  state: ('open' | 'closed');
};

export const initialState: ExitModalState = {
  state: 'closed',
};

const _exitModalReducer = createReducer(
  initialState,
  on(open, () => ({ state: 'open' as 'open' })),
  on(close, () => ({ state: 'closed' as 'closed' }))
);

export function exitModalReducer(
  state: ExitModalState | undefined,
  action: Action
) {
  return _exitModalReducer(state, action);
}
