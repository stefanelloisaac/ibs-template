import { IconInfoCircle } from '../../../icon';
import { State } from '../../_core/state';
import type { StateInfoProps } from './state-info.types';

export function StateInfo(props: StateInfoProps) {
  const { icon, title = 'Informação', description = 'Confira os detalhes a seguir.', ...rest } = props;

  return <State icon={icon ?? <IconInfoCircle color='info' />} title={title} description={description} {...rest} />;
}
