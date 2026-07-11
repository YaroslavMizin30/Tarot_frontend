import type { EffectProps } from './Effect.props';

import DiscountIcon from '@/shared/assets/svg/roulette/discount.svg';
import CardsIcon from '@/shared/assets/svg/common/tarot_page.svg';
import AstrologyIcon from '@/shared/assets/svg/common/astrology_page.svg';
import RetryIcon from '@/shared/assets/svg/roulette/update.svg';
import DevilIcon from '@/shared/assets/svg/roulette/devil.svg';

import Pentacle from '@/shared/ui/Pentacle';

const Effect = (props: EffectProps) => {
  const { effect, className } = props;

  switch (effect) {
    case 'coins':
      return <Pentacle className={className} />;

    case 'offs':
      return <DiscountIcon className={className} />;

    case 'happy-card':
      return <CardsIcon className={className} />;

    case 'reading':
      return <CardsIcon className={className} />;

    case 'horoscopes':
      return <AstrologyIcon className={className} />;

    case 'natal':
      return <AstrologyIcon className={className} />;

    case 'retry':
      return <RetryIcon className={className} />;

    case 'negative':
      return <DevilIcon className={className} />;

    default:
      return null;
  }
};

export default Effect;
