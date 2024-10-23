import * as React from 'react';
import {
  Stack,
  Select,
  Button,
  MenuItem,
  Container,
  TextField,
  InputLabel,
  FormControl,
} from '@mui/material';
import TitlePage from 'src/components/page/title';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStatus,
  getPageBy,
  fetchAllPages,
  updatePageById,
  deleteStaticPage,
} from 'src/redux/slices/staticPageSlices';
import { handleToast } from 'src/hooks/toast';
import LoadingFull from 'src/components/loading/loading-full';
import ConfirmDelete from 'src/components/modal/confirm-delete';
import Grid2 from '@mui/material/Unstable_Grid2';
import CardHaveTitle from 'src/components/card/card-have-title';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import FormHelpTextError from 'src/components/errors/form-error';
import TinyEditor from 'src/components/editor/tinyEditor';
import { useParams } from 'react-router-dom';
import { isValidObjectId } from 'src/utils/check';
import { useRouter } from 'src/routes/hooks';
import { staticPageType } from '../util';

export const staticPageSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tiêu đề là bắt buộc.')
    .min(4, 'Tiêu đề phải có ít nhất 4 ký tự.')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự.'),

  metaTitle: Yup.string()
    .required('Tiêu đề SEO là bắt buộc.')
    .min(4, 'Tiêu đề SEO phải có ít nhất 4 ký tự.')
    .max(60, 'Tiêu đề SEO không được vượt quá 60 ký tự.'),

  metaDescription: Yup.string()
    .required('Mô tả meta là bắt buộc.')
    .min(4, 'Mô tả meta phải có ít nhất 4 ký tự.')
    .max(160, 'Mô tả meta không được vượt quá 160 ký tự.'),

  metaKeywords: Yup.string().max(255, 'Từ khóa SEO không được vượt quá 255 ký tự.'),

  slug: Yup.string()
    .required('Slug là bắt buộc.')
    .min(4, 'Slug phải có ít nhất 4 ký tự.')
    .max(255, 'Slug không được vượt quá 255 ký tự.'),

  content: Yup.string()
    .required('Nội dung là bắt buộc.')
    .min(4, 'Nội dung phải có ít nhất 4 ký tự.'),

  type: Yup.string().required('Loại là bắt buộc.').oneOf(
    [
      'about', // Chúng tôi là ai
      'commit', // Cam kết của chúng tôi
      'storeSystem', // Hệ thống cửa hàng
      'orderHelp', // Hướng dẫn đặt hàng
      'paymentMethod', // Phương thức thanh toán
      'membershipPolicy', // Chính sách thành viên
      'pointsPolicy', // Chính sách tích - tiêu điểm
      'shippingPolicy', // Chính sách vận chuyển
      'inspectionPolicy', // Chính sách kiểm hàng
      'returnPolicy', // Chính sách đổi trả
      'termsConditions', // Điều kiện & Điều khoản
      'privacyPolicy', // Chính sách bảo mật
    ],
    'Loại không hợp lệ.'
  ),
});

export default function StaticWebEditPage() {
  const { id } = useParams();

  const [confirm, setConfirm] = React.useState(false);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.staticPages.statusUpdate);
  const error = useSelector((state) => state.staticPages.error);
  const page = useSelector((state) => state.staticPages.page);
  const route = useRouter();
  React.useEffect(() => {
    if (id) {
      if (isValidObjectId(id)) {
        dispatch(
          getPageBy({
            type: '_id',
            value: id,
          })
        );
      } else {
        handleToast('error', 'Id không hợp lệ');
        route.push('/admin/settings/static-pages');
      }
    }
  }, [id, route, dispatch]);
  const formik = useFormik({
    initialValues: {
      title: page?.title || '',
      metaTitle: page?.metaTitle || '',
      metaDescription: page?.metaDescription || '',
      metaKeywords: page?.metaKeywords || '',
      slug: page?.slug || '',
      content: page?.content || '',
      type: page?.type || '',
    },
    enableReinitialize: true,
    validationSchema: staticPageSchema,
    onSubmit: (values) => {
      if (values.metaKeywords === '') {
        delete values.metaKeywords;
      }
      if (values.metaDescription === '') {
        handleToast('warning', 'Mô tả meta không được để trống.');
      }
      dispatch(updatePageById({ id, data: values }));
    },
  });
  React.useEffect(() => {
    if (status === 'successful') {
      handleToast('success', 'Cập nhật trang tĩnh thành công.');
      formik.resetForm();
      dispatch(
        setStatus({
          key: 'statusUpdate',
          value: 'idle',
        })
      );
      dispatch(fetchAllPages());
    }
    if (status === 'failed') {
      handleToast('error', error?.message || 'Cập nhật trang tĩnh thất bại.');
      dispatch(
        setStatus({
          key: 'statusUpdate',
          value: 'idle',
        })
      );
      dispatch(
        setStatus({
          key: 'error',
          value: null,
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error, dispatch]);

  return (
    <Container>
      <ConfirmDelete
        openConfirm={confirm}
        label="trang tĩnh đã chọn"
        onAgree={() => dispatch(deleteStaticPage(confirm))}
        onClose={() => setConfirm(false)}
      />
      {status === 'loading' && <LoadingFull />}

      <TitlePage title="Cập nhật trang tĩnh" />
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <CardHaveTitle title="Thông tin trang tĩnh">
            <Grid2 container spacing={2}>
              <Grid2 xs={12}>
                <TextField
                  label="Tiêu đề"
                  variant="outlined"
                  name="title"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid2>
              <Grid2 xs={8}>
                <TextField
                  label="Đường dẫn"
                  variant="outlined"
                  name="slug"
                  fullWidth
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={formik.touched.slug && formik.errors.slug}
                />
              </Grid2>
              <Grid2 xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="type-select-label">Loại trang</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    value={formik.values.type}
                    name="type"
                    label="Loại trang"
                    onChange={formik.handleChange}
                  >
                    {Object.entries(staticPageType).map(([key, value]) => (
                      <MenuItem value={key} key={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelpTextError label={formik.touched.type && formik.errors.type} />
                </FormControl>
              </Grid2>
            </Grid2>
          </CardHaveTitle>

          <CardHaveTitle title="Nội dung">
            <Stack spacing={2} direction="column" justifyContent="flex-start">
              <TinyEditor
                error={formik.touched.content && Boolean(formik.errors.content)}
                initialValue={formik.values.content}
                onChange={(text) => formik.setFieldValue('content', text)}
              />
              <FormHelpTextError label={formik.touched.content && formik.errors.content} />
            </Stack>
          </CardHaveTitle>
          <CardHaveTitle title="SEO">
            <Grid2 container spacing={2}>
              <Grid2 xs={12}>
                <TextField
                  label="Tiêu đề SEO"
                  variant="outlined"
                  name="metaTitle"
                  fullWidth
                  value={formik.values.metaTitle}
                  onChange={formik.handleChange}
                  error={formik.touched.metaTitle && Boolean(formik.errors.metaTitle)}
                  helperText={formik.touched.metaTitle && formik.errors.metaTitle}
                />
              </Grid2>

              <Grid2 xs={12}>
                <TextField
                  label="Từ khóa SEO"
                  variant="outlined"
                  name="metaKeywords"
                  fullWidth
                  value={formik.values.metaKeywords}
                  onChange={formik.handleChange}
                  error={formik.touched.metaKeywords && Boolean(formik.errors.metaKeywords)}
                  helperText={formik.touched.metaKeywords && formik.errors.metaKeywords}
                />
              </Grid2>
              <Grid2 xs={12}>
                <TextField
                  label="Mô tả SEO"
                  name="metaDescription"
                  multiline
                  maxRows={4}
                  fullWidth
                  value={formik.values.metaDescription}
                  onChange={formik.handleChange}
                  error={formik.touched.metaDescription && Boolean(formik.errors.metaDescription)}
                  helperText={formik.touched.metaDescription && formik.errors.metaDescription}
                />
              </Grid2>
              <Grid2 xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: 'fit-content',
                  }}
                  color="inherit"
                >
                  Lưu
                </Button>
              </Grid2>
            </Grid2>
          </CardHaveTitle>
        </Stack>
      </form>
    </Container>
  );
}
