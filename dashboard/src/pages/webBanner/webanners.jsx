import {Helmet} from 'react-helmet-async';

// eslint-disable-next-line import/named
import {WebBannersView} from "src/sections/webBanner/view";

// ----------------------------------------------------------------------

export default function CouponsPage() {
    return (
        <>
            <Helmet>
                <title>Bảng quảng cáo</title>
            </Helmet>

            <WebBannersView/>
        </>
    );
}
