// import pkg from '../models/addressModel.js';
// const { addressModel } = pkg;

import axios from 'axios';
const dataXa = async (district_id) => {
    const xa = await axios.get(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
        {
            headers: {
                token: 'f2982490-d319-11ee-8bfa-8a2dda8ec551',
                'Content-Type': 'application/json',
            },
            data: {
                district_id: district_id,
            },
        }
    );
    const xaVip = xa.data.data;

    if (xaVip) {
        const newxa = xaVip.map((i) => ({
            WardCode: i.WardCode,
            DistrictID: i.DistrictID,
            WardName: i.WardName,
        }));
        const xa = await axios.post(
            'http://localhost:3000/api/address/xa',
            newxa
        );
        console.log(newxa);
    }
    // return newxa;
};
async function processNumbersWithDelay(numbers) {
    for (const i of numbers) {
        // console.log(i);
        await dataXa(i.DistrictID);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}
const getXa = async (req, res) => {
    try {
        const xa = await axios.get('http://localhost:3000/api/address/huyen');
        await processNumbersWithDelay(xa.data);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};
getXa();
