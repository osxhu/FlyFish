'use strict';

module.exports = component_mark => `
'use strict';

/**
 * @description 注册${component_mark}组件的设置面板
 */
import {
  registerComponentEvents,
  registerComponentOptionsSetting,
  registerComponentDataSetting,
} from "datavi-editor/adapter";

// import DataSetting from "./settings/data";
// import OptionsSetting from "./settings/options";

// registerComponentOptionsSetting("${component_mark}", OptionsSetting);
// registerComponentDataSetting("${component_mark}", DataSetting);
`;
