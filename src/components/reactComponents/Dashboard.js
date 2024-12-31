import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '../featuress/cryptoSlice';
import TableComponent from './TableComponent';
import ChartComponent from './ChartComponent';
import SummaryCard from './SummaryComponent';
import "./Dashboard.css";
const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const dispatch = useDispatch();
  const cryptoData = useSelector((state) => state.crypto.data);

  // State to manage the layout, theme, and components
  const [layout, setLayout] = useState(
    JSON.parse(localStorage.getItem('dashboardLayout')) || {
      lg: [],
      md: [],
      sm: [],
      xs: [],
      xxs: [],
    }
  );
  
  const [components, setComponents] = useState(
    JSON.parse(localStorage.getItem('dashboardComponents')) || []
  );
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Fetch crypto data
  useEffect(() => {
    dispatch(fetchCryptoData());
    const interval = setInterval(() => {
      dispatch(fetchCryptoData());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Update layout (drag and drop functionality)
  const onLayoutChange = (newLayout, allLayouts) => {
    setLayout(allLayouts);
    localStorage.setItem('dashboardLayout', JSON.stringify(allLayouts));
  };

  // Add new components to the dashboard
  const addComponent = (type) => {
    const id = `${type}-${Date.now()}`;
    const newComponents = [...components, { id, type }];
    const updatedLayout = {
      ...layout,
      lg: [...(layout.lg || []), { i: id, x: 0, y: 0, w: 6, h: 4 }],
      md: [...(layout.md || []), { i: id, x: 0, y: 0, w: 6, h: 4 }],
      sm: [...(layout.sm || []), { i: id, x: 0, y: 0, w: 6, h: 4 }],
      xs: [...(layout.xs || []), { i: id, x: 0, y: 0, w: 6, h: 4 }],
      xxs: [...(layout.xxs || []), { i: id, x: 0, y: 0, w: 6, h: 4 }]
    };
    setComponents(newComponents);
    setLayout(updatedLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(updatedLayout));
    localStorage.setItem('dashboardComponents', JSON.stringify(newComponents));
  };

  // Delete a component from the dashboard
  const deleteComponent = (id,e) => {
    e.stopPropagation();
    const updatedLayout = {
      ...layout,
      lg: (layout.lg || []).filter((item) => item.i !== id),
      md: (layout.md || []).filter((item) => item.i !== id),
      sm: (layout.sm || []).filter((item) => item.i !== id),
      xs: (layout.xs || []).filter((item) => item.i !== id),
      xxs: (layout.xxs || []).filter((item) => item.i !== id),
    };
    const newComponents = components.filter((comp) => comp.id !== id);
    setLayout(updatedLayout);
    setComponents(newComponents);
    localStorage.setItem('dashboardLayout', JSON.stringify(updatedLayout));
    localStorage.setItem('dashboardComponents', JSON.stringify(newComponents));
  };

  // Render the component based on type
  const renderComponent = (comp) => {
    switch (comp.type) {
      case 'table':
        return <div className='table'> <TableComponent data={cryptoData} theme={theme} /></div>;
      case 'chart':
        return <div className='chart'> <ChartComponent data={cryptoData} /> </div>;
      case 'summary':
        return <div className='summary'> <SummaryCard data={cryptoData} /> </div>;
      default:
        return null;
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Export the dashboard configuration to JSON
  const exportConfig = () => {
    const config = {
      layout,
      components,
      theme,
    };
    const jsonConfig = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_config.json';
    a.click();
  };

  // Import the dashboard configuration from JSON
  const importConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const config = JSON.parse(reader.result);
        setLayout(config.layout);
        setComponents(config.components);
        setTheme(config.theme);
        localStorage.setItem('dashboardLayout', JSON.stringify(config.layout));
        localStorage.setItem('dashboardComponents', JSON.stringify(config.components));
        localStorage.setItem('theme', config.theme);
      };
      reader.readAsText(file);
    }
  };

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 };

  // Apply the theme to the page
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div>
      <div className='buttonContainer'>
        <button className='btn1' onClick={() => addComponent('table')}>Add Table</button>
        <button className='btn2' onClick={() => addComponent('chart')}>Add Chart</button>
        <button className='btn3' onClick={() => addComponent('summary')}>Add Summary</button>
        <button className='btn4' onClick={toggleTheme}>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</button>
        <button className='btn5' onClick={exportConfig}>Export Configuration</button>
        <input type="file" accept=".json" onChange={importConfig} />
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={30}
        onLayoutChange={onLayoutChange}
        isDraggable={true}
        isResizable={true}  
      >
        {components.map((comp) => (
          <div key={comp.id} data-grid={layout.lg?.find((item) => item.i === comp.id)}>
            <div style={{ position: 'relative' }} >
             
              {renderComponent(comp)}
            </div>
            <button
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  zIndex: 1,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize:'20px'
                }}
                onClick={(e) => deleteComponent(comp.id, e)}
              >
                ×
              </button>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
