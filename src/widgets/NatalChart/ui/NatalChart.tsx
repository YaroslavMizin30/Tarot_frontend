import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';

import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';
import Price from '@/shared/ui/Price';
import Zodiac, { type Sign } from '@/shared/ui/Zodiac';

import useLocales from '@/shared/hooks/useLocales';
import TRANSLATIONS_EN from '@/shared/locales/en/natalchart';
import TRANSLATIONS_RU from '@/shared/locales/ru/natalchart';
import { compareObjects } from '@/shared/utils/compareObjects';

import { COUNTRIES } from '@/pages/Registry/config/countries';
import { YEARS, MONTHS, getDaysInMonth } from '@/pages/Registry/config/date';
import { useUpdateNatalChart } from '../model/useNatalChart/useNatalChart';

import Accordion from './Accordion/Accordion';
import DetailedNatalChart from './DetailedNatalChart/DetailedNatalChart';
import CelestialNatalOverview from './CelestialNatalOverview/CelestialNatalOverview';
import {
  getNatalAspectKey,
  getNatalAspectType,
  normalizeNatalAspectType,
} from '../lib/aspects';

import type { PlanetId, ZodiacSignId } from '@/entities/Horoscope/types';

import type { NatalChartProps } from './NatalChart.props';

import styles from './NatalChart.module.css';
export interface NatalChartEditValues {
  name: string;
  country: string;
  city: string;
  day: string;
  month: string;
  year: string;
  hour?: string;
  minute?: string;
  timeKnown: boolean;
}

const parseBirthDate = (
  birthDate: string,
): { day: string; month: string; year: string } => {
  const parts = birthDate.split('.');

  return {
    day: parts[0] ?? '',
    month: parts[1] ?? '',
    year: parts[2] ?? '',
  };
};

const parseBirthPlace = (
  birthPlace: string,
): { country: string; city: string } => {
  const [country, ...rest] = birthPlace.split(',');

  return {
    country: country?.trim() ?? '',
    city: rest.join(',').trim(),
  };
};

const parseBirthTime = (time?: string) => {
  if (!time) {
    return {};
  }

  const [hour, minute] = time.split(':');

  return { hour, minute };
};

const getZodiacTranslationKey = (sign: string) =>
  `${sign.charAt(0).toUpperCase()}${sign.slice(1)}`;

const ZODIAC_METADATA: Record<
  ZodiacSignId,
  { ruler: PlanetId; element: 'Fire' | 'Earth' | 'Air' | 'Water' }
> = {
  aries: { ruler: 'mars', element: 'Fire' },
  taurus: { ruler: 'venus', element: 'Earth' },
  gemini: { ruler: 'mercury', element: 'Air' },
  cancer: { ruler: 'moon', element: 'Water' },
  leo: { ruler: 'sun', element: 'Fire' },
  virgo: { ruler: 'mercury', element: 'Earth' },
  libra: { ruler: 'venus', element: 'Air' },
  scorpio: { ruler: 'pluto', element: 'Water' },
  sagittarius: { ruler: 'jupiter', element: 'Fire' },
  capricorn: { ruler: 'saturn', element: 'Earth' },
  aquarius: { ruler: 'uranus', element: 'Air' },
  pisces: { ruler: 'neptune', element: 'Water' },
};

const getFirstSentence = (value?: string) => {
  if (!value) return '';

  const sentence = value.match(/^.*?[.!?](?:\s|$)/)?.[0] ?? value;

  return sentence.trim();
};

export const NatalChart = (props: NatalChartProps) => {
  const { user, className = '', onBack } = props;

  const { i18n, addTranslations, locale } = useLocales();

  const { updateNatalChart, isLoading: isUpdating } = useUpdateNatalChart();

  const [isEditing, setIsEditing] = useState(false);
  const [chartMode, setChartMode] = useState<'overview' | 'detailed'>('overview');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId | null>(null);
  const [selectedAspectKey, setSelectedAspectKey] = useState<string | null>(null);
  const [selectedPlacementType, setSelectedPlacementType] =
    useState<'sign' | 'house'>('sign');

  const initialValues = (() => {
    const { day, month, year } = parseBirthDate(user.birthDate);
    const { country, city } = parseBirthPlace(user.birthPlace);
    const { hour, minute } = parseBirthTime(user?.birthTime);

    return {
      name: user.userName,
      country,
      city,
      day,
      month,
      year,
      hour,
      minute,
      timeKnown: true,
    };
  })();

  const [editValues, setEditValues] =
    useState<NatalChartEditValues>(initialValues);

  const { isEqual } = compareObjects(initialValues, editValues);

  const [error, setError] = useState('');

  useEffect(() => {
    addTranslations({ en: TRANSLATIONS_EN, ru: TRANSLATIONS_RU });
  }, [locale]);

  const translatedCountries = useMemo(() => {
    return COUNTRIES.map(({ value, label }) => {
      return { value, label: i18n(label) };
    });
  }, [locale, i18n]);

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleFieldChange = <K extends keyof NatalChartEditValues>(
    field: K,
    value: NatalChartEditValues[K],
  ) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (value: string) => {
    const [minute, hour] = value.split(':');

    setEditValues((prev) => ({ ...prev, minute, hour }));
  };

  const handleChangeButtonClick = () => {
    setIsEditing(true);
  };

  const handleTimeCheckboxClick = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;

    if (isChecked) {
      handleFieldChange('timeKnown', false);
      handleFieldChange('hour', '');
      handleFieldChange('minute', '');
    } else {
      handleFieldChange('timeKnown', true);
    }
  };

  const handleSave = async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { name, country, city, day, month, year, minute, hour, timeKnown } =
      editValues;

    if (!name || !country || !city || !day || !month || !year) {
      setError(i18n('All necessary fields must be filled'));

      return;
    }

    setError('');

    const locales: Record<typeof locale, 'en-EN' | 'ru-RU'> = {
      ru: 'ru-RU',
      en: 'en-EN',
    };

    await updateNatalChart({
      userId: String(user.id),
      name,
      country,
      city,
      day,
      month,
      year,
      hour,
      minute,
      timeKnown,
      lang: locales[locale],
    });

    setIsEditing(false);
  };

  const [highlightedBodies, setHighlightedBodies] = useState({
    moon: false,
    sun: false,
    jupiter: false,
    saturn: false,
    uranus: false,
    neptune: false,
    pluto: false,
    mars: false,
    venus: false,
    mercury: false,
    lilith: false,
    north_node: false,
    chiron: false,
    taurus: false,
    gemini: false,
    cancer: false,
    leo: false,
    virgo: false,
    libra: false,
    scorpio: false,
    sagittarius: false,
    capricorn: false,
    aquarius: false,
    pisces: false,
    aries: false,
    house_1: false,
    house_2: false,
    house_3: false,
    house_4: false,
    house_5: false,
    house_6: false,
    house_7: false,
    house_8: false,
    house_9: false,
    house_10: false,
    house_11: false,
    house_12: false,
  });

  if (isUpdating) {
    return (
      <div className={styles.loader}>
        <span>{i18n('Updating your natal chart')}...</span>

        <Spinner size={'l'} />
      </div>
    );
  }

  if (!user.natalChart || isEditing)
    return (
      <div
        className={`${styles.edit} ${isEditing ? styles.chartEdit : ''} ${className}`}
      >
        <form>
          <h3 className={styles.title}>
            {isEditing ? i18n('Edit chart') : i18n('Compose chart')}
          </h3>

          <div className={styles.formItem}>
            <span className={styles.subtitle}>{i18n('Name')}</span>

            <Input
              type={'text'}
              name={'name'}
              value={editValues.name}
              onChange={(e) => handleFieldChange('name', e.currentTarget.value)}
            />
          </div>

          <div className={styles.formItem}>
            <span className={styles.subtitle}>{i18n('Country of birth')}</span>

            <Select
              options={translatedCountries}
              value={editValues.country}
              onChange={(value) => handleFieldChange('country', value)}
              hasSearch
            />
          </div>

          <div className={styles.formItem}>
            <span className={styles.subtitle}>{i18n('City of birth')}</span>

            <Input
              type={'text'}
              name={'city'}
              value={editValues.city}
              onChange={(e) => handleFieldChange('city', e.currentTarget.value)}
            />
          </div>

          <div className={styles.formItem}>
            <span className={styles.subtitle}>{i18n('Birth date')}</span>

            <div className={styles.date}>
              <Select
                options={MONTHS[locale]}
                onChange={(value) => handleFieldChange('month', value)}
                value={editValues.month}
                placeholder={i18n('month')}
              />

              <Select
                options={getDaysInMonth(
                  editValues.month,
                  Number(editValues.year),
                )}
                onChange={(value) => handleFieldChange('day', value)}
                value={editValues.day}
                placeholder={i18n('day')}
                emptyPhrase={i18n('choose month')}
              />

              <Select
                options={YEARS}
                onChange={(value) => handleFieldChange('year', value)}
                value={editValues.year}
                placeholder={i18n('year')}
                hasSearch
              />
            </div>
          </div>

          <div className={styles.formItem}>
            <span className={styles.subtitle}>{i18n('Birth time')}</span>

            <div className={styles.birthItem}>
              <Input
                type={'time'}
                name={'time'}
                value={`${editValues.hour}:${editValues.minute}`}
                onChange={(e) => handleTimeChange(e.currentTarget.value)}
              />

              <div className={styles.birth}>
                <span className={styles.subtitle}>
                  {i18n("I don't remember")}
                </span>

                <Input
                  type={'checkbox'}
                  checked={!editValues.timeKnown}
                  onChange={handleTimeCheckboxClick}
                  style={{ marginLeft: '5px' }}
                />
              </div>
            </div>
          </div>

          <div className={styles.action}>
            {isEditing ? (
              <>
                <Button
                  type={'submit'}
                  className={styles.actionButton}
                  onClick={handleSave}
                  disabled={isEqual}
                  iconRight={<Price cost={10} />}
                >
                  {i18n('Edit')}
                </Button>
                <Button className={styles.actionButton} onClick={handleCancel}>
                  {i18n('Cancel')}
                </Button>
              </>
            ) : (
              <Button
                type={'submit'}
                className={styles.actionButton}
                onClick={handleSave}
                iconRight={<Price cost={10} />}
              >
                {i18n('Compose')}
              </Button>
            )}
          </div>

          {error && i18n(error)}
        </form>
      </div>
    );

  const {
    planets,
    interpretation,
    angles_details,
    aspects_summary,
    confidence,
    stelliums,
  } = user.natalChart;

  const selectedPlanetData = planets.find((planet) => planet.id === selectedPlanet);
  const chartIndex = user.natalChart.index ?? interpretation.index;
  const selectedAspect = user.natalChart.aspects.find(
    (aspect) => getNatalAspectKey(aspect) === selectedAspectKey,
  );
  const selectedAspectDescription = selectedAspect
    ? chartIndex?.aspects.find((aspect) => {
      const samePlanets =
        (aspect.p1 === selectedAspect.p1 && aspect.p2 === selectedAspect.p2) ||
        (aspect.p1 === selectedAspect.p2 && aspect.p2 === selectedAspect.p1);
      const indexedType = normalizeNatalAspectType(aspect.type);
      const selectedType = getNatalAspectType(selectedAspect);

      return samePlanets && (!indexedType || !selectedType || indexedType === selectedType);
    })
    : undefined;
  const selectedPlacements = selectedPlanet
    ? chartIndex?.placements.filter((placement) => placement.planet === selectedPlanet) ?? []
    : [];
  const selectedPlacement = selectedPlacements.find(
    (placement) => placement.type === selectedPlacementType,
  ) ?? selectedPlacements[0];
  const visibleAspects = selectedPlanet
    ? user.natalChart.aspects.filter(
      (aspect) => aspect.p1 === selectedPlanet || aspect.p2 === selectedPlanet,
    )
    : user.natalChart.aspects;
  const ascendantMetadata = ZODIAC_METADATA[angles_details.asc.sign_id];
  const overviewBodies = (['sun', 'moon'] as const).map((planetId) => {
    const planet = planets.find((item) => item.id === planetId);
    const placement = chartIndex?.placements.find(
      (item) => item.planet === planetId && item.type === 'sign',
    );

    return { planetId, planet, placement };
  });

  const handlePlanetSelect = (planet: PlanetId | null) => {
    setSelectedPlanet(planet);
    setSelectedAspectKey(null);
    setSelectedPlacementType('sign');
  };

  const handleBodyHighlight = (isHighlited: boolean, body: string | null) => {
    if (body) {
      setHighlightedBodies((prev) => ({ ...prev, [body]: isHighlited }));
    }
  };

  return (
    <div className={styles.chart}>
      <div className={styles.stickyHeader}>
        <div className={styles.headerTopline}>
          {onBack && (
            <button
              type={'button'}
              className={styles.headerBack}
              aria-label={i18n('Back')}
              onClick={onBack}
            >
              <span aria-hidden={'true'}>←</span>
              {i18n('Back')}
            </button>
          )}

          <h3 className={styles.name}>{user.userName}</h3>
        </div>

        <div className={styles.modeSwitch} role={"tablist"} aria-label={i18n('Chart mode')}>
          <button
            type={"button"}
            role={"tab"}
            aria-selected={chartMode === 'overview'}
            className={chartMode === 'overview' ? styles.activeMode : ''}
            onClick={() => setChartMode('overview')}
          >
            {i18n('Overview')}
          </button>
          <button
            type={"button"}
            role={"tab"}
            aria-selected={chartMode === 'detailed'}
            className={chartMode === 'detailed' ? styles.activeMode : ''}
            onClick={() => setChartMode('detailed')}
          >
            {i18n('Detailed chart')}
          </button>
        </div>
      </div>

      <div className={`${styles.visual} ${chartMode === 'detailed' ? styles.detailedVisual : ''}`}>
        <div className={styles.chartStage}>
          {chartMode === 'overview' ? (
            <CelestialNatalOverview
              chart={user.natalChart}
              highlightedBodies={highlightedBodies}
              selectedPlanet={selectedPlanet}
              onSelectPlanet={handlePlanetSelect}
            />
          ) : (
            <DetailedNatalChart
              chart={user.natalChart}
              highlightedBodies={highlightedBodies}
              selectedPlanet={selectedPlanet}
              onSelectPlanet={handlePlanetSelect}
              selectedAspectKey={selectedAspectKey}
              onSelectAspect={setSelectedAspectKey}
            />
          )}
        </div>

        <div className={styles.detailPanel}>
          {chartMode === 'detailed' && (
            <div className={styles.chartLegend}>
              <span><i className={styles.softMarker} />{i18n('Harmonious aspects')}</span>
              <span><i className={styles.hardMarker} />{i18n('Tense aspects')}</span>
              <span><i className={styles.minorMarker} />{i18n('Minor aspects')}</span>
              <small>{i18n('Select a planet to trace its connections')}</small>
            </div>
          )}

          {chartMode === 'overview' && !selectedPlanetData && (
            <div className={styles.overviewFoundation}>
              <div className={styles.foundationHeading}>
                <strong>{i18n('Chart foundation')}</strong>
                <span>{i18n('The three main reference points of your chart')}</span>
              </div>

              <div className={styles.foundationGrid}>
                {overviewBodies.map(({ planetId, planet, placement }) => planet && (
                  <button
                    type={'button'}
                    key={planetId}
                    className={styles.foundationCard}
                    onClick={() => handlePlanetSelect(planetId)}
                  >
                    <img
                      src={`/assets/images/horoscope/${planetId}.png`}
                      alt={''}
                    />
                    <span>
                      <b>{i18n(planet.name)}</b>
                      <small>{i18n(getZodiacTranslationKey(planet.sign_id))}</small>
                    </span>
                    <p>{getFirstSentence(placement?.content)}</p>
                    <span className={styles.foundationAction}>
                      {i18n('Read more')}
                      <span aria-hidden={'true'}>→</span>
                    </span>
                  </button>
                ))}

                <div className={`${styles.foundationCard} ${styles.ascendantCard}`}>
                  <div className={styles.ascendantIcons} aria-hidden={'true'}>
                    <img
                      className={styles.ascendantRulerIcon}
                      src={`/assets/images/horoscope/${ascendantMetadata.ruler}.png`}
                      alt={''}
                    />
                    <Zodiac
                      className={styles.ascendantZodiacIcon}
                      sign={getZodiacTranslationKey(angles_details.asc.sign_id) as Sign}
                      type={'small'}
                    />
                  </div>
                  <span>
                    <b>{i18n('Ascendant')}</b>
                    <small>
                      {i18n(getZodiacTranslationKey(angles_details.asc.sign_id))}{' '}
                      · {angles_details.asc.pos.toFixed(1)}°
                    </small>
                  </span>
                  <p>
                    {i18n('Ruler')}: {i18n(getZodiacTranslationKey(ascendantMetadata.ruler))} ·{' '}
                    {i18n(ascendantMetadata.element)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {chartMode === 'detailed' && !selectedPlanetData && !selectedAspect && (
            <div className={styles.chartFacts}>
              <span><b>ASC</b> {i18n(getZodiacTranslationKey(angles_details.asc.sign_id))} {Math.floor(angles_details.asc.pos)}°</span>
              <span><b>MC</b> {i18n(getZodiacTranslationKey(angles_details.mc.sign_id))} {Math.floor(angles_details.mc.pos)}°</span>
              <span>{i18n('Houses accuracy')}: {i18n(confidence.houses)}</span>
              <span>{i18n('Aspects')}: {aspects_summary.total} · {i18n('Major aspects')}: {aspects_summary.major}</span>
              <span>{i18n('Vertex')}: {i18n(getZodiacTranslationKey(angles_details.vertex.sign_id))} {Math.floor(angles_details.vertex.pos)}°</span>
              <span>{i18n('Stelliums')}: {stelliums.total}</span>
            </div>
          )}

          {selectedPlanetData && !selectedAspect && (
            <>
              <div className={styles.selectedPlanetInfo}>
                <strong>{i18n(selectedPlanetData.name)}</strong>
                <span>{i18n(getZodiacTranslationKey(selectedPlanetData.sign_id))} {selectedPlanetData.pos.toFixed(1)}°</span>
                <span>{i18n('House')} {selectedPlanetData.house}</span>
                <span>{i18n('Declination')}: {selectedPlanetData.declination_deg.toFixed(1)}°</span>
                {selectedPlanetData.retrograde && <span>{i18n('Retrograde')}</span>}
              </div>

              {chartMode === 'overview' && (
                <button
                  type={'button'}
                  className={styles.backToFoundation}
                  onClick={() => handlePlanetSelect(null)}
                >
                  <span aria-hidden={'true'}>←</span>
                  {i18n('Back to chart foundation')}
                </button>
              )}

              {selectedPlacement && (
                <div className={styles.indexDetail}>
                  {selectedPlacements.length > 1 && (
                    <div className={styles.indexTabs}>
                      {(['sign', 'house'] as const).map((type) => {
                        const placementExists = selectedPlacements.some(
                          (placement) => placement.type === type,
                        );
                        if (!placementExists) return null;

                        return (
                          <button
                            type={"button"}
                            key={type}
                            className={selectedPlacementType === type ? styles.activeIndexTab : ''}
                            onClick={() => setSelectedPlacementType(type)}
                          >
                            {i18n(type === 'sign' ? 'Sign placement' : 'House placement')}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <strong>{selectedPlacement.title}</strong>
                  <div className={`${styles.indexContent} custom-scrollbar`}>
                    {selectedPlacement.content}
                  </div>
                </div>
              )}
            </>
          )}

          {chartMode === 'detailed' && !selectedAspect && visibleAspects.length > 0 && (
            <div className={styles.aspectConnections}>
              <span className={styles.connectionLabel}>
                {selectedPlanet
                  ? `${i18n('Planet connections')}: ${visibleAspects.length} ${i18n('of')} ${user.natalChart.aspects.length}`
                  : `${i18n('All connections')}: ${visibleAspects.length}`}
              </span>
              <div className={styles.connectionButtons}>
                {visibleAspects.map((aspect) => {
                  const aspectKey = getNatalAspectKey(aspect);
                  const firstPlanet = planets.find((planet) => planet.id === aspect.p1);
                  const secondPlanet = planets.find((planet) => planet.id === aspect.p2);
                  const relationTitle = selectedPlanet
                    ? i18n((aspect.p1 === selectedPlanet ? secondPlanet : firstPlanet)?.name ?? '')
                    : `${i18n(firstPlanet?.name ?? aspect.p1)} — ${i18n(secondPlanet?.name ?? aspect.p2)}`;

                  return (
                    <button
                      type={"button"}
                      key={aspectKey}
                      className={selectedAspectKey === aspectKey ? styles.activeConnection : ''}
                      onClick={() => setSelectedAspectKey(selectedAspectKey === aspectKey ? null : aspectKey)}
                    >
                      {aspect.type} · {relationTitle} · {aspect.orb.toFixed(1)}°
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {chartMode === 'detailed' && selectedAspect && (
            <div className={`${styles.indexDetail} ${styles.aspectDetail}`}>
              <div className={styles.aspectMeta}>
                <span>{selectedAspect.type}</span>
                <span>{i18n(selectedAspect.is_applying ? 'Applying aspect' : 'Separating aspect')}</span>
                <span>{i18n('Orb')}: {selectedAspect.orb.toFixed(2)}°</span>
              </div>
              <strong>{selectedAspectDescription?.title ?? selectedAspect.type}</strong>
              {selectedAspectDescription?.content && (
                <div className={`${styles.indexContent} custom-scrollbar`}>
                  {selectedAspectDescription.content}
                </div>
              )}
              <button
                type={"button"}
                className={styles.backToConnections}
                onClick={() => setSelectedAspectKey(null)}
              >
                {i18n('Back to connections')}
              </button>
            </div>
          )}
        </div>
      </div>

      {chartMode === 'overview' && (
        <Accordion
          sections={interpretation.sections}
          onHighLight={handleBodyHighlight}
          selectedPlanet={selectedPlanet}
          onSelectPlanet={handlePlanetSelect}
          aspects={user.natalChart.aspects}
          selectedAspectKey={selectedAspectKey}
          onSelectAspect={setSelectedAspectKey}
        />
      )}

      <div className={styles.secondaryAction}>
        <span>{i18n('Birth data affects the accuracy of the chart')}</span>
        <Button
          className={styles.editChartButton}
          onClick={handleChangeButtonClick}
        >
          {i18n('Edit birth data')}
        </Button>
      </div>
    </div>
  );
};
