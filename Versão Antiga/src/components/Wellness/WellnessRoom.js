import React, { useState } from 'react';
import {
  Container,
  Header,
  Title,
  MenuContainer,
  MenuItem,
  ContentArea,
  PlaylistGrid,
  PlaylistCard,
  PlaylistImage,
  PlaylistTitle,
  PlaylistDescription,
  PlayerContainer,
  PlayButton,
  PlayerInfo,
  SectionContainer,
  SectionTitle,
  HorizontalScroll
} from './styles';
import { playlists, techniques, readings, favorites, myPlaylist, newContent } from './data';

const WellnessRoom = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [currentPlaying, setCurrentPlaying] = useState(null);

  const handlePlay = (item) => {
    setCurrentPlaying(item);
  };

  const renderContent = () => {
    let content = [];
    
    switch(activeTab) {
      case 'playlists':
        content = playlists;
        break;
      case 'techniques':
        content = techniques;
        break;
      case 'readings':
        content = readings;
        break;
      case 'podcasts':
        content = playlists.filter(item => item.type === 'podcast');
        break;
      default:
        content = playlists;
    }

    return (
      <PlaylistGrid>
        {content.map((item) => (
          <PlaylistCard key={item.id} onClick={() => handlePlay(item)}>
            <PlaylistImage src={item.image} alt={item.title} />
            <PlayButton>▶</PlayButton>
            <PlaylistTitle>{item.title}</PlaylistTitle>
            <PlaylistDescription>{item.description}</PlaylistDescription>
            <PlaylistDescription>{item.duration || item.pages}</PlaylistDescription>
          </PlaylistCard>
        ))}
      </PlaylistGrid>
    );
  };

  const renderHorizontalSection = (items, sectionTitle) => (
    <SectionContainer>
      <SectionTitle>{sectionTitle}</SectionTitle>
      <HorizontalScroll>
        {items.map((item) => (
          <PlaylistCard key={item.id} onClick={() => handlePlay(item)}>
            <PlaylistImage src={item.image} alt={item.title} />
            <PlayButton>▶</PlayButton>
            <PlaylistTitle>{item.title}</PlaylistTitle>
            <PlaylistDescription>{item.description}</PlaylistDescription>
            <PlaylistDescription>{item.duration || item.pages}</PlaylistDescription>
          </PlaylistCard>
        ))}
      </HorizontalScroll>
    </SectionContainer>
  );

  return (
    <Container>
      <Header>
        <Title>Sala de Bem-estar</Title>
      </Header>

      <MenuContainer>
        <MenuItem 
          active={activeTab === 'playlists'} 
          onClick={() => setActiveTab('playlists')}
        >
          Playlists de Músicas
        </MenuItem>
        <MenuItem 
          active={activeTab === 'techniques'} 
          onClick={() => setActiveTab('techniques')}
        >
          Técnicas de Relaxamento
        </MenuItem>
        <MenuItem 
          active={activeTab === 'readings'} 
          onClick={() => setActiveTab('readings')}
        >
          Leituras
        </MenuItem>
        <MenuItem 
          active={activeTab === 'podcasts'} 
          onClick={() => setActiveTab('podcasts')}
        >
          Podcasts
        </MenuItem>
      </MenuContainer>

      <ContentArea>
        {renderContent()}
      </ContentArea>

      {/* Seção Meus Favoritos */}
      {renderHorizontalSection(favorites, "Meus Favoritos")}

      {/* Seção Minha Playlist */}
      {renderHorizontalSection(myPlaylist, "Minha Playlist")}

      {/* Seção Novidades */}
      {renderHorizontalSection(newContent, "Novidades")}

      {currentPlaying && (
        <PlayerContainer>
          <PlayerInfo>
            <strong>{currentPlaying.title}</strong>
            <span>{currentPlaying.description}</span>
          </PlayerInfo>
          <audio controls style={{ flex: 1, margin: '0 20px' }}>
            <source src={`/assets/audios/${currentPlaying.id}.mp3`} type="audio/mpeg" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        </PlayerContainer>
      )}
    </Container>
  );
};

export default WellnessRoom;