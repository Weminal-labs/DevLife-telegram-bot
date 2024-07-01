import React, { useEffect } from "react";
import styled from 'styled-components';
import "nes.css/css/nes.min.css";

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

interface HeaderProps {
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
  onLanguageChange: () => void;
  data: {
    errorMessage: string;
    walletNotFoundMessage: string;
    walletConnectedMessage: string;
    walletNotConnectedMessage: string;
    walletDisconnectedMessage: string;
    walletReconnectedMessage: string;
  };
  language: string;
  publicAddress: string;
}

export const Header: React.FC<HeaderProps> = ({
  onLeftButtonClick,
  data,
  language,
  publicAddress,
}) => {
  const isHeaderVisible = useHeaderAnimation();
  const isMobile = window.innerWidth < 768;

  return (
    <HeaderContainer style={{ transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
      {isMobile ? (
        <>
        <div className="flex justify-center flex-col gap-3">
          <div className="flex flex-row gap-10">
          <LeftSideContainer>
            <ButtonStyle>
              <LeftButton onClick={onLeftButtonClick}>
                <Icon src="/assets/UI/console_1.png" alt="DevLife" />
              </LeftButton>
            </ButtonStyle>
          </LeftSideContainer>
          <ButtonStyle>
            <LeftButton>
              {publicAddress.length > 0
                ? `${data.walletConnectedMessage} ${String(publicAddress).substring(0, 6)}...${String(publicAddress).substring(38)}`
                : data.walletNotConnectedMessage}
            </LeftButton>
          </ButtonStyle>
          </div>
        <div className="flex flex-row">
        <Text>{language === "english" ? "Devlife game" : "Devlife game"}</Text>
        </div>
            
          <RightSideContainer>
            <ButtonContainer className="space-x-4">
            <IconButton>
                <i className="nes-icon cog is-small"></i>
              </IconButton>
              <IconButton>
                <i className="nes-icon save is-small"></i>
              </IconButton>
              <IconButton>
                <i className="nes-icon trophy is-small"></i>
              </IconButton>
              <IconButton>
                <i className="nes-icon user is-small"></i>
              </IconButton>
              <IconButton>
                <i className="nes-icon chart is-small"></i>
              </IconButton>
              <IconButton>
                <i className="nes-icon book is-small"></i>
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
              <LeftButton onClick={onLeftButtonClick}>
                <Icon src="/assets/UI/console_1.png" alt="DevLife" />
              </LeftButton>
            </ButtonStyle>
            <div className="w-10vw"></div> {/* Khoảng cách 10% chiều rộng màn hình */}
          </LeftSideContainer>
          )}
          <MiddleContainer>
              <Text>{language === "english" ? "Devlife game" : "Devlife game"}</Text>
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
                {publicAddress.length > 0
                  ? `${data.walletConnectedMessage} ${String(publicAddress).substring(0, 6)}...${String(publicAddress).substring(38)}`
                  : data.walletNotConnectedMessage}
              </RightButton>
            </ButtonStyle></>
        )}
    </HeaderContainer>
  );
};

export default Header;


