import React from "react";
import Header from "../components/UI/Header";
import Hero from "../components/LandingPage/Hero";
import TimeLine from "../components/LandingPage/TimeLine";
import Features from "../components/LandingPage/Features";
import Offering from "../components/LandingPage/Offering";
import OfferingMajor from "../components/LandingPage/OfferingMajor";
import Footer from "../components/UI/Footer";
export default function LandingPage() {
  return (
    <div>
      <Header />
      <Hero />
      <TimeLine />
      <Features />
      <Offering />
      <OfferingMajor />
      <Footer />
    </div>
  );
}
