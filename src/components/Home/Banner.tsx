import './Banner.css';

function Banner() {
    return (
      <>
        <section className="banner-section">
        <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>You come to <span>Ioannina</span>? Rent with Us</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3> 26510 26510</h3>
              </span>
            </div>
          </div>
        </div>
        </section>
      </>
    );
  }
  
  export default Banner;