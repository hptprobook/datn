import {Helmet} from 'react-helmet-async';

// eslint-disable-next-line import/named
import {WareHouseView} from "../../sections/warehouse/view";

// ----------------------------------------------------------------------

export default function WareHousePage() {
    return (
        <>
            <Helmet>
                <title> Warehouse</title>
            </Helmet>

            <WareHouseView/>
        </>
    );
}
