import React, { useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import WordPage from './pages/WordPage';
import PaperPage from './pages/PaperPage';
import RadioPage from './pages/RadioPage';
import MediaPage from './pages/MediaPage';
import { useResizeDetector } from 'react-resize-detector';

const MainContainer = styled(Container)`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  position: relative;
`;

const GridItem = styled(Grid)`
  text-align: center;
  &:hover .page-name {
    transform: scale(1.2);
    transition: transform 0.3s;
  }
`;

const PageNameBox = styled(Box)`
  margin: 20px;
  display: inline-block;
`;

const StyledLink = styled(Box)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

const CloseButton = styled(Box)`
  position: absolute;
  top: 20px;
  right: 40px;
  font-size: 30px;
  cursor: pointer;
  z-index: 10;
`;

const CountryView = ({ countryData, onClose }) => {
  const [currentPage, setCurrentPage] = useState('main');

  const { width, height, ref } = useResizeDetector();

  const fontSize = Math.min(width, height) / 20; // window 크기에 비례하여 글자 크기 설정

  const renderPage = () => {
    switch (currentPage) {
      case 'word':
        return <WordPage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      case 'paper':
        return <PaperPage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      case 'radio':
        return <RadioPage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      case 'media':
        return <MediaPage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      default:
        return (
          <MainContainer maxWidth={false}>
            <Grid container spacing={4}>
              <GridItem item xs={3}>
                <StyledLink onClick={() => setCurrentPage('word')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name" style={{ fontSize }}>
                      Word
                    </Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem>
              <GridItem item xs={3}>
                <StyledLink onClick={() => setCurrentPage('paper')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name" style={{ fontSize }}>
                      Paper
                    </Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem>
              <GridItem item xs={3}>
                <StyledLink onClick={() => setCurrentPage('radio')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name" style={{ fontSize }}>
                      Radio
                    </Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem>
              <GridItem item xs={3}>
                <StyledLink onClick={() => setCurrentPage('media')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name" style={{ fontSize }}>
                      Media
                    </Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem>
            </Grid>
          </MainContainer>
        );
    }
  };

  return (
    <div ref={ref} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {currentPage === 'main' && (
        <CloseButton onClick={onClose}>
          x
        </CloseButton>
      )}
      {renderPage()}
    </div>
  );
};

export default CountryView;