import Header from "./components/layout/Header";
import Hero from "./sections/Hero";
import Menu from "./sections/Menu";
import Occasions from "./sections/Occasions";
import Marquee from "./sections/Marquee";
import useReveal from "./hooks/useReveal";
import Story from "./sections/Story";
import Why from "./sections/Why";
import Custom from "./sections/Custom";
import Contact from "./sections/Contact";
import Collab from "./sections/Collab";
import Footer from "./sections/Footer";

export default function App() {
  useReveal();
  return (
    <>
      <Header />
      <Hero />
      <Menu />
      <Occasions />
      <Story />
      <Why />
      <Marquee />
      <Custom />
      <Contact />
      <Collab />
      <Footer />
    </>
  );
}
