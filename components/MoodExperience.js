function MoodExperience({ mood, onBack }) {
    try {
        const [timeSpent, setTimeSpent] = React.useState(0);
        const [playlist, setPlaylist] = React.useState([]);
        const [newSong, setNewSong] = React.useState('');
        const [showAddSong, setShowAddSong] = React.useState(false);
        const [currentTrack, setCurrentTrack] = React.useState(null);
        const [isPlaying, setIsPlaying] = React.useState(false);
        const [spotifyPlayer, setSpotifyPlayer] = React.useState(null);
        const [accessToken, setAccessToken] = React.useState(null);

        React.useEffect(() => {
            const timer = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);

            const loadPlaylist = async () => {
                try {
                    const result = await trickleListObjects(`playlist:${mood.id}`, 50, true);
                    setPlaylist(result.items || []);
                } catch (error) {
                    console.error('Failed to load playlist:', error);
                }
            };

            loadPlaylist();
            return () => clearInterval(timer);
        }, [mood.id]);

        const handlePlayerReady = (deviceId, token) => {
            setAccessToken(token);
        };

        const handleTrackChange = (track) => {
            setCurrentTrack(track);
        };

        const handlePlaybackState = (state) => {
            setIsPlaying(!state.paused);
        };

        const addSong = async () => {
            if (!newSong.trim() || !accessToken) return;
            
            try {
                const track = await spotifyAuth.searchTrack(newSong, accessToken);
                if (!track) {
                    alert('Song not found on Spotify');
                    return;
                }

                const songData = {
                    title: `${track.artists[0].name} - ${track.name}`,
                    spotifyUri: track.uri,
                    mood: mood.id,
                    addedAt: new Date().toISOString()
                };
                
                const newSongObj = await trickleCreateObject(`playlist:${mood.id}`, songData);
                const result = await trickleListObjects(`playlist:${mood.id}`, 50, true);
                setPlaylist(result.items || []);
                
                // Play the track
                await playSpotifyTrack(track.uri);
                
                setNewSong('');
                setShowAddSong(false);
            } catch (error) {
                console.error('Failed to add song:', error);
            }
        };

        const playSpotifyTrack = async (uri) => {
            if (!accessToken) return;
            
            try {
                await fetch('https://api.spotify.com/v1/me/player/play', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uris: [uri]
                    })
                });
            } catch (error) {
                console.error('Playback error:', error);
            }
        };

        const togglePlayback = async () => {
            if (!accessToken) return;
            
            try {
                const endpoint = isPlaying ? 'pause' : 'play';
                await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            } catch (error) {
                console.error('Toggle playback error:', error);
            }
        };

        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        return (
            <div 
                className="fixed inset-0 z-50 flex"
                style={{ 
                    backgroundColor: mood.color,
                    backgroundImage: `url(${mood.background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                data-name="mood-experience"
                data-file="components/MoodExperience.js"
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                
                <div className="relative z-10 flex-1 p-4 md:p-8 text-white">
                    <div className="flex justify-between items-start mb-6 md:mb-8">
                        <button 
                            className="bg-white text-gray-800 px-4 py-2 rounded-full text-xs md:text-sm font-bold hover:bg-gray-100 transition-all"
                            onClick={onBack}
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            BACK
                        </button>
                        
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl mb-2">{mood.icon}</div>
                            <h2 className="text-lg md:text-xl font-bold">{mood.name}</h2>
                        </div>
                        
                        <div className="w-16 md:w-20"></div>
                    </div>

                    {currentTrack && (
                        <div className="absolute bottom-20 md:bottom-24 left-4 md:left-8 right-4 md:right-8">
                            <div className="bg-black bg-opacity-70 p-4 rounded-lg text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs opacity-60">Now Playing</p>
                                        <p className="text-sm font-bold">{currentTrack.name}</p>
                                        <p className="text-xs opacity-80">{currentTrack.artists[0].name}</p>
                                    </div>
                                    <button 
                                        className="bg-green-500 bg-opacity-80 p-2 rounded-full hover:bg-opacity-100"
                                        onClick={togglePlayback}
                                    >
                                        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-white">
                        <div className="bg-black bg-opacity-60 p-3 md:p-4 rounded-lg">
                            <p className="text-xs md:text-sm mb-1 md:mb-2">Time in {mood.name} mode</p>
                            <div className="text-lg md:text-2xl font-bold">{formatTime(timeSpent)}</div>
                        </div>
                    </div>
                </div>

                <div className="w-80 bg-black bg-opacity-30 backdrop-blur-sm p-4 overflow-y-auto playlist-sidebar">
                    <SpotifyPlayer 
                        onPlayerReady={handlePlayerReady}
                        onTrackChange={handleTrackChange}
                        onPlaybackState={handlePlaybackState}
                    />
                    
                    <div className="mb-4">
                        <h3 className="text-white text-sm font-bold mb-2">Your {mood.name} Playlist</h3>
                        <button 
                            className="bg-white bg-opacity-20 text-white px-3 py-1 rounded text-xs hover:bg-opacity-30 transition-all"
                            onClick={() => setShowAddSong(!showAddSong)}
                        >
                            <i className="fas fa-plus mr-1"></i>
                            Add Song
                        </button>
                    </div>

                    {showAddSong && (
                        <div className="mb-4 p-3 bg-white bg-opacity-10 rounded">
                            <input 
                                type="text"
                                value={newSong}
                                onChange={(e) => setNewSong(e.target.value)}
                                placeholder="Search song or artist"
                                className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 text-xs"
                                onKeyPress={(e) => e.key === 'Enter' && addSong()}
                            />
                            <div className="flex gap-2 mt-2">
                                <button 
                                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                    onClick={addSong}
                                >
                                    <i className="fab fa-spotify mr-1"></i>
                                    Add & Play
                                </button>
                                <button 
                                    className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                                    onClick={() => setShowAddSong(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {playlist.length === 0 ? (
                            <p className="text-white text-xs opacity-60">No songs added yet. Connect Spotify and add your first song!</p>
                        ) : (
                            playlist.map((song) => (
                                <div 
                                    key={song.objectId}
                                    className="bg-white bg-opacity-10 p-2 rounded text-white text-xs cursor-pointer hover:bg-opacity-20 transition-all"
                                    onClick={() => song.objectData.spotifyUri && playSpotifyTrack(song.objectData.spotifyUri)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{song.objectData.title}</div>
                                            <div className="opacity-60 text-xs">
                                                Added {new Date(song.objectData.addedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-green-400">
                                            <i className="fab fa-spotify"></i>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('MoodExperience component error:', error);
        reportError(error);
        return <div>Error loading mood experience</div>;
    }
}
