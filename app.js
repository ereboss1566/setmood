function App() {
    try {
        const [selectedMood, setSelectedMood] = React.useState(null);
        const [isTransitioning, setIsTransitioning] = React.useState(false);

        const handleMoodSelect = (mood) => {
            setIsTransitioning(true);
            setTimeout(() => {
                setSelectedMood(mood);
                setIsTransitioning(false);
            }, 1000);
        };

        const handleBackToSelector = () => {
            setSelectedMood(null);
        };

        React.useEffect(() => {
            const handleKeyPress = (event) => {
                if (selectedMood) return;
                
                if (event.key === 'ArrowLeft') {
                    document.querySelector('[data-name="mood-selector"] button:first-of-type')?.click();
                } else if (event.key === 'ArrowRight') {
                    document.querySelector('[data-name="mood-selector"] button:last-of-type')?.click();
                } else if (event.key === 'Enter') {
                    document.querySelector('[data-name="mood-card"]')?.click();
                }
            };

            window.addEventListener('keydown', handleKeyPress);
            return () => window.removeEventListener('keydown', handleKeyPress);
        }, [selectedMood]);

        return (
            <div data-name="app" data-file="app.js">
                {isTransitioning && (
                    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                        <div className="text-white text-center">
                            <div className="animate-spin text-4xl mb-4">⭐</div>
                            <p>Entering {selectedMood?.name} mode...</p>
                        </div>
                    </div>
                )}
                
                {selectedMood ? (
                    <MoodExperience 
                        mood={selectedMood} 
                        onBack={handleBackToSelector}
                    />
                ) : (
                    <MoodSelector onMoodSelect={handleMoodSelect} />
                )}
            </div>
        );
    } catch (error) {
        console.error('App component error:', error);
        reportError(error);
        return <div>Error loading application</div>;
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
