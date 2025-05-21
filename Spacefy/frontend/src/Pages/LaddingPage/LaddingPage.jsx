import React from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { useUser } from "../../Contexts/userContext.jsx";
import Banner from "../../Components/Banner/Banner";
import LoginBanner from "../../Components/LoginBanner/LoginBanner";
import IdealSpaceSection from "../../Components/IdealSpaceSection/IdealSpaceSection";
import ExperienceSection from "../../Components/ExperienceSection/ExperienceSection";
import TopRatedSection from "../../Components/TopRatedSection/TopRatedSection";
import FAQSection from "../../Components/FAQSection/FAQSection";
import ScrollToTopButton from "../../Components/ScrollToTopButton/ScrollToTopButton";

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
