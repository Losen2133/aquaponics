"use client"

import TitleSetter from "@/components/utilities/titlesetter";

const LivestockPage = () => {
    return (
        <div className="min-h-screen font-sans antialiased">
            <TitleSetter title="LiveStock" />
            <main className="container mx-auto p-5">
                <h1 className="text-2xl font-bold mb-4">Livestock Management</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-3">Fish</h2>
                        <p className="text-gray-600">Fish management will go here</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-3">Plants</h2>
                        <p className="text-gray-600">Plant management will go here</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LivestockPage;