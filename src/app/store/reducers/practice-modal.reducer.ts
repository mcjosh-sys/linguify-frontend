import { close, open } from '@/app/store/actions/practice-modal.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { BrnDialogState } from '@spartan-ng/ui-dialog-brain';

export type PracticeModalState = {
  state: BrnDialogState;
};

export const initialState: PracticeModalState = {
  state: 'closed',
};

const _practiceModalReducer = createReducer(
  initialState,
  on(open, () =>  ({ state: 'open' as 'open' })),
  on(close, () => ({ state: 'closed' as 'closed' }))
);

export function practiceModalReducer(
  state: PracticeModalState | undefined,
  action: Action
) {
  return _practiceModalReducer(state, action);
}
