import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      <Topbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-slate-900 via-[#13352b] to-emerald-900 text-white py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          About HRMS
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-white/90">
          Empowering organizations with modern HR technology to simplify workforce management.
        </p>
      </section>

      {/* ABOUT CONTENT */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            HRMS is a powerful Human Resource Management System designed to
            automate employee management, payroll processing, attendance tracking,
            and performance analysis. Built using modern web technologies like
            React and Tailwind CSS, it provides a seamless and responsive experience.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-10">
          
          <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">
              🎯 Our Mission
            </h3>
            <p className="text-gray-600">
              To simplify HR operations through automation, improve efficiency,
              and help organizations focus more on growth rather than manual processes.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">
              🚀 Our Vision
            </h3>
            <p className="text-gray-600">
              To become a leading HR technology platform trusted by businesses
              worldwide for managing workforce operations efficiently and securely.
            </p>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          
          <h2 className="text-4xl font-bold text-gray-800 mb-16">
            Why Choose HRMS?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-3">Secure Platform</h4>
              <p className="text-gray-600">
                Your employee data is protected with high-level security and safe storage.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-3">Easy to Use</h4>
              <p className="text-gray-600">
                Clean and intuitive interface designed for simplicity and efficiency.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition">
              <h4 className="text-xl font-semibold mb-3">Scalable Solution</h4>
              <p className="text-gray-600">
                Suitable for startups, SMEs, and large enterprises.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
