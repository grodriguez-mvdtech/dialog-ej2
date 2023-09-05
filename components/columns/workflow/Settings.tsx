import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useDialogRecordDataContext } from "@/hooks/useDialogRecordData";

import WorkflowEditor from "./WorkflowEditor";

export default function Settings() {
  const { t } = useTranslation(["workflow-column", "common"]);

  const [showDiagramEditor, setShowDiagramEditor] = useState(false);

  function handleCloseDialog() {
    setShowDiagramEditor(false);
  }

  const workflowExtId = "__NEW__";

  return (
    <>
      <div>
        <ButtonComponent
          id={
            workflowExtId === "__NEW__"
              ? "create-workflow"
              : `edit-workflow-${workflowExtId}}`
          }
          type="button"
          onClick={() => {
            setShowDiagramEditor(true);
          }}
        >
          {workflowExtId === "__NEW__"
            ? t("create", { ns: "common" })
            : t("edit", { ns: "common" })}
        </ButtonComponent>
      </div>
      {showDiagramEditor && (
        <WorkflowEditor recordId={0} closeDialog={handleCloseDialog} />
      )}
    </>
  );
}
