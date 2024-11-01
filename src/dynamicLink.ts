import axios from 'axios';

const requestUrl = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`;

export const createDynamicUrl = async (link: string): Promise<string> => {
  const shortLink: any = await axios.post(
    requestUrl,
    {
      dynamicLinkInfo: {
        link,
        domainUriPrefix: 'https://devfx1.page.link',
        androidInfo: {
          androidPackageName: 'io.fx1.sports.dev',
        },
        iosInfo: {
          iosBundleId: 'io.fx1.fx1',
        },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return shortLink.data?.shortLink;
};
