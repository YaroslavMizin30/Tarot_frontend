export interface BirthPlaceSuggestion {
  id: string;
  city: string;
  state?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

interface PhotonFeature {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    osm_id?: number;
    osm_type?: string;
    name?: string;
    city?: string;
    locality?: string;
    state?: string;
    country?: string;
    countrycode?: string;
  };
}

interface PhotonResponse {
  features?: PhotonFeature[];
}

const PHOTON_API_URL =
  import.meta.env.VITE_PHOTON_API_URL ?? 'https://photon.komoot.io';

export const searchBirthPlaces = async (options: {
  query: string;
  countryName?: string;
  countryCode?: string;
  locale: 'ru' | 'en';
  signal?: AbortSignal;
}): Promise<BirthPlaceSuggestion[]> => {
  const { query, countryName, countryCode, locale, signal } = options;
  const params = new URLSearchParams({
    q: locale === 'en' && countryName ? `${query}, ${countryName}` : query,
    lang: locale === 'en' ? 'en' : 'default',
    limit: '10',
    layer: 'city',
  });

  params.append('layer', 'locality');

  const response = await fetch(`${PHOTON_API_URL}/api?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`PHOTON_REQUEST_FAILED_${response.status}`);
  }

  const data = (await response.json()) as PhotonResponse;
  const normalizedCountryCode = countryCode?.toLowerCase();

  return (data.features ?? [])
    .map((feature): BirthPlaceSuggestion | null => {
      const properties = feature.properties;
      const coordinates = feature.geometry?.coordinates;
      const city = properties?.name ?? properties?.city ?? properties?.locality;
      const featureCountryCode = properties?.countrycode?.toLowerCase();

      if (
        !properties ||
        !coordinates ||
        !city ||
        !properties.country ||
        !featureCountryCode ||
        (normalizedCountryCode && featureCountryCode !== normalizedCountryCode)
      ) {
        return null;
      }

      return {
        id: `${properties.osm_type ?? 'place'}-${properties.osm_id ?? coordinates.join('-')}`,
        city,
        state: properties.state,
        country: properties.country,
        countryCode: featureCountryCode.toUpperCase(),
        longitude: coordinates[0],
        latitude: coordinates[1],
      };
    })
    .filter((place): place is BirthPlaceSuggestion => Boolean(place))
    .filter(
      (place, index, places) =>
        places.findIndex(
          (candidate) =>
            candidate.city === place.city && candidate.state === place.state,
        ) === index,
    )
    .slice(0, 6);
};
