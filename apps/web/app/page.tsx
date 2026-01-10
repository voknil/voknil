'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function Home() {
  const { t, language } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const skills = [
    {
      titleKey: 'frontend',
      descKey: 'frontendDesc',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      titleKey: 'backend',
      descKey: 'backendDesc',
      color: 'from-purple-500 to-pink-500',
    },
    {
      titleKey: 'design',
      descKey: 'designDesc',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen relative overflow-hidden">
      <LanguageSwitcher />
      
      {/* Анимированный фон с градиентами */}
      <div
        className="fixed inset-0 opacity-30 -z-10"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.2), transparent 50%)`,
        }}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className={`max-w-5xl mx-auto text-center relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6 leading-tight font-display">
            <span className="animated-text-gradient block">Voknil</span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 font-light">
            {t('hero.subtitle')}
          </p>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a
              href="#about"
              className="group px-8 py-4 rounded-full glass hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              <span className="flex items-center gap-2 text-lg font-medium">
                {t('hero.learnMore')}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>
            
            <a
              href="#contact"
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50 pulse-glow"
            >
              <span className="flex items-center gap-2 text-lg font-medium text-white">
                {t('hero.contact')}
              </span>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 float-animation">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t('about.title')}
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`glass rounded-3xl p-8 md:p-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="text-3xl mb-4">→</div>
              <h3 className="text-2xl font-bold mb-4 text-white font-display">{t('about.story')}</h3>
              <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
                {t('about.description1')}
              </p>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                {t('about.description2')}
              </p>
            </div>

            <div className={`space-y-6 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                <h4 className="font-bold text-lg mb-2">{t('about.ideas')}</h4>
                <p className="text-gray-400 text-sm">{t('about.ideasDesc')}</p>
              </div>

              <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                <h4 className="font-bold text-lg mb-2">{t('about.goals')}</h4>
                <p className="text-gray-400 text-sm">{t('about.goalsDesc')}</p>
              </div>

              <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                <h4 className="font-bold text-lg mb-2">{t('about.energy')}</h4>
                <p className="text-gray-400 text-sm">{t('about.energyDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t('skills.title')}
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div
                key={skill.titleKey}
                className={`glass rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group hover:scale-105 hover:-translate-y-2 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skill.color} mb-6 group-hover:scale-110 transition-transform shadow-lg opacity-80`} />
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all font-display">
                  {t(`skills.${skill.titleKey}`)}
                </h3>
                <p className="text-gray-400 leading-relaxed">{t(`skills.${skill.descKey}`)}</p>
                <div className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full group-hover:w-full transition-all duration-1000`}
                    style={{ width: `${75 + index * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className={`glass rounded-3xl p-12 md:p-16 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t('contact.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed whitespace-pre-line">
              {t('contact.description')}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:contact@example.com"
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/50 flex items-center gap-2"
              >
                <span>{t('contact.writeMe')}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800/50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center">
            <p className="text-gray-400 text-center">
              {t('footer.copyright').replace('{year}', year.toString())}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
