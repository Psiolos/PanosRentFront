import './Footer.css';

function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-content">
            <ul className="footer-content__1">
              <li>
                <span>PANOS</span> Rental
              </li>
              <li>
                The best cars in the city at the best price!
              </li>
              <li>
                <a href="tel:2651026510">
                  <i className="fa-solid fa-phone"></i> &nbsp; +30 26510 26510
                </a>
              </li>

              <li>
                <a
                  href="mailto: 
                psiolos@outlook.com"
                >
                  <i className="fa-solid fa-envelope"></i>
                  &nbsp; psiolos@outlook.com
                </a>
              </li>

              {/*<li>
                <a
                  style={{ fontSize: "14px" }}
                  target="_blank"
                  rel="noreferrer"
                  href="https://psiolos.app/"
                >
                  Design by Panos Siolos
                </a>
              </li> */}
            </ul>

            <ul className="footer-content__2">
              <li>Store Info</li>
              <li>
                <a href="#home">Who we are</a>
              </li>
              <li>
                <a href="#home">News</a>
              </li>
              <li>
                <a href="#home">Travel at Ioannina</a>
              </li>
              <li>
                <a href="#home">Other Companies</a>
              </li>
              <li>
                <a href="/contact">Contact us</a>
              </li>
            </ul>

            <ul className="footer-content__2">
              <li>Hours Open</li>
              <li>Mon - Fri: 9:00AM - 3:00PM</li>
            </ul>

            <ul className="footer-content__2">
              <li>Subscription</li>
              <li>
                <p>Subscribe your Email address for latest offers.</p>
              </li>
              <li>
                <input type="email" placeholder="Enter Email Address"></input>
              </li>
              <li>
                <button className="submit-email">Submit</button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;