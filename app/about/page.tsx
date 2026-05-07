import React from 'react';
import Sectioncomponent from '../components/section-component/section-component';
import { About1, About2, About3, About4, HeroImage } from '@/content'
import AboutSection from '../components/about/section';
import Eligibility from '../components/eligibility/eligibility';
import Footer from '../components/footer/footer';

const About = () => {
  return (
    <div>
      < Sectioncomponent bgImage={HeroImage} heading="Built by People Who " headingsecondary="Understand What’s at Stake" paragraph="Building an ADU is a major decision. It involves your home, your money, and your future. WeStay was built to make that journey clearer, smarter, and easier to navigate.
"/>

      <div className='flex flex-col gap-2'>
        <AboutSection titlePrimary="Built by People Who " titleSecondary="Understand What’s at Stake" description="Building an ADU is a major decision. It involves your home, your money, and your future. WeStay was built to make that journey clearer, smarter, and easier to navigate." imageSrc={About2} imageAlt="About Image" />
        <AboutSection isImageLeft={false} titlePrimary="Built by People Who " titleSecondary="Understand What’s at Stake" description="Building an ADU is a major decision. It involves your home, your money, and your future. WeStay was built to make that journey clearer, smarter, and easier to navigate." imageSrc={About3} imageAlt="About Image" />
        <AboutSection titlePrimary="Built by People Who " titleSecondary="Understand What’s at Stake" description="Building an ADU is a major decision. It involves your home, your money, and your future. WeStay was built to make that journey clearer, smarter, and easier to navigate." imageSrc={About4} imageAlt="About Image" />
        <AboutSection isImageLeft={false} titlePrimary="Built by People Who " titleSecondary="Understand What’s at Stake" description="Building an ADU is a major decision. It involves your home, your money, and your future. WeStay was built to make that journey clearer, smarter, and easier to navigate." imageSrc={About4} imageAlt="About Image" />
        <AboutSection titlePrimary="Built by People Who " titleSecondary="Understand What’s at Stake" description="Building an ADU is a major decision. It involves your home, your money, and your future. WeStay was built to make that journey clearer, smarter, and easier to navigate." imageSrc={About4} imageAlt="About Image" />
      </div>
      <div>
        <Eligibility />
      </div>
      <div className="pt-[120px]">
        <Footer />
      </div>
    </div>
  );
}

export default About