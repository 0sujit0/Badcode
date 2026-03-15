export default function LandingPage() {
  return `
    <div class="container mt-8" style="min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: space-between; gap: 4rem;">
      
      <!-- Left Column: Copy -->
      <div style="flex: 1; max-width: 600px;">
        <p style="color: #c9db1d; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.25rem;">●</span> THE SQL LEARNING PLATFORM
        </p>
        
        <h1 class="hero-title" style="font-size: 4.5rem; line-height: 1.05; letter-spacing: -2px; margin-bottom: 1.5rem; color: var(--text-primary);">
          Write your first query.<br>Break things.<br>
          <span style="position: relative; display: inline-block;">
            Actually<span style="position: absolute; bottom: 8px; left: 0; right: 0; height: 6px; background: var(--accent-yellow); z-index: -1;"></span>
          </span> learn.
        </h1>
        
        <p style="font-size: 1.15rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 3rem; max-width: 500px;">
          badcode is a hands-on SQL practice environment. No slides. No videos. Just you, a query editor, and real data.
        </p>
        
        <div class="flex items-center gap-4">
          <a href="#/dashboard" class="btn btn-primary" style="padding: 1rem 1.5rem; font-size: 1rem; border-radius: var(--radius-full); display: flex; align-items: center; gap: 0.5rem;">
            Start Practicing 
            <span style="background: var(--bg-dark); color: white; padding: 0.15rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Free</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 0.25rem;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          
          <a href="#/dashboard" class="btn" style="padding: 1rem 1.75rem; font-size: 1rem; background: white; border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-full); display: flex; align-items: center; gap: 0.5rem;">
            Curriculum
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          </a>
        </div>
      </div>
      
      <!-- Right Column: Mock Editor Window -->
      <div style="flex: 1; max-width: 550px; display: none; @media(min-width: 768px) { display: block; }">
        <div class="card-dark" style="background: #313131; border-radius: var(--radius-2xl); padding: 0; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); overflow: hidden;">
          
          <!-- Editor Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 0px solid var(--border-dark);">
            <div style="display: flex; gap: 0.5rem;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #4a4a4a;"></div>
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #4a4a4a;"></div>
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #4a4a4a;"></div>
            </div>
            <div style="border: 1px solid #4a4a4a; border-radius: 12px; padding: 0.25rem 0.75rem; font-family: var(--font-mono); font-size: 0.65rem; color: #a3a3a3; text-transform: uppercase;">
              EMPLOYEES.SQL
            </div>
          </div>
          
          <!-- Editor Body -->
          <div style="padding: 1rem 3rem 4rem 3rem; font-family: var(--font-mono); font-size: 1.05rem; line-height: 2; color: #a3a3a3;">
            <div><span style="color: white; font-weight: 600;">SELECT</span> name, salary</div>
            <div><span style="color: white; font-weight: 600;">FROM</span> employees</div>
            <div><span style="color: white; font-weight: 600;">WHERE</span> department = <span style="color: #a3a3a3;">'Engineering'</span></div>
            <div><span style="color: white; font-weight: 600;">ORDER BY</span> salary <span style="color: white; font-weight: 600;">DESC</span></div>
            <div><span style="color: white; font-weight: 600;">LIMIT</span> 5;<span style="display: inline-block; width: 10px; height: 1em; background: var(--accent-yellow); margin-left: 4px; vertical-align: bottom; animation: blink 1s step-end infinite;"></span></div>
          </div>
          
        </div>
      </div>
      
    </div>
    <style>
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      @media(max-width: 900px) {
        .app-container > .container {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 2rem !important;
        }
        .hero-title { font-size: 3rem !important; }
      }
    </style>
  `;
}
