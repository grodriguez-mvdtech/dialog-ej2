import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { getDynamicComponent } from "@/components/utils";
import { DIALOG_CLOSED_TYPE } from "@/utilities/constants";

function CustomRecordFormDialog({
  closeCallBack,
  componentPath,
  recordId,
}: {
  closeCallBack: (closedType: number) => void;
  componentPath: string;
  recordId: number | null;
}) {
  const { t } = useTranslation("common");
  const dialogInstanceRef = useRef<DialogComponent | null>(null);
  const handleClickSaveCustomRef = useRef<(() => Promise<boolean>) | null>(
    null
  );
  const [dialogCloseType, setDialogCloseType] = useState<number>(
    DIALOG_CLOSED_TYPE.CANCELLED
  );
  const [dynamicComponent, setDynamicComponent] = useState<JSX.Element | null>(
    null
  );

  useEffect(() => {
    const dynamicComponent: JSX.Element = getDynamicComponent({
      componentKey: componentPath,
      props: {
        recordId,
        handleClickSaveCustomRef,
      },
    });
    setDynamicComponent(dynamicComponent);
    return () => {
      handleClickSaveCustomRef.current = null;
    };
  }, []);

  const closeDialog = () => {
    const dialogInstance = dialogInstanceRef.current as DialogComponent;
    dialogInstance.hide();
  };

  const handleClickSave = () => {
    if (handleClickSaveCustomRef.current) {
      const savePromise = handleClickSaveCustomRef.current();
      if (savePromise instanceof Promise) {
        savePromise.then((isSaved) => {
          if (isSaved) {
            setDialogCloseType(DIALOG_CLOSED_TYPE.APPROVED);
            closeDialog();
          }
        });
      }
    }
  };

  return dynamicComponent ? (
    <DialogComponent
      ref={dialogInstanceRef}
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
          // click: closeDialog,
        },
      ]}
      className="custom-record-form-dialog"
      header={`${
        recordId === null ? (t("add") as string) : (t("edit") as string)
      } ${t("record") as string}`}
      height="100%"
      showCloseIcon={true}
      close={() => {
        closeCallBack(dialogCloseType);
      }}
      content={() => (
        <div className="custom-record-form-dialog__content-wrapper">
          {dynamicComponent}
        </div>
      )}
    />
  ) : (
    // >
    //   <ErrorBoundary FallbackComponent={ErrorFallback}>
    //     <div>{dynamicComponent}</div>
    //   </ErrorBoundary>
    // </DialogComponent>
    <span>cargando</span>
  );
}

export default CustomRecordFormDialog;
