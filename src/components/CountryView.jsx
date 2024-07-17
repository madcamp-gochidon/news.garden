import React, { useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import GossipPage from './pages/GossipPage';
import PaperPage from './pages/PaperPage';
import PicturePage from './pages/PicturePage';
import RadioPage from './pages/RadioPage';
import MediaPage from './pages/MediaPage';

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

  const renderPage = () => {
    switch (currentPage) {
      case 'gossip':
        return <GossipPage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      case 'paper':
        return <PaperPage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      // case 'picture':
      //   return <PicturePage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      case 'radio':
        return <RadioPage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      case 'media':
        return <MediaPage countryData={countryData} onBack={() => setCurrentPage('main')} />;
      default:
        return (
          <MainContainer maxWidth={false}>
            <Grid container spacing={4}>
              <GridItem item xs={3}>
                <StyledLink onClick={() => setCurrentPage('gossip')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name">Gossip</Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem>
              <GridItem item xs={3}>
                <StyledLink onClick={() => setCurrentPage('paper')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name">Paper</Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem>
              {/* <GridItem item xs={2}>
                <StyledLink onClick={() => setCurrentPage('picture')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name">Picture</Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem> */}
              <GridItem item xs={3}>
                <StyledLink onClick={() => setCurrentPage('radio')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name">Radio</Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem>
              <GridItem item xs={3}>
                <StyledLink onClick={() => setCurrentPage('media')}>
                  <PageNameBox>
                    <Typography variant="h3" className="page-name">Media</Typography>
                  </PageNameBox>
                </StyledLink>
              </GridItem>
            </Grid>
          </MainContainer>
        );
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {currentPage == 'main' && (
        <CloseButton onClick={onClose}>
          x
        </CloseButton>
      )}
      {renderPage()}
    </div>
  );
};

export default CountryView;