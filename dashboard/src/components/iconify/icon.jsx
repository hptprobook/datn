import PropTypes from 'prop-types';
import Iconify from '.';

export const IconExcel = () => <Iconify icon="vscode-icons:file-type-excel" width={20} />;
export const IconUpload = () => <Iconify icon="line-md:upload-loop" width={20} />;
export const IconDownload = () => <Iconify icon="line-md:download-loop" width={20} />;
export const IconEdit = () => <Iconify icon="mdi:pencil" width={20} />;
export const IconDelete = ({ sx }) => <Iconify icon="mdi:trash" width={20} sx={sx} />;
export const IconAdd = () => <Iconify icon="bi:plus" width={20} />;
export const IconSearch = () => <Iconify icon="bi:search" width={20} />;
export const IconClose = () => <Iconify icon="bi:close" width={20} />;
export const IconSave = () => <Iconify icon="ic:round-save" width={20} />;
export const IconCancel = () => <Iconify icon="ic:round-cancel" width={20} />;
export const IconFilter = () => <Iconify icon="bi:filter" width={20} />;
export const IconRefresh = () => <Iconify icon="mdi:reload" width={20} />;
export const IconSort = () => <Iconify icon="bi:sort-alpha-down" width={20} />;
export const IconSortUp = () => <Iconify icon="bi:sort-alpha-up" width={20} />;

IconDelete.propTypes = {
  sx: PropTypes.object,
};
