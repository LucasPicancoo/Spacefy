import React from "react";
import Header from "../../Components/Header/Header.jsx";
import Footer from "../../Components/Footer/Footer.jsx";
import { useUser } from "../../Contexts/UserContext.jsx";
import Banner from "./Banner/Banner.jsx";
import LoginBanner from "./LoginBanner/LoginBanner.jsx";
import IdealSpaceSection from "./IdealSpaceSection/IdealSpaceSection.jsx";
import ExperienceSection from "./ExperienceSection/ExperienceSection.jsx";
import TopRatedSection from "./TopRatedSection/TopRatedSection.jsx";
import FAQSection from "./FAQSection/FAQSection.jsx";
import ScrollToTopButton from "../../Components/ScrollToTopButton/ScrollToTopButton.jsx";
import MiniChat from "../../Components/MiniChat/MiniChat.jsx";

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
      <MiniChat />
      <ScrollToTopButton />
    </>
  );
};

export default Landing;
