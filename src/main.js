import './styles/index.css';
import { initRouter } from './router.js';

// Apply saved theme immediately to avoid flash
const savedTheme = localStorage.getItem('bdc-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});
