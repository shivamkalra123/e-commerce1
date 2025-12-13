import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-50/40 via-white to-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO */}
        <section className="py-8">
          <Hero />
        </section>

        {/* BEST SELLER */}
        <section className="py-8">
          <div className="rounded-2xl bg-white/50 backdrop-blur-md shadow-md p-5">
            <BestSeller />
          </div>
        </section>

        {/* LATEST COLLECTION */}
        <section className="py-8">
          <div className="rounded-2xl bg-gradient-to-br from-orange-50/30 via-white to-gray-50 shadow-inner p-5">
            <LatestCollection />
          </div>
        </section>

        {/* POLICY */}
        <section className="py-8">
          <div className="rounded-2xl bg-white/60 backdrop-blur-xl shadow p-5">
            <OurPolicy />
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-10">
          <NewsletterBox />
        </section>

      </div>
    </div>
  )
}

export default Home
