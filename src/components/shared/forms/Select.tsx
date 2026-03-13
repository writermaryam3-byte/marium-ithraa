
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { validationErr } from "@/validations/general";
import { IFormField } from "@/lib/types/interfaces";
import type { SelectData } from "@/lib/types/types";



interface Props extends IFormField {
  error: validationErr;
  data: SelectData[];
  onValueChange?: (value: string) => void
}
export default function SelectField({
  data,
  label,
  name,
  placeholder,
  error,
  defaultValue,
  onValueChange
}: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="capitalize mb-2">
        {label}
      </Label>
      <Select onValueChange={onValueChange} name={name} defaultValue={defaultValue}>
        <SelectTrigger className="w-full!" dir="rtl">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full!" dir="rtl">
          <SelectGroup className="w-full!">
            <SelectLabel>{label}</SelectLabel>
            {data.map((item: SelectData) => {
              return (
                <SelectItem key={item.id} value={item.value}>
                  {item.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && error[name] && (
        <p
          className={`text-accent mt-2 text-sm font-medium ${error[name] ? "text-destructive" : ""
            }`}
        >
          {error[name]}
        </p>
      )}
    </div>
  );
}
