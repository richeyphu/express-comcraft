import { writeFileSync } from 'fs';
import path from 'path';
import { v4 } from 'uuid';

import { env } from '@config';
import { BASE64_IMAGE_REGEX } from '@utils';

export type Image = {
  type: string;
  data: string;
};

export const saveImageToDisk = (baseImage: string): string => {
  // If host is readonly, return empty string
  if (env.READONLY) return '';

  // Resolve absolute project path
  const projectPath: string = path.resolve('./');

  // Upload destination path
  const uploadPath = `${projectPath}/public/images/`;

  // Find file extension
  const ext: string = baseImage.substring(
    baseImage.indexOf('/') + 1,
    baseImage.indexOf(';base64')
  );

  // Random file name with extension
  let filename = '';
  if (ext === 'svg+xml') {
    filename = `${v4()}.svg`;
  } else {
    filename = `${v4()}.${ext}`;
  }

  // Extract base64 data from base64 string
  const image: Image = decodeBase64Image(baseImage);

  // Write file to disk
  writeFileSync(uploadPath + filename, image.data, 'base64');

  // Return new file name
  return filename;
};

export const decodeBase64Image = (base64Str: string): Image => {
  const matches: RegExpMatchArray | null = base64Str.match(BASE64_IMAGE_REGEX);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const image = { type: matches[1], data: matches[2] };

  return image;
};
