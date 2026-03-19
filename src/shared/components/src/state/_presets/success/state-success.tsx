import { IconCheckCircle } from '../../../icon';
import { State } from '../../_core/state';
import type { StateSuccessProps } from './state-success.types';

export function StateSuccess(props: StateSuccessProps) {
  const { icon, title = 'Operação realizada', description = 'A ação foi concluída com sucesso.', ...rest } = props;

  return <State icon={icon ?? <IconCheckCircle color='success' />} title={title} description={description} {...rest} />;
}
