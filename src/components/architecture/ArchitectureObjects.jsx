import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
} from "three";
import { Edges, Float, Line, RoundedBox } from "@react-three/drei";

const TOOL_ACCENT = "#ff89a7";
const LABEL_FONT_STACK =
  '"Cascadia Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace';

function parseHexColor(hex) {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  const numeric = Number.parseInt(normalized, 16);

  if (Number.isNaN(numeric)) return { r: 255, g: 255, b: 255 };

  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = parseHexColor(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixWithWhite(hex, amount) {
  const { r, g, b } = parseHexColor(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function measureSpacedText(ctx, text, spacing) {
  let width = 0;

  for (const char of text) width += ctx.measureText(char).width;

  return width + Math.max(0, [...text].length - 1) * spacing;
}

function drawSpacedText(ctx, text, centerX, y, spacing) {
  const chars = [...text];
  let x = centerX - measureSpacedText(ctx, text, spacing) / 2;
  const previousAlign = ctx.textAlign;
  ctx.textAlign = "left";

  for (const char of chars) {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + spacing;
  }

  ctx.textAlign = previousAlign;
}

function createLabelTexture(text, color, flow, maxAnisotropy) {
  const fontSize = flow ? 20 : 22;
  const letterSpacing = flow ? 0.5 : 1.6;
  const paddingX = flow ? 14 : 16;
  const paddingY = flow ? 8 : 9;
  const label = flow ? text : text.toUpperCase();
  const font = `${flow ? 600 : 700} ${fontSize}px ${LABEL_FONT_STACK}`;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.font = font;
  const width = Math.ceil(measureSpacedText(ctx, label, letterSpacing) + paddingX * 2);
  const height = Math.ceil(fontSize + paddingY * 2);
  const pixelRatio = 3;

  canvas.width = Math.max(1, Math.ceil(width * pixelRatio));
  canvas.height = Math.max(1, Math.ceil(height * pixelRatio));
  ctx.scale(pixelRatio, pixelRatio);
  ctx.font = font;

  roundedRectPath(ctx, 1.5, 1.5, width - 3, height - 3, flow ? 5 : 6);
  ctx.fillStyle = "rgba(11, 17, 32, 0.82)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = rgba(color, flow ? 0.34 : 0.52);
  ctx.stroke();

  ctx.textBaseline = "middle";
  ctx.fillStyle = flow ? "#b9c5d6" : mixWithWhite(color, 0.2);
  drawSpacedText(ctx, label, width / 2, height / 2 + 1, letterSpacing);

  const texture = new CanvasTexture(canvas);
  texture.anisotropy = Math.min(8, maxAnisotropy);
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;

  return { texture, aspect: width / height };
}

function useLabelTexture(text, color, flow) {
  const gl = useThree((state) => state.gl);
  const maxAnisotropy = gl.capabilities?.getMaxAnisotropy?.() ?? 1;
  const label = useMemo(
    () => createLabelTexture(text, color, flow, maxAnisotropy),
    [color, flow, maxAnisotropy, text],
  );

  useEffect(() => {
    if (!label) return undefined;

    return () => label.texture.dispose();
  }, [label]);

  return label;
}

export function SceneLabel({
  color,
  flow = false,
  height,
  opacity = 1,
  text,
  ...props
}) {
  const label = useLabelTexture(text, color, flow);

  if (!label) return null;

  const labelHeight = height ?? (flow ? 0.24 : 0.3);

  return (
    <sprite
      {...props}
      renderOrder={30}
      scale={[label.aspect * labelHeight, labelHeight, 1]}
      visible={opacity > 0}
    >
      <spriteMaterial
        depthTest={false}
        depthWrite={false}
        fog={false}
        map={label.texture}
        opacity={opacity}
        toneMapped={false}
        transparent
      />
    </sprite>
  );
}

function FrontendDecor({ accent }) {
  const panels = [
    { x: -1.32, y: 0.5, z: 0.15, rotation: 0.2 },
    { x: 0, y: 0.7, z: 0, rotation: 0 },
    { x: 1.32, y: 0.5, z: 0.15, rotation: -0.2 },
  ];

  return (
    <group>
      {panels.map((panel, index) => (
        <group
          key={index}
          position={[panel.x, panel.y, panel.z]}
          rotation={[-0.34, panel.rotation, 0]}
        >
          <RoundedBox args={[1.05, 0.7, 0.045]} radius={0.045} smoothness={3}>
            <meshPhysicalMaterial
              color={accent}
              depthWrite={false}
              emissive={accent}
              emissiveIntensity={0.2}
              metalness={0.25}
              opacity={0.2}
              roughness={0.18}
              transparent
            />
            <Edges
              color={accent}
              linewidth={0.8}
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
              threshold={20}
            />
          </RoundedBox>
          <mesh position={[-0.2, 0.16, 0.04]}>
            <planeGeometry args={[0.48, 0.035]} />
            <meshBasicMaterial color={accent} opacity={0.85} transparent />
          </mesh>
          <mesh position={[-0.1, 0.04, 0.04]}>
            <planeGeometry args={[0.68, 0.03]} />
            <meshBasicMaterial color={accent} opacity={0.4} transparent />
          </mesh>
          <mesh position={[0.1, -0.13, 0.04]}>
            <planeGeometry args={[0.48, 0.07]} />
            <meshBasicMaterial color={accent} opacity={0.22} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BackendDecor({ accent, active, paused }) {
  const coreRef = useRef();
  const shellRef = useRef();
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (paused) return;
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.45;
    if (shellRef.current) {
      shellRef.current.rotation.x += delta * 0.13;
      shellRef.current.rotation.y -= delta * 0.18;
    }
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.22;
  });

  return (
    <group position={[0, 0.62, 0]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.46, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={active ? 0.95 : 0.55}
          flatShading
          metalness={0.45}
          roughness={0.18}
        />
      </mesh>
      <mesh ref={shellRef} scale={1.65}>
        <icosahedronGeometry args={[0.46, 1]} />
        <meshBasicMaterial
          color={accent}
          depthWrite={false}
          opacity={active ? 0.6 : 0.3}
          transparent
          wireframe
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.012, 8, 72]} />
        <meshBasicMaterial color={accent} opacity={0.55} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[0.72, 0.008, 8, 64]} />
        <meshBasicMaterial color={accent} opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

function DatabaseDecor({ accent, active, paused }) {
  const matrixRef = useRef();
  const cubes = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        x: ((index % 3) - 1) * 0.55,
        z: (Math.floor(index / 3) - 1) * 0.55,
      })),
    [],
  );

  useFrame((state) => {
    if (paused || !matrixRef.current) return;
    matrixRef.current.children.forEach((cube, index) => {
      cube.position.y =
        Math.sin(state.clock.elapsedTime * 1.2 + index * 0.55) * 0.035;
    });
  });

  return (
    <group ref={matrixRef} position={[0, 0.3, 0]}>
      {cubes.map((cube, index) => (
        <mesh key={index} position={[cube.x, 0, cube.z]}>
          <boxGeometry args={[0.36, 0.36, 0.36]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={active ? 0.6 : 0.28}
            metalness={0.35}
            roughness={0.28}
          />
          <Edges
            color={accent}
            linewidth={0.6}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
            threshold={15}
          />
        </mesh>
      ))}
    </group>
  );
}

export function LevelPlatform({
  layer,
  y,
  active,
  dimmed,
  hovered,
  paused,
  handlers,
}) {
  const highlighted = active || hovered;
  const opacity = dimmed ? 0.05 : highlighted ? 0.34 : 0.16;

  return (
    <group position={[0, y, 0]} {...handlers}>
      <RoundedBox args={[4.9, 0.16, 2.9]} radius={0.09} smoothness={4}>
        <meshPhysicalMaterial
          color={layer.accent}
          depthWrite={false}
          emissive={layer.accent}
          emissiveIntensity={dimmed ? 0.04 : highlighted ? 0.55 : 0.22}
          metalness={0.35}
          opacity={opacity}
          roughness={0.2}
          transparent
        />
        <Edges
          color={layer.accent}
          linewidth={1}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
          threshold={20}
        />
      </RoundedBox>
      {layer.id === "frontend" && <FrontendDecor accent={layer.accent} />}
      {layer.id === "backend" && (
        <BackendDecor accent={layer.accent} active={highlighted} paused={paused} />
      )}
      {layer.id === "database" && (
        <DatabaseDecor
          accent={layer.accent}
          active={highlighted}
          paused={paused}
        />
      )}
    </group>
  );
}

export function DevOpsCage({
  category,
  active,
  dimmed,
  hovered,
  handlers,
}) {
  const frames = useMemo(() => {
    const corners = [
      [-2.85, -1.75],
      [2.85, -1.75],
      [2.85, 1.75],
      [-2.85, 1.75],
      [-2.85, -1.75],
    ];
    return [-3.08, 0, 3.08].map((frameY) =>
      corners.map(([x, z]) => [x, frameY, z]),
    );
  }, []);
  const rails = [
    [-2.85, -1.75],
    [2.85, -1.75],
    [2.85, 1.75],
    [-2.85, 1.75],
  ];
  const highlighted = active || hovered;
  const railOpacity = dimmed ? 0.06 : highlighted ? 0.9 : 0.35;

  return (
    <group {...handlers}>
      {frames.map((points, index) => (
        <Line
          key={index}
          color={category.accent}
          dashed={index === 1}
          dashSize={0.16}
          gapSize={0.12}
          lineWidth={index === 1 ? 0.8 : 1.3}
          opacity={dimmed ? 0.08 : highlighted ? 0.7 : 0.3}
          points={points}
          transparent
        />
      ))}
      {rails.map(([x, z], index) => (
        <group key={index}>
          <mesh position={[x, 0, z]}>
            <cylinderGeometry args={[0.028, 0.028, 6.16, 6]} />
            <meshBasicMaterial
              color={category.accent}
              opacity={railOpacity}
              transparent
            />
          </mesh>
          <mesh position={[x, 0, z]}>
            <cylinderGeometry args={[0.17, 0.17, 6.16, 6]} />
            <meshBasicMaterial
              depthWrite={false}
              opacity={0}
              transparent
            />
          </mesh>
          <mesh position={[x, 3.08, z]} rotation={[0.4, 0.2, 0]}>
            <octahedronGeometry args={[0.085, 0]} />
            <meshStandardMaterial
              color={category.accent}
              emissive={category.accent}
              emissiveIntensity={highlighted ? 0.9 : 0.4}
              metalness={0.3}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function DevOpsNodeLabel({
  item,
  active,
  dimmed,
  hovered,
  onHover,
  onLeave,
  onSelect,
}) {
  const highlighted = active || hovered;
  const label = useLabelTexture(item.label, item.accent, false);
  const labelHeight = highlighted ? 0.26 : 0.24;

  return (
    <group position={item.position}>
      <mesh scale={highlighted ? 1.5 : 1}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshBasicMaterial
          color={item.accent}
          opacity={dimmed ? 0.16 : highlighted ? 1 : 0.55}
          transparent
        />
      </mesh>
      {label && (
        <sprite
          onClick={(event) => {
            event.stopPropagation();
            onSelect(item);
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            onLeave();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover(item);
          }}
          position={[0, 0.2, 0]}
          renderOrder={31}
          scale={[label.aspect * labelHeight, labelHeight, 1]}
        >
          <spriteMaterial
            depthTest={false}
            depthWrite={false}
            fog={false}
            map={label.texture}
            opacity={dimmed ? 0.32 : highlighted ? 1 : 0.82}
            toneMapped={false}
            transparent
          />
        </sprite>
      )}
    </group>
  );
}

function ToolGeometry({ shape }) {
  switch (shape) {
    case "box":
      return <boxGeometry args={[0.42, 0.42, 0.42]} />;
    case "tetrahedron":
      return <tetrahedronGeometry args={[0.32, 0]} />;
    case "torusKnot":
      return <torusKnotGeometry args={[0.22, 0.07, 72, 12]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[0.3, 0]} />;
    case "icosahedron":
      return <icosahedronGeometry args={[0.3, 0]} />;
    default:
      return <octahedronGeometry args={[0.32, 0]} />;
  }
}

export function ToolSatellite({
  tool,
  active,
  dimmed,
  hovered,
  paused,
  handlers,
}) {
  const highlighted = active || hovered;
  const opacity = dimmed ? 0.2 : 1;
  const accent = tool.accent ?? TOOL_ACCENT;

  return (
    <Float
      floatIntensity={paused ? 0 : 0.55}
      rotationIntensity={paused ? 0 : 0.6}
      speed={paused ? 0 : 1.4}
    >
      <group
        position={tool.position}
        scale={highlighted ? 1.12 : 1}
        {...handlers}
      >
        <mesh>
          <ToolGeometry shape={tool.shape} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={highlighted ? 0.9 : 0.4}
            metalness={0.35}
            opacity={opacity}
            roughness={0.25}
            transparent
          />
        </mesh>
        <mesh scale={1.35}>
          <ToolGeometry shape={tool.shape} />
          <meshBasicMaterial
            color={accent}
            depthWrite={false}
            opacity={dimmed ? 0.06 : highlighted ? 0.45 : 0.18}
            transparent
            wireframe
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.62, 12, 12]} />
          <meshBasicMaterial colorWrite={false} depthWrite={false} transparent />
        </mesh>
        {hovered && (
          <SceneLabel color={accent} position={[0, 0.58, 0]} text={tool.label} />
        )}
      </group>
    </Float>
  );
}

export function FlowColumn({ flow, paused }) {
  const dotsRef = useRef();
  const dots = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        offset: index / 7,
      })),
    [],
  );
  const height = Math.abs(flow.from - flow.to);

  useFrame((state) => {
    if (paused || !dotsRef.current) return;
    dotsRef.current.children.forEach((dot, index) => {
      const progress =
        (state.clock.elapsedTime * flow.speed + dots[index].offset) % 1;
      dot.position.y = flow.from + (flow.to - flow.from) * progress;
      dot.material.opacity = 0.25 + Math.sin(progress * Math.PI) * 0.65;
    });
  });

  return (
    <group position={[flow.x, 0, flow.z]}>
      <mesh position={[0, (flow.from + flow.to) / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, height, 8, 1, true]} />
        <meshBasicMaterial color={flow.color} opacity={0.28} transparent />
      </mesh>
      <mesh position={[0, (flow.from + flow.to) / 2, 0]}>
        <cylinderGeometry args={[0.075, 0.075, height, 8, 1, true]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={flow.color}
          depthWrite={false}
          opacity={0.06}
          transparent
        />
      </mesh>
      <group ref={dotsRef}>
        {dots.map((dot, index) => (
          <mesh
            key={index}
            position={[0, flow.from + (flow.to - flow.from) * dot.offset, 0]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              blending={AdditiveBlending}
              color={flow.color}
              depthWrite={false}
              opacity={0.8}
              transparent
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
