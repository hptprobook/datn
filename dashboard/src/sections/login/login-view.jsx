/* eslint-disable import/no-unresolved */
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useAuth } from 'src/hooks/useAuth';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import { handleToast } from 'src/hooks/toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin } from 'src/redux/slices/authSlice';
// ----------------------------------------------------------------------
const loginSchema = Yup.object().shape({
  main: Yup.string().required('Tên đăng nhập là bắt buộc'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
});
const checkMainType = (main) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{7,15}$/;
  if (emailRegex.test(main)) {
    return 'email';
  }
  if (phoneRegex.test(main)) {
    return 'phone';
  }
  return 'staffCode';
};

export default function LoginView() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [submit, setSubmit] = useState(false);
  // const router = useRouter();

  const auth = useSelector((state) => state.auth.auth);
  const error = useSelector((state) => state.auth.error);
  const status = useSelector((state) => state.auth.status);
  const { login } = useAuth();

  useEffect(() => {
    if (status === 'loading') {
      setSubmit(true);
    } else {
      setSubmit(false);
      if (status === 'failed') {
        handleToast('error', error.message);
      }
      if (status === 'successful') {
        handleToast('success', 'Đăng nhập thành công');
        login(auth.token);
      }
    }
  }, [status, error, auth, login]);

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      main: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setSubmit(true);
      const mainType = checkMainType(values.main);
      values.type = mainType;
      dispatch(handleLogin(values));
    },
  });

  const renderForm = (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="main"
          label="Tên đăng nhập/ Email/ Số điện thoại"
          value={formik.values.main}
          onChange={formik.handleChange}
          error={formik.touched.main && Boolean(formik.errors.main)}
          helperText={formik.touched.main && formik.errors.main}
          onBlur={formik.handleBlur}
        />
        <TextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          onBlur={formik.handleBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        disabled={submit}
        variant="contained"
        color="inherit"
      >
        Đăng nhập
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
          height: { xs: 32, md: 40 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Đăng nhập quản trị</Typography>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              *
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
