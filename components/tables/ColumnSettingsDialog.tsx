import {
  ChangeEventArgs as ChangeEventArgsCheckBoxComponent,
  CheckBoxComponent,
} from "@syncfusion/ej2-react-buttons";
import {
  ChangeEventArgs as ChangeEventArgsDropDownListComponent,
  DropDownListComponent,
} from "@syncfusion/ej2-react-dropdowns";
import {
  ChangedEventArgs,
  TextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import {
  AnimationSettingsModel,
  DialogComponent,
} from "@syncfusion/ej2-react-popups";
import { Fragment, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { Column, ColumnTypeSettings, Error } from "@/domain";

import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";
import { useRecordsContext } from "@/hooks/useRecords";
import { DIALOG_COMPONENT } from "@/utilities/constants";
import { showAlertDialog } from "@/utilities/ui";

import { ErrorFallback } from "../shared/ErrorFallback";
import { getDynamicComponent } from "../utils";

const templateDropDownStyle = {
  alignItems: "center",
  display: "flex",
  height: "100%",
  paddingLeft: 8,
};
const IS_UNIQUE_ALLOWED_TYPES = [
  "integerNumber",
  "decimalNumber",
  "text",
  "textArea",
  "date",
  "dateTime",
  "time",
  "user",
  "group",
  "userOrGroup",
  "lookup",
  "workflow",
];

export type NewColumn = Pick<
  Column,
  | "ColumnType"
  | "Comments"
  | "CustomConfig"
  | "Description"
  | "DisplayName"
  | "Id"
  | "IsRequired"
  | "IsSystem"
  | "IsUnique"
  | "MaxNumber"
  | "MinNumber"
  | "Name"
  | "Precision"
  | "Scale"
  | "TableId"
>;

const NEW_COLUMN_DATA = {
  ColumnType: "text",
  Comments: "",
  CustomConfig: null,
  Description: "",
  DisplayName: "",
  Id: 0,
  IsRequired: false,
  IsSystem: false,
  IsUnique: false,
  MaxNumber: null,
  MinNumber: null,
  Name: "",
  Precision: 18,
  Scale: 1,
  TableId: 0,
};

const NEW_COLUMN_DATA_BY_TYPE = {
  file: {
    ColumnType: "file",
    CustomConfig: {
      isMultiple: true,
      allowedExtensions: [],
      minFileSize: null,
      maxFileSize: null,
      minFilesCount: null,
      maxFilesCount: null,
    },
  },
};

function getNewColumnMock(type: string) {
  const keyType = type as keyof typeof NEW_COLUMN_DATA_BY_TYPE;
  return {
    ...NEW_COLUMN_DATA,
    ...NEW_COLUMN_DATA_BY_TYPE[keyType],
  };
}

const columnTypesUI = [
  {
    Id: 1,
    Name: "integerNumber",
    SettingsComponentKey: "columns/number/Settings",
  },
  {
    Id: 2,
    Name: "decimalNumber",
    SettingsComponentKey: "columns/number/Settings",
  },
  {
    Id: 3,
    Name: "text",
    SettingsComponentKey: "columns/text/Settings",
  },
  {
    Id: 4,
    Name: "textArea",
    SettingsComponentKey: "columns/text/Settings",
  },
  {
    Id: 5,
    Name: "date",
    SettingsComponentKey: "columns/date/Settings",
  },
  {
    Id: 6,
    Name: "dateTime",
    SettingsComponentKey: "columns/date/Settings",
  },
  {
    Id: 7,
    Name: "time",
    SettingsComponentKey: "columns/date/Settings",
  },
  {
    Id: 8,
    Name: "boolean",
    SettingsComponentKey: "columns/boolean/Settings",
  },
  {
    Id: 10,
    Name: "user",
    SettingsComponentKey: "columns/user/Settings",
  },
  {
    Id: 11,
    Name: "multipleUser",
    SettingsComponentKey: "columns/user/Settings",
  },
  {
    Id: 12,
    Name: "group",
    SettingsComponentKey: "columns/user/Settings",
  },
  {
    Id: 13,
    Name: "multipleGroup",
    SettingsComponentKey: "columns/user/Settings",
  },
  {
    Id: 14,
    Name: "userOrGroup",
    SettingsComponentKey: "columns/user/Settings",
  },
  {
    Id: 15,
    Name: "multipleUsersAndGroups",
    SettingsComponentKey: "columns/user/Settings",
  },
  {
    Id: 16,
    Name: "lookup",
    SettingsComponentKey: "columns/lookup/Settings",
  },
  {
    Id: 17,
    Name: "multipleLookup",
    SettingsComponentKey: "columns/lookup/Settings",
  },
  {
    Id: 18,
    Name: "file",
    SettingsComponentKey: "columns/file/Settings",
  },
  {
    Id: 19,
    Name: "relation",
    SettingsComponentKey: "columns/relation/Settings",
  },
  {
    Id: 20,
    Name: "workflow",
    SettingsComponentKey: "columns/workflow/Settings",
  },
  {
    Id: 21,
    Name: "diagram",
    SettingsComponentKey: "columns/diagram/Settings",
  },
];

export type ValidateColumnFunction<T extends Column> = (
  recordData: T
) => string[] | null;

function ColumnSettingsDialog({ closeDialog }: { closeDialog: () => void }) {
  const { t } = useTranslation(["common", "columns", "column-types"]);
  const refDialog = useRef<DialogComponent | null>(null);
  const refValidateColumnTypeFunction = useRef<ValidateColumnFunction<Column>>(
    () => null
  );

  const { addRecord, editRecord } = useRecordsContext();

  const [dynamicComponent, setDynamicComponent] = useState<JSX.Element | null>(
    null
  );
  const [recordData, setRecordData] = useDialogRecordDataContext<Column>();

  const [columnTypeUI, setColumnTypeUI] = useState(
    () => recordData.CustomConfig?.ColumnType ?? recordData.ColumnType
  );

  const mergedColumTypes = columnTypesUI
    ? columnTypesUI.filter(
        (e) =>
          (recordData.Id === 0 &&
            ![
              "decimalNumber",
              "textArea",
              "dateTime",
              "time",
              "multipleUser",
              "group",
              "multipleGroup",
              "userOrGroup",
              "multipleUsersAndGroups",
              "multipleLookup",
              "multipleUser",
            ].includes(e.Name)) ||
          recordData.Id !== 0
      )
    : [];

  useEffect(() => {
    const columTypesItem = columnTypesUI.find(
      (e) => e.Name === columnTypeUI
    ) as ColumnTypeSettings;
    const componentKey = columTypesItem.SettingsComponentKey;
    const dynamicComponent: JSX.Element = getDynamicComponent({
      componentKey,
      props: {
        refValidateColumnTypeFunction,
      },
    });
    setDynamicComponent(dynamicComponent);
  }, [columnTypeUI]);

  function handleChangeColumnType(type: string) {
    refValidateColumnTypeFunction.current = () => null;
    if (type === "file") {
      const newColumn = {
        ...getNewColumnMock(type),
        Name: recordData.Name,
        DisplayName: recordData.DisplayName,
        Description: recordData.Description,
        Comments: recordData.Comments,
      };
      setRecordData(newColumn);
    } else {
      setRecordData({
        ...NEW_COLUMN_DATA,
        ...recordData,
        ColumnType: type,
      });
    }

    setColumnTypeUI(type);
  }

  function validateColumn(column: Pick<Column, "DisplayName">): boolean {
    const errorMessages: string[] = [];
    if (column.DisplayName.length === 0) {
      errorMessages.push(
        t("field-name-is-required", { ns: "errors", name: t("name") }) as string
      );
    }
    if (errorMessages.length) {
      showAlertDialog({
        title: t("error", { ns: "common" }) as string,
        content: errorMessages.join("<br />"),
      });
    }
    return errorMessages.length === 0;
  }

  function handleChangeRecordData(
    fieldName: string,
    value: boolean | number | string
  ) {
    const dataToSet: Partial<Column> = {
      [fieldName]: value,
    };
    if (recordData.Id === 0 && fieldName === "DisplayName") {
      dataToSet.Name = value as string;
    }
    setRecordData({
      ...recordData,
      ...dataToSet,
    });
  }

  async function handleClickSave() {
    const isValid = validateColumn(recordData as Column);
    if (!isValid) {
      return;
    }
    const hasErrors = refValidateColumnTypeFunction.current!(recordData);
    if (hasErrors) {
      showAlertDialog({
        title: t("error", { ns: "common" }) as string,
        content: hasErrors.join("\n"),
      });
      return;
    }
    const recordToSave = {
      ...recordData,
      CustomConfig: JSON.stringify(recordData.CustomConfig),
    };
    try {
      if (recordData.Id === 0) {
        addRecord(recordToSave);
      } else {
        editRecord(recordToSave);
      }
      closeDialog();
    } catch (error) {
      const { code, message } = error as Error;
      showAlertDialog({
        title: t("error", { ns: "common" }) as string,
        content: message,
      });
    }
  }

  return (
    <DialogComponent
      ref={refDialog}
      animationSettings={
        DIALOG_COMPONENT.AnimationSettings as AnimationSettingsModel
      }
      buttons={[
        {
          buttonModel: {
            content: t("save") as string,
            isPrimary: true,
          },
          click: handleClickSave,
        },
        {
          buttonModel: {
            content: t("cancel") as string,
          },
          click: () => {
            closeDialog();
          },
        },
      ]}
      //className={"column-settings-dialog"}
      header={`${
        recordData.Id === 0 ? (t("add") as string) : (t("edit") as string)
      } ${t("column") as string}`}
      isModal={true}
      target={"#__next"}
      showCloseIcon={true}
      close={() => {
        closeDialog();
      }}
      width="600px"
    >
      <div
      // className={`table-settings-dialog__content ${
      //   recordData.Id === 0
      //     ? "table-settings-dialog__content--add"
      //     : "table-settings-dialog__content--edit"
      // }`}
      >
        <div>
          <label htmlFor="DisplayName">{t("name")}:</label>
          <TextBoxComponent
            id="DisplayName"
            type="text"
            value={recordData.DisplayName}
            change={({ isInteracted, value }: ChangedEventArgs) => {
              if (isInteracted) {
                handleChangeRecordData("DisplayName", value?.trim() ?? "");
              }
            }}
          />
        </div>
        <div>
          <label htmlFor="Description">{t("description")}:</label>
          <TextBoxComponent
            id="Description"
            multiline={true}
            type="text"
            value={recordData.Description}
            change={({ isInteracted, value }: ChangedEventArgs) => {
              if (isInteracted) {
                handleChangeRecordData("Description", value?.trim() ?? "");
              }
            }}
          />
        </div>
        <div>
          <label htmlFor="ColumnType">{t("type")}:</label>
          <DropDownListComponent
            dataSource={
              mergedColumTypes as unknown as { [key: string]: object }[]
            }
            enabled={recordData.Id === 0}
            fields={{ text: "Name", value: "Name" }}
            id="ColumnType"
            value={columnTypeUI}
            change={({
              isInteracted,
              value,
            }: ChangeEventArgsDropDownListComponent) => {
              if (isInteracted) {
                handleChangeColumnType(value as string);
              }
            }}
            itemTemplate={function valueTemplate({ Name }: { Name: string }) {
              return (
                <div style={templateDropDownStyle}>
                  {t(`${Name}`, { ns: "column-types" })}
                </div>
              );
            }}
            valueTemplate={function valueTemplate({ Name }: { Name: string }) {
              return (
                <div style={templateDropDownStyle}>
                  {t(`${Name}`, { ns: "column-types" })}
                </div>
              );
            }}
          />
        </div>
        {recordData.IsSystem ? (
          <span>{t("message-is-system-column", { ns: "columns" })}</span>
        ) : (
          <>
            <div>
              <label htmlFor="IsRequired">{t("is-required")}:</label>
              <CheckBoxComponent
                checked={recordData.IsRequired}
                disabled={recordData.IsSystem}
                id="IsRequired"
                change={({ checked }: ChangeEventArgsCheckBoxComponent) => {
                  handleChangeRecordData("IsRequired", Boolean(checked));
                }}
              />
            </div>
            {IS_UNIQUE_ALLOWED_TYPES.includes(columnTypeUI) && (
              <div>
                <label htmlFor="IsUnique">{t("is-unique")}:</label>
                <CheckBoxComponent
                  checked={recordData.IsUnique}
                  disabled={recordData.IsSystem}
                  id="IsUnique"
                  change={({ checked }: ChangeEventArgsCheckBoxComponent) => {
                    handleChangeRecordData("IsUnique", Boolean(checked));
                  }}
                />
              </div>
            )}
          </>
        )}
        <Fragment /*key={crypto.randomUUID()}*/>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            // onReset={() => {
            //   const dynamicComponent = getDynamicComponent({
            //     componentKey: "columns/date/Settings",
            //     props: {
            //       refValidateColumnTypeFunction,
            //     },
            //   });
            //   setDynamicComponent(dynamicComponent);
            // }}
            resetKeys={[dynamicComponent]}
          >
            {!recordData.IsSystem && dynamicComponent}
          </ErrorBoundary>
        </Fragment>
      </div>
    </DialogComponent>
  );
}
export { ColumnSettingsDialog, NEW_COLUMN_DATA };
