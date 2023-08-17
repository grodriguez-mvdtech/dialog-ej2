import {
  ChangeEventArgs as CheckBoxChangeEventArgs,
  CheckBoxComponent,
} from "@syncfusion/ej2-react-buttons";
import {
  ChangeEventArgs as NumericTextBoxChangeEventArgs,
  NumericTextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import React, { Fragment, MutableRefObject } from "react";
import { useTranslation } from "react-i18next";

import { ValidateColumnFunction } from "@/components/tables/ColumnSettingsDialog";
import { NumericColumn } from "@/domain";
import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";

const Settings = ({
  refValidateColumnTypeFunction,
}: {
  refValidateColumnTypeFunction: MutableRefObject<
    ValidateColumnFunction<NumericColumn>
  >;
}) => {
  const { t } = useTranslation(["number-column", "columns"]);

  const [recordData, setRecordData] =
    useDialogRecordDataContext<NumericColumn>();

  function handleChangeRecordData(fieldName: string, value: any) {
    setRecordData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }

  refValidateColumnTypeFunction.current = (recordData: NumericColumn) => {
    const minNumber = recordData.MinNumber;
    const maxNumber = recordData.MaxNumber;
    const defaultValue = recordData.NumericDefaultValue;

    if (minNumber && maxNumber && minNumber > maxNumber) {
      const errorMessages = [
        t("error-message-selected-interval", { ns: "number-column" }) as string,
      ];
      return errorMessages;
    }
    if (
      defaultValue &&
      ((minNumber && defaultValue < minNumber) ||
        (maxNumber && defaultValue > maxNumber))
    ) {
      const errorMessages = [
        t("error-message-default-value", { ns: "number-column" }) as string,
      ];
      return errorMessages;
    }
  };

  const format = recordData.CustomConfig?.isPercentage
    ? `P${recordData.Scale ?? 0}`
    : recordData.ColumnType === "decimalNumber"
    ? `N${recordData.Scale ?? 1}`
    : "N";

  return (
    <Fragment /*key={crypto.randomUUID()}*/>
      <div>
        <label htmlFor="IsPercentage">{t("is-percentage")}:</label>
        <CheckBoxComponent
          checked={recordData.CustomConfig?.isPercentage ?? false}
          disabled={recordData.Id !== 0}
          id="IsPercentage"
          name="IsPercentage"
          change={({ checked }: CheckBoxChangeEventArgs) => {
            const customConfig = { isPercentage: Boolean(checked) };
            handleChangeRecordData("CustomConfig", customConfig);
          }}
        />
      </div>
      <div>
        <label htmlFor="IsDecimal">{t("is-decimal")}:</label>
        <CheckBoxComponent
          checked={recordData.ColumnType === "decimalNumber"}
          disabled={recordData.Id !== 0}
          id="IsDecimal"
          name="IsDecimal"
          change={({ checked }: CheckBoxChangeEventArgs) => {
            handleChangeRecordData("Scale", checked ? 1 : 0);
            handleChangeRecordData(
              "ColumnType",
              checked ? "decimalNumber" : "integerNumber"
            );
          }}
        />
      </div>
      {recordData.ColumnType === "decimalNumber" && (
        <div>
          <label htmlFor="Scale">{t("decimal-count")}:</label>
          <NumericTextBoxComponent
            enabled={recordData.Id === 0}
            format="N"
            id="Scale"
            name="Scale"
            max={4}
            min={0}
            value={recordData.Scale ?? 1}
            change={({
              isInteracted,
              value,
            }: NumericTextBoxChangeEventArgs) => {
              if (isInteracted) {
                handleChangeRecordData("Scale", value);
              }
            }}
          />
        </div>
      )}

      <div>
        <label htmlFor="MinNumber">{t("min-number")}:</label>
        <NumericTextBoxComponent
          decimals={recordData.Scale}
          format={format}
          id="MinNumber"
          name="MinNumber"
          //step={recordData.CustomConfig?.isPercentage ? 0.01 : 1}
          value={recordData.MinNumber ?? undefined}
          change={({ isInteracted, value }: NumericTextBoxChangeEventArgs) => {
            if (isInteracted) {
              handleChangeRecordData("MinNumber", value);
            }
          }}
        />
      </div>
      <div>
        <label htmlFor="MaxNumber">{t("max-number")}:</label>
        <NumericTextBoxComponent
          decimals={recordData.Scale}
          format={format}
          id="MaxNumber"
          name="MaxNumber"
          //step={recordData.CustomConfig?.isPercentage ? 0.01 : 1}
          value={recordData.MaxNumber ?? undefined}
          change={({ isInteracted, value }: NumericTextBoxChangeEventArgs) => {
            if (isInteracted) {
              handleChangeRecordData("MaxNumber", value);
            }
          }}
        />
      </div>
      <div>
        <label htmlFor="NumericDefaultValue">
          {t("default-value", { ns: "columns" })}:
        </label>
        <NumericTextBoxComponent
          decimals={recordData.Scale}
          format={format}
          id="NumericDefaultValue"
          name="NumericDefaultValue"
          //step={recordData.CustomConfig?.isPercentage ? 0.01 : 1}
          value={recordData.NumericDefaultValue ?? undefined}
          change={({ isInteracted, value }: NumericTextBoxChangeEventArgs) => {
            if (isInteracted) {
              handleChangeRecordData("NumericDefaultValue", value ?? null);
            }
          }}
        />
      </div>
    </Fragment>
  );
};

export default Settings;
