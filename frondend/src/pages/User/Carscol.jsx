import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import DefaultLayout from "../../component/DefaultLayout";
export default function SliderComponent() {
  return (
    <DefaultLayout>
    <div style={{ position: "relative", overflow: "hidden" }}>

      <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* <h1 style={{ position: "", top: "50%", left: "800px", transform: "translate(-50%, -50%)" }}>Welcome to Car Renter</h1> */}
        <button
          style={{
            
            zIndex: 2,
           
            borderRadius: "5px",
            boxShadow: "0px 0px 5px #ccc"
          }}
          className="mt-20 absolute top-96 left-[40%] p-4 w-52 bg-orange-600 hover:bg-orange-500 "
        >
          Rent Car
        </button>
      </div>
      <div style={{ position: "relative", height: "100vh" }}>
      <Swiper navigation modules={[Navigation]} className="mySwiper">
        <SwiperSlide>
          <img
            className="object-fill w-screen h-screen "
            src="https://images.cdn.autoslash.com/blog/rent-car-someone-else.jpg"
            alt="image slide 1"
          />
           <div style={{ position: "absolute", top: "40%", left: "45%", transform: "translate(-50%, -50%)" ,color: "red" }}>
        <h1 style={{ color: "#ffffff" }}>Welcome to Car Renter</h1>
      </div>
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="object-fill w-screen h-screen"
            src="https://www.readersdigest.ca/wp-content/uploads/2018/11/car-rental-discounts-with-airlines.jpg?w=1000"
            alt="image slide 2"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="object-fill w-screen h-screen"
            src="https://digestcars.com/wp-content/uploads/2019/10/rent-a-car.jpg"
            alt="image slide 3"
          />
        </SwiperSlide>
      </Swiper>
      </div>
    </div>
    </DefaultLayout>
  );
}
