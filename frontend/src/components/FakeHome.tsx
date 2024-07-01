import React, { useEffect } from "react";
import styled from 'styled-components';
import Knowledge from "./Knowledge";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  width: 99%;
  z-index: 999;
  padding: 0.8rem;
  background-color: #00000; /* NES.css dùng màu nền đơn giản */
  font-family: 'Press Start 2P', cursive; /* Font NES.css */
  border: 10px ridge #00000; /* Thêm viền để tạo cảm giác pixel */
  box-shadow: 0 0 0 4px #e9cdd0, 0 0 0 8px #000; /* Tạo hiệu ứng viền pixel */
  border-radius: 24px;
  margin: 0 auto; /* Căn giữa phần tử */
  

  @media only screen and (max-width: 768px) {
    padding: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ButtonStyle = styled.button`
  font-size: 1rem;
  letter-spacing: 0.125rem;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  border: 0.1875rem solid;
  padding: 0rem 0rem;
  box-shadow: 0.0625rem 0.0625rem 0 0, 0.125rem 0.125rem 0 0, 0.1875rem 0.1875rem 0 0, 0.25rem 0.25rem 0 0, 0.3125rem 0.3125rem 0 0; 
  transition: background-color 0.3s, color 0.3s;
  background-color: transparent;

  &:hover {
    background-color: #f2f2f2;
  }

  @media only screen and (max-width: 1024px) {
    font-size: 0.8rem;
    padding: 0rem 0rem;
    border: 0.14rem solid;
    margin-top: 0.3rem;
  }
`;

const LeftButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const RightButton = styled.button`
  font-size: 1rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media only screen and (max-width: 768px) {
    display: flex;
    align-items: flex-start;
  }
`;

const RightSideContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-right: 1rem;

  @media only screen and (max-width: 768px) {
    margin-right: 0;
    width: 100%;
    justify-content: space-between;
    flex-direction: column;
  }
`;

const LeftSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 0.5rem;

  @media only screen and (max-width: 1024px) {
    margin-left: 0.8rem;
    margin-bottom: 0.5rem;
  }
`;

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
  }
`;

const Text = styled.h1`
  font-size: 1.88rem;
  font-weight: bold;
  animation: pixelate 1s steps(5) infinite;

  @media only screen and (max-width: 768px) {
    font-size: 1.2rem;
  }

  @keyframes pixelate {
    0%, 100% {
      filter: none;
      color: #000; /* Màu chữ mặc định */
    }
    25% {
      filter: contrast(200%) brightness(150%) saturate(200%);
      color: #f2a65a; /* Màu chữ thay đổi */
    }
    50% {
      filter: contrast(200%) brightness(150%) saturate(200%);
      color: #f76c6c; /* Màu chữ thay đổi */
    }
    75% {
      filter: contrast(200%) brightness(150%) saturate(200%);
      color: #a1c4fd; /* Màu chữ thay đổi */
    }
  }
`;

const Icon = styled.img`
  width: 2rem;
  height: 2rem;

  @media only screen and (max-width: 1024px) {
    width: 2.5rem;
    height: 2.5rem;
  }

  @media only screen and (max-width: 768px) {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 100%;
    flex-direction: row;
  }
`;

const IconButton = styled.div`
  margin: 0 0.5rem;
  color: white;
  cursor: pointer;
  padding: 0.8rem;
  background-color: rgba(233,205,208, 0.5);
  backdrop-filter: blur(2px);
  transition: transform 0.3s ease;
  border-radius: 8px;

  &:hover {
    transform: scale(1.1);
  }

  @media only screen and (max-width: 768px) {
    margin: 0.2rem 0;
    padding: 0.2rem;
  }
`;

const FakeHome = () => {

  const useHeaderAnimation = () => {
    const [isHeaderVisible, setIsHeaderVisible] = React.useState(true);
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const scrollThreshold = window.innerHeight / 2;
  
        setIsHeaderVisible(scrollY <= scrollThreshold || scrollY <= headerHeight);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    return isHeaderVisible;
  };

  const isHeaderVisible = useHeaderAnimation();
  const isMobile = window.innerWidth < 768;

  const isLoaded = true; // Example loaded state

  const loadingProgression = 0.75; // Example loading progression


  const screenSize = { width: 1920, height: 1080 }; // Example screen size

  const isLargeScreen = true; // Example large screen state


  return (
    <>
    {/* max-w-6xl */}
    <div className="w-full mx-auto p-4 min-h-screen">

    <HeaderContainer style={{ transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
        {isMobile ? (
          <>
          <div className="flex justify-center flex-col gap-3">
            <div className="flex flex-row gap-10">
            <LeftSideContainer>
              <ButtonStyle>
                <LeftButton >
                  <Icon src="/assets/UI/console_1.png" alt="DevLife" />
                </LeftButton>
              </ButtonStyle>
            </LeftSideContainer>
            <ButtonStyle>
              <LeftButton>
                Loading ...
                </LeftButton>
            </ButtonStyle>
            </div>
          <div className="flex flex-row">
          <Text>Devlife game</Text>
          </div>
              
            <RightSideContainer>
              <ButtonContainer className="space-x-4">
                <IconButton>
                  <i className="fas fa-cog"></i>
                </IconButton>
                <IconButton>
                  <i className="fas fa-save"></i>
                </IconButton>
                <IconButton>
                  <i className="fas fa-trophy"></i>
                </IconButton>
                <IconButton>
                  <i className="fas fa-user-secret"></i>
                </IconButton>
                <IconButton>
                  <i className="fas fa-chart-line"></i>
                </IconButton>
                <IconButton>
                  <i className="fas fa-book"></i>
                </IconButton>
              </ButtonContainer>
            </RightSideContainer>
          </div>
          </>
          ) : (
            <>
            {window.innerWidth > 1080 && (
            <LeftSideContainer>
              <ButtonStyle>
                <LeftButton >
                  <Icon src="/assets/UI/console_1.png" alt="DevLife" />
                </LeftButton>
              </ButtonStyle>
              <div className="w-10vw"></div> {/* Khoảng cách 10% chiều rộng màn hình */}
            </LeftSideContainer>
            )}
            <MiddleContainer>
                <Text>Devlife game</Text>
              </MiddleContainer><RightSideContainer>
                <ButtonContainer className="space-x-4">
                  <IconButton>
                    <i className="fas fa-cog"></i>
                  </IconButton>
                  <IconButton>
                    <i className="fas fa-save"></i>
                  </IconButton>
                  <IconButton>
                    <i className="fas fa-trophy"></i>
                  </IconButton>
                  <IconButton>
                    <i className="fas fa-user-secret"></i>
                  </IconButton>
                  <IconButton>
                    <i className="fas fa-chart-line"></i>
                  </IconButton>
                  <IconButton>
                    <i className="fas fa-book"></i>
                  </IconButton>
                </ButtonContainer>
              </RightSideContainer><ButtonStyle>
                <RightButton>
                  Loading ...
                </RightButton>
              </ButtonStyle></>
          )}
      </HeaderContainer>
    <div/>

    <div className="sm:flex-col flex mt-4 gap-2">
          <div className="sm:w-full w-1/2 p-2 nes-container bg-[#1d0f48] rounded-[24px] ">
            <div className="flex justify-center items-center border-orange">
              {!isLoaded && (
                <p>
                  Loading Application... {Math.round(loadingProgression * 100)}%
                </p>
              )}
              <div
                style={{
                  display: isLoaded ? "block" : "none",
                  width: `${
                    !isLargeScreen
                      ? screenSize.width / screenSize.height > 1
                        ? screenSize.width
                        : screenSize.width - 50
                      : screenSize.width / 2.13
                  }px`,
                  height: `${
                    !isLargeScreen
                      ? screenSize.width / screenSize.height > 1
                        ? screenSize.height - 70
                        : screenSize.height - 100
                      : screenSize.height / 1.6
                  }px`,
                }}
              >
                Unity Component Placeholder
              </div>
            </div>
            {/* CONNECT */}
            <div>ConnectLocks Component Placeholder</div>
          </div>

          <Knowledge/>

          <div className="sm:w-full w-1/4 p-2 nes-container bg-[#7e56f3] rounded-[24px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-white mb-2">
                <div>SUB-KNOWLEDGE</div>
              </div>
              <div className="p-2">
                <div className="nes-balloon from-left nes-pointer p-2">
                  <div className="cursor-pointer">
                    <div className="text-red-500">Introduction</div>
                    <div className="text-black">
                      This game was designed to help you fun with the hackathon
                      concepts and learn more what blockchain is?
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <div className="nes-balloon from-left nes-pointer p-2">
                  <div className="cursor-pointer">
                    <div className="text-red-500">How the game help you understand blockchain?</div>
                    <div className="text-black">
                      We focus on providing insights into the Avax network.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
      
    </>
  );
};

export default FakeHome;              