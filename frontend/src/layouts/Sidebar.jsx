const menus = [
  'Dashboard',
  'Roadmaps',
  'Nodes',
  'Materials',
  'Quiz',
  'Analytics'
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="logo">EduPath</h1>

      <nav>
        {menus.map((item) => (
          <div className="menu-item" key={item}>
            {item}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar