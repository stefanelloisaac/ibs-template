import type { ValidatorFn } from '../../../lib/validator';
import { validateAutocompleteMultiple } from '../../autocomplete/_presets/multiple/autocomplete-multiple.validate';
import { validateAutocompleteSingle } from '../../autocomplete/_presets/single/autocomplete-single.validate';
import { validateCheckbox } from '../../checkbox/_core/checkbox.validate';
import { validateInputColor } from '../../input/_presets/color/input-color.validate';
import { validateInputDate } from '../../input/_presets/date/input-date.validate';
import { validateInputDatetimeLocal } from '../../input/_presets/datetime-local/input-datetime-local.validate';
import { validateInputCnpj, validateInputCpf } from '../../input/_presets/docs/input-docs.validate';
import { validateInputDropzone } from '../../input/_presets/dropzone/input-dropzone.validate';
import { validateInputEmail } from '../../input/_presets/email/input-email.validate';
import { validateInputFile } from '../../input/_presets/file/input-file.validate';
import { validateInputFloat } from '../../input/_presets/float/input-float.validate';
import { validateInputInt } from '../../input/_presets/int/input-int.validate';
import { validateInputMoney } from '../../input/_presets/money/input-money.validate';
import { validateInputMonth } from '../../input/_presets/month/input-month.validate';
import { validateInputPassword } from '../../input/_presets/password/input-password.validate';
import { validateInputPercent } from '../../input/_presets/percent/input-percent.validate';
import { validateInputSearch } from '../../input/_presets/search/input-search.validate';
import { validateInputTel } from '../../input/_presets/tel/input-tel.validate';
import { validateInputText } from '../../input/_presets/text/input-text.validate';
import { validateInputTime } from '../../input/_presets/time/input-time.validate';
import { validateInputWeek } from '../../input/_presets/week/input-week.validate';
import { validateLookupMultiple } from '../../lookup/_presets/multiple/lookup-multiple.validate';
import { validateLookupSingle } from '../../lookup/_presets/single/lookup-single.validate';
import { validateRadio } from '../../radio/_core/radio.validate';
import { validateSelect } from '../../select/_core/select.validate';
import { validateTextarea } from '../../textarea/_core/textarea.validate';

export const validatorRegistry: Record<string, ValidatorFn> = {
  'autocomplete-single': validateAutocompleteSingle,
  'autocomplete-multiple': validateAutocompleteMultiple,

  'input-email': validateInputEmail,
  'input-tel': validateInputTel,
  'input-int': validateInputInt,
  'input-float': validateInputFloat,
  'input-money': validateInputMoney,
  'input-percent': validateInputPercent,
  'input-date': validateInputDate,
  'input-time': validateInputTime,
  'input-month': validateInputMonth,
  'input-week': validateInputWeek,
  'input-datetime-local': validateInputDatetimeLocal,
  'input-password': validateInputPassword,

  'input-text': validateInputText,
  'input-search': validateInputSearch,
  'input-color': validateInputColor,
  'input-file': validateInputFile,
  'input-dropzone': validateInputDropzone,

  'input-docs-cpf': validateInputCpf,
  'input-docs-cnpj': validateInputCnpj,

  'lookup-single': validateLookupSingle,
  'lookup-multiple': validateLookupMultiple,

  select: validateSelect,

  radio: validateRadio,

  textarea: validateTextarea,

  checkbox: validateCheckbox,
};

export const getValidator = (name: string): ValidatorFn | undefined => {
  return validatorRegistry[name];
};
