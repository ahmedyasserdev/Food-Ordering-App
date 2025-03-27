import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  type DropdownProps = {
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder: string;
    children: React.ReactNode;
    className ?: string
  } & React.ComponentProps<typeof Select>; 
  
  const Dropdown = ({ defaultValue, onValueChange, className, placeholder, children, ...rest }: DropdownProps) => {
    return (
      <Select   defaultValue={defaultValue}  onValueChange={onValueChange} {...rest}>
        <SelectTrigger className={className}{...rest}>
          <SelectValue  placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent side="bottom">{children}</SelectContent>
      </Select>
    );
  };
  
  export default Dropdown;
  