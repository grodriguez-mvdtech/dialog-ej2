import { ToastUtility } from "@syncfusion/ej2-react-notifications";
import { Dialog, DialogUtility } from "@syncfusion/ej2-react-popups";

interface ToastMessageModel {
  content: string | HTMLElement;
  type: string;
  timeOut?: number;
}

const TOAST_TYPES = {
  ERROR: "Error",
  INFORMATION: "Information",
  SUCCESS: "Success",
  WARNING: "Warning",
};

function showToast(toast: ToastMessageModel) {
  const { content, type, timeOut = 4000 } = toast;
  ToastUtility.show(content, type, timeOut);
}

function showAlertDialog({
  title,
  content,
}: {
  title: string;
  content: string | HTMLElement;
}) {
  DialogUtility.alert({
    animationSettings: { effect: "Zoom" },
    closeOnEscape: true,
    content,
    okButton: {
      text: "OK",
      click() {
        (this as Dialog).hide();
      },
    },
    position: { X: "center", Y: "center" },
    title,
  });
}

async function showConfirmDialog({
  cancelTextButton,
  content,
  okTextButton,
  title,
}: {
  cancelTextButton: string;
  content: string | HTMLElement;
  okTextButton: string;
  title: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    DialogUtility.confirm({
      animationSettings: { effect: "Zoom" },
      closeOnEscape: false,
      content,
      isModal: true,
      position: { X: "center", Y: "center" },
      showCloseIcon: false,
      title,
      okButton: {
        text: okTextButton,
        click() {
          (this as Dialog).hide();
          resolve(true);
        },
      },
      cancelButton: {
        text: cancelTextButton,
        click() {
          (this as Dialog).hide();
          return false;
        },
      },
    });
  });
}

// function getDynamicComponent({ componentKey, props }) {
//     console.log(`getDynamicComponent key ${componentKey}`, props)
//     const DynamicComponent = dynamic(
//         () => import(`../components/${componentKey}`),
//         {
//             ssr: false,
//             loading: () => 'Cargando...',
//         }
//     );
//     return <DynamicComponent { ...props } />;
// }

export { showAlertDialog, showConfirmDialog, showToast, TOAST_TYPES };
