import React, {useEffect} from "react";
import { Autoplay, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/swiper-bundle.css";

interface Props {
    cover : Array<String>,
}

const ImageSliderNav = React.memo(({cover} : Props) => {
    const updatePosition = () => {
        try {
            const pagination = document.querySelector('.swiper-pagination') as HTMLElement;
            const container = document.getElementById('container-slide') as HTMLElement;
            container.appendChild(pagination);
            pagination.style.cssText = 'bottom:auto';
        } catch (error) {}
    }

    useEffect(() => {
        updatePosition();
    }, [updatePosition])

    return (
        <div className="container-slider" id="container-slide">
            <Swiper className="productSlider"
                modules={[Pagination, Scrollbar, Autoplay]}
                autoplay={{delay: 5000, disableOnInteraction: false}}
                spaceBetween={16}
                slidesPerView={'auto'}
                centeredSlides={false}
                pagination={{ clickable: true }}>
                {cover.map((item, index) => 
                <SwiperSlide key={index}>
                    <img src={item.toString()} alt="menu-cover" title={`menu-cover-${index}`}/>
                </SwiperSlide>
                )}
            </Swiper>
        </div>
    )
})

export default ImageSliderNav;