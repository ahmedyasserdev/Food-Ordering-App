import { InputTypes } from "@/constants/enums";
import TextField from "./TextField";
import PasswordField from "./PasswordField";
import Checkbox from "./Checkbox";
import { IFormField } from "@/types";
import { ValidationErrors } from "@/validations/auth";

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
      //@ts-expect-error  
      return <Checkbox {...props} />;
    }

    return <TextField {...props} />;
  };

  return <>{renderField()}</>;
};

export default FormFields;