import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import {
  ShieldCheckIcon,
  TruckIcon,
  ClockIcon,
  StarIcon,
  DocumentTextIcon,
  HeartIcon,
  PhoneIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';


// Counter component for animated stats
const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60); // 60 FPS
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const StatsSection = () => {
  const statVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delay: index * 0.2,
      },
    }),
  };

  const stats = [
    { value: 50000, label: 'Happy Customers', suffix: '+' },
    { value: 10000, label: 'Medicines Available', suffix: '+' },
    { value: 24, label: 'Customer Support', suffix: '/7' },
    { value: 2, label: 'Delivery Time', suffix: '-4 hrs' },
  ];

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={statVariants}
            className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold text-blue-900">
              {stat.value >= 24 ? (
                stat.value === 24 ? (
                  '24/7'
                ) : (
                  <>
                    <Counter end={stat.value} />
                    {stat.suffix}
                  </>
                )
              ) : (
                <>
                  <Counter end={stat.value} />
                  {stat.suffix}
                </>
              )}
            </h2>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <>
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-1f96f3f3c837?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-60" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Your Health, <span className="block">Our Priority</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-md mx-auto md:mx-0">
              Get authentic medicines delivered to your doorstep. Fast, reliable, and trusted by thousands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)' }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                aria-label="Order Medicines"
              >
                Order Medicines
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)' }}
                className="bg-white text-blue-900 border border-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
                aria-label="Upload Prescription"
              >
                Upload Prescription
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, rotateY: 30 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative"
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 transform hover:scale-105 transition-transform duration-500">
              <video
                autoPlay
                loop
                muted
                className="w-full h-64 md:h-96 rounded-lg shadow-2xl"
                src="https://player.vimeo.com/progressive_redirect/playback/689141147/rendition/1080p/file.mp4?loc=external&signature=5a2b8b5e7b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Why Choose Life Care */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-100 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4"
          >
            Why Choose Life Care?
          </motion.h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            We're committed to providing you with the best healthcare experience through our reliable services and quality products.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheckIcon className="w-8 h-8 text-blue-600" />,
                title: '100% Authentic',
                desc: 'All medicines are sourced directly from licensed manufacturers.',
              },
              {
                icon: <TruckIcon className="w-8 h-8 text-blue-600" />,
                title: 'Fast Delivery',
                desc: 'Free delivery within Colombo in 2–4 hours.',
              },
              {
                icon: <ClockIcon className="w-8 h-8 text-blue-600" />,
                title: '24/7 Support',
                desc: 'Round-the-clock customer support and emergency assistance.',
              },
              {
                icon: <StarIcon className="w-8 h-8 text-blue-600" />,
                title: 'Expert Care',
                desc: 'Qualified pharmacists available for consultation.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                whileHover={{ scale: 1.05, rotateY: 5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 transform perspective-1000"
              >
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-blue-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Services */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4"
          >
            Our Services
          </motion.h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Comprehensive healthcare solutions at your fingertips.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <HeartIcon className="w-6 h-6" />,
                bgColor: 'bg-blue-600',
                title: 'Medicine Delivery',
                desc: 'Order prescription and OTC medicines online.',
                link: '#',
              },
              {
                icon: <DocumentTextIcon className="w-6 h-6" />,
                bgColor: 'bg-green-600',
                title: 'Prescription Upload',
                desc: 'Upload your prescription and get medicines delivered.',
                link: '#',
              },
              {
                icon: <UserGroupIcon className="w-6 h-6" />,
                bgColor: 'bg-red-500',
                title: 'Health Products',
                desc: 'Wide range of health and wellness products.',
                link: '#',
              },
              {
                icon: <PhoneIcon className="w-6 h-6" />,
                bgColor: 'bg-purple-600',
                title: 'Teleconsultation',
                desc: 'Consult with doctors from the comfort of your home.',
                link: '#',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: 5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 text-left transform perspective-1000"
              >
                <div className={`${service.bgColor} text-white w-10 h-10 flex items-center justify-center rounded mb-4`}>
                  {service.icon}
                </div>
                <h3 className="font-bold text-lg text-blue-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <a href={service.link} className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  Learn More →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trusted By */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4"
          >
            Trusted By
          </motion.h2>
          <p className="text-lg text-gray-600 mb-8">
            Leading hospitals, certified pharmacists, and thousands of loyal customers.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              'https://images.unsplash.com/photo-1614935151651-0f27f2ff0a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
              'https://images.unsplash.com/photo-1620283086279-8643b96b05c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
              'https://images.unsplash.com/photo-1614680376573-545639729e4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
              'https://images.unsplash.com/photo-1620283086279-8643b96b05c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
            ].map((src, index) => (
              <motion.img
                key={index}
                src={src}
                alt={`Brand ${index + 1}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-12 object-contain"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </main>
    </>
  );
};

export default Home;