export interface Track { 
    spotifyId?: string; 
    id: string; 
 
    artist: string; 
    name: string; 
    imageUrl: string; 
 
    similarTracks: string[]; 
} 