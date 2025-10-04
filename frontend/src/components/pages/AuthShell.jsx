export default function AuthShell({
  title,
  children,
  formSide = "left",
  accent = "from-blue-600 via-indigo-600 to-purple-600",
}) {
  const isLeft = formSide === "left";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* FORM PANEL */}
          <div className={isLeft ? "order-1" : "order-2"}>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12 h-full flex transition-all duration-300 hover:shadow-3xl">
              <div className="m-auto w-full max-w-md">
                <div className="mb-8">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4">
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Welcome Back
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {title}
                  </h2>
                  <p className="text-gray-600">
                    Secure access to Bangladesh's digital land registry
                  </p>
                </div>
                {children}
              </div>
            </div>
          </div>

          {/* SHOWCASE PANEL */}
          <div className={isLeft ? "order-2" : "order-1"}>
            <div
              className={`rounded-3xl h-full p-8 lg:p-10 bg-gradient-to-br ${accent} text-white shadow-2xl relative overflow-hidden group`}
            >
              {/* Animated overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <div className="text-2xl font-bold mb-1">
                      e-Land Registry
                    </div>
                    <div className="text-sm text-white/80">
                      Powered by Blockchain Technology
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium border border-white/30">
                    🔒 Secure
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium border border-white/30">
                    ⚡ Fast
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium border border-white/30">
                    ✓ Verified
                  </span>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="text-3xl mb-3">🔍</div>
                    <div className="font-semibold mb-2">Quick Search</div>
                    <ul className="space-y-1.5 text-sm text-white/90">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        Search Khatiyan
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        Verify Dag/Plot
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        Mouza Map Viewer
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="text-3xl mb-3">📍</div>
                    <div className="font-semibold mb-2">Location Hierarchy</div>
                    <div className="text-sm text-white/90">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>Division</span>
                        <span className="opacity-50">→</span>
                        <span>District</span>
                        <span className="opacity-50">→</span>
                        <span>Upazila</span>
                        <span className="opacity-50">→</span>
                        <span>Mouza</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 md:col-span-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="text-3xl mb-3">📋</div>
                    <div className="font-semibold mb-3">
                      Supported Survey Types
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["CS", "SA", "RS", "BS", "BRS", "TS"].map((survey) => (
                        <span
                          key={survey}
                          className="px-3 py-1.5 bg-white/25 backdrop-blur rounded-lg text-sm font-semibold border border-white/30 hover:bg-white/35 transition-colors"
                        >
                          {survey}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-xs text-white/80">Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-xs text-white/80">Mouzas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-xs text-white/80">Uptime</div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center py-4 px-6 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
                  <span className="text-sm">New to e-Land Registry? </span>
                  <a
                    href="/register"
                    className="font-bold underline decoration-2 underline-offset-4 hover:text-white/90 transition-colors"
                  >
                    Create Account →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
