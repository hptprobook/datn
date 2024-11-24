import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { handleToast } from 'src/hooks/toast';
import {
  Box,
  Tab,
  List,
  Tabs,
  Modal,
  Avatar,
  Divider,
  ListItem,
  Accordion,
  ListItemText,
  ListItemAvatar,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { formatDateTime } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';
import { renderAddress, renderTotalPrice, renderNameProduct } from 'src/utils/format-text';
import Label from 'src/components/label';
import { fetchById, setStatus, updateOrder } from 'src/redux/slices/orderSlices';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { renderUrl } from 'src/utils/check';
import { statusConfig, handleStatusConfig } from '../utils';
import OrderTimeline from '../app-order-timeline';

const backEndUrl = import.meta.env.VITE_BACKEND_APP_URL;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};
const cancelSchema = Yup.object().shape({
  note: Yup.string()
    .required('Lý do hủy đơn hàng không được để trống')
    .min(10, 'Lý do hủy đơn hàng phải lớn hơn 10 ký tự')
    .max(100, 'Lý do hủy đơn hàng phải nhỏ hơn 100 ký tự'),
});
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// ----------------------------------------------------------------------
export default function DetailOrderPage() {
  const route = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [productList, setProductList] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const data = useSelector((state) => state.orders.order);
  const status = useSelector((state) => state.orders.statusGet);
  const statusUpdate = useSelector((state) => state.orders.statusUpdate);
  useEffect(() => {
    dispatch(fetchById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (status === 'successful') {
      setOrder(data);
      setProductList(data.productsList);
    }
    if (status === 'failed') {
      handleToast('error', 'Lỗi không tìm thấy đơn hàng');
      route.push('/orders');
    }
  }, [status, data, route]);
  useEffect(() => {
    if (statusUpdate === 'successful') {
      dispatch(setStatus({ key: 'statusUpdate', value: 'idle' }));
      handleToast('success', 'Cập nhật trạng thái đơn hàng thành công');
    }
    if (statusUpdate === 'failed') {
      handleToast('error', 'Cập nhật trạng thái đơn hàng thất bại');
      dispatch(setStatus({ key: 'statusUpdate', value: 'idle' }));
    }
  }, [statusUpdate, dispatch]);

  const formik = useFormik({
    initialValues: {
      note: '',
    },
    validationSchema: cancelSchema,
    onSubmit: (values) => {
      const dataUpdate = {
        status: {
          status: 'cancelled',
          note: 'Chủ cửa hàng hủy đơn hàng',
          reason: values.note,
        },
      };
      setOpen(false);
      dispatch(updateOrder({ id, data: dataUpdate }));
    },
  });

  useEffect(() => {
    setOrderStatus(order.status);
  }, [order]);
  const renderStatusLabel = () => {
    if (!Array.isArray(orderStatus) || orderStatus.length === 0) {
      return <Label color="error">Chưa xác nhận</Label>;
    }
    const latestStatus = orderStatus[orderStatus.length - 1]?.status;
    const config = statusConfig[latestStatus];
    return (
      <Label sx={{ ml: 2 }} color={config?.color}>
        {config?.label}
      </Label>
    );
  };
  const handleUpdateOrder = (v) => {
    // Gọi API hủy đơn hàng
    const dataUpdate = {
      status: {
        status: v.value,
        note: v.label,
      },
    };
    dispatch(updateOrder({ id, data: dataUpdate }));
  };
  const renderCancel = () => {
    if (!Array.isArray(orderStatus) || orderStatus.length === 0) {
      return '';
    }
    const latestStatus = orderStatus[orderStatus.length - 1]?.status;
    if (latestStatus === 'pending' || latestStatus === 'confirmed') {
      return (
        <Button
          variant="contained"
          color="error"
          startIcon={<Iconify icon="eva:close-fill" />}
          onClick={() => setOpen(true)}
        >
          Hủy đơn hàng
        </Button>
      );
    }
    return '';
  };
  const renderUpdateStatus = () => {
    if (!Array.isArray(orderStatus) || orderStatus.length === 0) {
      return '';
    }
    const latestStatus = orderStatus[orderStatus.length - 1]?.status;
    if (handleStatusConfig[latestStatus]) {
      return (
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon={handleStatusConfig[latestStatus].icon} />}
          onClick={() => handleUpdateOrder(handleStatusConfig[latestStatus])}
        >
          {handleStatusConfig[latestStatus].label}
        </Button>
      );
    }
    return '';
  };
  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Lý do hủy đơn
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <textarea
                name="note"
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ width: '100%', height: '100px', borderRadius: '5px', padding: '5px' }}
              />
              {formik.touched.note && formik.errors.note ? (
                <Typography variant="body2" color="error">
                  {formik.errors.note}
                </Typography>
              ) : null}
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="contained" color="inherit" onClick={handleClose}>
                  Đóng
                </Button>
                <Button type="submit" variant="contained" color="error">
                  Hủy đơn hàng
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Modal>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Thông tin đơn hàng</Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          spacing={2}
        >
          {renderCancel()}
          {renderUpdateStatus()}
        </Stack>
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Thông tin đơn hàng" {...a11yProps(0)} />
            <Tab label="Danh sách sản phẩm" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Grid2 container spacing={2}>
            <Grid2 xs={8}>
              <Card
                sx={{
                  p: 3,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={3}
                  pl={2}
                >
                  <Typography variant="h5">Thông tin cơ bản</Typography>
                  {renderStatusLabel()}
                </Stack>
                <Typography sx={{ padding: '12px 0', fontWeight: 400 }} variant="h6">
                  Thông tin khách hàng
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  pl={2}
                >
                  <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                    Tên khách hàng:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {order.shippingInfo?.name}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  pl={2}
                >
                  <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                    Số điện thoại:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {order.shippingInfo?.phone}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  pl={2}
                >
                  <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {order?.email}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  pl={2}
                >
                  <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                    Địa chỉ:
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {renderAddress(order.shippingInfo)}
                  </Typography>
                </Stack>
                <Divider />
                <Accordion>
                  <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ padding: '12px 0' }}
                  >
                    Thông tin giao hàng
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Đơn vị giao hàng:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {data?.deliveryUnit}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Phí giao hàng:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {data?.fee ? formatCurrency(data?.fee) : 'Miễn phí'}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Thời gian giao hàng dự kiến:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {data?.estimatedDeliveryDate
                          ? formatDateTime(data?.estimatedDeliveryDate)
                          : ''}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Kiểu giao hàng:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {data?.shippingType ? data?.shippingType : 'Không rõ kiểu giao hàng'}
                      </Typography>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    aria-controls="price-order-content"
                    id="price-order-header"
                    sx={{ padding: '12px 0' }}
                  >
                    Thông tin đơn hàng
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Tổng giá:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {order?.totalPrice ? formatCurrency(order.totalPrice) : '0'}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Giảm giá:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {order?.discountPrice ? formatCurrency(order.discountPrice) : '0'}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Kiểu thanh toán:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {order?.paymentMethod || '0'}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Số tiền phải trả:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {order?.totalPayment ? formatCurrency(order.totalPayment) : '0'}
                      </Typography>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
                <Divider />

                <Accordion>
                  <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    aria-controls="status-order-content"
                    id="status-order-header"
                    sx={{ padding: '12px 0' }}
                  >
                    Thông tin khác
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Trạng thái đánh giá:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {order?.isComment ? 'Đã đánh giá' : 'Chưa đánh giá'}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Ngày tạo đơn:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {order?.createdAt ? formatDateTime(order.createdAt) : ''}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                      pl={2}
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                        Ngày cập nhật:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {order?.updatedAt ? formatDateTime(order.updatedAt) : ''}
                      </Typography>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Grid2>
            <Grid2 xs={4}>
              <OrderTimeline
                title="Trạng thái đơn hàng"
                // subheader="Tính năng đang phát triển"
                list={data?.status || []}
              />
            </Grid2>
          </Grid2>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Card>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {productList.map((product) => (
                <div key={product._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={product.name} src={renderUrl(product?.image, backEndUrl)} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <span
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.primary', display: 'inline' }}
                          >
                            {renderNameProduct(product)}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.primary', display: 'inline' }}
                          >
                            {renderTotalPrice(product)}
                          </Typography>
                        </span>
                      }
                      secondary={
                        <span
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.primary', display: 'inline' }}
                          >
                            Kích thước: {product.variantSize}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.primary', display: 'inline' }}
                          >
                            Màu: {product.variantColor}
                          </Typography>
                        </span>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))}
            </List>
          </Card>
        </CustomTabPanel>
      </Box>
    </Container>
  );
}
