import { IconFilterLines } from '../../../icon';
import { State } from '../../_core/state';
import type { StateEmptyProps } from './state-empty.types';

export function StateEmpty(props: StateEmptyProps) {
  const {
    icon,
    title = 'Nenhum registro encontrado',
    description = 'Não há dados para exibir no momento.',
    ...rest
  } = props;

  return <State icon={icon ?? <IconFilterLines color='muted' />} title={title} description={description} {...rest} />;
}
