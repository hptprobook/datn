
import react, { useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import EditorContent from 'src/components/editor/editor';
import { Icon } from '@iconify/react';
import checkBoxOutlineBlank from '@iconify/icons-ic/baseline-check-box-outline-blank';
import checkBox from '@iconify/icons-ic/baseline-check-box';
import InfoBox from 'src/components/Box/InforBox';
import ImageDropZone from 'src/components/DropZoneUpload/DropZoneImage';

// ----------------------------------------------------------------------

const icon = <Icon icon={checkBoxOutlineBlank} />;
const checkedIcon = <Icon icon={checkBox} />;
export default function CreateCategoryPage() {
    const [imglist, setImglist] = useState([]);
 
      const handleChangeUploadImg = (value) => {
        setImglist(value);
    }
    
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Tạo một Danh mục mới</Typography>
            </Stack>
            <Box justifyContent="center">
                <Box sx={{ maxWidth: 'lg', p: 6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 3, mt: 5 }}>
                    <Typography variant="h6" gutterBottom>Chi tiết</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Tiêu đề, mô tả, hình ảnh...</Typography>
                    <form>
                        <Box mb={4}>
                            <TextField
                                fullWidth
                                id="productName"
                                label="Tên Danh mục"
                                variant="outlined"
                                placeholder="Tên danh mục"
                            />
                        </Box>
                        <Box mb={4}>
                            <InputLabel htmlFor="Description">Mô tả</InputLabel>
                            <EditorContent />
                        </Box>
                        <Box mb={4}>
                        <InfoBox title="Hình ảnh">
                                <ImageDropZone handleUpload={handleChangeUploadImg} />
                        </InfoBox>
                        </Box>
                    </form>
                </Box>
            </Box>
            <Box sx={{ maxWidth: 'lg', p: 6, color: 'text.primary', mt: 5 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#1C252E',
                        color: 'foreground-foreground',
                        py: 2,
                        px: 4,
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#1C252E',
                            opacity: 0.8,
                        },
                    }}
                >
                    Tạo Danh mục
                </Button>
            </Box>
        </Container>
    );
}
