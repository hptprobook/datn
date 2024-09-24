export const isValidObjectId = (id) =>
   /^[a-f\d]{24}$/i.test(id)
   ;

export const renderUrl = (url, backendUrl = '') => {
   if (!url.startsWith('http://') && !url.startsWith('https://')) {  
     return `${backendUrl}/${url}`.replace(/([^:]\/)\/+/g, '$1');  // Avoid double slashes
   }
   return url;
 };
 
