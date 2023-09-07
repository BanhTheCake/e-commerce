import slugify from 'slugify';

export const slugifyFn = (value: string) => {
  return slugify(value, {
    locale: 'vi',
    lower: true,
  });
};
