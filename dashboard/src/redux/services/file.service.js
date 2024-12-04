import { get, upload } from 'src/utils/request';
/* eslint-disable */

const FileManagerService = {
  get: async () => await get('files-manager'),
  getFiles: async ({
    folder,
    limit
  }) => await get(`files-manager/${folder}?limit=${limit}`),
  upload: async ({ file, data }) => await upload({
    path: 'files-manager/upload',
    file: file,
    additionalData: data,
    type: 'post',
  }),

};

export default FileManagerService;
