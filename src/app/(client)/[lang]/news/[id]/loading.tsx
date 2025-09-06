// src/app/[lang]/news/[id]/loading.tsx
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Orqaga qaytish skeleton */}
                <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>

                {/* Asosiy kontent skeleton */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Rasm skeleton */}
                    <div className="h-64 md:h-96 bg-gray-200 animate-pulse"></div>

                    {/* Kontent skeleton */}
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>

                        {/* Teglar skeleton */}
                        <div className="flex gap-2">
                            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}