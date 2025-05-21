import React from "react";
import Header from "../../Components/Header/Header.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
import { useUser } from "../../Contexts/userContext.jsx";
import Banner from "./Banner/Banner.jsx";
import LoginBanner from "../../Components/LoginBanner/LoginBanner.jsx";
import IdealSpaceSection from "../../Components/IdealSpaceSection/IdealSpaceSection";
import ExperienceSection from "../../Components/ExperienceSection/ExperienceSection";
import TopRatedSection from "../../Components/TopRatedSection/TopRatedSection";
import FAQSection from "../../Components/FAQSection/FAQSection";
import ScrollToTopButton from "../../Components/ScrollToTopButton/ScrollToTopButton.jsx";

const Landing = () => {
  const { isLoggedIn } = useUser();

  return (
    <>
      <Header />
      <Banner />
      {!isLoggedIn && <LoginBanner />}
      <IdealSpaceSection />
      <ExperienceSection />
      <TopRatedSection />
      <FAQSection />
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default Landing;
