import SelectCar from "../../images/whyus/ncap.png";
import Contact from "../../images/whyus/cheap2.png";
import Drive from "../../images/whyus/24support.png";
import './Why.css'

function PlanTrip() {
  return (
    <>
      <section className="plan-section">
        <div className="container">
          <div className="plan-container">
            <div className="plan-container__title">
              <h3>Why Us?</h3>
              <h2>The Best Car Rental on the Market</h2>
            </div>

            <div className="plan-container__boxes">
              <div className="plan-container__boxes__box">
                <img src={SelectCar} alt="icon_img" />
                <h3>Best Safety Standars</h3>
                <p>
                  All of our rental cars holds 5 stars at Euro NCAP
                </p>
              </div>

              <div className="plan-container__boxes__box">
                <img src={Contact} alt="icon_img" />
                <h3>Cheap Rentals</h3>
                <p>
                  The best prices for car rentals in the city!
                </p>
              </div>

              <div className="plan-container__boxes__box">
                <img src={Drive} alt="icon_img" />
                <h3>We got you Cover!</h3>
                <p>
                  We got you cover at any problem, we offer 24/7 support via telephone
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlanTrip;
