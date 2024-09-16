import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleToast } from 'src/hooks/toast';
import { Accordion, AccordionDetails, AccordionSummary, Divider } from '@mui/material';
import { formatDateTime } from 'src/utils/format-time';
import { formatCurrency } from 'src/utils/format-number';
import { renderAddress } from 'src/utils/format-address';
import { statusConfig } from '../utils';
import Label from 'src/components/label';

// ----------------------------------------------------------------------
const addressData = {
  provinceName: 'Đắk Lắk',
  districtName: 'Buôn Ma Thuột',
  districtCode: 661,
  wardName: 'Tân Lợi',
  wardCode: 11707,
  detailAddress: '123 đường ABC',
  phone: '0123456789',
  name: 'Nguyễn Văn A',
};
export default function DetailOrderPage() {
  const route = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState({});

  const data = useSelector((state) => state.orders.orders);
  const status = useSelector((state) => state.orders.status);
  useEffect(() => {
    if (status === 'succeeded') {
      const orderDetail = data.find((item) => item._id === id);
      if (orderDetail) {
        setOrder(orderDetail);
      } else {
        handleToast('error', 'Đơn hàng không tồn tại');
        route.push('/orders');
      }
    } else if (status === 'failed') {
      route.push('/orders');
      handleToast('error', 'Đã xảy ra lỗi');
    } else {
      route.push('/orders');
    }
  }, [status, data, id, route]);

  useEffect(() => {
    console.log(order);
  }, [order]);
  const renderStatusLabel = (sts) => {
    const latestStatus = sts[sts.length - 1]?.status;
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

      <Card
        sx={{
          p: 3,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
          <Typography variant="h5">Thông tin cơ bản</Typography>
          {renderStatusLabel(order.status)}
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
          <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>Số điện thoại:</Typography>
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Tổng giá vốn:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order?.totalCapitalPrice ? formatCurrency(order.totalCapitalPrice) : '0'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Giá giảm giá:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order?.discountPrice ? formatCurrency(order.discountPrice) : '0'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Tổng giá trị đơn hàng:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order?.totalPrice ? formatCurrency(order.totalPrice) : '0'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>Lợi nhuận:</Typography>
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Đơn vị giao hàng:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order.shipping?.deliveryUnit}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Địa chỉ giao hàng:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order.shipping?.detailAddress}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Thời gian giao hàng dự kiến:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order.shipping?.estimatedDeliveryDate
                  ? formatDateTime(order.shipping?.estimatedDeliveryDate)
                  : ''}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Phí giao hàng:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order.shipping?.fee ? formatCurrency(order.shipping.fee) : 'Miễn phí'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Phí giao hàng:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order.shipping?.fee ? formatCurrency(order.shipping.fee) : 'Miễn phí'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
              <Typography sx={{ width: '33%', flexShrink: 0, fontSize: 14 }}>
                Trạng thái:
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {order.shipping?.status ? order.shipping?.status : 'Không rõ trạng thái'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} pl={2}>
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
                    key={item._id}
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
    </Container>
  );
}
