export const Layout = ({ children, setView, currentView }) => (
  <div className="container">
    <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--pico-muted-border-color)' }}>
      <nav>
        <ul>
          <li><strong>Expense Tracker</strong></li>
        </ul>
        <ul>
          <li>
            <button 
              className={currentView === 'dashboard' ? 'contrast' : 'secondary outline'}
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button 
              className={currentView === 'add' ? 'contrast' : 'secondary outline'}
              onClick={() => setView('add')}
            >
              Add Expense
            </button>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      {children}
    </main>
  </div>
);

