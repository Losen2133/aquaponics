import TitleSetter from "@/components/utilities/titlesetter";

const Camera = () => {
    return (
        <div className="min-h-screen font-sans antialiased">
            <TitleSetter title="Camera Feed" />
            <main className="container mx-auto p-5 text-center">
                <p>This is the Camera Feed</p>
            </main>
        </div>
    );
}

export default Camera