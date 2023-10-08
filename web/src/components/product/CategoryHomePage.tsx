'use client';

import { FC } from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import Image from 'next/image';
import { grey } from '@mui/material/colors';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NextLink from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';

interface CategoryHomePageProps {}

const CategoryHomePage: FC<CategoryHomePageProps> = ({}) => {
    return (
        <Box
            sx={{
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                borderRadius: '4px',
                overflow: 'hidden',
            }}
        >
            <Typography
                bgcolor={'white'}
                variant="subtitle1"
                color={grey[600]}
                p={2}
                textTransform={'uppercase'}
                sx={{ borderBottom: '1px solid #eee' }}
            >
                Danh mục
            </Typography>
            <Box
                position={'relative'}
                sx={{
                    '&:hover .button-prev-swiper-category, &:hover .button-next-swiper-category':
                        {
                            opacity: 1,
                        },
                    '& .swiper-button-disabled': {
                        opacity: '0 !important',
                    },
                }}
            >
                <Box
                    component={Swiper}
                    slidesPerView={3}
                    breakpoints={{
                        0: {
                            slidesPerView: 3,
                        },
                        600: {
                            slidesPerView: 3,
                        },
                        900: {
                            slidesPerView: 4,
                        },
                        1200: {
                            slidesPerView: 5,
                        },
                    }}
                    slidesPerGroup={2}
                    navigation={{
                        prevEl: '.button-prev-swiper-category',
                        nextEl: '.button-next-swiper-category',
                        enabled: true,
                    }}
                    grid={{
                        rows: 2,
                        fill: 'row',
                    }}
                    spaceBetween={2}
                    modules={[Navigation, Grid]}
                    className="mySwiper"
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        borderRadius: '4px',
                        flex: 2,
                        '& .swiper-slide': {
                            width: 'fit-content',
                        },
                    }}
                >
                    {Array.from({ length: 10 }, (_, i) => (
                        <SwiperSlide key={i}>
                            <Link
                                component={NextLink}
                                href="/"
                                underline="none"
                                display={'flex'}
                            >
                                <Box
                                    bgcolor={'white'}
                                    width={'100%'}
                                    p={2}
                                    display="flex"
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    sx={{
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            boxShadow:
                                                'rgba(99, 99, 99, 0.1) 0px 2px 10px 0px',
                                        },
                                    }}
                                >
                                    <Box
                                        position={'relative'}
                                        sx={{ aspectRatio: '1 / 1' }}
                                    >
                                        <Image
                                            src="https://down-vn.img.susercontent.com/file/6cb7e633f8b63757463b676bd19a50e4_tn"
                                            alt="category"
                                            fill
                                            style={{ objectFit: 'contain' }}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </Box>
                                    <Typography
                                        textAlign={'center'}
                                        sx={{
                                            typography: {
                                                xs: 'body2',
                                                sm: 'subtitle1',
                                            },
                                        }}
                                    >
                                        Máy tính & điện tử
                                    </Typography>
                                </Box>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Box>
                <IconButton
                    className="button-prev-swiper-category"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        transform: 'translateY(-50%)',
                        zIndex: 20,
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
                    className="button-next-swiper-category"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 0,
                        transform: 'translateY(-50%)',
                        zIndex: 20,
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
            </Box>
        </Box>
    );
};

export default CategoryHomePage;
