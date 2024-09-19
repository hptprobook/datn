import {Helmet} from 'react-helmet-async';

// eslint-disable-next-line import/named
import {CouponsView} from "src/sections/coupons/view";

// ----------------------------------------------------------------------

export default function CouponsPage() {
    return (
        <>
            <Helmet>
                <title> Mã giảm giá</title>
            </Helmet>

            <CouponsView/>
        </>
    );
}
