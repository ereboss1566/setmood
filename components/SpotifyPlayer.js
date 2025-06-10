function SpotifyPlayer({ onPlayerReady, onTrackChange, onPlaybackState }) {
    try {
        const [player, setPlayer] = React.useState(null);
        const [deviceId, setDeviceId] = React.useState(null);
        const [token, setToken] = React.useState(null);

        React.useEffect(() => {
            const storedToken = localStorage.getItem('spotify_token') || spotifyAuth.getTokenFromUrl();
            if (storedToken) {
                setToken(storedToken);
                localStorage.setItem('spotify_token', storedToken);
                initializePlayer(storedToken);
            }
        }, []);

        const initializePlayer = (accessToken) => {
            if (window.Spotify) {
                const spotifyPlayer = new window.Spotify.Player({
                    name: 'Moody Web Player',
                    getOAuthToken: cb => cb(accessToken),
                    volume: 0.5
                });

                spotifyPlayer.addListener('ready', ({ device_id }) => {
                    setDeviceId(device_id);
                    onPlayerReady?.(device_id, accessToken);
                });

                spotifyPlayer.addListener('player_state_changed', state => {
                    if (state) {
                        onPlaybackState?.(state);
                        onTrackChange?.(state.track_window.current_track);
                    }
                });

                spotifyPlayer.connect();
                setPlayer(spotifyPlayer);
            }
        };

        const login = () => {
            window.location.href = spotifyAuth.getAuthUrl();
        };

        if (!token) {
            return (
                <div className="text-center p-4">
                    <button 
                        onClick={login}
                        className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-green-600 transition-all"
                    >
                        <i className="fab fa-spotify mr-2"></i>
                        Connect Spotify
                    </button>
                </div>
            );
        }

        return (
            <div className="text-center p-2">
                <div className="text-green-400 text-xs">
                    <i className="fab fa-spotify mr-1"></i>
                    Spotify Connected
                </div>
            </div>
        );
    } catch (error) {
        console.error('SpotifyPlayer component error:', error);
        reportError(error);
        return <div>Error loading Spotify player</div>;
    }
}
