const SPOTIFY_CLIENT_ID = '45d2d93041424d99a1c72ab7399dd0e6';
const REDIRECT_URI ="https://ereboss1566.github.io/setmood/callback";
;

const spotifyAuth = {
    getAuthUrl() {
        const scopes = [
            'streaming',
            'user-read-email',
            'user-read-private',
            'user-read-playback-state',
            'user-modify-playback-state'
        ].join(' ');

        return `https://accounts.spotify.com/authorize?` +
            `client_id=${SPOTIFY_CLIENT_ID}&` +
            `response_type=token&` +
            `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
            `scope=${encodeURIComponent(scopes)}`;
    },

    getTokenFromUrl() {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        return params.get('access_token');
    },

    async searchTrack(query, token) {
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            return data.tracks?.items[0] || null;
        } catch (error) {
            console.error('Spotify search error:', error);
            return null;
        }
    }
};
