"use client"
import { Label } from "@/components/ui/label";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { IFormField } from "@/lib/types/interfaces";
import { useState } from "react";

interface Props {
  checked?: IFormField["checked"];
  label?: IFormField["label"];
  name: IFormField["name"];
}

const Checkbox = ({ label, name, checked }: Props) => {
  const [isState, setIsState] = useState(checked)
  return (
    <div className="text-accent flex items-center gap-2">
      <ShadcnCheckbox
        type="button"
        id={name}
        name={name}
        onClick={()=>setIsState(!isState)}
        checked={isState||false}
      />
      <Label htmlFor={name} className="text-accent-foreground">
        {label}
      </Label>
    </div>
  );
};

export default Checkbox;