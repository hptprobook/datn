import { handleToast } from "src/hooks/toast";
import * as XLSX from "xlsx";

export const handleExport = (data, nameSheet, nameFile, removeValue = []) => {
    const filteredData = data.map((item) => {
        const newItem = { ...item };
        removeValue.forEach((field) => {
            delete newItem[field];
        });
        return newItem;
    });
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, nameSheet);

    XLSX.writeFile(workbook, `${nameFile}.xlsx`);
};
export const handleImportExcel = (event, validateKey) => new Promise((resolve, reject) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    // eslint-disable-next-line consistent-return
    reader.onload = (e) => {
        try {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            // Get the first sheet
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON format
            const sheetData = XLSX.utils.sheet_to_json(sheet);
            if (sheetData.length === 0) {
                handleToast('error', 'File Excel không có dữ liệu.');
                return resolve([]);
            }

            // Validate keys
            const keys = Object.keys(sheetData[0]);
            const isValid = keys.every((key) => validateKey.includes(key));


            if (!isValid) {
                handleToast('error', 'Các cột trong file Excel không đúng định dạng.');
                return resolve([]);
            }
            const data = sheetData.map((item, i) => ({
                ...item,
                key: i
            }))

            // Return the data if valid
            resolve(data);
        } catch (error) {
            handleToast('error', 'Đã xảy ra lỗi khi đọc file Excel.');
            reject(error);
        }
    };

    reader.onerror = (error) => {
        handleToast('error', 'Không thể đọc file Excel.');
        reject(error);
    };

    reader.readAsBinaryString(file);
});

export const handleCreateExcel = (validateKey, nameSheet, nameFile) => {
    const data = [];
    validateKey.forEach((key) => {
        const obj = {};
        obj[key] = '';
        data.push(obj);
    });
    handleExport(data, nameSheet, nameFile);
}