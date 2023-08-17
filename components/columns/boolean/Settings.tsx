import {
  ChangeEventArgs,
  CheckBoxComponent,
} from "@syncfusion/ej2-react-buttons";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Column } from "@/domain";
import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";

const Settings = () => {
  const { t } = useTranslation("columns");

  const [recordData, setRecordData] = useDialogRecordDataContext<Column>();

  function handleChangeRecordData(fieldName: string, value: boolean) {
    setRecordData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }

  return (
    <Fragment /*key={crypto.randomUUID()}*/>
      <div>
        <label htmlFor="BooleanDefaultValue">{t("default-value")}:</label>
        <CheckBoxComponent
          checked={recordData.BooleanDefaultValue}
          id="BooleanDefaultValue"
          change={({ checked }: ChangeEventArgs) => {
            handleChangeRecordData("BooleanDefaultValue", Boolean(checked));
          }}
        />
      </div>
    </Fragment>
  );
};
export default Settings;
