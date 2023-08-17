import {
  BaseCustomConfig,
  ColumnCustomConfig,
  Context,
  TableCustomConfig,
} from "@mvdtech/platform-domain";
import { ToastUtility } from "@syncfusion/ej2-react-notifications";

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

function getInitialBaseCustomConfig(
  customConfig: ColumnCustomConfig | TableCustomConfig = {},
  context: Context
) {
  const { tableRepository } = context;
  const language = context.site.languagesPriority[0];

  const baseCustomConfig: BaseCustomConfig = {};

  for (const key in customConfig) {
    if (key.includes("Translations")) {
      const columnName = key.replace("Translations", "");
      // if (customConfig[`${columnName}Translations`]) {
      //   const translations = customConfig[`${columnName}Translations`];
      //   baseCustomConfig[`${columnName}Translations`] = translations;
      //   baseCustomConfig[`${columnName}Translations`][language] =
      //     tableRepository.getTranslationValue(
      //       customConfig[`${columnName}Translations`],
      //       context.site.languagesPriority
      //     );
      // } else {
      //   baseCustomConfig[`${columnName}Translations`] = {
      //     [language]: columnName,
      //   };
      // }
      baseCustomConfig[key] = customConfig[key];
    }
  }

  // if ((customConfig as ColumnCustomConfig)?.ColumnType) {
  //   baseCustomConfig.ColumnType = customConfig.ColumnType;
  // }
  return baseCustomConfig;
}

export { getInitialBaseCustomConfig, showToast, TOAST_TYPES };
export type { ToastMessageModel };
