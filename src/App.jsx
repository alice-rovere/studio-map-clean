import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { initialEdges, initialNodes } from './data/schemaNodi.js'

const nodes = initialNodes
const edges = initialEdges

function App() {
  return (
    <main className="studio-map h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </main>
  )
}

export default App
