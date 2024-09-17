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
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import { formatDateTime } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';
import {
  calculateProductDetails,
  renderAddress,
  renderNameProduct,
  renderTotalPrice,
} from 'src/utils/format-text';
import Label from 'src/components/label';
import { fetchById } from 'src/redux/slices/orderSlices';
import { statusConfig } from '../utils';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

// ----------------------------------------------------------------------
export default function DetailOrderPage() {
  const route = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [productList, setProductList] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);

  const data = useSelector((state) => state.orders.order);
  const status = useSelector((state) => state.orders.statusGet);
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
    setOrderStatus(order.status);
  }, [order]);
  const renderStatusLabel = () => {
    // Kiểm tra xem orderStatus có phải là mảng và không phải undefined không
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

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thông tin đơn hàng</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => route.push('create')}
        >
          Thêm người dùng
        </Button>
      </Stack>

      <Grid2 container spacing={1}>
        <Grid2 xs={8}>
          <Card
            sx={{
              p: 3,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography variant="h5">Thông tin cơ bản</Typography>
              {renderStatusLabel()}
            </Stack>
            <Divider />
            <Typography sx={{ padding: '12px 0', fontWeight: 400 }} variant="h6">
              Thông tin khách hàng
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Tên khách hàng:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order.shippingInfo?.name}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Số điện thoại:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order.shippingInfo?.phone}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>Email:</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{order?.email}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
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
                        key={item.status}
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
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {productList.map((product) => (
                <div key={product._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={product.thumbnail} />
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
                            Kích thước: {product.size}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.primary', display: 'inline' }}
                          >
                            Màu: {product.color}
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
    </Container>
  );
}
