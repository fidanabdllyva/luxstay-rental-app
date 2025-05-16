const ValuesAbout = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
                        <p className="text-gray-600">
                            We maintain the highest standards for all properties on our platform.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust</h3>
                        <p className="text-gray-600">
                            We build trust through transparency, reliability, and exceptional service.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                        <p className="text-gray-600">
                            We continuously improve our platform to enhance the rental experience.
                        </p>
                    </div>

                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                        <p className="text-gray-600">
                            We foster connections between hosts and guests from around the world.
                        </p>
                    </div>

                </div>
            </div>
        </section>

    )
}

export default ValuesAbout