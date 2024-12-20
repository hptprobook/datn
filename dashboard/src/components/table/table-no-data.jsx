import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query, col = 8 }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={col} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" paragraph>
            Không tìm thấy
          </Typography>

          <Typography variant="body2">
            Không có kết quả nào cho &nbsp;
            <strong>&quot;{query}&quot;</strong>.
            <br /> Hãy kiểm tra lại lỗi chính tả hoặc sử dụng từ đầy đủ.
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
  col: PropTypes.number,
};
