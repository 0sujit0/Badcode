import LandingPage from './pages/LandingPage.js';
import DashboardPage from './pages/DashboardPage.js';
import LevelPage from './pages/LevelPage.js';
import LessonPage from './pages/LessonPage.js';
import Navbar from './components/Navbar.js';

const routes = {
  '/': LandingPage,
  '/dashboard': DashboardPage,
  '/level/:id': LevelPage,
  '/lesson/:id': LessonPage,
};

export function initRouter() {
  const render = () => {
    const app = document.getElementById('app');
    const hash = window.location.hash.slice(1) || '/';
    
    // Simple mock until we implement real pages
    let PageComponent = routes['/'];
    if (hash.startsWith('/dashboard')) PageComponent = routes['/dashboard'];
    else if (hash.startsWith('/level')) PageComponent = routes['/level/:id'];
    else if (hash.startsWith('/lesson')) PageComponent = routes['/lesson/:id'];
    
    app.innerHTML = `
      ${Navbar()}
      <main id="main-content" style="flex: 1;">
        ${PageComponent()}
      </main>
    `;
    
    // Bind global header events
    import('./components/Navbar.js').then(({ bindNavbar }) => bindNavbar());
  };

  window.addEventListener('hashchange', render);
  render();
}
