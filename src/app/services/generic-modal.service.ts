import { Injectable, Injector, Type } from '@angular/core';
import { BrnDialogState } from '@spartan-ng/ui-dialog-brain';
import { BehaviorSubject } from 'rxjs';

interface GenericModalProps {
  component: Type<any>;
  props: { [key: string]: any };
  title: string;
  description: string;
}

interface GenericModalState{
  title: string
  description: string
  state: BrnDialogState
  props?: GenericModalProps['props']
  component?: GenericModalProps['component']
}
@Injectable({
  providedIn: 'root',
})
export class GenericModalService {
  private modalStateSubject = new BehaviorSubject<GenericModalState>({
    title: '',
    description: '',
    state: 'closed',
    props: {},
    component: undefined,
  })

  genericModalState$ = this.modalStateSubject.asObservable()

  constructor(private injector: Injector) { }

  open({
    component, props, title, description
  }: GenericModalProps) {
    this.modalStateSubject.next({
      state: 'open',
      title,
      description,
      component,
      props
    })
  }

  close() {
    this.modalStateSubject.next({
      title: '',
      description: '',
      state: 'closed',
      props: {},
      component: undefined,
    })
  }

}