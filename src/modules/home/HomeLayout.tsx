'use client';

import { AnimationGeneratorType, motion, useAnimation } from 'framer-motion';
import { NavBarActions, StyledButton } from '../builder/nav-bar/atoms';

import { BsGithub } from 'react-icons/bs';
import { Button } from '@mui/material';
import FeatureSection from './components/Feature';
import Image from '@/helpers/common/components/Image';
import Link from 'next/link';
import Person from './components/Person';
import { useLanguage } from '@/helpers/i18n/LanguageContext';
import { messages } from '@/helpers/i18n/messages';

const HomeLayout = () => {
  const controls = useAnimation();
  const animationEffectsHoverEnter = { scale: 1.05 };
  const animationEffectsHoverLeave = { scale: 1 };
  const animationEffectsFirstLoad = {
    scale: [0.9, 1],
    opacity: [0, 1],
  };
  const transitionEffects = {
    type: 'spring' as AnimationGeneratorType,
    stiffness: 400,
    damping: 17,
  };

  const { locale, setLocale } = useLanguage();
  const t = messages[locale].home;
  const n = messages[locale].nav;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1] }} className="scroll-smooth">
      <nav className="sticky top-0 z-20 h-14 w-full bg-resume-800 flex py-2.5 px-4 xl:px-60 items-center shadow-level-8dp">
        <Link href="/">
          <Image src={'/icons/resume-icon.png'} alt="logo" height="36" width="36" />
        </Link>
        <div className="flex-auto flex justify-between items-center ml-5">
          <NavBarActions>
            <Link href="/builder" passHref={true}>
              <StyledButton variant="text">{n.editor}</StyledButton>
            </Link>
          </NavBarActions>
          <NavBarActions>
            <Link href="#contribute" passHref={true} className="max-md:hidden">
              <StyledButton variant="text">{n.contribute}</StyledButton>
            </Link>
            <Link href="#about-us" passHref={true}>
              <StyledButton variant="text">{n.aboutUs}</StyledButton>
            </Link>
            <button
              type="button"
              onClick={() => setLocale(locale === 'el' ? 'en' : 'el')}
              aria-label={n.languageLabel}
              className="text-white text-sm px-2 py-1 border border-white/40 rounded"
            >
              {locale === 'el' ? n.en : n.el}
            </button>
            <a
              href={'https://github.com/sadanandpai/resume-builder'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsGithub className="h-6 w-6" fill="white" />
            </a>
          </NavBarActions>
        </div>
      </nav>
      <div
        style={{
          background: 'linear-gradient(180deg, #E7EEFA 50%, #FFFFFF 100%)',
          fontFamily: "'Roboto Slab', serif",
        }}
      >
        <div className="mx-6 md:mx-40 xl:mx-60 mb-6">
          <motion.div
            className="grid grid-cols-12 pt-12 md:pt-24"
            initial={{ opacity: 0 }}
            animate={animationEffectsFirstLoad}
            transition={transitionEffects}
          >
            <div className="col-span-12 sm:col-span-4">
              <motion.img
                id="resume-3d"
                src="/resume.webp"
                alt="resume-3d"
                className="w-6/12 sm:w-9/12"
                onMouseEnter={() => {
                  controls.start(animationEffectsHoverEnter, transitionEffects);
                }}
                onMouseLeave={() => {
                  controls.start(animationEffectsHoverLeave, transitionEffects);
                }}
                animate={controls}
              />
            </div>
            <div className="col-span-12 sm:col-span-8">
              <h3 className="text-xl md:text-2xl mb-2 text-resume-400">{t.simplestWay}</h3>
              <h1 className="text-5xl mb-12 text-resume-800">{t.professionalResume}</h1>

              <div className="flex mb-10">
                <div className="bg-resume-800 w-1 rounded-lg"></div>
                <p className="text-lg ml-3 text-resume-800">
                  {t.quote}
                  <br />
                  {t.quoteAuthor}
                </p>
              </div>
              <Link href="/builder" passHref={true}>
                <Button variant="contained" className="bg-resume-800 mb-2">
                  {t.buildResume}
                </Button>
              </Link>
              <p
                className="xl:invisible text-resume-800"
                style={{ fontFamily: "'Roboto Slab', serif" }}
              >
                {t.desktopRecommended}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mx-6 md:mx-40 xl:mx-60 my-32"
        style={{ fontFamily: "'Roboto Slab', serif" }}
        initial={{ opacity: 0 }}
        animate={animationEffectsFirstLoad}
        transition={transitionEffects}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureSection />
        </div>
      </motion.div>

      <div className="bg-resume-50 my-32">
        <div
          id="contribute"
          className="mx-6 md:mx-40 xl:mx-60 py-12"
          style={{ fontFamily: "'Roboto Slab', serif" }}
        >
          <div className="grid grid-cols-12 items-center text-center">
            <div className="col-span-12 lg:col-span-4 mb-4 lg:mb-0 flex flex-col items-center gap-2">
              <Image src={'/icons/palette.svg'} alt="logo" height="48" width="48" />
              <p className="text-resume-800 text-xl mt-2">{t.contributeTemplate}</p>
            </div>
            <div className="col-span-12 lg:col-span-1 mb-4 lg:mb-0 text-resume-800 text-4xl">
              <p>+</p>
            </div>
            <div className="col-span-12 lg:col-span-2 flex flex-col items-center gap-2">
              <Image src={'/icons/terminal.svg'} alt="logo" height="48" width="48" />
              <p className="text-resume-800 text-xl mt-2">{t.contributeReact}</p>
            </div>
            <div className="invisible lg:visible lg:col-span-2 text-resume-800 text-4xl mx-6">
              <p>{t.contributeEquals}</p>
            </div>
            <div className="col-span-12 lg:col-span-3 mx-auto flex flex-col items-center gap-2">
              <div className="mb-6">
                <Image src={'/icons/wave.svg'} alt="logo" height="48" width="48" />
              </div>
              <div>
                <a
                  href="https://github.com/sadanandpai/resume-builder"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="contained" className="bg-resume-800 mt-2 lg:mt-5 mb-3">
                    {t.contributeButton}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="about-us"
        className="mx-6 md:mx-40 xl:mx-60 my-32"
        style={{ fontFamily: "'Roboto Slab', serif" }}
      >
        <h2 className="text-resume-800 text-3xl mb-2 text-center lg:text-left">{t.aboutTitle}</h2>
        <p className="text-resume-400 mb-8 text-center lg:text-left">{t.aboutSubtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Person />
        </div>
        <p className="text-resume-400 my-8 text-center lg:text-left">
          {t.designStory}&nbsp;
          <a
            href="https://medium.com/@yakshag/e-resume-build-a-professional-resume-design-case-study-3dc02a6359ea"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Medium
          </a>
          ↗
        </p>

        <div className="mt-12 rounded-xl border border-resume-100 bg-resume-50 p-6">
          <h3 className="text-resume-800 text-2xl mb-4">{t.creditsTitle}</h3>
          <p className="text-resume-400 mb-2">
            <strong>{t.originalProject}</strong>{' '}
            <a
              href="https://github.com/sadanandpai/resume-builder"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              sadanandpai/resume-builder
            </a>
          </p>
          <p className="text-resume-400 mb-2">
            <strong>{t.originalAuthors}</strong> Sadanand Pai, Gopalakrishnan, Vivek G, Siva K
          </p>
          <p className="text-resume-400 mb-2">
            <strong>{t.maintainedBy}</strong> Ioannis Axaopoulos (yannismc) —{' '}
            <a
              href="https://github.com/yannismc/dimiourgia-biografikou"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              yannismc/dimiourgia-biografikou
            </a>
          </p>
          <p className="text-resume-400 mb-4">
            <strong>{t.whatChanged}</strong>
          </p>
          <ul className="list-disc pl-6 text-resume-400 mb-4">
            {t.changesList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-resume-400 text-sm">{t.noEndorsement}</p>
          <p className="text-resume-400 text-sm mt-2">
            License: MIT. Original copyright notice and attribution are preserved.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeLayout;
