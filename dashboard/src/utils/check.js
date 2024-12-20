export const isValidObjectId = (id) =>
  /^[a-f\d]{24}$/i.test(id)
  ;

export const renderUrl = (url, backendUrl = '') => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://') && url.includes('uploads')) {
    return `${backendUrl}/${url}`.replace(/([^:]\/)\/+/g, '$1');  // Avoid double slashes
  }
  return url;
};

