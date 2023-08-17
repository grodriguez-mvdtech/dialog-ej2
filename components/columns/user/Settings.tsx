import {
  ChangeEventArgs as CheckBoxChangeEventArgs,
  CheckBoxComponent,
} from "@syncfusion/ej2-react-buttons";
import {
  ChangeEventArgs as DropDownListChangeEventArgs,
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
  const { t } = useTranslation(["columns", "columns-types", "user-column"]);
  const [recordData, setRecordData] = useDialogRecordDataContext<Column>();

  function handleChangeRecordData(fieldName: string, value: any) {
    if (fieldName === "IsMultiple") {
      setRecordData((prevState) => {
        let columnType = prevState.ColumnType;
        switch (columnType) {
          case "user":
            columnType = value ? "multipleUser" : "user";
            break;
          case "group":
            columnType = value ? "multipleGroup" : "group";
            break;
          case "userOrGroup":
            columnType = value ? "multipleUsersAndGroups" : "userOrGroup";
            break;
          case "multipleUser":
            columnType = value ? "multipleUser" : "user";
            break;
          case "multipleGroup":
            columnType = value ? "multipleGroup" : "group";
            break;
          case "multipleUsersAndGroups":
            columnType = value ? "multipleUsersAndGroups" : "userOrGroup";
            break;
        }

        return {
          ...prevState,
          ColumnType: columnType,
        };
      });
    } else {
      setRecordData((prevState) => {
        return {
          ...prevState,
          [fieldName]: value,
        };
      });
    }
  }

  const OPTION_USER = [
    {
      label: t("multipleUser", { ns: "column-types" }),
      value: "multipleUser",
    },
    {
      label: t("multipleGroup", { ns: "column-types" }),
      value: "multipleGroup",
    },
    {
      label: t("multipleUsersAndGroups", { ns: "column-types" }),
      value: "multipleUsersAndGroups",
    },
    { label: t("user", { ns: "column-types" }), value: "user" },
    { label: t("group", { ns: "column-types" }), value: "group" },
    { label: t("userOrGroup", { ns: "column-types" }), value: "userOrGroup" },
  ];

  const usersTypes = recordData.ColumnType.includes("multiple")
    ? OPTION_USER.filter((e) => e.value.includes("multiple"))
    : OPTION_USER.filter((e) => !e.value.includes("multiple"));

  return (
    <Fragment /*key={crypto.randomUUID()}*/>
      <div>
        <label htmlFor="IsMultiple">{t("is-multiple")}:</label>
        <CheckBoxComponent
          checked={recordData.ColumnType.includes("multiple")}
          disabled={recordData.Id !== 0}
          id="IsMultiple"
          name="IsMultiple"
          change={({ checked }: CheckBoxChangeEventArgs) => {
            handleChangeRecordData("IsMultiple", checked);
          }}
        />
      </div>
      <div>
        <label htmlFor="ColumnType">
          {t("user-type", { ns: "user-column" })}:
        </label>
        <DropDownListComponent
          dataSource={usersTypes}
          fields={{ text: "label", value: "value" }}
          id="ColumnType"
          name="ColumnType"
          value={recordData.ColumnType}
          change={({ isInteracted, value }: DropDownListChangeEventArgs) => {
            if (isInteracted) {
              handleChangeRecordData("ColumnType", value);
            }
          }}
        />
      </div>
    </Fragment>
  );
};

export default Settings;
