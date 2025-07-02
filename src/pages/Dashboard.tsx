import TitleSetter from "@/components/utilities/titlesetter"

const Dashboard = () => {
    return (
        <div className="min-h-screen font-sans antialiased">
            <TitleSetter title="Dashboard" />
            <main className="container mx-auto p-5 text-center">
                <p>This is the Dashboard</p>
            </main>
        </div>
    );
}

export default Dashboard