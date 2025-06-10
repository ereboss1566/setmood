function MoodSelector({ onMoodSelect }) {
    try {
        const [currentIndex, setCurrentIndex] = React.useState(0);
        const [isAnimating, setIsAnimating] = React.useState(false);

        const handlePrevious = () => {
            if (isAnimating) return;
            setIsAnimating(true);
            setCurrentIndex((prev) => 
                prev === 0 ? moodData.length - 1 : prev - 1
            );
            setTimeout(() => setIsAnimating(false), 300);
        };

        const handleNext = () => {
            if (isAnimating) return;
            setIsAnimating(true);
            setCurrentIndex((prev) => 
                prev === moodData.length - 1 ? 0 : prev + 1
            );
            setTimeout(() => setIsAnimating(false), 300);
        };

        const handleCardSelect = () => {
            onMoodSelect(moodData[currentIndex]);
        };

        const getVisibleCards = () => {
            const cards = [];
            const prevIndex = currentIndex === 0 ? moodData.length - 1 : currentIndex - 1;
            const nextIndex = currentIndex === moodData.length - 1 ? 0 : currentIndex + 1;
            
            cards.push({ mood: moodData[prevIndex], position: 'left', isPreview: true });
            cards.push({ mood: moodData[currentIndex], position: 'center', isActive: true });
            cards.push({ mood: moodData[nextIndex], position: 'right', isPreview: true });
            
            return cards;
        };

        return (
            <div 
                className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
                data-name="mood-selector"
                data-file="components/MoodSelector.js"
            >
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-2xl md:text-4xl text-white mb-2 md:mb-4">Choose Your Mood</h1>
                    <p className="text-white opacity-80 text-xs md:text-sm">Select the vibe that matches your current state</p>
                </div>

                <div className="card-stack relative flex items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12">
                    <button 
                        className="nav-arrow"
                        onClick={handlePrevious}
                        disabled={isAnimating}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    {getVisibleCards().map((card, index) => (
                        <div 
                            key={`${card.mood.id}-${index}`}
                            className={`
                                ${card.position === 'center' ? 'z-20' : 'z-10'}
                                ${card.position === 'left' ? '-translate-x-2 md:-translate-x-4' : ''}
                                ${card.position === 'right' ? 'translate-x-2 md:translate-x-4' : ''}
                            `}
                        >
                            <MoodCard
                                mood={card.mood}
                                isActive={card.isActive}
                                isPreview={card.isPreview}
                                onClick={card.isActive ? handleCardSelect : null}
                            />
                        </div>
                    ))}

                    <button 
                        className="nav-arrow"
                        onClick={handleNext}
                        disabled={isAnimating}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div className="text-center">
                    <button 
                        className="bg-white text-gray-800 px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-all"
                        onClick={handleCardSelect}
                    >
                        Enter {moodData[currentIndex].name} Mode
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        console.error('MoodSelector component error:', error);
        reportError(error);
        return <div>Error loading mood selector</div>;
    }
}
