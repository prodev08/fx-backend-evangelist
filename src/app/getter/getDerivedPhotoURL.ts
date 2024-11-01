import getEnv from './getEnv';

export default async function (id: string, isSport = false, type?: string | null) {
  let url = 'photos/0';
  if (isSport) {
    url = 'photos/sports';
  }
  const env = getEnv();
  // return `https://us-central1-${env}.cloudfunctions.net/photos/${id}.webp`;
  return `https://${env}.io/${url}/${id}${type ? `-${type}` : ''}.webp`;
}
