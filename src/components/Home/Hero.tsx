import { Link } from "react-router-dom";
import BgShape from "../../images/hero/hero-bgg.svg";
import HeroCar from "../../images/hero/yaris.webp";
import { useEffect, useState } from "react";
import './Hero.css'

function Hero() {
  const [goUp, setGoUp] = useState(false);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bookBtn = (): void => {
    const bookingSection = document.querySelector("#booking-section");
    if (bookingSection) {
      (bookingSection as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onPageScroll = () => {
      if (window.pageYOffset > 600) {
        setGoUp(true);
      } else {
        setGoUp(false);
      }
    };
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);
  return (
    <>
      <section id="home" className="hero-section">
        <div className="container">
          <img className="bg-shape" src={BgShape} alt="bg-shape" />
          <div className="hero-content">
            <div className="hero-content__text">
              <h4>Plan your trip now</h4>
              <h1>
                Rent at <span>Ioannina</span> with our car rental
              </h1>
              <p>
              Rent a car at the best price, all of ours cars have the best
               safety standars of the market.
              </p>
              <div className="hero-content__text__btns">
                <Link
                  className="hero-content__text__btns__book-ride"
                  to="/cars"
                >
                  Book Ride &nbsp; <i className="fa-solid fa-car"></i>
                </Link>
                <Link 
                  className="hero-content__text__btns__learn-more" 
                  to="/contact"
                  >
                  Learn More &nbsp; <i className="fa-solid fa-angle-right"></i>
                </Link>
              </div>
            </div>

          
            <img
              src={HeroCar}
              alt="car-img"
              className="hero-content__car-img"
            />
          </div>
        </div>

       
        <div
          onClick={scrollToTop}
          className={`scroll-up ${goUp ? "show-scroll" : ""}`}
        >
          <i className="fa-solid fa-angle-up"></i>
        </div>
      </section>
    </>
  );
}

export default Hero;