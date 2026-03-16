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
  const employeeFields = ():IFormField[]=>[
    {
      name: "name",
      type: "text",
      label: "name",
      placeholder: "enter employee name",
      autoFocus: true,
    },
    {
      name: "phone",
      type: "text",
      label: "رقم الهاتف",
      placeholder: "ادخل رقم الهاتف",
    },
    {
      name: "email",
      type: "email",
      label: "email",
      placeholder: "enters the employee email",
    },
    {
      name: "password",
      type: "password",
      label: "كلمة المرور",
      placeholder: "ادخل كلمة المرور",
    },
    {
      name: "job_title",
      type: "text",
      label: "الوظيفة",
      placeholder: "job",
    },
  ]
 


 
  const getFormFields = (): IFormField[] | [] => {
    switch (slug) {
      case FormTypes.SIGNIN:
        return loginFields();
      case FormTypes.EMPLOYEE:
        return employeeFields();
      default:
        return [];
    }
  };

  return { getFormFields };
};

export default useFormFields;
