import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';

import useLocales from '@/shared/hooks/useLocales';

import type { NatalChart, Planet } from '@/entities/Horoscope/types/chart';
import type { PlanetId, ZodiacSignId } from '@/entities/Horoscope/types';

import styles from './CelestialNatalOverview.module.css';

type HighlightKey = PlanetId | ZodiacSignId | `house_${number}`;

interface CelestialNatalOverviewProps {
  chart: NatalChart;
  highlightedBodies?: Partial<Record<HighlightKey, boolean>>;
  selectedPlanet?: PlanetId | null;
  onSelectPlanet?: (planet: PlanetId | null) => void;
}

const ZODIAC: Array<{ id: ZodiacSignId; glyph: string }> = [
  { id: 'aries', glyph: '♈' },
  { id: 'taurus', glyph: '♉' },
  { id: 'gemini', glyph: '♊' },
  { id: 'cancer', glyph: '♋' },
  { id: 'leo', glyph: '♌' },
  { id: 'virgo', glyph: '♍' },
  { id: 'libra', glyph: '♎' },
  { id: 'scorpio', glyph: '♏' },
  { id: 'sagittarius', glyph: '♐' },
  { id: 'capricorn', glyph: '♑' },
  { id: 'aquarius', glyph: '♒' },
  { id: 'pisces', glyph: '♓' },
];

const PLANET_LANES: Record<PlanetId, number> = {
  sun: 33,
  moon: 29,
  mercury: 36,
  venus: 31,
  mars: 35,
  jupiter: 28,
  saturn: 36,
  uranus: 31,
  neptune: 35,
  pluto: 28,
  north_node: 34,
  chiron: 30,
  lilith: 37,
};

const PLANET_SIZES: Partial<Record<PlanetId, number>> = {
  sun: 43,
  moon: 28,
  jupiter: 38,
  saturn: 42,
  uranus: 34,
  neptune: 30,
};

const PLANET_DEPTH: Record<PlanetId, { z: number; scale: number; opacity: number; blur: number }> = {
  sun: { z: 28, scale: 1.06, opacity: 1, blur: 0 },
  moon: { z: 25, scale: 1.04, opacity: 0.96, blur: 0 },
  mercury: { z: 22, scale: 1, opacity: 0.94, blur: 0 },
  venus: { z: 23, scale: 1.03, opacity: 0.96, blur: 0 },
  mars: { z: 20, scale: 1, opacity: 0.92, blur: 0.15 },
  jupiter: { z: 17, scale: 0.98, opacity: 0.9, blur: 0.25 },
  saturn: { z: 14, scale: 0.96, opacity: 0.86, blur: 0.4 },
  uranus: { z: 11, scale: 0.93, opacity: 0.8, blur: 0.55 },
  neptune: { z: 8, scale: 0.9, opacity: 0.75, blur: 0.7 },
  pluto: { z: 6, scale: 0.88, opacity: 0.72, blur: 0.8 },
  north_node: { z: 18, scale: 0.96, opacity: 0.88, blur: 0.2 },
  chiron: { z: 12, scale: 0.94, opacity: 0.82, blur: 0.45 },
  lilith: { z: 16, scale: 0.96, opacity: 0.86, blur: 0.3 },
};

const STAR_POINTS = Array.from({ length: 38 }, (_, index) => ({
  left: 5 + ((index * 37 + index * index * 3) % 90),
  top: 5 + ((index * 53 + index * index * 5) % 90),
  size: 0.7 + (index % 4) * 0.28,
  opacity: 0.42 + (index % 5) * 0.11,
}));

const normalize = (degree: number) => ((degree % 360) + 360) % 360;
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const positionAt = (degree: number, radius: number) => {
  const angle = ((180 - normalize(degree)) * Math.PI) / 180;

  return {
    left: `${50 + Math.cos(angle) * radius}%`,
    top: `${50 + Math.sin(angle) * radius}%`,
  };
};

const getPlanetStyle = (planet: Planet) => {
  const position = positionAt(planet.abs_pos, PLANET_LANES[planet.id]);
  const size = PLANET_SIZES[planet.id] ?? 24;
  const depth = PLANET_DEPTH[planet.id];

  return {
    '--planet-left': position.left,
    '--planet-top': position.top,
    '--planet-size': `${size}px`,
    '--planet-depth': `${depth.z}px`,
    '--planet-scale': depth.scale,
    '--planet-opacity': depth.opacity,
    '--planet-blur': `${depth.blur}px`,
  } as CSSProperties;
};

export const CelestialNatalOverview = (props: CelestialNatalOverviewProps) => {
  const { chart, highlightedBodies, selectedPlanet, onSelectPlanet } = props;
  const sceneRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const rotationRef = useRef({ x: 7, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    rotationX: number;
    rotationY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { i18n } = useLocales();

  const applyRotation = (x: number, y: number) => {
    const plane = planeRef.current;
    if (!plane) return;

    rotationRef.current = { x, y };

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      plane.style.setProperty('--rotation-x', `${x}deg`);
      plane.style.setProperty('--rotation-y', `${y}deg`);
      plane.style.setProperty('--counter-x', `${-x}deg`);
      plane.style.setProperty('--counter-y', `${-y}deg`);
      frameRef.current = null;
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const scene = sceneRef.current;
    if (!scene) return;

    scene.setPointerCapture(event.pointerId);
    scene.dataset.dragging = 'true';
    setHasInteracted(true);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rotationX: rotationRef.current.x,
      rotationY: rotationRef.current.y,
      moved: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) drag.moved = true;
    const nextX = clamp(drag.rotationX - deltaY * 0.18, -9, 20);
    const nextY = clamp(drag.rotationY + deltaX * 0.22, -25, 25);

    applyRotation(nextX, nextY);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const scene = sceneRef.current;
    const drag = dragRef.current;
    if (!scene || !drag || drag.pointerId !== event.pointerId) return;

    if (scene.hasPointerCapture(event.pointerId)) {
      scene.releasePointerCapture(event.pointerId);
    }

    delete scene.dataset.dragging;
    suppressClickRef.current = drag.moved;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
    dragRef.current = null;
  };

  const resetPerspective = () => {
    applyRotation(7, 0);
  };

  return (
    <div
      ref={sceneRef}
      className={styles.scene}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onDoubleClick={resetPerspective}
    >
      <div className={styles.nebula} />
      <div className={styles.stars} />
      <div className={styles.starDust} aria-hidden={"true"}>
        {STAR_POINTS.map((star, index) => (
          <span
            key={index}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div ref={planeRef} className={styles.plane}>
        <svg className={styles.guide} viewBox={"0 0 300 300"} aria-hidden={"true"}>
          <circle cx={"150"} cy={"150"} r={"125"} />
          <circle cx={"150"} cy={"150"} r={"96"} />

          {chart.houses.map((house) => {
            const angle = ((180 - normalize(house.abs_pos)) * Math.PI) / 180;
            const x1 = 150 + Math.cos(angle) * 96;
            const y1 = 150 + Math.sin(angle) * 96;
            const x2 = 150 + Math.cos(angle) * 122;
            const y2 = 150 + Math.sin(angle) * 122;

            return (
              <line
                key={house.house}
                className={highlightedBodies?.[`house_${house.house}`] ? styles.activeHouse : undefined}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
              />
            );
          })}
        </svg>

        {ZODIAC.map((sign, index) => {
          const position = positionAt(index * 30 + 15, 43);

          return (
            <span
              key={sign.id}
              className={`${styles.zodiac} ${highlightedBodies?.[sign.id] ? styles.activeZodiac : ''}`}
              style={{ left: position.left, top: position.top }}
            >
              {sign.glyph}
            </span>
          );
        })}

        <div className={styles.observer}>
          <span />
        </div>

        {chart.planets.map((planet) => (
          <div
            key={planet.id}
            className={`${styles.planet} ${highlightedBodies?.[planet.id] || selectedPlanet === planet.id ? styles.activePlanet : ''}`}
            style={getPlanetStyle(planet)}
            role={"button"}
            tabIndex={0}
            onClick={() => {
              if (!suppressClickRef.current) {
                onSelectPlanet?.(selectedPlanet === planet.id ? null : planet.id);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onSelectPlanet?.(selectedPlanet === planet.id ? null : planet.id);
              }
            }}
          >
            <span className={styles.planetGlow} />
            {planet.id === 'north_node' ? (
              <span className={styles.nodeGlyph} aria-label={planet.name}>☊</span>
            ) : (
              <img
                src={`/assets/images/horoscope/${planet.id}.png`}
                alt={planet.name}
                draggable={false}
              />
            )}
            {planet.retrograde && <small>R</small>}
          </div>
        ))}
      </div>

      <div className={styles.foregroundMist} />
      <div className={`${styles.interactionHint} ${hasInteracted ? styles.hiddenHint : ''}`}>
        <svg viewBox={"0 0 36 36"} aria-hidden={"true"}>
          <path d={"M7 18h22M7 18l4-4M7 18l4 4M29 18l-4-4M29 18l-4 4"} />
          <path d={"M18 7v22M18 7l-4 4M18 7l4 4M18 29l-4-4M18 29l4-4"} />
          <circle cx={"18"} cy={"18"} r={"4"} />
        </svg>
        <span>{i18n('Drag to rotate')}</span>
      </div>
      <button
        type={"button"}
        className={styles.resetView}
        aria-label={i18n('Reset chart view')}
        title={i18n('Reset chart view')}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={resetPerspective}
      >
        ↺
      </button>
    </div>
  );
};

export default CelestialNatalOverview;
