import express from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../../config/s3.js';
import { env } from '../../config/env.js';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.post('/generate-upload-url', async (req, res) => {
  try {
    const { fileType } = req.body;

    if (!fileType) {
      return res.status(400).json({ message: 'fileType is required' });
    }

    const fileName = `${uuid()}.${fileType.split('/')[1]}`;

    // 🔹 1. Create PUT command (upload)
    const putCommand = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, putCommand, {
      expiresIn: 60, // upload valid for 1 min
    });

    // 🔹 3. Send both URLs
    res.json({
      uploadUrl,
      key: fileName,
    });
  } catch (error) {
    console.error('🔥 S3 ERROR:', error);
    res.status(500).json({ message: 'Failed to generate URL' });
  }
});

export default router;
