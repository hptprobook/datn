import * as XLSX from "xlsx";

export const handleExport = (data, nameSheet, nameFile) => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, nameSheet);

    XLSX.writeFile(workbook, `${nameFile}.xlsx`);
};