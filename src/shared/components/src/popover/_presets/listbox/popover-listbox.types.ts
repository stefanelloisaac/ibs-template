export interface PopoverListboxProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  multiselectable?: boolean;
  id?: string;
  ref?: React.Ref<HTMLUListElement>;
}
