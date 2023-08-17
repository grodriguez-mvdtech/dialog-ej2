import {
  ChangeEventArgs as CheckBoxChangeEventArgs,
  CheckBoxComponent,
} from "@syncfusion/ej2-react-buttons";
import {
  ChangedEventArgs as TextBoxComponentChangedEventArgs,
  ChangeEventArgs as NumericTextBoxChangeEventArgs,
  NumericTextBoxComponent,
  TextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Column } from "@/domain";
import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";

const Settings = () => {
  const { t } = useTranslation(["text-column", "columns"]);

  const [recordData, setRecordData] = useDialogRecordDataContext<Column>();

  function handleChangeRecordData(
    fieldName: string,
    value: boolean | number | string | null
  ) {
    setRecordData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }

  return (
    <Fragment /*key={crypto.randomUUID()}*/>
      <div>
        <label htmlFor="IsMultiline">{t("is-multiline")}:</label>

        <CheckBoxComponent
          checked={recordData.ColumnType === "textArea"}
          disabled={recordData.Id !== 0}
          id="IsMultiline"
          change={({ checked }: CheckBoxChangeEventArgs) => {
            handleChangeRecordData("ColumnType", checked ? "textArea" : "text");
          }}
        />
      </div>
      <div>
        <label htmlFor="TextLength">{t("max-text-length")}:</label>
        <NumericTextBoxComponent
          decimals={0}
          format="N"
          id="TextLength"
          min={1}
          name="TextLength"
          value={recordData.TextLength as number}
          change={({ isInteracted, value }: NumericTextBoxChangeEventArgs) => {
            if (isInteracted) {
              handleChangeRecordData("TextLength", value ?? null);
            }
          }}
        />
      </div>
      <div>
        <label htmlFor="StringDefaultValue">
          {t("default-value", { ns: "columns" })}:
        </label>
        <TextBoxComponent
          id="StringDefaultValue"
          key={`StringDefaultValue${
            recordData.ColumnType === "textArea" ? "TextArea" : "Text"
          }`}
          multiline={recordData.ColumnType === "textArea"}
          name="StringDefaultValue"
          type="text"
          value={recordData.StringDefaultValue}
          change={({
            isInteracted,
            value,
          }: TextBoxComponentChangedEventArgs) => {
            if (isInteracted) {
              handleChangeRecordData("StringDefaultValue", value ?? "");
            }
          }}
        />
      </div>
    </Fragment>
  );
};

export default Settings;
