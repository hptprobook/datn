import {Helmet} from 'react-helmet-async';

// eslint-disable-next-line import/named
import { OrdersView } from "src/sections/orders/view";

// ----------------------------------------------------------------------

export default function OrdersPage() {
    return (
        <>
            <Helmet>
                <title> Đơn hàng</title>
            </Helmet>

            <OrdersView/>
        </>
    );
}
