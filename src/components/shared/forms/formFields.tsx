import TextField from "./TextField";
import PasswordField from "./PasswordField";
import Checkbox from "./CheckboxField";
import Select from "./Select";
import TextArea from "./TextArea";
import { IFormField } from "@/lib/types/interfaces";
import { InputTypes } from "@/lib/types/enums";
import { ValidationErrors } from "@/lib/types/types";

interface Props extends IFormField {
  error: ValidationErrors;
}

const FormFields = (props: Props) => {
  const { type } = props;
  const renderField = (): React.ReactNode => {
    if (type === InputTypes.EMAIL || type === InputTypes.TEXT) {
      return <TextField {...props} />;
    }

    if (type === InputTypes.PASSWORD) {
      return <PasswordField {...props} />;
    }

    if (type === InputTypes.CHECKBOX) {
      return <Checkbox {...props} />;
    }
    if(type===InputTypes.TEXTAREA){
      return <TextArea {...props}/>
    }
    if (type === InputTypes.SELECT&&props.data) {
      console.log("data select", props.data)
      return <Select {...props} data={props.data||[]} />;
    }
    
    return <TextField {...props} />;
  };

  return <>{renderField()}</>;
};

export default FormFields;
