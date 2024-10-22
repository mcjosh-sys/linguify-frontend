import { Action, createReducer, on } from '@ngrx/store';
import { BrnDialogState } from '@spartan-ng/ui-dialog-brain';
import { close, open } from '@/app/store/actions/hearts-modal.actions';

export type HeartsModalState = {
  state: BrnDialogState;
};

export const initialState: HeartsModalState = {
  state: 'closed',
};

const _heartsModalReducer = createReducer(
  initialState,
  on(open, () => ({ state: 'open' as 'open' })),
  on(close, () => ({ state: 'closed' as 'closed' }))
);

export function heartsModalReducer(
  state: HeartsModalState | undefined,
  action: Action
) {
  return _heartsModalReducer(state, action);
}
