import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import {
  ARCHITECTURE_CATEGORIES,
  ARCHITECTURE_FLOWS,
  ARCHITECTURE_LAYERS,
  ARCHITECTURE_TOOLS,
} from "../lib/architectureLayers.js";
import {
  DevOpsCage,
  FlowColumn,
  LevelPlatform,
  SceneLabel,
  ToolSatellite,
} from "./architecture/ArchitectureObjects.jsx";

const LEVEL_Y = {
  frontend: 2.15,
  backend: 0,
  database: -2.15,
};

const devopsCategory = ARCHITECTURE_CATEGORIES.find(
  (category) => category.id === "devops",
);
const toolsCategory = ARCHITECTURE_CATEGORIES.find(
  (category) => category.id === "tools",
);

const toolItems = ARCHITECTURE_TOOLS.map((tool) => ({
  ...tool,
  category: toolsCategory.id,
  tagline: toolsCategory.tagline,
  accent: toolsCategory.accent,
}));

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const isNarrow = size.width / size.height < 0.8;
    camera.position.set(
      isNarrow ? 9.4 : 7.6,
      isNarrow ? 6.1 : 5,
      isNarrow ? 12.2 : 9.8,
    );
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}

export default function ArchitectureScene({
  activeCategory,
  hoveredId,
  onHoverItem,
  onLeaveItem,
  onSelectCategory,
  reducedMotion,
}) {
  function getHandlers(item, categoryId) {
    return {
      onClick: (event) => {
        event.stopPropagation();
        onSelectCategory(categoryId);
      },
      onPointerOut: (event) => {
        event.stopPropagation();
        onLeaveItem();
      },
      onPointerOver: (event) => {
        event.stopPropagation();
        onHoverItem(item);
      },
    };
  }

  return (
    <Canvas
      camera={{ far: 60, fov: 38, near: 0.1, position: [7.6, 5, 9.8] }}
      dpr={[1, 1.75]}
      fallback={
        <div className="architecture-scene-fallback">
          WebGL non è disponibile. Puoi comunque filtrare la mappa dai livelli
          qui sotto.
        </div>
      }
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ height: "100%", width: "100%" }}
    >
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#a9c9ff", "#0b1120", 0.65]} />
      <directionalLight
        color="#dce9ff"
        intensity={1.8}
        position={[4, 7, 6]}
      />
      <pointLight
        color="#7ab8ff"
        distance={9}
        intensity={22}
        position={[0, 4, 2]}
      />
      <pointLight
        color="#c49aff"
        distance={8}
        intensity={14}
        position={[0, 0, 3]}
      />
      <pointLight
        color="#64d9bd"
        distance={9}
        intensity={18}
        position={[0, -3.4, 2]}
      />

      <group position={[0, -0.1, 0]}>
        {ARCHITECTURE_LAYERS.map((layer) => {
          const y = LEVEL_Y[layer.id];
          return (
            <LevelPlatform
              key={layer.id}
              active={activeCategory === layer.id}
              dimmed={Boolean(activeCategory && activeCategory !== layer.id)}
              handlers={getHandlers(layer, layer.id)}
              hovered={hoveredId === layer.id}
              layer={layer}
              paused={reducedMotion}
              y={y}
            />
          );
        })}

        <DevOpsCage
          active={activeCategory === devopsCategory.id}
          category={devopsCategory}
          dimmed={Boolean(
            activeCategory && activeCategory !== devopsCategory.id,
          )}
          handlers={getHandlers(devopsCategory, devopsCategory.id)}
          hovered={hoveredId === devopsCategory.id}
        />

        {ARCHITECTURE_FLOWS.map((flow) => (
          <FlowColumn key={flow.id} flow={flow} paused={reducedMotion} />
        ))}

        {toolItems.map((tool) => (
          <ToolSatellite
            key={tool.id}
            active={activeCategory === tool.category}
            dimmed={Boolean(activeCategory && activeCategory !== tool.category)}
            handlers={getHandlers(tool, tool.category)}
            hovered={hoveredId === tool.id}
            paused={reducedMotion}
            tool={tool}
          />
        ))}

        <Html
          position={[0, 0, 0]}
          style={{ display: "none" }}
          zIndexRange={[0, 0]}
        />
        {ARCHITECTURE_LAYERS.map((layer) => (
          <SceneLabel
            color={layer.accent}
            key={`label-${layer.id}`}
            position={[-2.2, LEVEL_Y[layer.id] + 0.48, 1.18]}
            text={layer.label}
          />
        ))}

        {ARCHITECTURE_FLOWS.map((flow) => (
          <SceneLabel
            color={flow.color}
            flow
            key={`flow-label-${flow.id}`}
            position={[
              flow.x + flow.labelOffset[0],
              (flow.from + flow.to) / 2,
              flow.z + flow.labelOffset[1],
            ]}
            text={flow.label}
          />
        ))}
      </group>

      <ResponsiveCamera />
      <OrbitControls
        dampingFactor={0.08}
        enableDamping
        enablePan={false}
        maxDistance={20}
        maxPolarAngle={2.22}
        minDistance={6.5}
        minPolarAngle={0.55}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
