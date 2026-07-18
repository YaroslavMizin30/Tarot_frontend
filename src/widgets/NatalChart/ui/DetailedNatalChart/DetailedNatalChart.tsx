import useLocales from '@/shared/hooks/useLocales';

import type {
  Aspect,
  NatalChart,
  Planet,
} from '@/entities/Horoscope/types/chart';
import type { BodyId, PlanetId, ZodiacSignId } from '@/entities/Horoscope/types';
import type { PersonalTransit } from '@/entities/Horoscope/types/transit';

import { getNatalAspectKey, getNatalAspectType } from '../../lib/aspects';

import styles from './DetailedNatalChart.module.css';

type HighlightKey = PlanetId | ZodiacSignId | `house_${number}`;

interface DetailedNatalChartProps {
  chart: NatalChart;
  highlightedBodies?: Partial<Record<HighlightKey, boolean>>;
  selectedPlanet?: PlanetId | null;
  onSelectPlanet?: (planet: PlanetId | null) => void;
  selectedAspectKey?: string | null;
  onSelectAspect?: (aspectKey: string | null) => void;
  selectedTransit?: PersonalTransit | null;
}

const PLANET_GLYPHS: Record<PlanetId, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  north_node: '☊',
  chiron: '⚷',
  lilith: '⚸',
};

const TRANSIT_GLYPHS: Record<BodyId, string> = {
  ...PLANET_GLYPHS,
  south_node: '☋',
};

const ZODIAC: Array<{ id: ZodiacSignId; name: string; glyph: string }> = [
  { id: 'aries', name: 'Aries', glyph: '♈' },
  { id: 'taurus', name: 'Taurus', glyph: '♉' },
  { id: 'gemini', name: 'Gemini', glyph: '♊' },
  { id: 'cancer', name: 'Cancer', glyph: '♋' },
  { id: 'leo', name: 'Leo', glyph: '♌' },
  { id: 'virgo', name: 'Virgo', glyph: '♍' },
  { id: 'libra', name: 'Libra', glyph: '♎' },
  { id: 'scorpio', name: 'Scorpio', glyph: '♏' },
  { id: 'sagittarius', name: 'Sagittarius', glyph: '♐' },
  { id: 'capricorn', name: 'Capricorn', glyph: '♑' },
  { id: 'aquarius', name: 'Aquarius', glyph: '♒' },
  { id: 'pisces', name: 'Pisces', glyph: '♓' },
];

const ASPECT_CLASS: Record<Aspect['type'], string> = {
  conjunction: styles.conjunction,
  opposition: styles.hard,
  square: styles.hard,
  trine: styles.soft,
  sextile: styles.soft,
  quincunx: styles.adjustment,
  semisextile: styles.adjustment,
};

const normalize = (degree: number) => ((degree % 360) + 360) % 360;

const pointAt = (degree: number, radius: number, ascendant: number) => {
  const angle = ((180 - normalize(degree - ascendant)) * Math.PI) / 180;

  return {
    x: 180 + Math.cos(angle) * radius,
    y: 180 + Math.sin(angle) * radius,
  };
};

const formatDegree = (value: number) => `${Math.floor(value)}°${String(Math.round((value % 1) * 60)).padStart(2, '0')}′`;

export const DetailedNatalChart = (props: DetailedNatalChartProps) => {
  const {
    chart,
    highlightedBodies,
    selectedPlanet,
    onSelectPlanet,
    selectedAspectKey,
    onSelectAspect,
    selectedTransit,
  } = props;
  const { i18n } = useLocales();
  const ascendant = chart.angles.asc;
  const planetsById = new Map(chart.planets.map((planet) => [planet.id, planet]));
  const ascPoint = pointAt(chart.angles.asc, 145, ascendant);
  const dcPoint = pointAt(chart.angles.dc, 145, ascendant);
  const mcPoint = pointAt(chart.angles.mc, 145, ascendant);
  const icPoint = pointAt(chart.angles.ic, 145, ascendant);
  const vertexInnerPoint = pointAt(chart.angles.vertex, 112, ascendant);
  const vertexOuterPoint = pointAt(chart.angles.vertex, 145, ascendant);

  const isPlanetActive = (planet: Planet) =>
    selectedPlanet === planet.id || Boolean(highlightedBodies?.[planet.id]);

  const isAspectActive = (aspect: Aspect) => {
    const aspectKey = getNatalAspectKey(aspect);

    if (selectedTransit) return false;
    if (selectedAspectKey) return selectedAspectKey === aspectKey;

    return !selectedPlanet || aspect.p1 === selectedPlanet || aspect.p2 === selectedPlanet;
  };

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.chart}
        viewBox={"0 0 360 360"}
        role={"img"}
        aria-label={i18n('Detailed natal chart')}
      >
        <circle className={styles.outerRing} cx={"180"} cy={"180"} r={"174"} />
        <circle className={styles.zodiacRing} cx={"180"} cy={"180"} r={"145"} />
        <circle className={styles.houseRing} cx={"180"} cy={"180"} r={"112"} />

        {ZODIAC.map((sign, index) => {
          const boundary = pointAt(index * 30, 174, ascendant);
          const inner = pointAt(index * 30, 145, ascendant);
          const label = pointAt(index * 30 + 15, 159, ascendant);
          const active = highlightedBodies?.[sign.id];

          return (
            <g key={sign.id} className={active ? styles.activeSign : undefined}>
              <line className={styles.zodiacDivider} x1={inner.x} y1={inner.y} x2={boundary.x} y2={boundary.y} />
              <text className={styles.zodiacGlyph} x={label.x} y={label.y} textAnchor={"middle"} dominantBaseline={"central"}>
                {sign.glyph}
              </text>
              <title>{i18n(sign.name)}</title>
            </g>
          );
        })}

        {chart.houses.map((house) => {
          const nextHouse = chart.houses[house.house % chart.houses.length];
          const houseSpan = normalize(nextHouse.abs_pos - house.abs_pos);
          const outer = pointAt(house.abs_pos, 145, ascendant);
          const inner = pointAt(house.abs_pos, 112, ascendant);
          const label = pointAt(house.abs_pos + houseSpan / 2, 126, ascendant);
          const active = highlightedBodies?.[`house_${house.house}`];

          return (
            <g key={house.house} className={active ? styles.activeHouse : undefined}>
              <line className={styles.houseLine} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} />
              <text className={styles.houseNumber} x={label.x} y={label.y} textAnchor={"middle"} dominantBaseline={"central"}>
                {house.house}
              </text>
            </g>
          );
        })}

        {chart.aspects.map((aspect) => {
          const first = planetsById.get(aspect.p1);
          const second = planetsById.get(aspect.p2);
          if (!first || !second) return null;
          const from = pointAt(first.abs_pos, 91, ascendant);
          const to = pointAt(second.abs_pos, 91, ascendant);

          const aspectKey = getNatalAspectKey(aspect);
          const aspectType = getNatalAspectType(aspect);
          const active = isAspectActive(aspect);
          const firstPlanetPoint = pointAt(first.abs_pos, 102, ascendant);
          const secondPlanetPoint = pointAt(second.abs_pos, 102, ascendant);

          return (
            <g
              key={aspectKey}
              className={styles.aspectGroup}
              onClick={() => {
                onSelectPlanet?.(aspect.p1);
                onSelectAspect?.(selectedAspectKey === aspectKey ? null : aspectKey);
              }}
            >
              <line
                className={styles.aspectHitArea}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              />
              <line
                className={`${styles.aspect} ${ASPECT_CLASS[aspectType]} ${aspect.is_major ? '' : styles.minorAspect} ${active ? styles.activeAspect : styles.muted}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              >
                <title>{`${aspect.type} · ${formatDegree(aspect.orb)}`}</title>
              </line>
              {aspectType === 'conjunction' && (
                <g className={`${styles.conjunctionMarkers} ${active ? styles.activeAspect : styles.muted}`}>
                  <circle cx={firstPlanetPoint.x} cy={firstPlanetPoint.y} r={'14'} />
                  <circle cx={secondPlanetPoint.x} cy={secondPlanetPoint.y} r={'14'} />
                  <circle
                    className={styles.conjunctionCore}
                    cx={(firstPlanetPoint.x + secondPlanetPoint.x) / 2}
                    cy={(firstPlanetPoint.y + secondPlanetPoint.y) / 2}
                    r={'3'}
                  />
                </g>
              )}
            </g>
          );
        })}

        {selectedTransit && (() => {
          const isConjunction = selectedTransit.aspect === 'conjunction';
          const from = pointAt(
            selectedTransit.transitPosition,
            isConjunction ? 70 : 91,
            ascendant,
          );
          const to = pointAt(selectedTransit.natalTargetPosition, 102, ascendant);
          const transitClass = ASPECT_CLASS[selectedTransit.aspect];

          return (
            <g className={styles.selectedTransit}>
              <line
                className={`${styles.transitLine} ${transitClass}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              />
              <circle className={styles.transitSourceHalo} cx={from.x} cy={from.y} r={'13'} />
              <circle className={styles.transitSource} cx={from.x} cy={from.y} r={'9'} />
              <text
                className={styles.transitGlyph}
                x={from.x}
                y={from.y}
                textAnchor={'middle'}
                dominantBaseline={'central'}
              >
                {TRANSIT_GLYPHS[selectedTransit.transitBody]}
              </text>
              <circle className={styles.transitTarget} cx={to.x} cy={to.y} r={'14'} />
              {isConjunction && (
                <circle className={styles.transitConjunctionPulse} cx={to.x} cy={to.y} r={'19'} />
              )}
            </g>
          );
        })()}

        <g className={styles.angleAxes}>
          <line
            className={`${styles.angleAxis} ${styles.ascendantAxis}`}
            x1={ascPoint.x}
            y1={ascPoint.y}
            x2={dcPoint.x}
            y2={dcPoint.y}
          >
            <title>ASC — DC</title>
          </line>
          <line
            className={`${styles.angleAxis} ${styles.meridianAxis}`}
            x1={mcPoint.x}
            y1={mcPoint.y}
            x2={icPoint.x}
            y2={icPoint.y}
          >
            <title>MC — IC</title>
          </line>
          <line
            className={`${styles.angleAxis} ${styles.vertexAxis}`}
            x1={vertexInnerPoint.x}
            y1={vertexInnerPoint.y}
            x2={vertexOuterPoint.x}
            y2={vertexOuterPoint.y}
          >
            <title>{i18n('Vertex')}</title>
          </line>
        </g>

        {chart.planets.map((planet) => {
          const point = pointAt(planet.abs_pos, 102, ascendant);
          const active = isPlanetActive(planet);

          return (
            <g
              key={planet.id}
              className={`${styles.planet} ${active ? styles.activePlanet : ''}`}
              transform={`translate(${point.x} ${point.y})`}
              onClick={() => onSelectPlanet?.(selectedPlanet === planet.id ? null : planet.id)}
              role={"button"}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  onSelectPlanet?.(selectedPlanet === planet.id ? null : planet.id);
                }
              }}
            >
              <circle r={"11"} />
              <text textAnchor={"middle"} dominantBaseline={"central"}>{PLANET_GLYPHS[planet.id]}</text>
              {planet.retrograde && <text className={styles.retrograde} x={"8"} y={"-8"}>R</text>}
              <title>{`${i18n(planet.name)} · ${i18n(ZODIAC.find((sign) => sign.id === planet.sign_id)?.name ?? planet.sign_id)} ${formatDegree(planet.pos)} · ${i18n('House')} ${planet.house}`}</title>
            </g>
          );
        })}

        {(['asc', 'mc', 'dc', 'ic'] as const).map((angle) => {
          const point = pointAt(chart.angles[angle], 132, ascendant);
          return (
            <text key={angle} className={styles.angleLabel} x={point.x} y={point.y} textAnchor={"middle"} dominantBaseline={"central"}>
              {angle.toUpperCase()}
            </text>
          );
        })}
      </svg>

    </div>
  );
};

export default DetailedNatalChart;
