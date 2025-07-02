import TitleSetter from "@/components/utilities/titlesetter";

const About = () => {
    return (
        <div className="min-h-screen font-sans antialiased">
            <TitleSetter title="About" />
            <main className="container mx-auto p-5 text-center">
                <p>This is the About</p>
            </main>
        </div>
    );
}

export default About