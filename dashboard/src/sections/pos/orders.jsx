import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import InputAdornment from '@mui/material/InputAdornment';
import {
  List,
  Avatar,
  Divider,
  ListItem,
  Accordion,
  Typography,
  ListItemText,
  OutlinedInput,
  ListItemAvatar,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { trackingOrder } from 'src/redux/slices/posSlices';
import Grid2 from '@mui/material/Unstable_Grid2';
import Label from 'src/components/label';
import { renderAddress, renderTotalPrice, renderNameProduct } from 'src/utils/format-text';
import { formatCurrency } from 'src/utils/format-number';
import { formatDateTime } from 'src/utils/format-time';
import { renderUrl } from 'src/utils/check';
import { statusConfig, handleStatusConfig } from '../orders/utils';

// ----------------------------------------------------------------------
const backendUrl = import.meta.env.VITE_BACKEND_APP_URL;
export default function CheckOrderPage() {
  const route = useRouter();
  const [order, setOrder] = useState(null);
  const status = useSelector((state) => state.pos.statusOrder);
  const data = useSelector((state) => state.pos.orders);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === 'successful') {
      console.log(data);
      setOrder(data);
    }
  }, [status, data]);
  const handleTrackingOrder = (e) => {
    if (e.target.value.length > 0 && status !== 'loading') {
      dispatch(trackingOrder(e.target.value));
    }
  };
  const renderStatusLabel = (s) => {
    if (!Array.isArray(s) || s.length === 0) {
      return <Label color="error">Chưa xác nhận</Label>;
    }
    const latestStatus = s[s.length - 1]?.status;
    const config = statusConfig[latestStatus];
    return (
      <Label sx={{ ml: 2 }} color={config?.color}>
        {config?.label}
      </Label>
    );
  };
  const renderCancel = (s) => {
    if (!Array.isArray(s) || s.length === 0) {
      return '';
    }
    const latestStatus = s[s.length - 1]?.status;
    if (latestStatus === 'pending' || latestStatus === 'processing') {
      return (
        <Button
          variant="contained"
          color="error"
          startIcon={<Iconify icon="eva:close-fill" />}
          // onClick={() => setOpen(true)}
        >
          Hủy đơn hàng
        </Button>
      );
    }
    return '';
  };
  const renderUpdateStatus = (s) => {
    if (!Array.isArray(s) || s.length === 0) {
      return '';
    }
    const latestStatus = s[s.length - 1]?.status;
    if (handleStatusConfig[latestStatus]) {
      return (
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon={handleStatusConfig[latestStatus].icon} />}
          // onClick={() => handleUpdateOrder(handleStatusConfig[latestStatus].value)}
        >
          {handleStatusConfig[latestStatus].label}
        </Button>
      );
    }
    return '';
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <OutlinedInput
          onChange={handleTrackingOrder}
          placeholder="Tìm kiếm đơn hàng..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          {renderCancel(order?.status)}
          {renderUpdateStatus(order?.status)}
          {/* <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => handleToast('info', 'Tính năng đang phát triển')}
          >
            Tạo đơn hàng
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => handleToast('info', 'Tính năng đang phát triển')}
          >
            Tạo đơn trả hàng
          </Button> */}
        </Stack>
      </Stack>

      {order ? (
        <Grid2 container spacing={3}>
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
                mb={5}
                pl={2}
              >
                <Typography variant="h5">Thông tin cơ bản</Typography>
                {renderStatusLabel(order.status)}
              </Stack>
              <Divider />
              <Typography sx={{ padding: '12px 0', fontWeight: 400 }} variant="h6">
                Thông tin khách hàng
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={5}
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
                mb={5}
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
                mb={5}
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
                mb={5}
                pl={2}
              >
                <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>Địa chỉ:</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                  {renderAddress(order.shippingInfo)}
                </Typography>
              </Stack>
              <Divider />
              <Accordion>
                <AccordionSummary
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  aria-controls="price-order-content"
                  id="price-order-header"
                  sx={{ padding: '12px 0' }}
                >
                  Giá trị đơn hàng
                </AccordionSummary>
                <AccordionDetails>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Tổng giá vốn:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order?.totalCapitalPrice ? formatCurrency(order.totalCapitalPrice) : '0'}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Giá giảm giá:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order?.discountPrice ? formatCurrency(order.discountPrice) : '0'}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Tổng giá trị đơn hàng:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order?.totalPrice ? formatCurrency(order.totalPrice) : '0'}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Lợi nhuận:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order?.totalProfit ? formatCurrency(order.totalProfit) : '0'}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
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
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Đơn vị giao hàng:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order.shipping?.deliveryUnit}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Địa chỉ giao hàng:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order.shipping?.detailAddress}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Thời gian giao hàng dự kiến:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order.shipping?.estimatedDeliveryDate
                        ? formatDateTime(order.shipping?.estimatedDeliveryDate)
                        : ''}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Phí giao hàng:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order.shipping?.fee ? formatCurrency(order.shipping.fee) : 'Miễn phí'}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Phí giao hàng:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order.shipping?.fee ? formatCurrency(order.shipping.fee) : 'Miễn phí'}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Trạng thái:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order.shipping?.status ? order.shipping?.status : 'Không rõ trạng thái'}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                    pl={2}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                      Kiểu giao hàng:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {order.shipping?.shippingType
                        ? order.shipping?.shippingType
                        : 'Không rõ kiểu giao hàng'}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  aria-controls="status-order-content"
                  id="status-order-header"
                  sx={{ padding: '12px 0' }}
                >
                  Trạng thái đơn hàng
                </AccordionSummary>
                <AccordionDetails>
                  {order.status
                    ? order.status?.map((item) => (
                        <Stack
                          key={item.createdAt}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={5}
                          pl={2}
                        >
                          <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                            Trạng thái:
                            <Label sx={{ ml: 2 }} color={statusConfig[item.status]?.color}>
                              {statusConfig[item.status]?.label}
                            </Label>
                          </Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                            {item.createdAt ? formatDateTime(item.createdAt) : ''}
                          </Typography>
                        </Stack>
                      ))
                    : ''}
                </AccordionDetails>
              </Accordion>
            </Card>
          </Grid2>
          <Grid2 xs={4}>
            <Card>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {order.productsList.map((product) => (
                  <div key={product._id}>
                    <ListItem
                      sx={{
                        ':hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          cursor: 'pointer',
                        },
                      }}
                      alignItems="flex-start"
                      onClick={() => route.push(`/admin/products/${product._id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar alt={product.name} src={renderUrl(product.image, backendUrl)} />
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
          </Grid2>
        </Grid2>
      ) : (
        <Card
          sx={{
            p: 3,
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {status === 'idle' ? (
            <Typography variant="h5">Nhập mã tra cứu và đơn hàng sẽ hiển thị ở đây</Typography>
          ) : (
            <Typography variant="h5">Không tìm thấy đơn hàng</Typography>
          )}
        </Card>
      )}
    </Container>
  );
}
