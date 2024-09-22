const profileDefaultImage1 = '/assets/default_profile_1.png';
const profileDefaultImage2 = '/assets/default_profile_2.png';
const profileDefaultImage3 = '/assets/default_profile_3.png';
const profileDefaultImage4 = '/assets/default_profile_4.png';

import { Avatar } from '@Components/ui/avatar';

const defaultProfileImages = [profileDefaultImage1, profileDefaultImage2, profileDefaultImage3, profileDefaultImage4];

export function RandomAvatar() {
  const randomProfileImage = defaultProfileImages.at(Math.floor(Math.random() * 4))!;
  return <Avatar src={randomProfileImage} size="32" local />;
}
