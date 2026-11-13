
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";

import primaryImage from "../../assets/icons/primary.webp";
import secondaryImage from "../../assets/icons/secondary.jfif";
import tertiaryImage from "../../assets/icons/uni.jpg";
import skillsImage from "../../assets/icons/skills.webp";

import "./Home.scss";

const slides = [
  {
    title: "Primary Education",
    description:
      "Build strong foundations in essential subjects and develop the knowledge needed for lifelong learning.",
    image: primaryImage,
  },
  {
    title: "Secondary Education",
    description:
      "Strengthen your academic knowledge, prepare for examinations, and build confidence for the next stage of your education.",
    image: secondaryImage,
  },
  {
    title: "Tertiary Education",
    description:
      "Develop advanced academic and professional knowledge designed to support your university and career goals.",
    image: tertiaryImage,
  },
  {
    title: "Practical Skills",
    description:
      "Learn practical skills for work, entrepreneurship, business, technology, and personal growth.",
    image: skillsImage,
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((previous) =>
        previous === slides.length - 1 ? 0 : previous + 1
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((previous) =>
      previous === slides.length - 1 ? 0 : previous + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((previous) =>
      previous === 0 ? slides.length - 1 : previous - 1
    );
  };

  const slide = slides[currentSlide];

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-background">
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <div className="hero-grid-pattern" />
            <div className="hero-circle hero-circle-one" />
            <div className="hero-circle hero-circle-two" />
          </div>

          <Container>
            <div className="learning-carousel">
              <div className="carousel-image-wrapper">
                <img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.title}
                  className="carousel-image"
                />

                <div className="carousel-image-overlay" />
              </div>

              <div className="carousel-content">
                <h2>{slide.title}</h2>

                <p>{slide.description}</p>
              </div>

              <button
                type="button"
                className="carousel-control carousel-control-left"
                onClick={previousSlide}
                aria-label="Previous learning level"
              >
                <ArrowLeft size={20} />
              </button>

              <button
                type="button"
                className="carousel-control carousel-control-right"
                onClick={nextSlide}
                aria-label="Next learning level"
              >
                <ArrowRight size={20} />
              </button>

              <div className="carousel-dots">
                {slides.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    className={
                      index === currentSlide
                        ? "carousel-dot active"
                        : "carousel-dot"
                    }
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to ${item.title}`}
                  />
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
