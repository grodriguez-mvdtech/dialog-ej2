import {
  ChangeEventArgs as DropDownListChangeEventArgs,
  DropDownListComponent,
} from "@syncfusion/ej2-react-dropdowns";
import { Fragment, MutableRefObject } from "react";
import { useTranslation } from "react-i18next";

import { ValidateColumnFunction } from "@/components/tables/ColumnSettingsDialog";
import { DiagramColumn } from "@/domain";
import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";

import { Settings as IshikawaSettings } from "./ishikawa/Settings";

const Settings = ({
  refValidateColumnTypeFunction,
}: {
  refValidateColumnTypeFunction: MutableRefObject<
    ValidateColumnFunction<DiagramColumn>
  >;
}) => {
  const { t } = useTranslation(["diagram-column", "columns", "common"]);

  const [recordData, setRecordData] =
    useDialogRecordDataContext<DiagramColumn>();

  function handleChangeRecordData(fieldName: string, value: any) {
    setRecordData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }

  const diagramsTypes = [
    { value: "five-why", label: t("five-why") },
    { value: "ishikawa", label: t("ishikawa") },
    { value: "bpmn", label: t("bpmn") },
  ];
  const type = recordData.CustomConfig?.type ?? "ishikawa";

  return (
    <Fragment /*key={crypto.randomUUID()}*/>
      <label htmlFor="DiagramSubType">{t("sub-type")}:</label>
      <DropDownListComponent
        dataSource={diagramsTypes}
        fields={{ text: "label", value: "value" }}
        id="DiagramSubType"
        placeholder={t("select", { ns: "common" }) as string}
        value={type}
        change={({ isInteracted, value }: DropDownListChangeEventArgs) => {
          if (isInteracted) {
            const customConfig: DiagramColumn["CustomConfig"] = {
              ColumnType: "diagram",
              type: value as string,
              settings: null,
            };
            handleChangeRecordData("CustomConfig", customConfig);
          }
        }}
      />
      <IshikawaSettings
        refValidateColumnTypeFunction={refValidateColumnTypeFunction}
      />
      {/* {type === "ishikawa" && (
        <IshikawaSettings
          refValidateColumnTypeFunction={refValidateColumnTypeFunction}
        />
      )} */}
      {/* {type === "bpmn" && <BPMNSettings tableId={recordData.TableId} />} */}
    </Fragment>
  );
};

export default Settings;
