'use client';

import { FC } from 'react';
import { Stack, Box, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';

interface IBannerImage {
    image: string;
}

interface BannerProps {
    swiperData: IBannerImage[];
    subSwiper?: IBannerImage[];
}

const Banner: FC<BannerProps> = ({ swiperData, subSwiper }) => {
    if (subSwiper && subSwiper.length < 2) {
        throw new Error('subSwiper must have at least 2 images');
    }

    return (
        <>
            <Stack direction="row" spacing={1}>
                <Box
                    component={Swiper}
                    slidesPerView={1}
                    pagination={true}
                    navigation={{
                        prevEl: '.button-prev-swiper',
                        nextEl: '.button-next-swiper',
                    }}
                    loop={true}
                    autoplay={{
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                        delay: 5000,
                    }}
                    modules={[Navigation, Pagination, Autoplay]}
                    className="mySwiper"
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        borderRadius: '4px',
                        flex: 2,
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                        '& .swiper-pagination-bullet-active': {
                            bgcolor: 'primary.main',
                        },
                        '&:hover .button-prev-swiper, &:hover .button-next-swiper':
                            {
                                opacity: 1,
                            },
                    }}
                >
                    <IconButton
                        className="button-prev-swiper"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                            color: 'white',
                            borderRadius: '2px',
                            width: 'auto',
                            height: 'auto',
                            py: 2,
                            px: 0.8,
                            bgcolor: 'rgba(0,0,0,.1)',
                            opacity: 0,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        <ArrowBackIosNewIcon fontSize="medium" />
                    </IconButton>
                    <IconButton
                        className="button-next-swiper"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 0,
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                            color: 'white',
                            borderRadius: '2px',
                            width: 'auto',
                            height: 'auto',
                            py: 2,
                            px: 0.8,
                            bgcolor: 'rgba(0,0,0,.1)',
                            opacity: 0,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        <ArrowForwardIosIcon fontSize="medium" />
                    </IconButton>
                    {swiperData.map((data) => {
                        return (
                            <SwiperSlide key={data.image}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        aspectRatio: '7/2',
                                    }}
                                >
                                    <Image
                                        src={data.image}
                                        alt="banner"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </Box>
                            </SwiperSlide>
                        );
                    })}
                </Box>
                {subSwiper && (
                    <Stack
                        flex={1}
                        spacing={1}
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'flex',
                            },
                        }}
                    >
                        {subSwiper.map((data) => {
                            return (
                                <Box
                                    key={data.image}
                                    height={'100%'}
                                    sx={{
                                        position: 'relative',
                                        borderRadius: '4px',
                                        boxShadow:
                                            'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                                    }}
                                >
                                    <Image
                                        src={data.image}
                                        alt="banner"
                                        fill
                                        style={{
                                            borderRadius: '4px',
                                            objectFit: 'cover',
                                        }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </Box>
                            );
                        })}
                    </Stack>
                )}
            </Stack>
        </>
    );
};

export default Banner;
