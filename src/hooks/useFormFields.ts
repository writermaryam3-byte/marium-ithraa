import { FormTypes } from "@/lib/types/enums";
import { IFormFieldsVariables, IFormField } from "@/lib/types/interfaces";



const useFormFields = ({ slug, data }: IFormFieldsVariables) => {
  const loginFields = (): IFormField[] => [
    {
      name: "phone",
      type: "text",
      label: "رقم الهاتف",
      placeholder: "ادخل رقم الهاتف",
      autoFocus: true,
    },
    {
      name: "password",
      type: "password",
      label: "كلمة المرور",
      placeholder: "ادخل كلمة المرور",
    },
  ];
 


 
  const getFormFields = (): IFormField[] | [] => {
    switch (slug) {
      case FormTypes.SIGNIN:
        return loginFields();
      default:
        return [];
    }
  };

  return { getFormFields };
};

export default useFormFields;
