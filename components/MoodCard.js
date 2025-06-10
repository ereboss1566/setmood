function MoodCard({ mood, isActive, isPreview, onClick }) {
    try {
        const cardClasses = `
            mood-card pixel-border relative w-64 h-80 md:w-64 md:h-80 sm:w-48 sm:h-64 
            rounded-2xl overflow-hidden cursor-pointer
            ${isActive ? 'z-10 scale-110' : ''}
            ${isPreview ? 'card-preview' : ''}
            transition-all duration-300 ease-in-out
        `;

        return (
            <div 
                className={cardClasses}
                onClick={onClick}
                style={{ 
                    backgroundColor: mood.color,
                    backgroundImage: `url(${mood.background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                data-name="mood-card"
                data-file="components/MoodCard.js"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-60"></div>
                
                <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between text-white">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl mb-2 md:mb-4">{mood.icon}</div>
                        <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">{mood.name}</h3>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-xs opacity-90 mb-2 md:mb-4">{mood.description}</p>
                        <div className="w-full h-2 bg-black bg-opacity-30 rounded">
                            <div 
                                className="h-full bg-white rounded transition-all duration-1000"
                                style={{ width: isActive ? '100%' : '0%' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('MoodCard component error:', error);
        reportError(error);
        return <div>Error loading mood card</div>;
    }
}
