import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import { Box } from '@mui/material';


export default function CustomerTableRow({
  id,
  selected,
  name,
  phone,
  email,
  onDelete,
  handleClick,
  handleNavigate
}) {

  const handleDelete = (idDelete) => {
    onDelete(idDelete);
  };
  return (
    <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={selected}
            onClick={(event) => event.stopPropagation()}
            onChange={handleClick}
          />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Typography variant="subtitle2" noWrap>
              {phone}
            </Typography>
          </Box>
        </TableCell>
      

        <TableCell>
        {email}
        </TableCell>
       

        <TableCell align="right">
        <IconButton onClick={handleNavigate}>
          <Iconify icon="eva:eye-fill" />
        </IconButton>
        <IconButton onClick={() => handleDelete(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
        </TableCell>
    
      </TableRow>
  );
}

CustomerTableRow.propTypes = {
  id: PropTypes.any,
  handleClick: PropTypes.func,
  handleNavigate: PropTypes.func,
  selected: PropTypes.any,
  name: PropTypes.any,
  phone: PropTypes.any,
  email: PropTypes.any,
  onDelete: PropTypes.func
};