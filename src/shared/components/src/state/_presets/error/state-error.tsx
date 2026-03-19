import { IconXCircle } from '../../../icon';
import { State } from '../../_core/state';
import type { StateErrorProps } from './state-error.types';

export function StateError(props: StateErrorProps) {
  const {
    icon,
    title = 'Ocorreu um erro',
    description = 'Não foi possível carregar os dados. Tente novamente.',
    ...rest
  } = props;

  return <State icon={icon ?? <IconXCircle color='error' />} title={title} description={description} {...rest} />;
}
