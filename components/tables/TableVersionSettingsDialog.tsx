import {
  ButtonComponent,
  ChangeEventArgs as CheckBoxChangeEventArgs,
  CheckBoxComponent,
} from "@syncfusion/ej2-react-buttons";
import {
  ChangeEventArgs as NumericTextBoxChangeEventArgs,
  NumericTextBoxComponent,
} from "@syncfusion/ej2-react-inputs";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Error, Table } from "@/domain";
import { useRecordsContext } from "@/hooks/useRecords";
import { showAlertDialog } from "@/utilities/ui";

function TableVersionSettingsDialog(record: Table) {
  const { t } = useTranslation(["common", "tables", "column-type"]);
  const refDialog = useRef<DialogComponent | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [keepHistoryMonths, setKeepHistoryMonths] = useState(
    record.KeepHistoryMonths ?? 0
  );

  const { editRecord } = useRecordsContext();

  async function handleClickSave() {
    try {
      await editRecord({
        ...record,
        KeepHistoryMonths: keepHistoryMonths,
      } as Table);

      const dialogInstance = refDialog.current!;
      dialogInstance.hide();
    } catch (error) {
      const { code, message } = error as Error;
      showAlertDialog({
        title: t("error", { ns: "common" }) as string,
        content: message,
      });
    }
  }

  return (
    <>
      <ButtonComponent type="button" onClick={() => setShowDialog(true)}>
        {t("dialog-title-edit-versioning", { ns: "tables" })}
      </ButtonComponent>
      {showDialog && (
        <DialogComponent
          ref={refDialog}
          buttons={[
            {
              buttonModel: {
                content: `${t("save")}`,
                isPrimary: true,
              },
              click: handleClickSave,
            },
            {
              buttonModel: {
                content: `${t("cancel")}`,
              },
              click: () => {
                const dialogInstance = refDialog.current!;
                dialogInstance.hide();
              },
            },
          ]}
          header={t("dialog-title-edit-versioning", { ns: "tables" })}
          isModal={true}
          showCloseIcon={true}
          target={"#__next"}
          width="30%"
          close={() => setShowDialog(false)}
        >
          <div>
            <label htmlFor="KeepingHistory">
              {t("store-version-history", { ns: "tables" })}
            </label>
            <CheckBoxComponent
              checked={keepHistoryMonths !== 0}
              id="KeepingHistory"
              change={({ checked }: CheckBoxChangeEventArgs) =>
                setKeepHistoryMonths(checked ? 1 : 0)
              }
            />
          </div>
          <div>
            <label htmlFor="KeepHistoryMonths">
              {t("store-version-history-months-quantity", { ns: "tables" })}
            </label>
            <NumericTextBoxComponent
              decimals={0}
              enabled={keepHistoryMonths !== 0}
              format="N0"
              id="KeepHistoryMonths"
              min={0}
              value={keepHistoryMonths}
              change={({ value }: NumericTextBoxChangeEventArgs) =>
                setKeepHistoryMonths(value as number)
              }
            />
          </div>
        </DialogComponent>
      )}
    </>
  );
}
export { TableVersionSettingsDialog };
