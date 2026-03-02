export const CECOS_TABLE = 'cecos';

export const CECOSStatus = {
  ACTIVE: true,
  INACTIVE: false,
};

export const CECOSStatusLabels = {
  [CECOSStatus.ACTIVE]: 'Activo',
  [CECOSStatus.INACTIVE]: 'Inactivo',
};

export const CECOSStatusColors = {
  [CECOSStatus.ACTIVE]: 'success',
  [CECOSStatus.INACTIVE]: 'warning',
};

export const POLLING_INTERVAL = 30000; // 30 segundos
