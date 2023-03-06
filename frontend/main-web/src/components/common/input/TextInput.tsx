// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FieldHookConfig, useField } from "formik";
import { FC } from "react";

type TextInputProps = FieldHookConfig<string> & {
  label: string;
};

const TextInput: FC<TextInputProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="form-control w-full max-w-lg">
      <label htmlFor={field.name} className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        {...field}
        {...props}
        className={`input input-bordered w-full max-w-lg`}
      />
      <label htmlFor={field.name} className="label">
        {meta.touched && meta.error ? (
          <span className="label-text text-red-600">{meta.error}</span>
        ) : null}
      </label>
    </div>
  );
};

export default TextInput;
