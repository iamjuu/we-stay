import Image from 'next/image';
import Sectioncomponent from '../components/section-component/section-component';
import { About2, About3, HeroImage,AboutSectionImage } from '@/content';
import AboutSection from '../components/about/section';
import Eligibility from '../components/eligibility/eligibility';
import Footer from '../components/footer/footer';

const About = () => {
  return (
    <div>
      <Sectioncomponent
        bgImage={AboutSectionImage}
        heading="Built by People Who"
        headingsecondary="Understand What's at Stake"
        paragraph="Building an ADU is a major decision. It involves your home, your money, and your future. WeStay was built to make that journey clearer, smarter, and easier to navigate."
      />

      <div className="flex flex-col gap-[80px] pt-[120px]">
        <AboutSection
          featured
          titlePrimary="Helping Homeowners Build"
          titleSecondary="With Clarity & Confidence"
          paragraphs={[
            "Richie's story is built on service, grit, and purpose. As a Navy veteran, he learned discipline, leadership, and the importance of showing up when it matters most. Those values became the foundation of everything he built after service.",
            "He entered the construction world with a hands-on mindset, earning real experience in building projects, solving problems, and delivering results. That background gave him a clear view of how difficult the process can be for homeowners trying to improve their property and create long-term value.",
            "Through his business journey, Richie became connected to an Inc. 5000 level environment, where growth, execution, and high standards were the expectation, not the exception. It shaped his belief that great businesses are built through strong systems, trust, and relentless consistency.",
          ]}
          imageSrc={About2}
          imageAlt="Richie - WeStay Founder"
          isImageLeft={true}
        />

        <AboutSection
          paragraphs={[
            "Richie leads with faith. He believes success should be grounded in integrity, service, and doing right by people. That mindset is the driving force behind WeStay.",
            "Today, his mission is simple but powerful: help homeowners unlock the hidden potential of their property, create new income opportunities, and make the path to building easier, smarter, and more transparent than ever before.",
          ]}
          imageSrc={About3}
          imageAlt="WeStay ADU exterior"
          isImageLeft={false}
        />
      </div>

      {/* Wide landscape image */}
     

      <Eligibility />

      <div className="pt-10">
        <Footer />
      </div>
    </div>
  );
};

export default About;
