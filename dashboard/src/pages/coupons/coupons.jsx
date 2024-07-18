import {Helmet} from 'react-helmet-async';

// eslint-disable-next-line import/named
import {CouponsView} from "src/sections/coupons/view";

// ----------------------------------------------------------------------

export default function OrdersPage() {
    return (
        <>
            <Helmet>
                <title> Orders</title>
            </Helmet>

            <CouponsView/>
        </>
    );
}
