'use client';
        </div>
      </Card>
      <Card title="Connected systems">
        <div style={{display:'grid',gap:12}}>
          {[
            'Directo transfer request feed',
            'Internal courier handoff scan',
            'Warehouse ootel receipt status',
            'Ops Hub blocked-order status sync'
          ].map((text) => <div key={text} style={{padding:16,borderRadius:18,background:'var(--panel-soft)',fontSize:14}}>{text}</div>)}
        </div>
      </Card>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case 'Overview': return <OverviewPage />;
      case 'Requests': return <RequestsPage />;
      case 'Courier': return <CourierPage />;
      case 'Warehouse Receipt': return <WarehouseReceiptPage />;
      case 'Exceptions': return <ExceptionsPage />;
      case 'Settings': return <SettingsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'var(--bg)'}}>
      <aside style={{width:274,background:'#ffffff',borderRight:'1px solid var(--border)',padding:16,display:'flex',flexDirection:'column',gap:18}}>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:10}}>
          <div style={{width:42,height:42,borderRadius:16,background:'var(--primary)',color:'#fff',display:'grid',placeItems:'center',fontWeight:800}}>G</div>
          <div><div style={{fontSize:15,fontWeight:800}}>Gemer Flow</div><div style={{fontSize:12,color:'var(--muted)'}}>Store Transfer Desk</div></div>
        </div>
        <nav style={{display:'grid',gap:6}}>
          {NAV.map((item) => {
            const active = activePage === item;
            return (
              <button key={item} onClick={() => setActivePage(item)} style={{border:'none',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',borderRadius:18,background:active ? 'var(--primary)' : '#fff',color:active ? '#fff' : 'var(--text)',fontWeight:active ? 700 : 600,boxShadow:active ? '0 8px 20px rgba(15,23,42,.12)' : 'none'}}>
                <span>{item}</span>
                {item === 'Exceptions' ? <span style={{fontSize:12,padding:'4px 8px',borderRadius:999,background:active ? 'rgba(255,255,255,.18)' : 'var(--high-soft)',color:active ? '#fff' : 'var(--high)'}}>{EXCEPTIONS.length}</span> : null}
              </button>
            );
          })}
        </nav>
        <div style={{marginTop:'auto',background:'var(--primary)',color:'#fff',borderRadius:26,padding:18}}>
          <div style={{fontWeight:800}}>Today’s transfer focus</div>
          <div style={{marginTop:8,fontSize:13,color:'rgba(255,255,255,.78)',lineHeight:1.5}}>
            Clear high-priority store transfers before courier pickup so blocked warehouse orders can move the same day.
          </div>
          <button onClick={() => setActivePage('Overview')} style={{marginTop:14,border:'none',background:'#fff',color:'var(--primary)',padding:'10px 14px',borderRadius:14,fontWeight:700}}>Open overview</button>
        </div>
      </aside>
      <main style={{flex:1,minWidth:0}}>
        <header style={{background:'rgba(255,255,255,.92)',borderBottom:'1px solid var(--border)',padding:'20px 28px'}}>
          <div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',flexWrap:'wrap'}}>
            <div>
              <h1 style={{margin:0,fontSize:30,lineHeight:1.05,letterSpacing:'-0.04em'}}>{activePage}</h1>
              <div style={{marginTop:6,color:'var(--muted)',fontSize:14}}>Retail workflow for picking, handoff, transit, and warehouse stock release.</div>
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search task, order, customer" style={{width:280,padding:'12px 14px',borderRadius:16,border:'1px solid var(--border)',background:'#fff',outline:'none'}} />
              <button style={secondaryButton}>Export handoff list</button>
              <button style={primaryButton}>Create exception</button>
            </div>
          </div>
        </header>
        <div style={{padding:28}}>{renderPage()}</div>
      </main>
    </div>
  );
}