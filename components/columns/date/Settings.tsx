import {
  DatePickerComponent,
  DateTimePickerComponent,
  TimePickerComponent,
} from "@syncfusion/ej2-react-calendars";
import {
  ChangeEventArgs as ChangeEventArgsDropDownListComponent,
  DropDownListComponent,
} from "@syncfusion/ej2-react-dropdowns";
import { Fragment, MutableRefObject } from "react";
import { useTranslation } from "react-i18next";

import { ValidateColumnFunction } from "@/components/tables/ColumnSettingsDialog";
import { Column } from "@/domain";
import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";

const Settings = ({
  refValidateColumnTypeFunction,
}: {
  refValidateColumnTypeFunction: MutableRefObject<
    ValidateColumnFunction<Column>
  >;
}) => {
  const { t } = useTranslation(["date-column", "column-types", "columns"]);

  const [recordData, setRecordData] = useDialogRecordDataContext<Column>();

  function handleChangeRecordData(fieldName: string, value: any) {
    setRecordData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }

  const OPTION = [
    { text: t("date", { ns: "column-types" }), value: "date" },
    { text: t("dateTime", { ns: "column-types" }), value: "dateTime" },
    { text: t("time", { ns: "column-types" }), value: "time" },
    //{value: 'MonthYear', label: 'MonthYear', name: 'TypeDate'},
    //{value: 'Year', label: 'Year',  name: 'TypeDate'}
  ];

  refValidateColumnTypeFunction.current = (recordData: Column) => {
    const minNumber = recordData.MinDate;
    const maxNumber = recordData.MaxDate;
    const defaultValue = recordData.DateTimeDefaultValue;

    if (minNumber && maxNumber && minNumber > maxNumber) {
      const errorMessages = [t("error-message-selected-interval") as string];
      return errorMessages;
    }
    if (
      defaultValue &&
      ((minNumber && defaultValue < minNumber) ||
        (maxNumber && defaultValue > maxNumber))
    ) {
      const errorMessages = [t("error-message-default-value") as string];
      return errorMessages;
    }
    return null;
  };

  return (
    <Fragment /*key={crypto.randomUUID()}*/>
      <label htmlFor="DateType">{t("date-type")}:</label>
      <DropDownListComponent
        id="DateType"
        name="ColumnType"
        dataSource={OPTION}
        enabled={recordData.Id === 0 && !recordData.IsSystem}
        fields={{ text: "text", value: "value" }}
        value={recordData.ColumnType}
        change={({
          isInteracted,
          value,
        }: ChangeEventArgsDropDownListComponent) => {
          if (isInteracted) {
            handleChangeRecordData("ColumnType", value);
          }
        }}
      />
      {recordData.ColumnType === "date" && (
        <>
          <label htmlFor="MinDate">{t("min-date-allowed")}:</label>
          <DatePickerComponent
            id="MinDate"
            name="MinDate"
            value={recordData.MinDate ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("MinDate", value);
              }
            }}
          />
          <label htmlFor="DateFormat">{t("max-date-allowed")}:</label>
          <DatePickerComponent
            id="MaxDate"
            name="MaxDate"
            value={recordData.MaxDate ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("MaxDate", value);
              }
            }}
          />
          <label htmlFor="DateTimeDefaultValue">
            {t("default-value", { ns: "columns" })}:
          </label>
          <DatePickerComponent
            id="DateTimeDefaultValue"
            name="DateTimeDefaultValue"
            value={recordData.MinDate ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("DateTimeDefaultValue", value);
              }
            }}
          />
        </>
      )}
      {recordData.ColumnType === "dateTime" && (
        <>
          <label htmlFor="MinDate">{t("min-date-allowed")}:</label>
          <DateTimePickerComponent
            id="MinDate"
            name="MinDate"
            value={recordData.DateTimeDefaultValue ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("MinDate", value);
              }
            }}
          />
          <label htmlFor="MaxDate">{t("max-date-allowed")}:</label>
          <DateTimePickerComponent
            id="MaxDate"
            name="MaxDate"
            value={recordData.MaxDate ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("MaxDate", value);
              }
            }}
          />
          <label htmlFor="DateTimeDefaultValue">
            {t("default-value", { ns: "columns" })}:
          </label>
          <DateTimePickerComponent
            id="DateTimeDefaultValue"
            name="DateTimeDefaultValue"
            value={recordData.DateTimeDefaultValue ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("DateTimeDefaultValue", value);
              }
            }}
          />
        </>
      )}
      {recordData.ColumnType === "time" && (
        <>
          <label htmlFor="MinDate">{t("min-time-allowed")}:</label>
          <TimePickerComponent
            id="MinDate"
            name="MinDate"
            value={recordData.MinDate ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("MinDate", value);
              }
            }}
          />
          <label htmlFor="MaxDate">{t("max-time-allowed")}:</label>
          <TimePickerComponent
            id="MaxDate"
            name="MaxDate"
            value={recordData.MaxDate ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("MaxDate", value);
              }
            }}
          />
          <label htmlFor="DateTimeDefaultValue">
            {t("default-value", { ns: "columns" })}:
          </label>
          <TimePickerComponent
            id="DateTimeDefaultValue"
            name="DateTimeDefaultValue"
            value={recordData.DateTimeDefaultValue ?? undefined}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeRecordData("DateTimeDefaultValue", value);
              }
            }}
          />
        </>
      )}
    </Fragment>
  );
};

export default Settings;
