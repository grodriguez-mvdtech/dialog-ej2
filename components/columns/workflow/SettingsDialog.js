import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import React from "react";

const SettingsDialog = () => {
  return (
    <>
      <TextBoxComponent
        floatLabelType="Auto"
        name="ExtId"
        id="ExtId"
        placeholder="ExtId"
        type="text"
      />
      <TextBoxComponent
        placeholder="Name"
        name="Name"
        id="Name"
        floatLabelType="Auto"
        type="text"
      />
      {/* <CheckBoxComponent
        label="onServer"
        name="onServer"
        id="onServer"
        floatLabelType="Auto"
        type="boolean"
      /> */}
    </>
  );
};

export default SettingsDialog;
