'use client';

import React from 'react';
import {
  RefObject,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import I18N from '@/app/utils/I18N';
import Image from 'next/image';
import Fullpage, { fullpageOptions } from '@fullpage/react-fullpage';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import LottieLightningCat from '@/app/assets/lightning_cat.json';
import LottieHelixCat from '@/app/assets/helix_cat.json';
import LottieOctopusCat from '@/app/assets/octopus_cat.json';
import GitHubIcon from '@/public/icons/GitHubIcon';
import MenuIcon from '@/public/icons/MenuIcon';
import StarIcon from '@/public/icons/StarIcon';
import LanguageSwitcher from '@/components/LangSwitcher';
import GitHubStars from '@/components/GitHubStars';

// play same video util refresh page
const PC_EXAMPLE_VIDEO = [
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*7lc3QKRnuYAAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*TmIsT7SUWPsAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*UaYESbe_mJMAAAAAAAAAAAAADuH-AQ',
];
const MOBILE_EXAMPLE_VIDEO = [
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*izMfSbJJXLoAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*tuaNRbG-5q4AAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*sxvhTafMlIoAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*wFfqQ6XBd2EAAAAAAAAAAAAADuH-AQ',
];

function Contributors() {
  return (
    <>
      <img
        className="mx-auto lg:mx-0 mb-4 my-1.5"
        src="/images/title_contributors.svg"
        alt="CONTRIBUTORS"
      />
      <div className="lg:max-w-[335px] grid grid-cols-2 gap-4">
        <a
          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
          href="https://github.com/xingwanying"
          target="_blank"
        >
          xingwanying
        </a>
        <a
          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
          href="https://github.com/RaoHai"
          target="_blank"
        >
          RaoHai
        </a>
        <a
          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
          href="https://github.com/ch-liuzhide"
          target="_blank"
        >
          ch-liuzhide
        </a>
        <a
          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
          href="https://github.com/PeachScript"
          target="_blank"
        >
          PeachScript
        </a>
        <a
          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
          href="https://github.com/golevkadesign"
          target="_blank"
        >
          golevkadesign
        </a>
        <a
          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
          href="https://github.com/MadratJerry"
          target="_blank"
        >
          MadratJerry
        </a>
        <a
          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
          href="https://github.com/AirBobby"
          target="_blank"
        >
          AirBobby
        </a>
        <a
          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
          href="https://github.com/alichengyue"
          target="_blank"
        >
          alichengyue
        </a>
      </div>
    </>
  );
}

export default function Homepage() {
  const videoRefs = {
    banner: useRef<HTMLVideoElement>(null),
    pcCase: useRef<HTMLVideoElement & { _timer: number }>(null),
    mobileCase: useRef<HTMLVideoElement & { _timer: number }>(null),
  };
  const bannerActionRef = useRef<HTMLDivElement>(null);
  const lightningCatRef = useRef<LottieRefCurrentProps>(null);
  const helixCatRef = useRef<LottieRefCurrentProps>(null);
  const helixOctopusRef = useRef<LottieRefCurrentProps>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const showCaseRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<{ pc: string; mobile: string }>();
  const [stars, setStars] = useState<number | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    async function getStars() {
      const starsData = await GitHubStars();
      setStars(starsData);
    }

    if (stars === null) {
      getStars();
    }
  }, [stars]);

  const scrollHandler = useCallback<
    NonNullable<fullpageOptions['onScrollOverflow']>
  >(() => {
    const isActionInView =
      bannerActionRef.current?.getBoundingClientRect().bottom! <=
      window.innerHeight;
    const isActionVisible =
      bannerActionRef.current?.classList.contains('opacity-0');

    if (isActionInView && isActionVisible) {
      bannerActionRef.current!.classList.remove('opacity-0');
      bannerActionRef.current!.classList.remove('translate-y-8');
    } else if (!isActionInView && !isActionVisible) {
      bannerActionRef.current!.classList.add('opacity-0');
      bannerActionRef.current!.classList.add('translate-y-8');
    }
  }, []);

  const playAnimation = useCallback(
    (
      animationRef: RefObject<{ goToAndPlay: (frame: number) => void }>,
      play: boolean = true,
    ) => {
      if (play) {
        requestAnimationFrame(() => animationRef.current?.goToAndPlay(0));
      }
    },
    [],
  );

  const updateClasses = useCallback(
    (addTableClass: boolean, addShowCaseClass: boolean) => {
      requestAnimationFrame(() => {
        if (addTableClass) {
          tableRef.current?.classList.add('animate-borders');
        } else {
          tableRef.current?.classList.remove('animate-borders');
        }

        if (addShowCaseClass) {
          showCaseRef.current?.classList.add('animate-border-group');
        } else {
          showCaseRef.current?.classList.remove('animate-border-group');
        }
      });
    },
    [tableRef, showCaseRef],
  );

  const leaveHandler = useCallback<NonNullable<fullpageOptions['beforeLeave']>>(
    (_, dest) => {
      if (dest.isFirst) {
        requestAnimationFrame(() => {
          videoRefs.banner.current?.play();
          updateClasses(false, false);
        });
      } else {
        switch (dest.index) {
          case 1:
            playAnimation(helixOctopusRef);
            updateClasses(true, false);
            break;
          case 2:
            playAnimation(lightningCatRef);
            updateClasses(false, false);
            break;
          case 3:
            playAnimation(helixCatRef);
            break;
          default:
            updateClasses(false, false);
            break;
        }
      }
    },
    [],
  );
  const enterHandler = useCallback<NonNullable<fullpageOptions['afterLoad']>>(
    (_, dest) => {
      if (dest.index === 2) {
        lightningCatRef.current?.goToAndPlay(0);
      } else if (dest.index === 3) {
        updateClasses(false, true);

        // play video after transition
        const [{ current: pcElm }, { current: mobileElm }] = [
          videoRefs.pcCase,
          videoRefs.mobileCase,
        ];
        if (pcElm && mobileElm) {
          clearTimeout(pcElm._timer);
          pcElm._timer = window.setTimeout(() => {
            pcElm.currentTime = 0;
            pcElm.play();
            mobileElm.currentTime = 0;
            mobileElm.play();
          }, 1333);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const videoUpdateHandler = () => {
      if (
        videoRefs.banner.current!.currentTime >
        videoRefs.banner.current!.duration - 0.02
      ) {
        videoRefs.banner.current!.currentTime = 5;
        videoRefs.banner.current!.play();
      } else if (videoRefs.banner.current!.currentTime > 2.5) {
        // try to display banner action for large screen (no scroll bar)
        // @ts-ignore
        scrollHandler();
      }
    };

    videoRefs.banner.current?.addEventListener(
      'timeupdate',
      videoUpdateHandler,
    );

    setVideos({
      pc: PC_EXAMPLE_VIDEO[Math.floor(Math.random() * 3)],
      mobile: MOBILE_EXAMPLE_VIDEO[Math.floor(Math.random() * 4)],
    });

    return () => {
      videoRefs.banner.current?.removeEventListener(
        'timeupdate',
        videoUpdateHandler,
      );
      if (videoRefs.pcCase.current) {
        clearTimeout(videoRefs.pcCase.current!._timer);
      }
    };
  }, []);

  return (
    <Fullpage
      onScrollOverflow={scrollHandler}
      beforeLeave={leaveHandler}
      afterLoad={enterHandler}
      credits={{}}
      render={() => (
        <Fullpage.Wrapper>
          <div className="section bg-black">
            <header
              className={`h-20 px-6 lg:px-10 mx-auto flex items-center group${
                showMobileNav ? ' mobile-nav-expanded' : ''
              }`}
            >
              <span className="flex-1">
                <Image
                  width={114}
                  height={32}
                  src="/images/logo-inverse.svg"
                  alt="petercat"
                  className="h-8"
                />
              </span>
              <nav
                className={`${
                  showMobileNav ? '' : 'hidden '
                }absolute z-10 top-20 left-0 right-0 bottom-0 flex flex-col text-center bg-black lg:block lg:static lg:bg-auto`}
              >
                <a
                  href="https://www.youtube.com/@petercat-ai"
                  className="mt-8 text-white lg:mt-0 lg:text-[#f4f4f5] lg:opacity-60 transition-opacity hover:opacity-90"
                  target="_blank"
                >
                  {I18N.app.page.yanShiAnLi}
                </a>
                <a
                  href="/market"
                  className="mt-8 text-white lg:mt-0 lg:ml-8 lg:text-[#f4f4f5] lg:opacity-60 transition-opacity hover:opacity-90"
                >
                  {I18N.app.page.gongZuoTai}
                </a>
                <a
                  href="https://github.com/petercat-ai/petercat/blob/main/README.md"
                  className="mt-8 text-white lg:mt-0 lg:ml-8 lg:text-[#f4f4f5] lg:opacity-60 transition-opacity hover:opacity-90"
                  target="_blank"
                >
                  {I18N.app.page.wenDang}
                </a>
                <a
                  className="mt-8 text-white lg:hidden"
                  onClick={() => setShowMobileNav(false)}
                >
                  <Image
                    width={24}
                    height={24}
                    src="/images/icon-close.svg"
                    alt="close"
                    className="mx-auto h-6"
                  />
                </a>
              </nav>
              <div className="flex-1 flex justify-end">
                <span className="group-[.mobile-nav-expanded]:opacity-60">
                  <LanguageSwitcher />
                </span>
                <a
                  href="https://github.com/petercat-ai/petercat"
                  className="lg:min-w-[100px] whitespace-nowrap text-sm lg:text-base pl-2 pr-3 lg:px-4 h-10 inline-block bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full leading-10 lg:leading-10 text-center mr-4 group-[.mobile-nav-expanded]:opacity-60"
                  target="_blank"
                >
                  <GitHubIcon className="hidden lg:inline scale-75 -translate-y-0.5" />
                  <StarIcon className="lg:hidden inline translate-y-0.5 translate-x-0.5" />
                  <Suspense>
                    <span id="github-stars-wrapper">{stars}</span>
                  </Suspense>
                  <span className="hidden lg:inline">stars</span>
                </a>
                <a
                  className="lg:hidden w-10 h-10 inline-block bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full leading-10 text-center"
                  onClick={() => setShowMobileNav((v) => !v)}
                >
                  <MenuIcon className="inline translate-x-0.5" />
                </a>
              </div>
            </header>
            <div className="relative min-h-[calc(100vh-80px)]">
              <video
                className="mx-auto"
                width={1400}
                height={1200}
                src="https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*CeZ5TJsdJfMAAAAAAAAAAAAADuH-AQ"
                ref={videoRefs.banner}
                autoPlay
                muted
              />
              <div
                className="absolute w-full left-0 bottom-[180px] text-center mix-blend-difference transition-all duration-300 translate-y-8 opacity-0"
                ref={bannerActionRef}
              >
                <h2 className="mb-6 lg:mb-8 text-2xl leading-[32px] lg:text-5xl lg:leading-[64px] text-white">
                  {I18N.app.page.xiaoMaoMiZhuNi}
                </h2>
                <p className="mb-6 lg:mb-8 text-sm px-9 lg:text-xl text-white">
                  <Image
                    className="inline scale-85 origin-top-center"
                    style={{ filter: 'saturate(0)' }}
                    width={106}
                    height={20}
                    src="/images/logo-footer.svg"
                    alt="PeterCat"
                  />
                  {I18N.app.page.shiZhuanWeiSheQu}
                </p>
                <a
                  className="inline-block px-5 py-2 lg:px-8 lg:py-3 rounded-full border-2 border-white text-white text-sm lg:text-xl transition-transform hover:scale-105"
                  href="/market"
                >
                  {I18N.app.page.liJiChangShi}
                </a>
              </div>
            </div>
          </div>
          <div className="section bg-black group">
            <div className="h-screen border-box border-[20px] border-solid border-black bg-[#FEF4E1] rounded-[48px]">
              <div className="relative h-full flex flex-col items-center lg:justify-center lg:items-start max-w-[1600px] mx-auto p-8 pt-[146px] lg:py-8 lg:p-16 lg:pt-10 2xl:pt-[110px] opacity-0 transition-opacity group-[.active]:opacity-100">
                <Image
                  width={475}
                  height={95}
                  className="w-[140px] h-[28px] lg:w-[475px] lg:h-[95px] lg:ml-6 mb-3 lg:mb-6 opacity-0 transition-opacity group-[.fp-completely]:opacity-100"
                  src="/images/title_features.svg"
                  alt="Features"
                />
                <p className="lg:w-1/2 lg:ml-6 text-xs lg:text-xl text-[#27272A] opacity-0 transition-opacity group-[.fp-completely]:opacity-100">
                  {I18N.app.page.woMenTiGongDui}
                </p>
                <div
                  className="w-full relative mt-5 xl:mt-[72px] overflow-hidden"
                  ref={tableRef}
                >
                  <div className="lg:table table-fixed border-collapse">
                    <div className="table-row-group lg:table-row">
                      <div className="table-row border-1 border-[rgba(0,0,0,0.3)] lg:border-0 lg:table-cell relative px-5 xl:px-10 py-5 xl:py-[51.5px] lg:w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-300 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                        <div className="table-cell p-2.5 text-center lg:p-0 lg:text-left lg:block">
                          <Image
                            width={72}
                            height={73}
                            src="/images/create.svg"
                            alt="create"
                            className="w-[20px] height-[20px] mx-auto lg:mx-0 lg:w-[72px] lg:h-[73px]"
                          />
                          <h3 className="mt-2 mb-0 lg:mt-6 lg:mb-3 font-medium text-sm lg:text-2xl 2xl:text-4xl text-black leading-[1.4]">
                            {I18N.app.page.duiHuaJiChuangZao}
                          </h3>
                          <p className="mt-1 text-xs lg:mt-3 lg:text-base 2xl:text-xl text-zinc-800">
                            {I18N.app.page.jinXuYaoGaoZhi}
                          </p>
                        </div>
                      </div>
                      <div className="table-row border-1 border-[rgba(0,0,0,0.3)] lg:border-0 lg:table-cell relative px-5 2xl:px-10 py-5 2xl:py-[51.5px] lg:w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-500 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                        <div className="table-cell p-2.5 pt-4 text-center lg:p-0 lg:text-left lg:block">
                          <Image
                            width={72}
                            height={73}
                            src="/images/knowledge.svg"
                            alt="knowledge"
                            className="w-[20px] height-[20px] mx-auto lg:mx-0 lg:w-[72px] lg:h-[73px]"
                          />
                          <h3 className="mt-2 mb-0 lg:mt-6 lg:mb-3 font-medium text-sm lg:text-2xl 2xl:text-4xl text-black leading-[1.4]">
                            {I18N.app.page.zhiShiZiDongRu}
                          </h3>
                          <p className="mt-1 text-xs lg:mt-3 lg:text-base 2xl:text-xl text-zinc-800">
                            {I18N.app.page.jiQiRenChuangJian}
                          </p>
                        </div>
                      </div>
                      <div className="table-row border-1 border-[rgba(0,0,0,0.3)] lg:border-0 lg:table-cell relative px-5 2xl:px-10 py-5 2xl:py-[51.5px] lg:w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-700 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                        <div className="table-cell p-2.5 text-center lg:p-0 lg:text-left lg:block">
                          <Image
                            width={72}
                            height={73}
                            src="/images/integrated.svg"
                            alt="integrated"
                            className="w-[20px] height-[20px] mx-auto lg:mx-0 lg:w-[72px] lg:h-[73px]"
                          />
                          <h3 className="mt-2 mb-0 lg:mt-6 lg:mb-3 font-medium text-sm lg:text-2xl 2xl:text-4xl text-black leading-[1.4]">
                            {I18N.app.page.duoPingTaiJiCheng}
                          </h3>
                          <p className="mt-1 text-xs lg:mt-3 lg:text-base 2xl:text-xl text-zinc-800">
                            {I18N.app.page.duoZhongJiChengFang}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-[#b2ab9d] border-top" />
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-[#b2ab9d] border-side" />
                    <div className="absolute inset-y-0 right-0 w-[1px] bg-[#b2ab9d] border-side" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#b2ab9d] border-bottom" />
                    <div className="absolute top-0 left-[calc(100%/3)] w-[1px] h-full bg-[#b2ab9d] border-side" />
                    <div className="absolute top-0 left-[calc(100%*2/3)] w-[1px] h-full bg-[#b2ab9d] border-side" />
                  </div>
                </div>
                <Lottie
                  className="absolute w-[175px] lg:w-1/2 top-8 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:top-[20%] lg:left-auto lg:right-5 pointer-events-none"
                  animationData={LottieOctopusCat}
                  autoPlay={false}
                  loop={false}
                  lottieRef={helixOctopusRef}
                />
              </div>
            </div>
          </div>
          <div className="section bg-black group relative">
            <div className="mx-auto min-h-screen lg:min-h-0 p-8 lg:p-[100px] lg:pb-8 opacity-0 transition-opacity group-[.active]:opacity-100 lg:grid grid-cols-2">
              <Lottie
                className="-mt-[80px] -translate-x-7 mx-auto w-[300px] lg:m-0 lg:w-auto lg:absolute lg:bottom-0 lg:-right-[200px] pointer-events-none opacity-0 group-[.fp-completely]:opacity-100"
                animationData={LottieLightningCat}
                autoPlay={false}
                loop={false}
                lottieRef={lightningCatRef}
              />
              <div>
                <div className="mx-auto lg:w-[650px] text-center lg:text-left">
                  <Image
                    className="hidden lg:block mb-9 relative scale-0 transition-transform duration-[166ms] group-[.fp-completely]:delay-[683ms] group-[.fp-completely]:scale-100"
                    width={542}
                    height={251}
                    src="/images/title_based.svg"
                    alt="Based on GPT4"
                  />
                  <Image
                    className="lg:hidden mx-auto mt-6 mb-3 scale-0 transition-transform duration-[166ms] group-[.fp-completely]:delay-[683ms] group-[.fp-completely]:scale-100"
                    width={121}
                    height={56}
                    src="/images/title_based_m.svg"
                    alt="Based on GPT4"
                  />
                  <p className="relative mb-6 lg:mb-[119px] leading-5 lg:leading-7 lg:ml-2 text-xs lg:text-xl text-[#FEF4E1] lg:w-[500px] mix-blend-difference scale-0 transition-transform duration-[83ms] group-[.fp-completely]:delay-[333ms] group-[.fp-completely]:scale-100">
                    {I18N.app.page.deYiYuQiangDa}
                  </p>
                  <div className="absolute left-8 right-8 lg:left-auto lg:right-auto z-10 bottom-10 inline-block text-[#FEF4E1] text-[15px] lg:text-base mix-blend-difference scale-0 transition-transform duration-[83ms] group-[.fp-completely]:delay-[83ms] group-[.fp-completely]:scale-100">
                    <Image
                      className="my-1 mx-auto lg:mx-0"
                      width={147}
                      height={24}
                      src="/images/title_powered.svg"
                      alt="Powered by"
                    />
                    <span className="inline-flex h-12 items-center mr-6">
                      <Image
                        width={48}
                        height={48}
                        className="mr-2"
                        src="/images/icon-open-ai.svg"
                        alt="OpenAI"
                      />
                      OpenAI
                    </span>
                    <span className="inline-flex h-12 items-center mr-6">
                      <Image
                        width={48}
                        height={48}
                        className="mr-2"
                        src="/images/icon-gemini.svg"
                        alt="Gemini"
                      />
                      Gemini
                    </span>
                    <span className="inline-flex h-12 items-center mr-6">
                      <Image
                        width={49}
                        height={48}
                        className="mr-2"
                        src="/images/icon-aws.svg"
                        alt="AWS"
                      />
                      AWS
                    </span>
                    <span className="inline-flex h-12 items-center mr-6">
                      <Image
                        width={48}
                        height={48}
                        className="mr-2"
                        src="/images/icon-supabase.svg"
                        alt="Supabase"
                      />
                      Supabase
                    </span>
                    <span className="inline-flex h-12 items-center">
                      <Image
                        width={48}
                        height={48}
                        className="mr-2"
                        src="/images/icon-tavily.svg"
                        alt="Tavily"
                      />
                      Tavily
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="section lg:min-w-[900px] bg-[#FEF4E1] group *:relative"
            ref={showCaseRef}
          >
            <div className="absolute z-10 left-0 top-0 w-[150px] lg:w-1/2 h-screen flex justify-center items-end pointer-events-none">
              <Lottie
                animationData={LottieHelixCat}
                autoPlay={false}
                loop={false}
                lottieRef={helixCatRef}
              />
            </div>
            <div className="relative flex flex-col justify-center lg:max-w-[1400px] h-screen mx-auto px-4 lg:p-14 pt-8 lg:pt-[79px] opacity-0 transition-opacity group-[.active]:opacity-100">
              <Image
                className="mx-auto mb-4 lg:mb-0 lg:mx-0 w-[144px] h-[28px] lg:w-[463px] lg:h-[90px] lg:absolute z-10 top-[8.8%] left-1/2 lg:-translate-x-1/2 duration-[583ms] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                width={463}
                height={90}
                src="/images/title_showcase.svg"
                alt="Showcase"
              />
              <div className="flex flex-col-reverse lg:flex-row justify-center items-start lg:pl-10">
                <div className="relative lg:-translate-y-[116px] mx-auto mt-5 lg:mt-0 lg:mx-0 lg:mr-12 p-1 lg:p-2">
                  <div className="w-full h-full absolute inset-0">
                    <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                    <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                  </div>
                  <div className="border-container relative">
                    <div className="w-full h-full absolute inset-0">
                      <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 right-0" />
                      <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                      <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                    </div>
                    <video
                      className="max-w-[187px] lg:max-w-full lg:max-h-[60vh] lg:min-h-[383px] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                      src={videos?.mobile}
                      ref={videoRefs.mobileCase}
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                </div>
                <div className="relative p-1 lg:p-2 pt-4 lg:pt-9">
                  <div className="w-full h-full absolute inset-0">
                    <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 right-0" />
                    <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                    <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                  </div>
                  <div className="border-container relative">
                    <div className="animated-border w-full h-full absolute inset-0">
                      <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                      <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                    </div>
                    <video
                      className="lg:max-h-[55vh] lg:min-h-[400px] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                      src={videos?.pc}
                      ref={videoRefs.pcCase}
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                  <span className="circle-border-animation absolute top-[5px] lg:top-2.5 left-1 lg:left-4 border rounded-full w-2 h-2 lg:w-4 lg:h-4" />
                  <span className="circle-border-animation absolute top-[5px] lg:top-2.5 left-5 lg:left-12 border rounded-full w-2 h-2 lg:w-4 lg:h-4" />
                  <span className="circle-border-animation absolute top-[5px] lg:top-2.5 left-9 lg:left-20 border rounded-full w-2 h-2 lg:w-4 lg:h-4" />
                </div>
              </div>
              <span className="block mt-4 lg:mt-0 mb-8 lg:mb-0 text-center lg:absolute z-10 bottom-[8.8%] left-1/2 lg:-translate-x-1/2 opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100">
                <a
                  className="inline-block py-2 lg:py-3 px-5 lg:px-8 bg-gray-800 text-sm lg:text-xl text-white rounded-full transition-all hover:scale-105"
                  href="https://www.youtube.com/@petercat-ai"
                  target="_blank"
                >
                  {I18N.app.page.liaoJieGengDuo}
                </a>
              </span>
            </div>
            <footer className="bg-black">
              <div className="px-10">
                <nav className=" grid grid-cols-2 gap-3 lg:flex justify-between items-center max-w-[1400px] mx-auto py-[21px]">
                  <a
                    className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
                    href="https://github.com/petercat-ai/petercat"
                    target="_blank"
                  >
                    {I18N.app.page.pETER}
                  </a>
                  <a
                    className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
                    href="https://ant-design.antgroup.com/index-cn"
                    target="_blank"
                  >
                    Ant Design
                  </a>
                  <a
                    className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
                    href="https://makojs.dev/"
                    target="_blank"
                  >
                    Mako
                  </a>
                  <a
                    className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
                    href="https://opensource.antgroup.com"
                    target="_blank"
                  >
                    {I18N.app.page.maYiKaiYuan}
                  </a>
                </nav>
              </div>
              <table className="w-full text-[#FEF4E1]">
                <tbody>
                  <tr>
                    <td className="w-1/2 border border-l-0 border-[#7F7A71] p-8 lg:px-10 lg:py-[51.5px]">
                      <div className="lg:flex justify-end">
                        <div className="relative flex-1 pb-[72px] lg:pb-0 max-w-[660px] text-center lg:text-left">
                          <a
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:static lg:float-right whitespace-nowrap mt-4 py-3 px-8 text-xl text-[#FEF4E1] rounded-full border-2 border-white/[0.4] transition-all hover:border-white/[0.8] hover:scale-105"
                            href="https://github.com/petercat-ai/petercat/blob/main/README.md"
                            target="_blank"
                          >
                            {I18N.app.page.chaKanGengDuo}
                          </a>
                          <img
                            className="mx-auto lg:mx-0 mb-2 my-1.5"
                            src="/images/title_docs.svg"
                            alt="DOCS"
                          />
                          <p className="text-xl">
                            {I18N.app.page.xiangMuXiangXiXin}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="hidden lg:table-cell border border-r-0 border-[#7F7A71] px-10 py-[51.5px] 2xl:bg-[url('/images/footer-contribution.png')] bg-contain bg-no-repeat pl-20 2xl:pl-[335px]"
                      rowSpan={2}
                    >
                      <Contributors />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-l-0 border-[#7F7A71] p-8 lg:px-10 lg:py-[51.5px]">
                      <div className="lg:flex justify-end">
                        <div className="flex-1 max-w-[660px] text-center lg:text-left">
                          <img
                            className="mx-auto lg:mx-0 mb-2 my-1.5"
                            src="/images/title_contact.svg"
                            alt="CONTACT"
                          />
                          <a
                            className="text-xl text-[#FEF4E1] hover:underline"
                            href="mailto:petercat.assistant@gmail.com"
                          >
                            petercat.assistant@gmail.com
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="lg:hidden">
                    <td className="border border-l-0 border-[#7F7A71] pt-[290px] p-8 text-center bg-[url('/images/footer-contribution.png')] bg-[length:300px] bg-no-repeat bg-top">
                      <Contributors />
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="border-t border-[#7F7A71] p-8 lg:px-10 lg:py-[51.5px]"
                      colSpan={2}
                    >
                      <div className="lg:flex max-w-[1400px] mx-auto items-center">
                        <p className="max-w-[560px] text-xl">
                          {I18N.app.page.woMenLaiZiMa}
                        </p>
                        <span className="block flex-1 my-12 lg:my-0 lg:mx-12 h-px border-t border-[#7F7A71]" />
                        <Image
                          width={106}
                          height={20}
                          className="mx-auto lg:mx-0"
                          src="/images/logo-footer.svg"
                          alt="PeterCat"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </footer>
          </div>
        </Fullpage.Wrapper>
      )}
    />
  );
}
