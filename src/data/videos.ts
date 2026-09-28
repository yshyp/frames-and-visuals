import { VideoStory } from '../types/portfolio';
import { createPhotoArtwork } from './artworks';

export const INITIAL_VIDEOS: VideoStory[] = [
  {
    id: 'vid-01',
    title: 'The Hidden Microcosmos — 120fps Macro Study',
    category: 'Macro',
    description: 'Ultra-slow motion observation of praying mantis raptorial strikes, robber fly predation, and compound eye light refractions recorded in the rainforest understory.',
    duration: '03:42',
    location: 'Nelliyampathy Rainforest, Kerala',
    thumbnail: createPhotoArtwork('macro-praying-mantis'),
    // High-quality public CDN ambient nature video loop
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    youtubeUrl: 'https://youtube.com/@FramesandVisualsbyYsh',
    gear: 'Nikon Z6III · 105mm f/2.8 Micro VR · 4K 120fps N-Log',
    featured: true
  },
  {
    id: 'vid-02',
    title: 'Silent Valley — The Monsoon Canopy Expedition',
    category: 'Wildlife',
    description: 'Cinematic expedition tracking Malabar Great Hornbills, lion-tailed macaques, and virgin tropical rainforest canopies shrouded in continuous southwest monsoon mists.',
    duration: '05:18',
    location: 'Silent Valley National Park, Western Ghats',
    thumbnail: createPhotoArtwork('wildlife-hornbill'),
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    youtubeUrl: 'https://youtube.com/@FramesandVisualsbyYsh',
    gear: 'Nikon Z6III · 500mm f/4 PF · 4K 60fps ProRes RAW',
    featured: true
  },
  {
    id: 'vid-03',
    title: 'Thunder in the Basalt — Athirappilly River Pulse',
    category: 'Nature',
    description: 'Hypnotic cinematic exploration of torrential monsoon waters roaring through ancient Western Ghats gorges, capturing the tactile weight and mist of falling water.',
    duration: '02:50',
    location: 'Athirappilly Rainforest, Kerala',
    thumbnail: createPhotoArtwork('nature-waterfall'),
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    youtubeUrl: 'https://youtube.com/@FramesandVisualsbyYsh',
    gear: 'Nikon Z6III · 24–70mm f/2.8 S · 4K 24fps 10-Bit',
    featured: false
  },
  {
    id: 'vid-04',
    title: 'Monsoon Mirrors — Streets of Fort Kochi',
    category: 'Visual Stories',
    description: 'An atmospheric short film capturing slow afternoon rain on terracotta tiles, harbor steam, fishermen hauling Chinese nets, and reflections on rain-soaked cobblestones.',
    duration: '04:15',
    location: 'Fort Kochi Heritage Quarter, Kerala',
    thumbnail: createPhotoArtwork('story-monsoon'),
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    youtubeUrl: 'https://youtube.com/@FramesandVisualsbyYsh',
    gear: 'Nikon Z6III · 50mm f/1.8 S · 4K 24fps Flat Color Profile',
    featured: false
  }
];
