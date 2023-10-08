import { FC } from 'react';
import { Box, Stack } from '@mui/material';
import Banner from '@/components/product/Banner';
import CategoryHomePage from '@/components/product/CategoryHomePage';

interface pageProps {}

const data = [
    {
        image: 'https://cf.shopee.vn/file/vn-50009109-306952c0b75686c1efdf3839067da87c_xxhdpi',
    },
    {
        image: 'https://cf.shopee.vn/file/vn-50009109-d15192752ffe0490ac920f97bb8b2d30_xxhdpi',
    },
    {
        image: 'https://cf.shopee.vn/file/vn-50009109-03cd2d19624abf4f3aa0c90cc7a2a873_xxhdpi',
    },
    {
        image: 'https://cf.shopee.vn/file/vn-50009109-5688f24c376d7df04fce3c80d5028511_xxhdpi',
    },
    {
        image: 'https://cf.shopee.vn/file/vn-50009109-9f55e03457f53c21641e034794aa44a0_xxhdpi',
    },
    {
        image: 'https://cf.shopee.vn/file/vn-50009109-fabe2ead59c291819454f8e780519fce_xxhdpi',
    },
];

const subData = [
    {
        image: 'https://cf.shopee.vn/file/vn-50009109-eb884a587f474acc3fb57308baae76b9_xhdpi',
    },
    {
        image: 'https://cf.shopee.vn/file/vn-50009109-fdc0b0de2081fb1b4c7121c7a6de1ac6_xhdpi',
    },
];

const HomePage: FC<pageProps> = ({}) => {
    return (
        <Stack py={4} spacing={4}>
            <Banner swiperData={data} subSwiper={subData} />
            <CategoryHomePage />
        </Stack>
    );
};

export default HomePage;
